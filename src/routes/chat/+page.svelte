<script lang="ts">
  import { SendIcon, ArrowLeftIcon, SearchIcon, MoreVerticalIcon, MessageCircleIcon } from 'lucide-svelte';
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import type { Id } from '$convex/_generated/dataModel';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const client = useConvexClient();
  const conversationsQuery = useQuery(api.conversations.getConversations, {});

  let selectedConversationId = $state<Id<"conversations"> | null>(null);
  let messageInput = $state('');
  let searchQuery = $state('');
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  let hasInitializedFromUrl = $state(false);

  $effect(() => {
    if (!hasInitializedFromUrl) {
      const convId = $page.url.searchParams.get('c');
      if (convId) {
        selectedConversationId = convId as Id<"conversations">;
        hasInitializedFromUrl = true;
      }
    }
  });

  const conversationDetailsQuery = $derived(
    selectedConversationId 
      ? useQuery(api.conversations.getConversationById, { conversationId: selectedConversationId })
      : null
  );

  const messagesQuery = $derived(
    selectedConversationId 
      ? useQuery(api.messages.getMessages, { conversationId: selectedConversationId, limit: 50 })
      : null
  );

  const conversations = $derived(conversationsQuery.data ?? []);
  const currentConversation = $derived(conversationDetailsQuery?.data ?? null);
  const messagesData = $derived(messagesQuery?.data ?? { messages: [], hasMore: false });
  const messages = $derived(messagesData.messages);

  const filteredConversations = $derived(
    conversations.filter(conv => 
      conv.otherProfile.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const isLoadingConversations = $derived(conversationsQuery.isLoading);
  const isLoadingMessages = $derived(messagesQuery?.isLoading ?? false);

  onMount(() => {
    heartbeatInterval = setInterval(async () => {
      try {
        await client.mutation(api.presence.heartbeat, {});
      } catch {}
    }, 30000);

    client.mutation(api.presence.heartbeat, {}).catch(() => {});
  });

  onDestroy(() => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
  });

  $effect(() => {
    if (selectedConversationId && messages.length > 0) {
      client.mutation(api.messages.markMessagesAsRead, { 
        conversationId: selectedConversationId 
      }).catch(() => {});
    }
  });

  function selectConversation(convId: Id<"conversations">) {
    selectedConversationId = convId;
    setTimeout(scrollToBottom, 100);
  }

  function goBack() {
    selectedConversationId = null;
  }

  function scrollToBottom() {
    const container = document.getElementById('messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  async function sendMessage() {
    if (!messageInput.trim() || !selectedConversationId) return;
    
    const content = messageInput.trim();
    messageInput = '';
    
    try {
      await client.mutation(api.messages.sendMessage, {
        conversationId: selectedConversationId,
        content,
        type: "text",
      });
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Failed to send message:', err);
      messageInput = content;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('id-ID', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
  }

  function viewProfile(profileId: Id<"profiles">) {
    goto(`/user/${profileId}`);
  }
</script>

<div class="relative flex h-[calc(100vh-50px)] overflow-hidden md:h-screen sm:ml-18">
	<div
		class="pointer-events-none fixed top-[-10%] left-[-10%] h-[40%] w-[50%] rounded-full bg-pink-300 opacity-20 blur-[100px]"
	></div>
	<div
		class="pointer-events-none fixed right-[-10%] bottom-[10%] h-[40%] w-[50%] rounded-full bg-purple-300 opacity-20 blur-[100px]"
	></div>

  <div class="
    {selectedConversationId ? 'hidden md:flex' : 'flex'} 
    flex-col w-full md:w-95 md:min-w-95 md:max-w-95 
    bg-white/50 backdrop-blur-sm md:border-r border-gray-200 
    relative z-10
  ">
    <header class="shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
      <h1 class="text-2xl font-bold text-gray-900">Pesan</h1>
      <p class="text-sm text-gray-500 mt-0.5">Chat dengan match kamu</p>
      
      <div class="relative mt-4">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari percakapan..."
          class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/50 focus:bg-white transition-all"
        />
      </div>
    </header>

    <div class="flex-1 overflow-y-auto">
      {#if isLoadingConversations}
        <div class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      {:else if filteredConversations.length === 0}
        <div class="flex flex-col items-center justify-center py-20 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SendIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-500 text-center">Belum ada percakapan</p>
          <p class="text-gray-400 text-sm text-center mt-1">Match dengan seseorang untuk mulai chat!</p>
        </div>
      {:else}
        <div class="divide-y divide-gray-100">
          {#each filteredConversations as conv (conv._id)}
            <button
              onclick={() => selectConversation(conv._id)}
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/80 active:bg-gray-100 transition-colors text-left
                {selectedConversationId === conv._id ? 'bg-pink-50/80 md:bg-pink-50/80' : ''}"
            >
              <div class="relative shrink-0">
                {#if conv.otherProfile.photo}
                  <img 
                    src={conv.otherProfile.photo} 
                    alt={conv.otherProfile.nickname}
                    class="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                {:else}
                  <div class="w-14 h-14 rounded-full bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                    {conv.otherProfile.nickname.charAt(0).toUpperCase()}
                  </div>
                {/if}
                {#if conv.otherProfile.isOnline}
                  <span class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                {/if}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900 truncate">{conv.otherProfile.nickname}</h3>
                  {#if conv.lastMessageAt}
                    <span class="text-xs text-gray-400 shrink-0 ml-2">{formatTime(conv.lastMessageAt)}</span>
                  {/if}
                </div>
                <p class="text-sm text-gray-500 truncate mt-0.5">
                  {conv.lastMessagePreview || 'Mulai percakapan...'}
                </p>
              </div>

              {#if conv.unreadCount > 0}
                <span class="shrink-0 min-w-5 h-5 px-1.5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                </span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="
    {selectedConversationId ? 'flex' : 'hidden md:flex'} 
    flex-col flex-1 bg-gray-50/50 relative z-10
  ">
    {#if currentConversation}
      <header class="shrink-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 py-3 flex items-center gap-3">
        <button 
          onclick={goBack}
          aria-label="Kembali"
          class="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5 text-gray-700" />
        </button>
        
        <button 
          onclick={() => viewProfile(currentConversation.otherProfile._id)}
          class="relative shrink-0"
          aria-label="Lihat profil"
        >
          {#if currentConversation.otherProfile.photo}
            <img 
              src={currentConversation.otherProfile.photo} 
              alt={currentConversation.otherProfile.nickname}
              class="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-pink-300 transition-all"
            />
          {:else}
            <div class="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
              {currentConversation.otherProfile.nickname.charAt(0).toUpperCase()}
            </div>
          {/if}
          {#if currentConversation.otherProfile.isOnline}
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          {/if}
        </button>

        <button 
          onclick={() => viewProfile(currentConversation.otherProfile._id)}
          class="flex-1 min-w-0 text-left"
        >
          <h2 class="font-semibold text-gray-900 truncate">{currentConversation.otherProfile.nickname}</h2>
          <p class="text-xs {currentConversation.otherProfile.isOnline ? 'text-green-500' : 'text-gray-400'}">
            {currentConversation.otherProfile.isOnline ? 'Online' : 'Offline'}
          </p>
        </button>

        <button 
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Opsi lainnya"
        >
          <MoreVerticalIcon class="w-5 h-5 text-gray-500" />
        </button>
      </header>

      <div 
        id="messages-container"
        class="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {#if isLoadingMessages}
          <div class="flex items-center justify-center py-10">
            <div class="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        {:else if messages.length === 0}
          <div class="flex flex-col items-center justify-center py-10 text-center">
            <p class="text-gray-400 text-sm">Belum ada pesan</p>
            <p class="text-gray-400 text-xs mt-1">Kirim pesan pertama! 👋</p>
          </div>
        {:else}
          {#each messages as msg (msg._id)}
            {#if msg.type === 'system'}
              <div class="flex justify-center">
                <span class="px-3 py-1.5 bg-gray-200/80 text-gray-600 text-xs rounded-full">
                  {msg.content}
                </span>
              </div>
            {:else}
              <div class="flex {msg.isMe ? 'justify-end' : 'justify-start'}">
                <div 
                  class="max-w-[80%] md:max-w-[60%] px-4 py-2.5 rounded-2xl {
                    msg.isMe 
                      ? 'bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }"
                >
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p class="text-[10px] mt-1 {msg.isMe ? 'text-white/70' : 'text-gray-400'} text-right">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            {/if}
          {/each}
        {/if}
      </div>

      <div class="shrink-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-3 py-3 mb-16 md:mb-0">
        <div class="flex items-end gap-2 max-w-4xl mx-auto">
          <div class="flex-1 relative">
            <textarea
              bind:value={messageInput}
              onkeydown={handleKeydown}
              placeholder="Ketik pesan..."
              rows={1}
              class="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl text-sm resize-none focus:ring-2 focus:ring-pink-500/50 focus:bg-white transition-all max-h-32"
            ></textarea>
          </div>
          <button
            onclick={sendMessage}
            disabled={!messageInput.trim()}
            aria-label="Kirim pesan"
            class="shrink-0 w-12 h-12 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SendIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

    {:else}
      <div class="hidden md:flex flex-1 flex-col items-center justify-center text-center px-4">
        <div class="w-24 h-24 bg-linear-to-tr from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
          <MessageCircleIcon class="w-12 h-12 text-pink-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Pilih percakapan</h3>
        <p class="text-gray-500 max-w-sm">Pilih salah satu percakapan dari daftar untuk mulai chatting</p>
      </div>
    {/if}
  </div>
</div>

<script lang="ts">
  import { SendIcon, ArrowLeftIcon, SearchIcon, MoreVerticalIcon, MessageCircleIcon } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  };

  const MOCK_CONVERSATIONS = [
    {
      id: "conv_1",
      name: "Sarah Amalia",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      lastMessage: "Haha iya bener banget! 😂",
      timestamp: "10:30",
      unread: 2,
      online: true
    },
    {
      id: "conv_2", 
      name: "Jessica Tan",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      lastMessage: "Besok jadi ga ke cafe?",
      timestamp: "Kemarin",
      unread: 0,
      online: false
    },
    {
      id: "conv_3",
      name: "Dimas Pratama",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      lastMessage: "GG bro, next time lagi ya",
      timestamp: "Kemarin",
      unread: 0,
      online: true
    }
  ];

  const MOCK_MESSAGES_BY_CONV: Record<string, Message[]> = {
    "conv_1": [
      { id: "msg_1_1", senderId: "other", text: "Haii, aku liat kita match! 👋", timestamp: "10:15" },
      { id: "msg_1_2", senderId: "me", text: "Hai juga! Iya nih haha", timestamp: "10:18" },
      { id: "msg_1_3", senderId: "other", text: "Kamu dari fakultas apa?", timestamp: "10:20" },
      { id: "msg_1_4", senderId: "me", text: "Aku dari Teknik Informatika, kamu?", timestamp: "10:22" },
      { id: "msg_1_5", senderId: "other", text: "Wah keren! Aku DKV nih", timestamp: "10:25" },
      { id: "msg_1_6", senderId: "other", text: "Suka ngoding ya berarti?", timestamp: "10:26" },
      { id: "msg_1_7", senderId: "me", text: "Iya lumayan, kalau kamu pasti jago desain dong", timestamp: "10:28" },
      { id: "msg_1_8", senderId: "other", text: "Haha iya bener banget! 😂", timestamp: "10:30" },
    ],
    "conv_2": [
      { id: "msg_2_1", senderId: "other", text: "Hai! Salam kenal ya 😊", timestamp: "14:00" },
      { id: "msg_2_2", senderId: "me", text: "Hai Jessica! Salam kenal juga", timestamp: "14:05" },
      { id: "msg_2_3", senderId: "other", text: "Kamu suka ngopi ga?", timestamp: "14:10" },
      { id: "msg_2_4", senderId: "me", text: "Suka banget! Biasanya ke mana?", timestamp: "14:12" },
      { id: "msg_2_5", senderId: "other", text: "Ada cafe baru di deket kampus, mau coba bareng?", timestamp: "14:15" },
      { id: "msg_2_6", senderId: "me", text: "Boleh! Kapan?", timestamp: "14:18" },
      { id: "msg_2_7", senderId: "other", text: "Besok jadi ga ke cafe?", timestamp: "Kemarin" },
    ],
    "conv_3": [
      { id: "msg_3_1", senderId: "other", text: "Bro main ML yuk!", timestamp: "20:00" },
      { id: "msg_3_2", senderId: "me", text: "Gas! Rank apa?", timestamp: "20:02" },
      { id: "msg_3_3", senderId: "other", text: "Mythic 3, kamu?", timestamp: "20:03" },
      { id: "msg_3_4", senderId: "me", text: "Mythic 5, masih grinding nih", timestamp: "20:05" },
      { id: "msg_3_5", senderId: "other", text: "Oke siap, invite ya", timestamp: "20:06" },
      { id: "msg_3_6", senderId: "me", text: "Done bro, ayo push!", timestamp: "20:10" },
      { id: "msg_3_7", senderId: "other", text: "GG bro, next time lagi ya", timestamp: "22:30" },
    ]
  };

  let selectedConversation = $state<typeof MOCK_CONVERSATIONS[0] | null>(null);
  let messageInput = $state('');
  let messagesStore = $state<Record<string, Message[]>>({ ...MOCK_MESSAGES_BY_CONV });
  let searchQuery = $state('');

  const currentMessages = $derived(
    selectedConversation ? (messagesStore[selectedConversation.id] || []) : []
  );

  const filteredConversations = $derived(
    MOCK_CONVERSATIONS.filter(conv => 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function selectConversation(conv: typeof MOCK_CONVERSATIONS[0]) {
    selectedConversation = conv;
    setTimeout(() => {
      const container = document.getElementById('messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }

  function goBack() {
    selectedConversation = null;
  }

  function sendMessage() {
    if (!messageInput.trim() || !selectedConversation) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: "me",
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    messagesStore = {
      ...messagesStore,
      [selectedConversation.id]: [...(messagesStore[selectedConversation.id] || []), newMessage]
    };
    messageInput = '';
    
    setTimeout(() => {
      const container = document.getElementById('messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="h-[calc(100vh-80px)] md:h-screen flex relative overflow-hidden md:ml-18 lg:ml-64">
  <div class="fixed top-[-10%] left-[-10%] w-[50%] h-[40%] bg-pink-300 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
  <div class="fixed bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

  <!-- ==================== CONVERSATION LIST (Left Panel) ==================== -->
  <div class="
    {selectedConversation ? 'hidden md:flex' : 'flex'} 
    flex-col w-full md:w-95 md:min-w-95 md:max-w-95 
    bg-white/50 backdrop-blur-sm md:border-r border-gray-200 
    relative z-10
  ">
    <!-- Header -->
    <header class="shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
      <h1 class="text-2xl font-bold text-gray-900">Pesan</h1>
      <p class="text-sm text-gray-500 mt-0.5">Chat dengan match kamu</p>
      
      <!-- Search bar -->
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

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto">
      {#if filteredConversations.length === 0}
        <div class="flex flex-col items-center justify-center py-20 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SendIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-500 text-center">Belum ada percakapan</p>
          <p class="text-gray-400 text-sm text-center mt-1">Match dengan seseorang untuk mulai chat!</p>
        </div>
      {:else}
        <div class="divide-y divide-gray-100">
          {#each filteredConversations as conv (conv.id)}
            <button
              onclick={() => selectConversation(conv)}
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/80 active:bg-gray-100 transition-colors text-left
                {selectedConversation?.id === conv.id ? 'bg-pink-50/80 md:bg-pink-50/80' : ''}"
            >
              <!-- Avatar -->
              <div class="relative shrink-0">
                <img 
                  src={conv.avatar} 
                  alt={conv.name}
                  class="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                {#if conv.online}
                  <span class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                {/if}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900 truncate">{conv.name}</h3>
                  <span class="text-xs text-gray-400 shrink-0 ml-2">{conv.timestamp}</span>
                </div>
                <p class="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>

              <!-- Unread badge -->
              {#if conv.unread > 0}
                <span class="shrink-0h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {conv.unread}
                </span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- ==================== CHAT ROOM (Right Panel) ==================== -->
  <div class="
    {selectedConversation ? 'flex' : 'hidden md:flex'} 
    flex-col flex-1 bg-gray-50/50 relative z-10
  ">
    {#if selectedConversation}
      <!-- Chat Header -->
      <header class="shrink-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 py-3 flex items-center gap-3">
        <button 
          onclick={goBack}
          class="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5 text-gray-700" />
        </button>
        
        <div class="relative shrink-0">
          <img 
            src={selectedConversation.avatar} 
            alt={selectedConversation.name}
            class="w-10 h-10 rounded-full object-cover"
          />
          {#if selectedConversation.online}
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <h2 class="font-semibold text-gray-900 truncate">{selectedConversation.name}</h2>
          <p class="text-xs text-gray-500">
            {selectedConversation.online ? 'Online' : 'Offline'}
          </p>
        </div>

        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVerticalIcon class="w-5 h-5 text-gray-500" />
        </button>
      </header>

      <!-- Messages Container -->
      <div 
        id="messages-container"
        class="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {#each currentMessages as msg (msg.id)}
          <div 
            class="flex {msg.senderId === 'me' ? 'justify-end' : 'justify-start'}"
          >
            <div 
              class="max-w-[80%] md:max-w-[60%] px-4 py-2.5 rounded-2xl {
                msg.senderId === 'me' 
                  ? 'bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-br-md' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
              }"
            >
              <p class="text-sm leading-relaxed">{msg.text}</p>
              <p class="text-[10px] mt-1 {msg.senderId === 'me' ? 'text-white/70' : 'text-gray-400'} text-right">
                {msg.timestamp}
              </p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Message Input -->
      <div class="shrink-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-3 py-3 mb-16 md:mb-0">
        <div class="flex items-end gap-2 max-w-4xl mx-auto">
          <div class="flex-1 relative">
            <textarea
              bind:value={messageInput}
              onkeydown={handleKeydown}
              placeholder="Ketik pesan..."
              rows="1"
              class="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl text-sm resize-none focus:ring-2 focus:ring-pink-500/50 focus:bg-white transition-all max-h-32"
            ></textarea>
          </div>
          <button
            onclick={sendMessage}
            disabled={!messageInput.trim()}
            class="shrink-0 w-12 h-12 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SendIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

    {:else}
      <!-- Empty State for Desktop -->
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


<script lang="ts">
	import {
		SendIcon,
		ArrowLeftIcon,
		SearchIcon,
		MoreVerticalIcon,
		MessageCircleIcon
	} from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';

	type Message = {
		id: string;
		senderId: string;
		text: string;
		timestamp: string;
	};

	const MOCK_CONVERSATIONS = [
		{
			id: 'conv_1',
			name: 'Sarah Amalia',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
			lastMessage: 'Haha iya bener banget! 😂',
			timestamp: '10:30',
			unread: 2,
			online: true
		},
		{
			id: 'conv_2',
			name: 'Jessica Tan',
			avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
			lastMessage: 'Besok jadi ga ke cafe?',
			timestamp: 'Kemarin',
			unread: 0,
			online: false
		},
		{
			id: 'conv_3',
			name: 'Dimas Pratama',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
			lastMessage: 'GG bro, next time lagi ya',
			timestamp: 'Kemarin',
			unread: 0,
			online: true
		}
	];

	const MOCK_MESSAGES_BY_CONV: Record<string, Message[]> = {
		conv_1: [
			{
				id: 'msg_1_1',
				senderId: 'other',
				text: 'Haii, aku liat kita match! 👋',
				timestamp: '10:15'
			},
			{ id: 'msg_1_2', senderId: 'me', text: 'Hai juga! Iya nih haha', timestamp: '10:18' },
			{ id: 'msg_1_3', senderId: 'other', text: 'Kamu dari fakultas apa?', timestamp: '10:20' },
			{
				id: 'msg_1_4',
				senderId: 'me',
				text: 'Aku dari Teknik Informatika, kamu?',
				timestamp: '10:22'
			},
			{ id: 'msg_1_5', senderId: 'other', text: 'Wah keren! Aku DKV nih', timestamp: '10:25' },
			{ id: 'msg_1_6', senderId: 'other', text: 'Suka ngoding ya berarti?', timestamp: '10:26' },
			{
				id: 'msg_1_7',
				senderId: 'me',
				text: 'Iya lumayan, kalau kamu pasti jago desain dong',
				timestamp: '10:28'
			},
			{ id: 'msg_1_8', senderId: 'other', text: 'Haha iya bener banget! 😂', timestamp: '10:30' }
		],
		conv_2: [
			{ id: 'msg_2_1', senderId: 'other', text: 'Hai! Salam kenal ya 😊', timestamp: '14:00' },
			{ id: 'msg_2_2', senderId: 'me', text: 'Hai Jessica! Salam kenal juga', timestamp: '14:05' },
			{ id: 'msg_2_3', senderId: 'other', text: 'Kamu suka ngopi ga?', timestamp: '14:10' },
			{ id: 'msg_2_4', senderId: 'me', text: 'Suka banget! Biasanya ke mana?', timestamp: '14:12' },
			{
				id: 'msg_2_5',
				senderId: 'other',
				text: 'Ada cafe baru di deket kampus, mau coba bareng?',
				timestamp: '14:15'
			},
			{ id: 'msg_2_6', senderId: 'me', text: 'Boleh! Kapan?', timestamp: '14:18' },
			{ id: 'msg_2_7', senderId: 'other', text: 'Besok jadi ga ke cafe?', timestamp: 'Kemarin' }
		],
		conv_3: [
			{ id: 'msg_3_1', senderId: 'other', text: 'Bro main ML yuk!', timestamp: '20:00' },
			{ id: 'msg_3_2', senderId: 'me', text: 'Gas! Rank apa?', timestamp: '20:02' },
			{ id: 'msg_3_3', senderId: 'other', text: 'Mythic 3, kamu?', timestamp: '20:03' },
			{ id: 'msg_3_4', senderId: 'me', text: 'Mythic 5, masih grinding nih', timestamp: '20:05' },
			{ id: 'msg_3_5', senderId: 'other', text: 'Oke siap, invite ya', timestamp: '20:06' },
			{ id: 'msg_3_6', senderId: 'me', text: 'Done bro, ayo push!', timestamp: '20:10' },
			{ id: 'msg_3_7', senderId: 'other', text: 'GG bro, next time lagi ya', timestamp: '22:30' }
		]
	};

	let selectedConversation = $state<(typeof MOCK_CONVERSATIONS)[0] | null>(null);
	let messageInput = $state('');
	let messagesStore = $state<Record<string, Message[]>>({ ...MOCK_MESSAGES_BY_CONV });
	let searchQuery = $state('');

	const currentMessages = $derived(
		selectedConversation ? messagesStore[selectedConversation.id] || [] : []
	);

	const filteredConversations = $derived(
		MOCK_CONVERSATIONS.filter((conv) => conv.name.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectConversation(conv: (typeof MOCK_CONVERSATIONS)[0]) {
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
			senderId: 'me',
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

<div class="relative flex h-[calc(100vh-50px)] overflow-hidden md:h-screen ml-18">
	<div
		class="pointer-events-none fixed top-[-10%] left-[-10%] h-[40%] w-[50%] rounded-full bg-pink-300 opacity-20 blur-[100px]"
	></div>
	<div
		class="pointer-events-none fixed right-[-10%] bottom-[10%] h-[40%] w-[50%] rounded-full bg-purple-300 opacity-20 blur-[100px]"
	></div>

	<!-- ==================== CONVERSATION LIST (Left Panel) ==================== -->
	<div
		class="
    {selectedConversation ? 'hidden md:flex' : 'flex'} 
    relative z-10 w-full flex-col border-gray-200
    bg-white/50 backdrop-blur-sm md:w-95 md:max-w-95
    md:min-w-95 md:border-r
  "
	>
		<!-- Header -->
		<header class="shrink-0 border-b border-gray-100 bg-white/80 px-4 py-4 backdrop-blur-md">
			<h1 class="text-2xl font-bold text-gray-900">Pesan</h1>
			<p class="mt-0.5 text-sm text-gray-500">Chat dengan match kamu</p>

			<!-- Search bar -->
			<div class="relative mt-4">
				<SearchIcon class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari percakapan..."
					class="w-full rounded-xl border-0 bg-gray-100 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/50"
				/>
			</div>
		</header>

		<!-- Conversations List -->
		<div class="flex-1 overflow-y-auto">
			{#if filteredConversations.length === 0}
				<div class="flex flex-col items-center justify-center px-4 py-20">
					<div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
						<SendIcon class="h-8 w-8 text-gray-400" />
					</div>
					<p class="text-center text-gray-500">Belum ada percakapan</p>
					<p class="mt-1 text-center text-sm text-gray-400">
						Match dengan seseorang untuk mulai chat!
					</p>
				</div>
			{:else}
				<div class="divide-y divide-gray-100">
					{#each filteredConversations as conv (conv.id)}
						<button
							onclick={() => selectConversation(conv)}
							class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/80 active:bg-gray-100
                {selectedConversation?.id === conv.id ? 'bg-primary/10 md:bg-primary/10' : ''}"
						>
							<!-- Avatar -->
							<div class="relative shrink-0">
								<img
									src={conv.avatar}
									alt={conv.name}
									class="h-14 w-14 rounded-full object-cover shadow-sm ring-2 ring-white"
								/>
								{#if conv.online}
									<span
										class="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"
									></span>
								{/if}
							</div>

							<!-- Content -->
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between">
									<h3 class="truncate font-semibold text-gray-900">{conv.name}</h3>
									<span class="ml-2 shrink-0 text-xs text-gray-400">{conv.timestamp}</span>
								</div>
								<div class="grid grid-cols-[1fr_auto] gap-2 items-center">
									<p class="truncate text-sm text-gray-500">{conv.lastMessage}</p>
									<!-- Unread badge -->
									<span
										class="text-xs flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white {conv.unread > 0 ? '' : 'opacity-0'}"
									>
										{conv.unread}
									</span>
								</div>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- ==================== CHAT ROOM (Right Panel) ==================== -->
	<div
		class="
    {selectedConversation ? 'flex' : 'hidden md:flex'} 
    relative z-10 flex-1 flex-col bg-gray-50/50
  "
	>
		{#if selectedConversation}
			<!-- Chat Header -->
			<header
				class="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white/90 px-3 py-3 backdrop-blur-md"
			>
				<button
					onclick={goBack}
					class="-ml-2 rounded-full p-2 transition-colors hover:bg-gray-100 md:hidden"
				>
					<ArrowLeftIcon class="h-5 w-5 text-gray-700" />
				</button>

				<div class="relative shrink-0">
					<img
						src={selectedConversation.avatar}
						alt={selectedConversation.name}
						class="h-10 w-10 rounded-full object-cover"
					/>
					{#if selectedConversation.online}
						<span
							class="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
						></span>
					{/if}
				</div>

				<div class="min-w-0 flex-1">
					<h2 class="truncate font-semibold text-gray-900">{selectedConversation.name}</h2>
					<p class="text-xs text-gray-500">
						{selectedConversation.online ? 'Online' : 'Offline'}
					</p>
				</div>

				<button class="rounded-full p-2 transition-colors hover:bg-gray-100">
					<MoreVerticalIcon class="h-5 w-5 text-gray-500" />
				</button>
			</header>

			<!-- Messages Container -->
			<div id="messages-container" class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
				{#each currentMessages as msg (msg.id)}
					<div class="flex {msg.senderId === 'me' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[80%] rounded-2xl px-4 py-2.5 md:max-w-[60%] {msg.senderId === 'me'
								? 'rounded-br-md bg-primary text-white'
								: 'rounded-bl-md border border-gray-100 bg-white text-gray-800 shadow-sm'}"
						>
							<p class="text-sm leading-relaxed">{msg.text}</p>
							<p
								class="mt-1 text-[10px] {msg.senderId === 'me'
									? 'text-white/70'
									: 'text-gray-400'} text-right"
							>
								{msg.timestamp}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Message Input -->
			<div
				class="shrink-0 border-t border-gray-100 bg-white/90 px-3 py-3 backdrop-blur-md md:mb-0"
			>
				<div class=" flex max-w-4xl items-end gap-2">
					<div class="relative flex-1">
						<textarea
							bind:value={messageInput}
							onkeydown={handleKeydown}
							placeholder="Ketik pesan..."
							rows="1"
							class="max-h-32 w-full resize-none rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/50"
						></textarea>
					</div>
					<button
						onclick={sendMessage}
						disabled={!messageInput.trim()}
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
					>
						<SendIcon class="h-5 w-5" />
					</button>
				</div>
			</div>
		{:else}
			<!-- Empty State for Desktop -->
			<div class="hidden flex-1 flex-col items-center justify-center px-4 text-center md:flex">
				<div
					class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-tr from-primary/20 to-primary/10"
				>
					<MessageCircleIcon class="h-12 w-12 text-primary" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-700">Pilih percakapan</h3>
				<p class="max-w-sm text-gray-500">
					Pilih salah satu percakapan dari daftar untuk mulai chatting
				</p>
			</div>
		{/if}
	</div>
</div>

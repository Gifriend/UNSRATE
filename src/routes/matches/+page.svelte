<script lang="ts">
  import { goto } from '$app/navigation';
  import { scale, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { useConvexClient, useQuery } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';
  import type { Id } from '../../convex/_generated/dataModel';
  import { 
    HeartIcon, 
    MessageCircleIcon, 
    UserXIcon, 
    SparklesIcon,
    SearchIcon,
    XIcon,
    AlertTriangleIcon
  } from 'lucide-svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  const convex = useConvexClient();
  const matchesQuery = useQuery(api.matches.getMatches, () => ({ sortBy: "recent" as const }));

  const matches = $derived(matchesQuery.data ?? []);
  const isLoading = $derived(matchesQuery.isLoading);

  let searchQuery = $state('');
  let showUnmatchConfirm = $state(false);
  let selectedMatchId = $state<Id<"matches"> | null>(null);
  let selectedMatchName = $state('');
  let isUnmatching = $state(false);
  let lastSeenMatchCount = $state(0);

  const filteredMatches = $derived(
    searchQuery.trim() === '' 
      ? matches 
      : matches.filter(m => 
          m?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m?.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
        )
  );

  const newMatchesCount = $derived(matches.filter(m => m?.isNew).length);

  $effect(() => {
    const currentCount = matches.length;
    if (currentCount > 0 && currentCount !== lastSeenMatchCount) {
      lastSeenMatchCount = currentCount;
      convex.mutation(api.matches.markMatchesAsSeen, {});
    }
  });

  function openChat(partnerId: Id<"profiles">) {
    goto(`/chat?partner=${partnerId}`);
  }

  function viewProfile(partnerId: Id<"profiles">) {
    goto(`/user/${partnerId}`);
  }

  function confirmUnmatch(matchId: Id<"matches">, name: string) {
    selectedMatchId = matchId;
    selectedMatchName = name;
    showUnmatchConfirm = true;
  }

  async function handleUnmatch() {
    if (!selectedMatchId) return;
    
    isUnmatching = true;
    try {
      await convex.mutation(api.matches.unmatch, { matchId: selectedMatchId });
      showUnmatchConfirm = false;
      selectedMatchId = null;
      selectedMatchName = '';
    } catch (e) {
      console.error("Unmatch failed", e);
    } finally {
      isUnmatching = false;
    }
  }

  function closeUnmatchModal() {
    showUnmatchConfirm = false;
    selectedMatchId = null;
    selectedMatchName = '';
  }
</script>

<Sidebar />

<div class="min-h-screen bg-slate-50 md:ml-18 lg:ml-64">
  <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-lg mx-auto px-4 py-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <HeartIcon class="w-6 h-6 text-pink-500" />
          <h1 class="text-xl font-bold text-gray-800">Matches</h1>
          {#if newMatchesCount > 0}
            <span class="px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded-full">
              {newMatchesCount} baru
            </span>
          {/if}
        </div>
        <span class="text-sm text-gray-500">{matches.length} match</span>
      </div>

      <div class="relative">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari match..."
          bind:value={searchQuery}
          class="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        {#if searchQuery}
          <button 
            onclick={() => searchQuery = ''}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XIcon class="w-4 h-4" />
          </button>
        {/if}
      </div>
    </div>
  </header>

  <main class="max-w-lg mx-auto px-4 py-4 pb-24 md:pb-8">
    {#if isLoading}
      <div class="space-y-3">
        {#each Array(5) as _}
          <div class="bg-white rounded-2xl p-4 animate-pulse">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-gray-200"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>

    {:else if matches.length === 0}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="p-6 bg-pink-50 rounded-full mb-6">
          <SparklesIcon class="w-16 h-16 text-pink-300" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Belum Ada Match</h2>
        <p class="text-gray-500 mb-6 max-w-xs">
          Terus explore dan like orang yang kamu tertarik. Match akan muncul di sini!
        </p>
        <button 
          onclick={() => goto('/explore')}
          class="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition"
        >
          <HeartIcon class="w-5 h-5" />
          Mulai Explore
        </button>
      </div>

    {:else if filteredMatches.length === 0}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <SearchIcon class="w-12 h-12 text-gray-300 mb-4" />
        <p class="text-gray-500">Tidak ada match dengan nama "{searchQuery}"</p>
      </div>

    {:else}
      <div class="space-y-3">
        {#each filteredMatches as match (match?._id)}
          {#if match}
            <div 
              class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition group relative {match.isNew ? 'ring-2 ring-pink-400' : ''}"
              in:fly={{ y: 20, duration: 300, easing: quintOut }}
            >
              {#if match.isNew}
                <div class="absolute -top-2 -right-2 px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded-full">
                  NEW
                </div>
              {/if}

              <div class="flex items-center gap-4">
                <button 
                  onclick={() => viewProfile(match.partnerId)}
                  class="relative shrink-0"
                >
                  <div class="w-16 h-16 rounded-full overflow-hidden ring-2 ring-pink-200 group-hover:ring-pink-400 transition">
                    <img 
                      src={match.photos?.[0] || `https://ui-avatars.com/api/?name=${match.fullname}&size=128&background=random`}
                      alt={match.fullname}
                      class="w-full h-full object-cover"
                    />
                  </div>
                </button>

                <div class="flex-1 min-w-0">
                  <button 
                    onclick={() => viewProfile(match.partnerId)}
                    class="text-left w-full"
                  >
                    <h3 class="font-semibold text-gray-800 truncate flex items-baseline gap-2">
                      {match.fullname}
                      <span class="text-sm font-normal text-gray-500">{match.age}</span>
                    </h3>
                    <p class="text-sm text-gray-500 truncate">{match.prodi}</p>
                  </button>

                  {#if match.interests && match.interests.length > 0}
                    <div class="flex flex-wrap gap-1 mt-2">
                      {#each match.interests.slice(0, 2) as interest}
                        {#if interest}
                          <span class="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs">
                            {interest.icon ?? ''} {interest.name}
                          </span>
                        {/if}
                      {/each}
                      {#if match.interests.length > 2}
                        <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                          +{match.interests.length - 2}
                        </span>
                      {/if}
                    </div>
                  {/if}
                </div>

                <div class="flex flex-col gap-2">
                  <button 
                    onclick={() => openChat(match.partnerId)}
                    class="p-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition active:scale-95"
                    aria-label="Mulai chat"
                  >
                    <MessageCircleIcon class="w-5 h-5" />
                  </button>
                  <button 
                    onclick={() => confirmUnmatch(match._id, match.fullname ?? '')}
                    class="p-2.5 bg-gray-100 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition active:scale-95"
                    aria-label="Unmatch"
                  >
                    <UserXIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </main>

  <BottomNav />
</div>

{#if showUnmatchConfirm}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    role="presentation"
    transition:scale={{ duration: 200 }}
  >
    <button 
      class="absolute inset-0 w-full h-full cursor-default"
      onclick={closeUnmatchModal}
      aria-label="Tutup"
    ></button>
    <div 
      class="relative bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex justify-center mb-4">
        <div class="p-4 bg-red-100 rounded-full">
          <AlertTriangleIcon class="w-8 h-8 text-red-500" />
        </div>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-2">Unmatch {selectedMatchName}?</h3>
      <p class="text-gray-500 text-sm mb-6">
        Kamu akan kehilangan match ini dan tidak bisa chat lagi. Tindakan ini tidak bisa dibatalkan.
      </p>

      <div class="flex gap-3">
        <button 
          onclick={closeUnmatchModal}
          class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Batal
        </button>
        <button 
          onclick={handleUnmatch}
          disabled={isUnmatching}
          class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if isUnmatching}
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          {:else}
            Unmatch
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

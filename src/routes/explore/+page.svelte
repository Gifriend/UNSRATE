<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { SearchXIcon, HeartIcon, RefreshCwIcon, PartyPopperIcon, Loader2Icon } from 'lucide-svelte';
  import { useConvexClient, useQuery } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';
  import type { ExploreProfile, MatchResult } from '$lib/types/explore';
  import type { Id } from '../../convex/_generated/dataModel';
  import ActionButtons from '$lib/components/ActionButtons.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import NewCard from '$lib/components/NewCard.svelte';
  import * as m from '$lib/paraglide/messages';

  const convex = useConvexClient();
  
  let fetchKey = $state(0);
  const profilesQuery = useQuery(api.explore.getExploreProfiles, () => ({ limit: 20, _key: fetchKey }));

  let currentIndex = $state(0);
  let swipeDirection = $state<'left' | 'right' | null>(null);
  let isSwiping = $state(false);
  let showMatchModal = $state(false);
  let matchedProfile = $state<MatchResult['matchedProfile'] | null>(null);
  let swipeError = $state<string | null>(null);

  const profiles = $derived(profilesQuery.data as ExploreProfile[] | undefined);
  const isLoading = $derived(profilesQuery.isLoading);
  const currentProfile = $derived(profiles?.[currentIndex]);
  const remaining = $derived((profiles?.length ?? 0) - currentIndex);

  const handleAction = async (action: 'LIKE' | 'DISLIKE') => {
    if (!currentProfile || isSwiping) return;

    isSwiping = true;
    swipeDirection = action === 'LIKE' ? 'right' : 'left';
    const profileId = currentProfile._id;
    const previousIndex = currentIndex;

    setTimeout(async () => {
      currentIndex++;
      swipeDirection = null;

      try {
        const result = await convex.mutation(api.explore.swipe, {
          swipeeId: profileId as Id<"profiles">,
          action,
        });

        swipeError = null;

        if (result.match) {
          matchedProfile = result.match.matchedProfile;
          showMatchModal = true;
        }

        if (remaining <= 3) {
          handleRefresh();
        }
      } catch (e) {
        console.error("Swipe failed", e);
        swipeError = m.explore_error();
        currentIndex = previousIndex;
      } finally {
        isSwiping = false;
      }
    }, 250);
  };

  const handleRefresh = () => {
    currentIndex = 0;
    fetchKey++;
  };

  const closeMatchModal = () => {
    showMatchModal = false;
    matchedProfile = null;
  };
</script>

{#if showMatchModal && matchedProfile}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    role="presentation"
  >
    <button 
      class="absolute inset-0 w-full h-full cursor-default"
      onclick={closeMatchModal}
      aria-label="Close match modal"
    ></button>
    <div 
      class="relative bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex justify-center mb-4">
        <div class="relative">
          <div class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-pink-400 shadow-lg">
            <img 
              src={matchedProfile.photos?.[0] || `https://ui-avatars.com/api/?name=${matchedProfile.fullname}&size=200&background=random`}
              alt={matchedProfile.fullname}
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2">
            <HeartIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-center gap-2 mb-2">
        <PartyPopperIcon class="w-6 h-6 text-yellow-500" />
        <h2 class="text-2xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          {m.match_title()}
        </h2>
        <PartyPopperIcon class="w-6 h-6 text-yellow-500 scale-x-[-1]" />
      </div>
      
      <p class="text-gray-600 mb-6">
        {m.match_message({ name: matchedProfile.fullname })}
      </p>
      
      <div class="flex gap-3">
        <button 
          onclick={closeMatchModal}
          class="flex-1 py-3 px-4 border-2 border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          {m.match_later()}
        </button>
        <a 
          href="/chat"
          class="flex-1 py-3 px-4 bg-linear-to-r from-pink-500 to-rose-500 rounded-full font-semibold text-white hover:opacity-90 transition text-center"
        >
          {m.match_send_message()}
        </a>
      </div>
    </div>
  </div>
{/if}

<div class="min-h-screen flex flex-col relative overflow-hidden">
  <div class="fixed top-[-10%] left-[-10%] w-[50%] h-[40%] bg-pink-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
  <div class="fixed bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

  <main class="flex-1 flex flex-col justify-center px-4 max-w-md mx-auto w-full relative z-10 pt-4 pb-24">
    {#if isLoading}
      <SkeletonCard />
      <div class="mt-8 flex justify-center gap-8 opacity-50">
        <div class="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
        <div class="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

    {:else if !profiles || profiles.length === 0 || !currentProfile}
      <div class="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div class="p-6 bg-linear-to-br from-pink-50 to-rose-50 rounded-full shadow-lg mb-6">
          <SearchXIcon class="w-16 h-16 text-pink-300" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">{m.explore_no_profiles()}</h2>
        <p class="text-gray-500 mb-8 max-w-xs">
          {m.explore_no_profiles_desc()}
        </p>
        <button 
          onclick={handleRefresh}
          class="flex items-center gap-2 bg-linear-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition font-semibold"
        >
          <RefreshCwIcon class="w-5 h-5" />
          {m.common_refresh()}
        </button>
      </div>

    {:else}
      <div class="relative w-full aspect-3/4">
        {#if profiles[currentIndex + 1]}
          <div class="absolute inset-0 top-3 scale-95 opacity-50 z-0 brightness-90">
            <NewCard profile={profiles[currentIndex + 1]} />
          </div>
        {/if}

        {#key currentProfile._id}
          <div 
            class="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
            in:scale={{ start: 0.95, duration: 300, easing: quintOut }}
            out:fly={{ x: swipeDirection === 'right' ? 500 : swipeDirection === 'left' ? -500 : 0, duration: 300, opacity: 0 }}
          >
            <NewCard profile={currentProfile} />
            
            {#if swipeDirection === 'right'}
              <div class="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded transform -rotate-12 bg-black/20 backdrop-blur-sm z-30">
                {m.explore_like()}
              </div>
            {:else if swipeDirection === 'left'}
              <div class="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded transform rotate-12 bg-black/20 backdrop-blur-sm z-30">
                {m.explore_nope()}
              </div>
            {/if}
          </div>
        {/key}
      </div>

      <div class="relative z-30">
        <ActionButtons 
          onlike={() => handleAction('LIKE')} 
          ondislike={() => handleAction('DISLIKE')}
          disabled={isSwiping}
        />
      </div>

      {#if swipeError}
        <p class="text-center text-sm text-red-500 mt-2">{swipeError}</p>
      {/if}

      <p class="text-center text-sm text-gray-400 mt-2">
        {m.explore_profiles_remaining({ count: remaining })}
      </p>
    {/if}
  </main>

  <BottomNav />
</div>
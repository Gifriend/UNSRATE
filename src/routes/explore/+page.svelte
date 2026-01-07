<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { ZapIcon } from 'lucide-svelte';
  
  // Components
  import ActionButtons from '$lib/components/ActionButtons.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte'; // Ganti Header dengan ini
  import SkeletonCard from '$lib/components/SkeletonCard.svelte';
  import NewCard from '$lib/components/NewCard.svelte';
  
  // Services & Types
  import { api } from '$lib/services/client-api';
  import type { Profile, ExploreResponse } from '$lib/types/explore'; // Pastikan type explore benar

  // --- STATE ---
  let currentIndex = 0;
  let profiles: Profile[] = [];
  let isLoading = true;
  let error: string | null = null;
  let isFetchingMore = false;
  let swipeDirection: 'left' | 'right' | null = null; // Visual only

  // Reactive
  $: currentProfile = profiles[currentIndex];
  $: remaining = profiles.length - currentIndex;

  // --- API HANDLER ---
  const fetchProfiles = async (isLoadMore = false) => {
    if (isLoadMore && isFetchingMore) return;
    
    try {
      if (!isLoadMore) isLoading = true;
      else isFetchingMore = true;

      // NOTE: Sesuaikan structure ini dengan return backend Anda.
      // Jika backend return { data: { profiles: [...] } }, gunakan response.data.profiles
      // Jika backend return { profiles: [...] }, gunakan response.profiles
      const response = await api.get<{ data: { profiles: Profile[] } }>("discovery/feed");
      
      // Asumsi backend mengembalikan structure standard
      const newProfiles = response.data?.profiles || [];

      if (!isLoadMore) {
        profiles = newProfiles;
        currentIndex = 0;
      } else if (newProfiles.length > 0) {
        profiles = [...profiles, ...newProfiles];
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (!isLoadMore) error = "Gagal memuat profil.";
    } finally {
      isLoading = false;
      isFetchingMore = false;
    }
  };

  const handleAction = async (action: 'LIKE' | 'DISLIKE') => {
    if (!currentProfile) return;

    // 1. Visual Animation
    swipeDirection = action === 'LIKE' ? 'right' : 'left';
    const profileId = currentProfile.id;

    // 2. Logic Delay (biarkan animasi jalan dulu)
    setTimeout(async () => {
      currentIndex++;
      swipeDirection = null;

      // 3. API Call (Optimistic UI)
      try {
        await api.post("explores", { exploredUserId: profileId, action });
        // Cek match logic here jika perlu (response.match)
      } catch (e) {
        console.error("Swipe failed", e);
      }
    }, 250);
  };

  // --- LIFECYCLE ---
  onMount(() => {
    fetchProfiles();
  });

  // Auto fetch more jika sisa kartu <= 2
  $: if (remaining <= 2 && remaining > 0 && !isFetchingMore && !isLoading) {
    fetchProfiles(true);
  }
</script>

<div class="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden pb-20">
  
  <div class="fixed top-[-10%] left-[-10%] w-[50%] h-[40%] bg-pink-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
  <div class="fixed bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

  <main class="flex-1 flex flex-col justify-center px-4 max-w-md mx-auto w-full relative z-10 pt-4">
    
    {#if isLoading}
      <SkeletonCard />
      <div class="mt-8 flex justify-center gap-8 opacity-50">
         <div class="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
         <div class="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

    {:else if error}
      <div class="text-center py-20">
        <p class="text-red-500 mb-4">{error}</p>
        <button on:click={() => fetchProfiles(false)} class="bg-pink-500 text-white px-6 py-2 rounded-full">Coba Lagi</button>
      </div>

    {:else if currentProfile}
      <div class="relative w-full aspect-3/4">
        
        {#if profiles[currentIndex + 1]}
          <div class="absolute inset-0 top-3 scale-95 opacity-50 z-0 brightness-90">
             <NewCard profile={profiles[currentIndex + 1]} />
          </div>
        {/if}

        {#key currentProfile.id}
          <div 
            class="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
            in:scale={{ start: 0.95, duration: 300, easing: quintOut }}
            out:fly={{ x: swipeDirection === 'right' ? 500 : swipeDirection === 'left' ? -500 : 0, duration: 300, opacity: 0 }}
          >
            <NewCard profile={currentProfile} />
            
            {#if swipeDirection === 'right'}
              <div class="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded transform -rotate-12 bg-black/20 backdrop-blur-sm z-30">
                LIKE
              </div>
            {:else if swipeDirection === 'left'}
              <div class="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded transform rotate-12 bg-black/20 backdrop-blur-sm z-30">
                NOPE
              </div>
            {/if}
          </div>
        {/key}
      </div>

      <div class="relative z-30">
        <ActionButtons 
          on:like={() => handleAction('LIKE')} 
          on:dislike={() => handleAction('DISLIKE')} 
          showSuperLike={true}
        />
      </div>

    {:else}
      <div class="flex flex-col items-center justify-center h-[60vh] text-center">
        <div class="p-6 bg-white rounded-full shadow-lg mb-6">
          <ZapIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="text-xl font-bold text-gray-800">Tidak ada orang baru</h2>
        <p class="text-gray-500 mt-2 mb-6">Coba perlebar jarak pencarian kamu.</p>
        <button on:click={() => fetchProfiles(false)} class="bg-linear-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition">
          Refresh
        </button>
      </div>
    {/if}
  </main>

  <BottomNav />
  
</div>
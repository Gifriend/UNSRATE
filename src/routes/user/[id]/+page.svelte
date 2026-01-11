<script lang="ts">
  import { page } from '$app/stores';
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import type { Id } from '$convex/_generated/dataModel';
  import { 
    ArrowLeftIcon, 
    GraduationCapIcon, 
    CalendarIcon, 
    BookOpenIcon,
    SparklesIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  } from 'lucide-svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';

  const profileId = $derived($page.params.id as Id<"profiles">);
  const profileQuery = useQuery(api.profiles.getProfileById, () => ({ profileId }));

  const profile = $derived(profileQuery.data);
  const isLoading = $derived(profileQuery.isLoading);

  let currentPhotoIndex = $state(0);

  const mainPhoto = $derived(
    profile?.photos && profile.photos.length > 0
      ? profile.photos[currentPhotoIndex]
      : `https://ui-avatars.com/api/?name=${profile?.fullname ?? 'User'}&size=500&background=random`
  );

  const totalPhotos = $derived(profile?.photos?.length ?? 0);

  function nextPhoto() {
    if (currentPhotoIndex < totalPhotos - 1) {
      currentPhotoIndex++;
    }
  }

  function prevPhoto() {
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
    }
  }

  function goBack() {
    history.back();
  }
</script>

<div class="min-h-screen bg-slate-50 md:ml-18 lg:ml-64">
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <svg class="animate-spin h-12 w-12 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="text-gray-500">Memuat profil...</p>
      </div>
    </div>

  {:else if !profile}
    <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div class="p-6 bg-gray-100 rounded-full mb-6">
        <SparklesIcon class="w-16 h-16 text-gray-300" />
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Profil Tidak Ditemukan</h2>
      <p class="text-gray-500 mb-6">User ini mungkin sudah tidak aktif atau tidak ada.</p>
      <button 
        onclick={goBack}
        class="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        Kembali
      </button>
    </div>

  {:else}
    <div class="max-w-lg mx-auto pb-24 md:pb-8">
      <div class="relative">
        <div class="relative aspect-4/5 bg-gray-200">
          <img 
            src={mainPhoto} 
            alt={profile.fullname} 
            class="w-full h-full object-cover"
          />

          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/30"></div>

          <button 
            onclick={goBack}
            class="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition z-10"
            aria-label="Kembali"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </button>

          {#if totalPhotos > 1}
            <div class="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {#each profile.photos as _, i}
                <button 
                  onclick={() => currentPhotoIndex = i}
                  class="h-1 rounded-full transition-all {i === currentPhotoIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}"
                  aria-label="Foto {i + 1}"
                ></button>
              {/each}
            </div>

            <button 
              onclick={prevPhoto}
              disabled={currentPhotoIndex === 0}
              class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeftIcon class="w-6 h-6" />
            </button>

            <button 
              onclick={nextPhoto}
              disabled={currentPhotoIndex === totalPhotos - 1}
              class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Foto selanjutnya"
            >
              <ChevronRightIcon class="w-6 h-6" />
            </button>
          {/if}

          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 class="text-3xl font-bold flex items-baseline gap-2">
              {profile.fullname}
              <span class="text-2xl font-normal opacity-90">{profile.age}</span>
            </h1>
            <p class="text-white/80 mt-1">{profile.nickname}</p>
          </div>
        </div>

        <div class="bg-white px-6 py-5 space-y-6">
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <GraduationCapIcon class="w-4 h-4 text-pink-500" />
              <span>{profile.fakultas}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <BookOpenIcon class="w-4 h-4 text-pink-500" />
              <span>{profile.prodi}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <CalendarIcon class="w-4 h-4 text-pink-500" />
              <span>Angkatan {profile.angkatan}</span>
            </div>
          </div>

          {#if profile.bio}
            <div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tentang</h3>
              <p class="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          {/if}

          {#if profile.interests && profile.interests.length > 0}
            <div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Minat & Hobi</h3>
              <div class="flex flex-wrap gap-2">
                {#each profile.interests as interest}
                  {#if interest}
                    <span class="px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-medium border border-pink-100">
                      {interest.icon ?? ''} {interest.name}
                    </span>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <BottomNav />
</div>

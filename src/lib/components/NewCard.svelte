<script lang="ts">
  import { MapPinIcon, InfoIcon } from 'lucide-svelte';
  import type { ExploreProfile } from '$lib/types/explore';

  let { profile }: { profile: ExploreProfile } = $props();

  const mainPhoto = $derived(
    profile.photos && profile.photos.length > 0 
      ? profile.photos[0] 
      : `https://ui-avatars.com/api/?name=${profile.fullname}&size=500&background=random`
  );
</script>

<div class="relative w-full aspect-3/4 bg-white rounded-3xl overflow-hidden shadow-xl select-none group">
  <img 
    src={mainPhoto} 
    alt={profile.fullname} 
    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    draggable="false"
  />

  <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-90"></div>

  <div class="absolute bottom-0 left-0 w-full p-6 text-white">
    <div class="flex items-end justify-between mb-2">
      <div class="flex flex-col">
        <h2 class="text-3xl font-bold tracking-tight flex items-baseline gap-2 text-shadow">
          {profile.fullname}
          <span class="text-xl font-normal opacity-90">{profile.age}</span>
        </h2>
        
        {#if profile.fakultas || profile.prodi}
          <p class="text-sm text-gray-300 font-medium mt-1">
             {profile.prodi || profile.fakultas}
          </p>
        {/if}

        {#if profile.matchScore}
          <div class="flex items-center text-xs font-medium text-pink-300 mt-1">
            <span class="mr-1">💕</span>
            {profile.matchScore}% Match
          </div>
        {/if}
      </div>

      <button class="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition active:scale-95">
        <InfoIcon class="w-6 h-6 text-white" />
      </button>
    </div>

    <div class="h-px w-full bg-white/20 my-3"></div>

    {#if profile.bio}
      <p class="text-sm text-gray-200 leading-relaxed line-clamp-2 opacity-90">
        {profile.bio}
      </p>
    {/if}

    {#if profile.interests && profile.interests.length > 0}
      <div class="flex flex-wrap gap-2 mt-4">
        {#each profile.interests.slice(0, 3) as interest}
          <span class="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold text-white/90">
            {interest.icon ?? ''} {interest.name}
          </span>
        {/each}
        {#if profile.interests.length > 3}
          <span class="px-2 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/80">
            +{profile.interests.length - 3}
          </span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
</style>
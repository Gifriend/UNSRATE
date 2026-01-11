<script lang="ts">
  import { Home, HeartIcon, MessageCircleIcon, UserIcon, LogOutIcon, ZapIcon } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { logout } from '$lib/stores/auth';
  import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { useQuery } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';

  const auth = useAuth();
  const unseenMatchesQuery = useQuery(api.matches.getUnseenMatchCount, () => ({}));
  
  const unseenCount = $derived(unseenMatchesQuery.data ?? 0);
  const isActive = (path: string) => $page.url.pathname.startsWith(path);
  let isLoggingOut = $state(false);
  
  async function handleLogout() {
    if (isLoggingOut) return;
    isLoggingOut = true;
    await logout();
    isLoggingOut = false;
  }
</script>

<nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-300 py-3 pb-safe z-50 transition-transform duration-300">
  <div class="flex justify-around items-center max-w-md mx-auto">
    
    <a href="/explore" class="flex flex-col items-center gap-1 transition-colors {isActive('/explore') ? 'text-primary' : 'text-gray-400'}">
      <ZapIcon size={24} strokeWidth={isActive('/explore') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Jelajahi</span>
    </a>

    <a href="/matches" class="relative flex flex-col items-center gap-1 transition-colors {isActive('/matches') ? 'text-primary' : 'text-grey-400'}">
      <HeartIcon size={24} strokeWidth={isActive('/matches') ? 2.5 : 2} />
      {#if unseenCount > 0}
        <span class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full px-1">
          {unseenCount > 99 ? '99+' : unseenCount}
        </span>
      {/if}
      <span class="text-[10px] font-medium">Suka</span>
    </a> -->
    <a href="/chat" class="flex flex-col items-center gap-1 transition-colors {isActive('/chat') ? 'text-primary' : 'text-gray-400'}">
      <MessageCircleIcon size={24} strokeWidth={isActive('/chat') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Pesan</span>
    </a>

    <a href="/profile" class="flex flex-col items-center gap-1 transition-colors {isActive('/profile') ? 'text-primary' : 'text-gray-400'}">
      <UserIcon size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Profil</span>
    </a>

    <button 
      onclick={handleLogout}
      disabled={isLoggingOut}
      class="flex flex-col items-center gap-1 transition-colors text-gray-400 hover:text-red-500 disabled:opacity-50"
    >
      {#if isLoggingOut}
        <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      {:else}
        <LogOutIcon size={24} strokeWidth={2} />
      {/if}
      <span class="text-[10px] font-medium">Keluar</span>
    </button>

  </div>
</nav>

<style>
  /* Menangani safe area untuk iPhone X ke atas */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 12px);
  }
</style>
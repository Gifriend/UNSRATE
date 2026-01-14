<script lang="ts">
  import { HeartIcon, MessageCircleIcon, UserIcon, SettingsIcon, ZapIcon } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { useQuery } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';
  import * as m from '$lib/paraglide/messages';
  import { i18n } from '$lib/i18n';

  const unseenMatchesQuery = useQuery(api.matches.getUnseenMatchCount, () => ({}));
  const unreadMessagesQuery = useQuery(api.conversations.getTotalUnreadCount, () => ({}));
  
  const unseenCount = $derived(unseenMatchesQuery.data ?? 0);
  const unreadMessages = $derived(unreadMessagesQuery.data ?? 0);
  
  // Helper to get localized route
  const getRoute = (path: string) => i18n.route(path);
  
  // Helper to check if path is active (without language prefix)
  const isActive = (path: string) => {
    const currentPath = $page.url.pathname.replace(/^\/en(\/|$)/, '/');
    return currentPath.startsWith(path);
  };
</script>

<nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-300 py-3 pb-safe z-50 transition-transform duration-300">
  <div class="flex justify-around items-center max-w-md mx-auto">
    
    <a href={getRoute('/explore')} class="flex flex-col items-center gap-1 transition-colors {isActive('/explore') ? 'text-primary' : 'text-gray-400'}">
      <ZapIcon size={24} strokeWidth={isActive('/explore') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">{m.nav_explore()}</span>
    </a>

    <a href={getRoute('/matches')} class="relative flex flex-col items-center gap-1 transition-colors {isActive('/matches') ? 'text-primary' : 'text-grey-400'}">
      <HeartIcon size={24} strokeWidth={isActive('/matches') ? 2.5 : 2} />
      {#if unseenCount > 0}
        <span class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full px-1">
          {unseenCount > 99 ? '99+' : unseenCount}
        </span>
      {/if}
      <span class="text-[10px] font-medium">{m.nav_likes()}</span>
    </a>

    <a href={getRoute('/chat')} class="relative flex flex-col items-center gap-1 transition-colors {isActive('/chat') ? 'text-primary' : 'text-grey-400'}">
      <MessageCircleIcon size={24} strokeWidth={isActive('/chat') ? 2.5 : 2} />
      {#if unreadMessages > 0}
        <span class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full px-1">
          {unreadMessages > 99 ? '99+' : unreadMessages}
        </span>
      {/if}
      <span class="text-[10px] font-medium">{m.nav_messages()}</span>
    </a>

    <a href={getRoute('/profile')} class="flex flex-col items-center gap-1 transition-colors {isActive('/profile') ? 'text-primary' : 'text-gray-400'}">
      <UserIcon size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">{m.nav_profile()}</span>
    </a>

    <a href={getRoute('/settings')} class="flex flex-col items-center gap-1 transition-colors {isActive('/settings') ? 'text-primary' : 'text-gray-400'}">
      <SettingsIcon size={24} strokeWidth={isActive('/settings') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">{m.nav_settings()}</span>
    </a>

  </div>
</nav>

<style>
  /* Menangani safe area untuk iPhone X ke atas */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 12px);
  }
</style>
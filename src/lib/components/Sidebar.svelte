<script lang="ts">
  import { page } from '$app/stores';
  import { 
    ZapIcon, 
    HeartIcon, 
    MessageCircleIcon, 
    UserIcon,
    SettingsIcon 
  } from 'lucide-svelte';
  import { useQuery } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';
  import * as m from '$lib/paraglide/messages';

  const unseenMatchesQuery = useQuery(api.matches.getUnseenMatchCount, () => ({}));
  const unseenCount = $derived(unseenMatchesQuery.data ?? 0);

  const unreadMessagesQuery = useQuery(api.conversations.getTotalUnreadCount, () => ({}));
  const unreadMessages = $derived(unreadMessagesQuery.data ?? 0);

  const menuItems = $derived([
    { icon: ZapIcon, label: m.nav_explore(), href: '/explore', badge: 0 },
    { icon: HeartIcon, label: m.nav_matches(), href: '/matches', badge: unseenCount },
    { icon: MessageCircleIcon, label: m.nav_messages(), href: '/chat', badge: unreadMessages },
    { icon: UserIcon, label: m.nav_profile(), href: '/profile', badge: 0 },
  ]);

  const activePath = $derived($page.url.pathname);
</script>

<aside class="hidden md:flex flex-col fixed left-0 top-0 h-screen {activePath.startsWith('/chat') ? 'w-18' : 'w-18 lg:w-64'} bg-white border-r border-gray-200 z-50 transition-all duration-300">
  
  <div class="h-20 flex items-center px-4 lg:px-6 mb-6 mt-2">
    <a href="/explore" class="hidden {activePath.startsWith('/chat') ? 'lg:hidden' : 'lg:block'} transition-opacity hover:opacity-80">
        <h1 class="text-2xl font-extrabold tracking-tight text-text-main">
            UNS<span class="text-gradient-brand">RATE</span>
        </h1>
    </a>

    <!-- svelte-ignore a11y_consider_explicit_label -->
    <a href="/explore" class="block {activePath.startsWith('/chat') ? 'lg:block' : 'lg:hidden'} mx-auto transition-transform hover:scale-105">
        {#if activePath.startsWith('/chat')}
          <img src="/src/lib/assets/unsrate.png" alt="UNSRATE" class="w-15 h-15 object-contain" />
        {:else}
          <div class="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-md">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
        {/if}
    </a>
  </div>

  <nav class="flex-1 px-3 space-y-2">
    {#each menuItems as item}
      <a 
        href={item.href}
        class="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative
               {activePath.startsWith(item.href) 
                 ? 'bg-primary/10 text-primary font-semibold' 
                 : 'text-gray-500 hover:bg-gray-100 hover:text-text-main'}"
      >
        <div class="relative group-hover:scale-110 transition-transform duration-200">
             <item.icon size={26} strokeWidth={activePath.startsWith(item.href) ? 2.5 : 2} />
             
             {#if item.badge > 0}
               <span class="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1">
                 {item.badge > 99 ? '99+' : item.badge}
               </span>
             {/if}
        </div>

        <span class="hidden {activePath.startsWith('/chat') ? 'lg:hidden' : 'lg:block'} text-[15px] tracking-wide">{item.label}</span>
        
        {#if item.badge > 0}
          <span class="hidden {activePath.startsWith('/chat') ? 'lg:hidden' : 'lg:flex'} ml-auto min-w-5 h-5 items-center justify-center bg-primary text-white text-xs font-bold rounded-full px-1.5">
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        {/if}
      </a>
    {/each}
  </nav>

  <div class="p-4 mt-auto space-y-1">
    <a 
      href="/settings"
      class="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
             {activePath.startsWith('/settings') 
               ? 'bg-primary/10 text-primary font-semibold' 
               : 'text-gray-500 hover:bg-gray-100 hover:text-text-main'}"
    >
      <SettingsIcon size={26} strokeWidth={activePath.startsWith('/settings') ? 2.5 : 2} />
      <span class="hidden {activePath.startsWith('/chat') ? 'lg:hidden' : 'lg:block'} text-[15px]">{m.nav_settings()}</span>
    </a>
  </div>

</aside>
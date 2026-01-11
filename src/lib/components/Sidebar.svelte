<script lang="ts">
  import { page } from '$app/stores';
  import { 
    ZapIcon, 
    HeartIcon, 
    MessageCircleIcon, 
    UserIcon, 
    LogOutIcon,
    SettingsIcon 
  } from 'lucide-svelte';
  import { logout } from '$lib/stores/auth';
  import { useQuery } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';

  const unseenMatchesQuery = useQuery(api.matches.getUnseenMatchCount, () => ({}));
  const unseenCount = $derived(unseenMatchesQuery.data ?? 0);

  const menuItems = $derived([
    { icon: ZapIcon, label: 'Jelajahi', href: '/explore', badge: 0 },
    { icon: HeartIcon, label: 'Suka & Cocok', href: '/matches', badge: unseenCount },
    { icon: MessageCircleIcon, label: 'Pesan', href: '/chat', badge: 0 },
    { icon: UserIcon, label: 'Profil', href: '/profile', badge: 0 },
  ]);

  let isLoggingOut = $state(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    isLoggingOut = true;
    await logout();
    isLoggingOut = false;
  }

  const activePath = $derived($page.url.pathname);
</script>

<aside class="hidden md:flex flex-col fixed left-0 top-0 h-screen w-18 lg:w-64 bg-white border-r border-grey-100/10 z-50 transition-all duration-300">
  
  <div class="h-20 flex items-center px-4 lg:px-6 mb-6 mt-2">
    <a href="/explore" class="hidden lg:block transition-opacity hover:opacity-80">
        <h1 class="text-2xl font-extrabold tracking-tight text-text-main">
            UNS<span class="text-gradient-brand">RATE</span>
        </h1>
    </a>

    <!-- svelte-ignore a11y_consider_explicit_label -->
    <a href="/explore" class="block lg:hidden mx-auto transition-transform hover:scale-105">
        <div class="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-md">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
    </a>
  </div>

  <nav class="flex-1 px-3 space-y-2">
    {#each menuItems as item}
      <a 
        href={item.href}
        class="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative
               {activePath.startsWith(item.href) 
                 ? 'bg-primary/10 text-primary font-semibold' 
                 : 'text-grey-500 hover:bg-grey-100 hover:text-text-main'}"
      >
        <div class="relative group-hover:scale-110 transition-transform duration-200">
             <svelte:component this={item.icon} size={26} strokeWidth={activePath.startsWith(item.href) ? 2.5 : 2} />
             
             {#if item.badge > 0}
               <span class="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full px-1">
                 {item.badge > 99 ? '99+' : item.badge}
               </span>
             {/if}
        </div>

        <span class="hidden lg:block text-[15px] tracking-wide">{item.label}</span>
        
        {#if item.badge > 0}
          <span class="hidden lg:flex ml-auto min-w-5 h-5 items-center justify-center bg-pink-500 text-white text-xs font-bold rounded-full px-1.5">
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        {/if}
      </a>
    {/each}
  </nav>

  <div class="p-4 mt-auto space-y-1">
    <button class="w-full flex items-center gap-4 p-3 rounded-xl text-grey-500 hover:bg-grey-100 hover:text-text-main transition-colors text-left group">
      <SettingsIcon size={26} />
      <span class="hidden lg:block text-[15px]">Pengaturan</span>
    </button>
    <button 
      onclick={handleLogout}
      disabled={isLoggingOut}
      class="w-full flex items-center gap-4 p-3 rounded-xl text-grey-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left group disabled:opacity-50"
    >
      {#if isLoggingOut}
        <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      {:else}
        <LogOutIcon size={26} />
      {/if}
      <span class="hidden lg:block text-[15px]">Keluar</span>
    </button>
  </div>

</aside>
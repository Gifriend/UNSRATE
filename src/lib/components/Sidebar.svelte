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

  const menuItems = [
    { icon: ZapIcon, label: 'Jelajahi', href: '/explore' },
    { icon: HeartIcon, label: 'Suka & Cocok', href: '/matches' },
    { icon: MessageCircleIcon, label: 'Pesan', href: '/chat' },
    { icon: UserIcon, label: 'Profil', href: '/profile' },
  ];

  $: activePath = $page.url.pathname;
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
             
             {#if item.label === 'Messages' || item.label === 'Likes & Matches'}
               <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border border-white"></span>
             {/if}
        </div>

        <span class="hidden lg:block text-[15px] tracking-wide">{item.label}</span>
      </a>
    {/each}
  </nav>

  <div class="p-4 mt-auto space-y-1">
    <button class="w-full flex items-center gap-4 p-3 rounded-xl text-grey-500 hover:bg-grey-100 hover:text-text-main transition-colors text-left group">
      <SettingsIcon size={26} />
      <span class="hidden lg:block text-[15px]">Pengaturan</span>
    </button>
    <button class="w-full flex items-center gap-4 p-3 rounded-xl text-grey-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left group">
      <LogOutIcon size={26} />
      <span class="hidden lg:block text-[15px]">Keluar</span>
    </button>
  </div>

</aside>
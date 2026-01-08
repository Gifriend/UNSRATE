<script>
  import { ZapIcon, HeartIcon, MessageCircleIcon, UserIcon } from 'lucide-svelte';
  import { page } from '$app/stores';

  // Helper untuk mengecek route aktif
  $: isActive = (/** @type {string} */ path) => $page.url.pathname.startsWith(path);
</script>

<nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-grey-100 py-3 pb-safe z-50 transition-transform duration-300">
  <div class="flex justify-around items-center max-w-md mx-auto">
    
    <a href="/explore" class="flex flex-col items-center gap-1 transition-colors {isActive('/explore') ? 'text-primary' : 'text-grey-400'}">
      <ZapIcon size={24} strokeWidth={isActive('/explore') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Explore</span>
    </a>

    <a href="/matches" class="flex flex-col items-center gap-1 transition-colors {isActive('/matches') ? 'text-primary' : 'text-grey-400'}">
      <HeartIcon size={24} strokeWidth={isActive('/matches') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Likes</span>
    </a>

    <a href="/chat" class="flex flex-col items-center gap-1 transition-colors {isActive('/chat') ? 'text-primary' : 'text-grey-400'}">
      <MessageCircleIcon size={24} strokeWidth={isActive('/chat') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Chat</span>
    </a>

    <a href="/profile" class="flex flex-col items-center gap-1 transition-colors {isActive('/profile') ? 'text-primary' : 'text-grey-400'}">
      <UserIcon size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Profile</span>
    </a>

  </div>
</nav>

<style>
  /* Menangani safe area untuk iPhone X ke atas */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 12px);
  }
</style>
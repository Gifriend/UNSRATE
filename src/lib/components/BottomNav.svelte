<script>
  import { Home, HeartIcon, MessageCircleIcon, UserIcon } from 'lucide-svelte';
  import { page } from '$app/stores';

  // Helper untuk mengecek route aktif
  $: isActive = (/** @type {string} */ path) => $page.url.pathname.startsWith(path);
</script>

<nav class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 py-3 pb-safe z-50">
  <div class="flex justify-around items-center max-w-md mx-auto">
    
    <a href="/explore" class="flex flex-col items-center gap-1 transition-colors {isActive('/explore') ? 'text-pink-500' : 'text-gray-400'}">
      <Home size={24} strokeWidth={isActive('/explore') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Explore</span>
    </a>

    <a href="/matches" class="flex flex-col items-center gap-1 transition-colors {isActive('/matches') ? 'text-pink-500' : 'text-gray-400'}">
      <HeartIcon size={24} strokeWidth={isActive('/matches') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Likes</span>
    </a>

    <a href="/chat" class="flex flex-col items-center gap-1 transition-colors {isActive('/chat') ? 'text-pink-500' : 'text-gray-400'}">
      <MessageCircleIcon size={24} strokeWidth={isActive('/chat') ? 2.5 : 2} />
      <span class="text-[10px] font-medium">Chat</span>
    </a>

    <a href="/profile" class="flex flex-col items-center gap-1 transition-colors {isActive('/profile') ? 'text-pink-500' : 'text-gray-400'}">
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
<script lang="ts">
  import { HeartIcon, XIcon } from 'lucide-svelte';

  let { 
    disabled = false,
    onlike,
    ondislike 
  }: { 
    disabled?: boolean;
    onlike?: () => void;
    ondislike?: () => void;
  } = $props();
</script>

<div class="flex justify-center items-center gap-6 mt-6">
  <button
    onclick={ondislike}
    {disabled}
    class="flex items-center justify-center h-16 w-16 rounded-full border-2 border-red-200 bg-white shadow-lg hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-90"
    aria-label="Dislike"
  >
    <XIcon class="h-8 w-8 group-hover:scale-110 transition-transform text-red-400" />
  </button>

  <button
    onclick={onlike}
    {disabled}
    class="flex items-center justify-center h-16 w-16 rounded-full border-2 border-pink-200 bg-white shadow-lg hover:bg-pink-50 hover:border-pink-400 hover:text-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-90"
    aria-label="Like"
  >
    <HeartIcon class="h-8 w-8 group-hover:scale-110 transition-transform text-pink-400" />
  </button>
</div>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { HeartIcon, StarIcon, XIcon } from 'lucide-svelte';

  // Props
  export let disabled: boolean = false;
  // Prop opsional untuk mengontrol apakah tombol Super Like muncul
  export let showSuperLike: boolean = false;

  const dispatch = createEventDispatcher<{
    like: void;
    dislike: void;
    superlike: void;
  }>();
</script>

<div class="flex justify-center items-center gap-4 mt-6">
  <button
    on:click={() => dispatch('dislike')}
    {disabled}
    class="flex items-center justify-center h-14 w-14 rounded-full border-2 border-muted bg-background shadow-md hover:bg-muted/10 hover:text-rose-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    aria-label="Dislike"
  >
    <XIcon class="h-7 w-7 group-hover:scale-110 transition-transform" />
  </button>

  {#if showSuperLike}
    <button
      on:click={() => dispatch('superlike')}
      {disabled}
      class="flex items-center justify-center h-12 w-12 rounded-full border-2 border-muted bg-background shadow-md hover:bg-muted/10 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      aria-label="Super Like"
    >
      <StarIcon class="h-6 w-6 group-hover:scale-110 transition-transform" />
    </button>
  {/if}

  <button
    on:click={() => dispatch('like')}
    {disabled}
    class="flex items-center justify-center h-14 w-14 rounded-full border-2 border-muted bg-background shadow-md hover:bg-muted/10 hover:text-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    aria-label="Like"
  >
    <HeartIcon class="h-7 w-7 group-hover:scale-110 transition-transform" />
  </button>
</div>
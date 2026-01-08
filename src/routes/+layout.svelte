<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/unsrate.png';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { page } from '$app/stores';

	const hiddenRoutes = ['/login', '/register', '/'];
	let isHidden = $derived(hiddenRoutes.includes($page.url.pathname));
	
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isHidden}
  <Sidebar />
{/if}

<main class="{!isHidden ? '' : ''} min-h-screen w-full transition-all duration-300">
  {@render children()}
</main>

{#if !isHidden}
  <div class="md:hidden">
     <BottomNav />
  </div>
{/if}

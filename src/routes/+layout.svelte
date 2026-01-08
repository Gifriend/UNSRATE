<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/unsrate.png';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	const hiddenRoutes = ['/login', '/register', '/'];
	let isHidden = $derived(hiddenRoutes.includes($page.url.pathname));

	let { children, data } = $props();

	createSvelteAuthClient({
		authClient,
		getServerState: () => data.authState
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isHidden}
	<Sidebar />
{/if}

<main class="{!isHidden ? '' : ''} min-h-screen w-full transition-all duration-300">
	<AuthGuard>
		{@render children()}
	</AuthGuard>
</main>

{#if !isHidden}
	<div class="md:hidden">
		<BottomNav />
	</div>
{/if}

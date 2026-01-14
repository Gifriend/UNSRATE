<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit'
	import { i18n } from '$lib/i18n'

	import './layout.css';
	import favicon from '$lib/assets/unsrate.png';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	const hiddenRoutes = ['/login', '/register', '/', '/onboarding'];
	// Check pathname without language prefix
	const pathWithoutLang = $derived(() => {
		const path = $page.url.pathname;
		return path.replace(/^\/en(\/|$)/, '/');
	});
	let isHidden = $derived(hiddenRoutes.includes(pathWithoutLang()));

	let { children, data } = $props();

	createSvelteAuthClient({
		authClient,
		getServerState: () => data.authState
	});

	onMount(() => {
		themeStore.init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ParaglideJS {i18n}>

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

</ParaglideJS>
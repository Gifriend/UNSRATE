<script lang="ts">
	import { page } from '$app/stores';
	import { ZapIcon, HeartIcon, MessageCircleIcon, UserIcon, SettingsIcon } from 'lucide-svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import * as m from '$lib/paraglide/messages';
	import { i18n } from '$lib/i18n';

	const unseenMatchesQuery = useQuery(api.matches.getUnseenMatchCount, () => ({}));
	const unseenCount = $derived(unseenMatchesQuery.data ?? 0);

	const unreadMessagesQuery = useQuery(api.conversations.getTotalUnreadCount, () => ({}));
	const unreadMessages = $derived(unreadMessagesQuery.data ?? 0);

	// Helper to get localized route
	const getRoute = (path: string) => i18n.route(path);

	// Helper to check if path is active (without language prefix)
	const isPathActive = (path: string) => {
		const currentPath = $page.url.pathname.replace(/^\/en(\/|$)/, '/');
		return currentPath.startsWith(path);
	};

	const activePath = $derived($page.url.pathname);
	const isChatPage = $derived(isPathActive('/chat'));

	const menuItems = $derived([
		{ icon: ZapIcon, label: m.nav_explore(), href: '/explore', badge: 0 },
		{ icon: HeartIcon, label: m.nav_matches(), href: '/matches', badge: unseenCount },
		{ icon: MessageCircleIcon, label: m.nav_messages(), href: '/chat', badge: unreadMessages },
		{ icon: UserIcon, label: m.nav_profile(), href: '/profile', badge: 0 }
	]);
</script>

<aside
	class="fixed top-0 left-0 hidden h-screen flex-col md:flex {isChatPage
		? 'w-18'
		: 'w-18 lg:w-64'} z-50 border-r border-gray-200 bg-white transition-all duration-300"
>
	<div class="mt-2 mb-6 flex h-20 items-center px-4 lg:px-6">
		<a
			href={getRoute('/explore')}
			class="hidden {isChatPage ? 'lg:hidden' : 'lg:block'} transition-opacity hover:opacity-80"
		>
			<h1 class="text-2xl font-extrabold tracking-tight text-text-main">
				UNS<span class="text-gradient-brand">RATE</span>
			</h1>
		</a>

		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a
			href={getRoute('/explore')}
			class="block {isChatPage ? 'lg:block' : 'lg:hidden'} mx-auto transition-transform hover:scale-105"
		>
			{#if isChatPage}
				<img src="/src/lib/assets/unsrate.png" alt="UNSRATE" class="h-15 w-15 object-contain" />
			{:else}
				<div
					class="bg-gradient-brand flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-white"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path
							d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
						/></svg
					>
				</div>
			{/if}
		</a>
	</div>

	<nav class="flex-1 space-y-2 px-3">
		{#each menuItems as item}
			<a
				href={getRoute(item.href)}
				class="group relative flex items-center gap-4 rounded-xl p-3 transition-all duration-200
               {isPathActive(item.href)
					? 'bg-primary/10 font-semibold text-primary'
					: 'text-gray-500 hover:bg-gray-100 hover:text-text-main'}"
			>
				<div class="relative transition-transform duration-200 group-hover:scale-110">
					<item.icon size={26} strokeWidth={isPathActive(item.href) ? 2.5 : 2} />

					{#if item.badge > 0}
						<span
							class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
						>
							{item.badge > 99 ? '99+' : item.badge}
						</span>
					{/if}
				</div>

				<span class="hidden {isChatPage ? 'lg:hidden' : 'lg:block'} text-[15px] tracking-wide"
					>{item.label}</span
				>

				{#if item.badge > 0}
					<span
						class="hidden {isChatPage
							? 'lg:hidden'
							: 'lg:flex'} ml-auto h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white"
					>
						{item.badge > 99 ? '99+' : item.badge}
					</span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="mt-auto space-y-1 p-4">
		<a
			href={getRoute('/settings')}
			class="group flex w-full items-center gap-4 rounded-xl p-3 transition-all duration-200
             {isPathActive('/settings')
				? 'bg-primary/10 font-semibold text-primary'
				: 'text-gray-500 hover:bg-gray-100 hover:text-text-main'}"
		>
			<SettingsIcon size={26} strokeWidth={isPathActive('/settings') ? 2.5 : 2} />
			<span class="hidden {isChatPage ? 'lg:hidden' : 'lg:block'} text-[15px]"
				>{m.nav_settings()}</span
			>
		</a>
	</div>
</aside>

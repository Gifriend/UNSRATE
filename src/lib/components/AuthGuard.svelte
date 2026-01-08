<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { untrack } from 'svelte';
  import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import {
    PROTECTED_ROUTES,
    PUBLIC_ROUTES,
    ONBOARDING_ROUTE,
    AUTH_REDIRECT,
    LOGIN_REDIRECT
  } from '$lib/stores/auth';

  let { children } = $props();

  const auth = useAuth();
  const profileCheck = useQuery(api.profiles.checkProfileComplete, {});

  const isProtectedRoute = $derived(
    PROTECTED_ROUTES.some(route => page.url.pathname.startsWith(route))
  );

  const isPublicOnlyRoute = $derived(PUBLIC_ROUTES.includes(page.url.pathname));

  const isOnboardingRoute = $derived(page.url.pathname.startsWith(ONBOARDING_ROUTE));

  const isLoading = $derived(auth.isLoading || profileCheck.isLoading);

  $effect(() => {
    if (isLoading) return;

    const isAuthenticated = auth.isAuthenticated;
    const hasProfile = profileCheck.data?.hasProfile ?? false;
    const isComplete = profileCheck.data?.isComplete ?? false;

    untrack(() => {
      if (!isAuthenticated && isProtectedRoute) {
        goto(LOGIN_REDIRECT, { replaceState: true });
        return;
      }

      if (!isAuthenticated && isOnboardingRoute) {
        goto(LOGIN_REDIRECT, { replaceState: true });
        return;
      }

      if (isAuthenticated && isPublicOnlyRoute) {
        if (!hasProfile || !isComplete) {
          goto(ONBOARDING_ROUTE, { replaceState: true });
        } else {
          goto(AUTH_REDIRECT, { replaceState: true });
        }
        return;
      }

      if (isAuthenticated && isProtectedRoute && (!hasProfile || !isComplete)) {
        goto(ONBOARDING_ROUTE, { replaceState: true });
        return;
      }

      if (isAuthenticated && isOnboardingRoute && hasProfile && isComplete) {
        goto(AUTH_REDIRECT, { replaceState: true });
        return;
      }
    });
  });

  const showLoading = $derived(isLoading);
  const showContent = $derived(!isLoading);
</script>

{#if showLoading}
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 bg-linear-to-tr from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>
      <div class="flex items-center gap-2">
        <svg class="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-slate-500 text-sm">Memuat...</span>
      </div>
    </div>
  </div>
{:else if showContent}
  {@render children()}
{:else}
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <span class="text-slate-400 text-sm">Mengalihkan...</span>
  </div>
{/if}

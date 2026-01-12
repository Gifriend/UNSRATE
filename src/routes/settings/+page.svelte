<script lang="ts">
  import { ChevronRightIcon, MoonIcon, SunIcon, MonitorIcon, GlobeIcon, LogOutIcon, TrashIcon, ShieldBanIcon, ChevronLeftIcon } from 'lucide-svelte';
  import { logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import * as m from '$lib/paraglide/messages';
  import { languageTag, setLanguageTag, availableLanguageTags } from '$lib/paraglide/runtime';
  import { themeStore } from '$lib/stores/theme';

  let selectedMenu = $state<'main' | 'theme' | 'language' | 'blocked' | null>('main');
  let showLogoutConfirm = $state(false);
  let showDeleteConfirm = $state(false);
  let isLoggingOut = $state(false);
  
  // Theme state from store
  let currentTheme = $state<'light' | 'dark' | 'system'>('system');
  
  // Subscribe to theme store
  themeStore.subscribe(value => {
    currentTheme = value;
  });
  
  // Get current language
  const currentLanguage = $derived(languageTag());

  async function handleLogout() {
    isLoggingOut = true;
    await logout();
    isLoggingOut = false;
  }

  function handleThemeChange(theme: 'light' | 'dark' | 'system') {
    themeStore.set(theme);
    selectedMenu = 'main';
  }

  function handleLanguageChange(lang: 'en' | 'id') {
    setLanguageTag(lang);
    selectedMenu = 'main';
  }

  function handleDeleteAccount() {
    // TODO: Implement delete account
    console.log('Delete account');
    showDeleteConfirm = false;
  }

  const menuItems = $derived([
    {
      id: 'theme',
      icon: currentTheme === 'dark' ? MoonIcon : currentTheme === 'light' ? SunIcon : MonitorIcon,
      label: m.settings_theme(),
      value: currentTheme === 'dark' ? m.settings_theme_dark() : currentTheme === 'light' ? m.settings_theme_light() : m.settings_theme_system(),
      action: () => selectedMenu = 'theme'
    },
    {
      id: 'language',
      icon: GlobeIcon,
      label: m.settings_language(),
      value: currentLanguage === 'en' ? m.settings_language_en() : m.settings_language_id(),
      action: () => selectedMenu = 'language'
    },
    {
      id: 'blocked',
      icon: ShieldBanIcon,
      label: m.settings_blocked_accounts(),
      value: '',
      action: () => selectedMenu = 'blocked'
    },
    {
      id: 'logout',
      icon: LogOutIcon,
      label: m.settings_logout(),
      value: '',
      danger: true,
      action: () => showLogoutConfirm = true
    },
    {
      id: 'delete',
      icon: TrashIcon,
      label: m.settings_delete_account(),
      value: '',
      danger: true,
      action: () => showDeleteConfirm = true
    }
  ]);
</script>

<div class="min-h-screen bg-gray-50 md:pl-20 lg:pl-64">
  <div class="max-w-7xl mx-auto">
    <div class="md:flex md:gap-4 md:p-4">
      <!-- Main Menu - Mobile: Full Screen, Desktop: Left Panel -->
      <div class="md:w-96 bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 min-h-screen md:min-h-[calc(100vh-2rem)] overflow-hidden">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 md:py-6">
          <div class="flex items-center gap-3">
            <button 
              onclick={() => goto('/profile')}
              class="md:hidden w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeftIcon size={24} class="text-gray-700" />
            </button>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">{m.settings_title()}</h1>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          {#each menuItems as item}
            <button
              onclick={item.action}
              class="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 {item.danger ? 'text-red-600' : 'text-gray-900'}"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <item.icon size={20} />
                </div>
                <div class="text-left">
                  <div class="font-medium">{item.label}</div>
                  {#if item.value}
                    <div class="text-sm text-gray-500">{item.value}</div>
                  {/if}
                </div>
              </div>
              <ChevronRightIcon size={20} class="text-gray-400" />
            </button>
          {/each}
        </div>
      </div>

      <!-- Right Panel - Desktop Only -->
      <div class="hidden md:block flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[calc(100vh-2rem)]">
        {#if selectedMenu === 'theme'}
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{m.settings_theme()}</h2>
            <div class="space-y-3">
              {#each [
                { value: 'light', label: m.settings_theme_light(), icon: SunIcon },
                { value: 'dark', label: m.settings_theme_dark(), icon: MoonIcon },
                { value: 'system', label: m.settings_theme_system(), icon: MonitorIcon }
              ] as theme}
                <button
                  onclick={() => handleThemeChange(theme.value as 'light' | 'dark' | 'system')}
                  class="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all {currentTheme === theme.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <div class="w-10 h-10 rounded-full {currentTheme === theme.value ? 'bg-primary/10' : 'bg-gray-100'} flex items-center justify-center">
                    <theme.icon size={20} class={currentTheme === theme.value ? 'text-primary' : 'text-gray-600'} />
                  </div>
                  <span class="font-medium {currentTheme === theme.value ? 'text-primary' : 'text-gray-900'}">{theme.label}</span>
                </button>
              {/each}
            </div>
          </div>
        {:else if selectedMenu === 'language'}
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{m.settings_language()}</h2>
            <div class="space-y-3">
              {#each [
                { value: 'id', label: m.settings_language_id(), flag: '🇮🇩' },
                { value: 'en', label: m.settings_language_en(), flag: '🇬🇧' }
              ] as lang}
                <button
                  onclick={() => handleLanguageChange(lang.value as 'en' | 'id')}
                  class="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all {currentLanguage === lang.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <div class="text-3xl">{lang.flag}</div>
                  <span class="font-medium {currentLanguage === lang.value ? 'text-primary' : 'text-gray-900'}">{lang.label}</span>
                </button>
              {/each}
            </div>
          </div>
        {:else if selectedMenu === 'blocked'}
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{m.settings_blocked_accounts()}</h2>
            <div class="text-center py-12">
              <ShieldBanIcon size={48} class="mx-auto text-gray-300 mb-4" />
              <p class="text-gray-500">Tidak ada akun yang diblokir</p>
            </div>
          </div>
        {:else}
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ChevronLeftIcon size={32} class="text-gray-400" />
              </div>
              <p class="text-gray-500">Pilih menu di sebelah kiri</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Mobile Modals for Theme, Language, Blocked -->
{#if selectedMenu === 'theme' || selectedMenu === 'language' || selectedMenu === 'blocked'}
  <div class="md:hidden fixed inset-0 bg-white z-50">
    <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
      <div class="flex items-center gap-3">
        <button 
          onclick={() => selectedMenu = 'main'}
          class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <ChevronLeftIcon size={24} class="text-gray-700" />
        </button>
        <h1 class="text-xl font-bold text-gray-900">
          {#if selectedMenu === 'theme'}
            {m.settings_theme()}
          {:else if selectedMenu === 'language'}
            {m.settings_language()}
          {:else if selectedMenu === 'blocked'}
            {m.settings_blocked_accounts()}
          {/if}
        </h1>
      </div>
    </div>

    <div class="p-4">
      {#if selectedMenu === 'theme'}
        <div class="space-y-3">
          {#each [
            { value: 'light', label: m.settings_theme_light(), icon: SunIcon },
            { value: 'dark', label: m.settings_theme_dark(), icon: MoonIcon },
            { value: 'system', label: m.settings_theme_system(), icon: MonitorIcon }
          ] as theme}
            <button
              onclick={() => handleThemeChange(theme.value as 'light' | 'dark' | 'system')}
              class="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all {currentTheme === theme.value ? 'border-primary bg-primary/5' : 'border-gray-200'}"
            >
              <div class="w-10 h-10 rounded-full {currentTheme === theme.value ? 'bg-primary/10' : 'bg-gray-100'} flex items-center justify-center">
                <theme.icon size={20} class={currentTheme === theme.value ? 'text-primary' : 'text-gray-600'} />
              </div>
              <span class="font-medium {currentTheme === theme.value ? 'text-primary' : 'text-gray-900'}">{theme.label}</span>
            </button>
          {/each}
        </div>
      {:else if selectedMenu === 'language'}
        <div class="space-y-3">
          {#each [
            { value: 'id', label: m.settings_language_id(), flag: '🇮🇩' },
            { value: 'en', label: m.settings_language_en(), flag: '🇬🇧' }
          ] as lang}
            <button
              onclick={() => handleLanguageChange(lang.value as 'en' | 'id')}
              class="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all {currentLanguage === lang.value ? 'border-primary bg-primary/5' : 'border-gray-200'}"
            >
              <div class="text-3xl">{lang.flag}</div>
              <span class="font-medium {currentLanguage === lang.value ? 'text-primary' : 'text-gray-900'}">{lang.label}</span>
            </button>
          {/each}
        </div>
      {:else if selectedMenu === 'blocked'}
        <div class="text-center py-12">
          <ShieldBanIcon size={48} class="mx-auto text-gray-300 mb-4" />
          <p class="text-gray-500">Tidak ada akun yang diblokir</p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Logout Confirmation Modal -->
{#if showLogoutConfirm}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
      <h3 class="text-lg font-bold text-gray-900 mb-2">{m.settings_logout()}</h3>
      <p class="text-gray-600 mb-6">{m.settings_logout_confirm()}</p>
      <div class="flex gap-3">
        <button
          onclick={() => showLogoutConfirm = false}
          class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {m.common_cancel()}
        </button>
        <button
          onclick={handleLogout}
          disabled={isLoggingOut}
          class="flex-1 px-4 py-3 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {#if isLoggingOut}
            <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          {:else}
            {m.common_yes()}
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Account Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
      <h3 class="text-lg font-bold text-red-600 mb-2">{m.settings_delete_account()}</h3>
      <p class="text-gray-600 mb-6">{m.settings_delete_confirm()}</p>
      <div class="flex gap-3">
        <button
          onclick={() => showDeleteConfirm = false}
          class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {m.common_cancel()}
        </button>
        <button
          onclick={handleDeleteAccount}
          class="flex-1 px-4 py-3 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition-colors"
        >
          {m.common_delete()}
        </button>
      </div>
    </div>
  </div>
{/if}

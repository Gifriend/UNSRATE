import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
  // Get initial theme from localStorage or default to system
  const initialTheme: Theme = browser 
    ? (localStorage.getItem('theme') as Theme) || 'system' 
    : 'system';

  const { subscribe, set } = writable<Theme>(initialTheme);

  function applyTheme(theme: Theme) {
    if (!browser) return;

    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  return {
    subscribe,
    set: (theme: Theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
      }
      set(theme);
    },
    init: () => {
      if (browser) {
        applyTheme(initialTheme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          subscribe((theme) => {
            if (theme === 'system') {
              document.documentElement.classList.toggle('dark', e.matches);
            }
            return theme;
          })();
        });
      }
    }
  };
}

export const themeStore = createThemeStore();

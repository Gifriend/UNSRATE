<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { onMount } from 'svelte';

  const auth = useAuth();

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const errorMessage = urlParams.get('error_description');
    
    if (errorParam || errorMessage) {
      const fullError = `${errorParam || ''} ${errorMessage || ''}`.toLowerCase();
      if (
        fullError.includes('invalid_domain') || 
        fullError.includes('student.unsrat.ac.id') ||
        fullError.includes('domain') ||
        errorParam === 'auth_failed'
      ) {
        error = 'Hanya email @student.unsrat.ac.id yang diizinkan untuk login.';
      } else {
        error = errorMessage || 'Terjadi kesalahan saat login. Silakan coba lagi.';
      }
      window.history.replaceState({}, '', '/login');
    }
  });

  const handleGoogleLogin = async () => {
    try {
      isLoading = true;
      error = null;

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/explore',
        errorCallbackURL: '/login?error=auth_failed',
      });
    } catch (err) {
      error = 'Gagal login dengan Google. Silakan coba lagi.';
      isLoading = false;
    }
  };
</script>

<div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden p-6">
  
  <div class="fixed top-[-10%] left-[-10%] w-[50%] h-[40%] bg-pink-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
  <div class="fixed bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

  <div class="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative z-10 text-center transform hover:scale-[1.01] transition-transform duration-300">
    
    <div class="mb-8">
      <div class="mx-auto w-16 h-16 bg-linear-to-tr from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 rotate-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>

      <h1 class="text-3xl font-extrabold tracking-tight text-slate-800">
        UNS<span class="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600">RATE</span>
      </h1>
      <p class="text-slate-500 mt-2 text-sm">
        Cari jodoh se-almamater.<br/>Masuk pakai akun kampus lebih asik.
      </p>
    </div>

    <div class="space-y-4">
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
          {error}
        </div>
      {/if}
      
      <button 
        onclick={handleGoogleLogin}
        disabled={isLoading || auth.isLoading}
        class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 font-semibold py-3.5 px-4 rounded-xl shadow-sm transition-all duration-200 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isLoading || auth.isLoading}
          <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-slate-500">Menghubungkan...</span>
        {:else}
          <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Lanjutkan dengan Google</span>
        {/if}
      </button>
    </div>

    <div class="mt-8 text-center">
      <p class="text-xs text-slate-400 px-4">
        Dengan masuk, kamu menyetujui 
        <a href="/terms" class="underline hover:text-rose-500">Syarat & Ketentuan</a> serta 
        <a href="/privacy" class="underline hover:text-rose-500">Kebijakan Privasi</a> UNSRATE.
      </p>
    </div>

  </div>

  <div class="absolute bottom-6 text-slate-400 text-xs font-medium">
    &copy; {new Date().getFullYear()} UNSRATE. Made with ❤️ in Manado.
  </div>
</div>
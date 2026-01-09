<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { goto } from '$app/navigation';
  import { logout } from '$lib/stores/auth';

  const client = useConvexClient();
  const myProfile = useQuery(api.profiles.getMyProfile, {});

  let isEditMode = $state(false);
  let isSubmitting = $state(false);
  let error = $state<string | null>(null);

  // Edit form states
  let editBio = $state('');
  let editPhotos = $state<string[]>([]);

  function startEdit() {
    if (myProfile.data) {
      editBio = myProfile.data.bio || '';
      editPhotos = [...(myProfile.data.photos || [])];
      isEditMode = true;
    }
  }

  function cancelEdit() {
    isEditMode = false;
    error = null;
  }

  async function saveEdit() {
    if (!editBio.trim()) {
      error = 'Bio tidak boleh kosong';
      return;
    }

    isSubmitting = true;
    error = null;

    try {
      await client.mutation(api.profiles.updateProfile, {
        bio: editBio.trim(),
        photos: editPhotos,
      });
      isEditMode = false;
    } catch (err) {
      console.error('Failed to update profile:', err);
      error = 'Gagal menyimpan perubahan';
    } finally {
      isSubmitting = false;
    }
  }

  function calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  async function handleLogout() {
    await logout('/login');
  }

  const profile = $derived(myProfile.data);
  const isLoading = $derived(myProfile.isLoading);
  const currentPhoto = $derived(profile?.photos?.[0] || '');
  const age = $derived(profile?.birthDate ? calculateAge(profile.birthDate) : 0);
</script>

{#if isLoading}
  <div class="min-h-screen bg-grey-50 flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <svg class="animate-spin h-12 w-12 text-brand-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <p class="text-grey-500">Memuat profil...</p>
    </div>
  </div>
{:else if profile}
  <div class="min-h-screen bg-grey-50 pb-20 md:pb-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-4 md:py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- <button 
          onclick={() => goto('/explore')}
          class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-grey-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6 text-grey-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button> -->
        <h1 class="text-xl md:text-2xl font-bold text-grey-900">Profil Saya</h1>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button 
          onclick={handleLogout}
          class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6 text-grey-900 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <!-- Profile Card (Tinder Style) -->
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden mb-4 md:mb-6">
        <!-- Photo -->
        <div class="relative aspect-[4/3] md:aspect-[16/9] bg-linear-to-br from-brand-100 to-brand-300">
          {#if currentPhoto}
            <img
              src={currentPhoto}
              alt={profile.nickname}
              class="w-full h-full object-contain"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center text-white">
                <div class="w-20 h-20 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span class="text-3xl md:text-5xl font-bold">{profile.nickname[0]}</span>
                </div>
                <p class="text-base md:text-lg">Belum ada foto</p>
              </div>
            </div>
          {/if}
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          
          <!-- Info Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            <div class="flex items-end gap-2 mb-2">
              <h2 class="text-2xl md:text-4xl font-bold">{profile.nickname}</h2>
              <span class="text-xl md:text-3xl font-light">{age}</span>
            </div>
            <div class="flex items-center gap-2 text-xs md:text-sm opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="truncate">{profile.prodi}</span>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="p-4 md:p-6 space-y-4 md:space-y-6">
          <!-- Bio Section -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xs md:text-sm font-semibold text-grey-900 uppercase tracking-wide">Tentang Saya</h3>
              {#if !isEditMode}
                <button
                  onclick={startEdit}
                  class="text-brand-300 hover:text-brand-500 transition-colors text-xs md:text-sm font-medium"
                >
                  Edit
                </button>
              {/if}
            </div>
            {#if isEditMode}
              <div class="space-y-3">
                <textarea
                  bind:value={editBio}
                  rows="4"
                  maxlength="500"
                  class="w-full px-4 py-3 rounded-xl border-2 border-grey-400/30 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all outline-none resize-none text-grey-900"
                  placeholder="Ceritakan tentang dirimu..."
                ></textarea>
                <p class="text-xs text-grey-400 text-right">{editBio.length}/500</p>
                
                {#if error}
                  <div class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                    {error}
                  </div>
                {/if}
                
                <div class="flex gap-2 md:gap-3">
                  <button
                    onclick={cancelEdit}
                    disabled={isSubmitting}
                    class="flex-1 py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base rounded-xl border-2 border-grey-400/30 text-grey-900 font-semibold hover:bg-grey-50 transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onclick={saveEdit}
                    disabled={isSubmitting || !editBio.trim()}
                    class="flex-1 py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base rounded-xl bg-gradient-brand text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            {:else}
              <p class="text-sm md:text-base text-grey-900 leading-relaxed">{profile.bio}</p>
            {/if}
          </div>

          <!-- Info Cards -->
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <!-- Gender -->
            <div class="bg-grey-50 rounded-xl md:rounded-2xl p-3 md:p-4">
              <div class="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-[10px] md:text-xs font-medium text-grey-500 uppercase">Gender</span>
              </div>
              <p class="text-sm md:text-base text-grey-900 font-semibold">{profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</p>
            </div>

            <!-- Angkatan -->
            <div class="bg-grey-50 rounded-xl md:rounded-2xl p-3 md:p-4">
              <div class="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-[10px] md:text-xs font-medium text-grey-500 uppercase">Angkatan</span>
              </div>
              <p class="text-sm md:text-base text-grey-900 font-semibold">{profile.angkatan}</p>
            </div>
          </div>

          <!-- Fakultas & Prodi -->
          <div class="space-y-2 md:space-y-3">
            <div class="flex items-start gap-2 md:gap-3">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-100/30 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-[10px] md:text-xs text-grey-500 font-medium uppercase mb-1">Fakultas</p>
                <p class="text-sm md:text-base text-grey-900 font-medium">{profile.fakultas}</p>
              </div>
            </div>

            <div class="flex items-start gap-2 md:gap-3">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-100/30 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-[10px] md:text-xs text-grey-500 font-medium uppercase mb-1">Program Studi</p>
                <p class="text-sm md:text-base text-grey-900 font-medium">{profile.prodi}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Akun -->
      <div class="bg-white rounded-2xl shadow-md p-4 md:p-6">
        <h3 class="text-xs md:text-sm font-semibold text-grey-900 uppercase tracking-wide mb-3 md:mb-4">Info Akun</h3>
        <div class="space-y-2 md:space-y-3">
          <div class="flex items-center justify-between py-2">
            <span class="text-xs md:text-sm text-grey-500">Nama Lengkap</span>
            <span class="text-sm md:text-base text-grey-900 font-medium">{profile.fullname}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs md:text-sm text-grey-500">Email</span>
            <span class="text-xs md:text-sm text-grey-900 font-medium break-all">{profile.email}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs md:text-sm text-grey-500">Status</span>
            <span class="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs md:text-sm font-medium">
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></span>
              Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
{:else}
  <div class="min-h-screen bg-grey-50 flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-sm md:text-base text-grey-500 mb-4">Profil tidak ditemukan</p>
      <button
        onclick={() => goto('/onboarding')}
        class="px-6 py-3 text-sm md:text-base bg-gradient-brand text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Buat Profil
      </button>
    </div>
  </div>
{/if}

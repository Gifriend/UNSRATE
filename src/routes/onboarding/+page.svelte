<script lang="ts">
  import { goto } from '$app/navigation';
  import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import {
    FAKULTAS_LIST,
    getProdiList,
    generateAngkatanOptions,
    type Fakultas
  } from '$lib/data/fakultas';

  const auth = useAuth();
  const client = useConvexClient();

  let currentStep = $state(1);
  const totalSteps = 4;

  let fullname = $state('');
  let nickname = $state('');
  let birthDate = $state('');
  let gender = $state<'MALE' | 'FEMALE' | ''>('');
  let fakultas = $state<Fakultas | ''>('');
  let prodi = $state('');
  let angkatan = $state<number | ''>('');
  let bio = $state('');
  let photoUrl = $state('');

  let isSubmitting = $state(false);
  let error = $state<string | null>(null);

  const prodiOptions = $derived(fakultas ? getProdiList(fakultas as Fakultas) : []);
  const angkatanOptions = generateAngkatanOptions();

  $effect(() => {
    if (fakultas) {
      prodi = '';
    }
  });

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  const canProceedStep1 = $derived(
    fullname.trim().length >= 2 &&
    nickname.trim().length >= 2 &&
    birthDate !== '' &&
    gender !== ''
  );

  const canProceedStep2 = $derived(
    fakultas !== '' &&
    prodi !== '' &&
    angkatan !== ''
  );

  const canProceedStep3 = $derived(bio.trim().length >= 10);

  const canSubmit = $derived(photoUrl.trim().length > 0);

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) return;

    isSubmitting = true;
    error = null;

    try {
      await client.mutation(api.profiles.createProfile, {
        fullname: fullname.trim(),
        nickname: nickname.trim(),
        birthDate,
        gender: gender as 'MALE' | 'FEMALE',
        fakultas,
        prodi,
        angkatan: angkatan as number,
        bio: bio.trim(),
        photos: [photoUrl.trim()],
      });

      await goto('/explore', { replaceState: true });
    } catch (err) {
      console.error('Failed to create profile:', err);
      error = 'Gagal menyimpan profil. Silakan coba lagi.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
  <div class="fixed top-[-10%] left-[-10%] w-[50%] h-[40%] bg-pink-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
  <div class="fixed bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

  <div class="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8 relative z-10">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        {#each Array(totalSteps) as _, i}
          <div 
            class="flex-1 h-1.5 rounded-full transition-colors {i < currentStep ? 'bg-pink-500' : 'bg-gray-200'}"
          ></div>
        {/each}
      </div>
      <p class="text-sm text-slate-500">Langkah {currentStep} dari {totalSteps}</p>
    </div>

    {#if currentStep === 1}
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Info Dasar</h1>
          <p class="text-slate-500 mt-1">Ceritakan sedikit tentang dirimu</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="fullname" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              id="fullname"
              bind:value={fullname}
              placeholder="Masukkan nama lengkap"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
            />
          </div>

          <div>
            <label for="nickname" class="block text-sm font-medium text-slate-700 mb-1">Nickname</label>
            <input
              type="text"
              id="nickname"
              bind:value={nickname}
              placeholder="Nama panggilan"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
            />
          </div>

          <div>
            <label for="birthDate" class="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              id="birthDate"
              bind:value={birthDate}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
            />
          </div>

          <fieldset>
            <legend class="block text-sm font-medium text-slate-700 mb-2">Gender</legend>
            <div class="flex gap-3">
              <button
                type="button"
                onclick={() => gender = 'MALE'}
                class="flex-1 py-3 px-4 rounded-xl border-2 transition-all {gender === 'MALE' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
              >
                👨 Laki-laki
              </button>
              <button
                type="button"
                onclick={() => gender = 'FEMALE'}
                class="flex-1 py-3 px-4 rounded-xl border-2 transition-all {gender === 'FEMALE' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
              >
                👩 Perempuan
              </button>
            </div>
          </fieldset>
        </div>
      </div>

    {:else if currentStep === 2}
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Info Akademik</h1>
          <p class="text-slate-500 mt-1">Data kuliahmu di UNSRAT</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="fakultas" class="block text-sm font-medium text-slate-700 mb-1">Fakultas</label>
            <select
              id="fakultas"
              bind:value={fakultas}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none bg-white"
            >
              <option value="">Pilih Fakultas</option>
              {#each FAKULTAS_LIST as fak}
                <option value={fak}>{fak}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="prodi" class="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
            <select
              id="prodi"
              bind:value={prodi}
              disabled={!fakultas}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">Pilih Prodi</option>
              {#each prodiOptions as p}
                <option value={p}>{p}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="angkatan" class="block text-sm font-medium text-slate-700 mb-1">Angkatan</label>
            <select
              id="angkatan"
              bind:value={angkatan}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none bg-white"
            >
              <option value="">Pilih Angkatan</option>
              {#each angkatanOptions as year}
                <option value={year}>{year}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

    {:else if currentStep === 3}
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Bio</h1>
          <p class="text-slate-500 mt-1">Tulis sesuatu yang menarik tentang dirimu</p>
        </div>

        <div>
          <textarea
            bind:value={bio}
            placeholder="Contoh: Anak teknik yang suka ngopi dan dengerin musik indie. Swipe right kalau kamu suka kucing! 🐱"
            rows="6"
            maxlength="500"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none resize-none"
          ></textarea>
          <p class="text-xs text-slate-400 mt-1 text-right">{bio.length}/500</p>
        </div>
      </div>

    {:else if currentStep === 4}
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Foto Profil</h1>
          <p class="text-slate-500 mt-1">Tambahkan minimal 1 foto</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="photoUrl" class="block text-sm font-medium text-slate-700 mb-1">URL Foto</label>
            <input
              type="url"
              id="photoUrl"
              bind:value={photoUrl}
              placeholder="https://example.com/foto.jpg"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
            />
            <p class="text-xs text-slate-400 mt-1">Gunakan URL foto dari Google Drive, Imgur, atau lainnya</p>
          </div>

          {#if photoUrl}
            <div class="relative aspect-square w-48 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200">
              <img
                src={photoUrl}
                alt="Preview"
                class="w-full h-full object-cover"
                onerror={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = 'https://ui-avatars.com/api/?name=' + nickname + '&size=200&background=random';
                }}
              />
            </div>
          {/if}
        </div>

        {#if error}
          <div class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        {/if}
      </div>
    {/if}

    <div class="mt-auto pt-8 flex gap-3">
      {#if currentStep > 1}
        <button
          type="button"
          onclick={prevStep}
          class="flex-1 py-3.5 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
        >
          Kembali
        </button>
      {/if}

      {#if currentStep < totalSteps}
        <button
          type="button"
          onclick={nextStep}
          disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2) || (currentStep === 3 && !canProceedStep3)}
          class="flex-1 py-3.5 px-4 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut
        </button>
      {:else}
        <button
          type="button"
          onclick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          class="flex-1 py-3.5 px-4 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if isSubmitting}
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Menyimpan...
          {:else}
            Selesai 🎉
          {/if}
        </button>
      {/if}
    </div>
  </div>
</div>

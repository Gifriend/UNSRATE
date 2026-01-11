<script lang="ts">
  import { goto } from '$app/navigation';
  import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { useConvexClient, useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import type { Id } from '$convex/_generated/dataModel';
  import {
    FAKULTAS_LIST,
    getProdiList,
    generateAngkatanOptions,
    type Fakultas
  } from '$lib/data/fakultas';

  const auth = useAuth();
  const client = useConvexClient();
  const profileCheck = useQuery(api.profiles.checkProfileComplete, {});
  const interestsQuery = useQuery(api.interests.getAll, {});

  $effect(() => {
    if (!profileCheck.isLoading && profileCheck.data?.hasProfile && profileCheck.data?.isComplete) {
      goto('/explore', { replaceState: true });
    }
  });

  let currentStep = $state(1);
  const totalSteps = 5;

  let fullname = $state('');
  let nickname = $state('');
  let birthDate = $state('');
  let gender = $state<'MALE' | 'FEMALE' | ''>('');
  let fakultas = $state<Fakultas | ''>('');
  let prodi = $state('');
  let angkatan = $state<number | ''>('');
  let bio = $state('');
  let selectedInterests = $state<Id<"interests">[]>([]);
  let uploadedPhotos = $state<Array<{ storageId: string; previewUrl: string }>>([]);
  let isUploading = $state(false);
  let isDragging = $state(false);
  let uploadError = $state<string | null>(null);

  let isSubmitting = $state(false);
  let error = $state<string | null>(null);

  let fileInput = $state<HTMLInputElement | null>(null);

  const prodiOptions = $derived(fakultas ? getProdiList(fakultas as Fakultas) : []);
  const angkatanOptions = generateAngkatanOptions();

  $effect(() => {
    if (fakultas) {
      prodi = '';
    }
  });

  function toggleInterest(id: Id<"interests">) {
    if (selectedInterests.includes(id)) {
      selectedInterests = selectedInterests.filter(i => i !== id);
    } else if (selectedInterests.length < 5) {
      selectedInterests = [...selectedInterests, id];
    }
  }

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

  const canProceedStep4 = $derived(selectedInterests.length >= 3);

  const canSubmit = $derived(uploadedPhotos.length >= 1);

  async function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));
    input.value = '';
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));
  }

  async function uploadFiles(files: File[]) {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        uploadError = 'Hanya file gambar yang diizinkan';
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        uploadError = 'Ukuran file maksimal 5MB';
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (uploadedPhotos.length + validFiles.length > 6) {
      uploadError = 'Maksimal 6 foto';
      return;
    }

    isUploading = true;
    uploadError = null;

    try {
      for (const file of validFiles) {
        const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!response.ok) throw new Error('Upload failed');

        const { storageId } = await response.json();

        const previewUrl = URL.createObjectURL(file);
        uploadedPhotos = [...uploadedPhotos, { storageId, previewUrl }];
      }
    } catch (err) {
      console.error('Upload error:', err);
      uploadError = 'Gagal mengupload foto. Coba lagi.';
    } finally {
      isUploading = false;
    }
  }

  function removePhoto(index: number) {
    const photo = uploadedPhotos[index];
    if (photo.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photo.previewUrl);
    }
    uploadedPhotos = uploadedPhotos.filter((_, i) => i !== index);
  }

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
        photos: uploadedPhotos.map(p => p.storageId),
        interests: selectedInterests,
      });

      uploadedPhotos.forEach(p => {
        if (p.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.previewUrl);
        }
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
              placeholder="Masukkan Nama Lengkap"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
            />
          </div>

          <div>
            <label for="nickname" class="block text-sm font-medium text-slate-700 mb-1">Nama Panggilan</label>
            <input
              type="text"
              id="nickname"
              bind:value={nickname}
              placeholder="Nama Panggilan"
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
            <legend class="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</legend>
            <div class="flex gap-3">
              <button
                type="button"
                onclick={() => gender = 'MALE'}
                class="flex-1 py-3 px-4 rounded-xl border-2 transition-all {gender === 'MALE' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
              >
                Laki-laki
              </button>
              <button
                type="button"
                onclick={() => gender = 'FEMALE'}
                class="flex-1 py-3 px-4 rounded-xl border-2 transition-all {gender === 'FEMALE' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
              >
                Perempuan
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
          <h1 class="text-2xl font-bold text-slate-800">Minat & Hobi</h1>
          <p class="text-slate-500 mt-1">Pilih 3-5 minat yang menggambarkan dirimu</p>
        </div>

        {#if interestsQuery.isLoading}
          <div class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        {:else if interestsQuery.data}
          <div class="flex flex-wrap gap-2">
            {#each interestsQuery.data as interest}
              <button
                type="button"
                onclick={() => toggleInterest(interest._id)}
                disabled={!selectedInterests.includes(interest._id) && selectedInterests.length >= 5}
                class="px-4 py-2 rounded-full border-2 transition-all text-sm font-medium
                  {selectedInterests.includes(interest._id) 
                    ? 'border-pink-500 bg-pink-50 text-pink-600' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'}
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {interest.icon} {interest.name}
              </button>
            {/each}
          </div>
          <p class="text-sm text-slate-400">{selectedInterests.length}/5 dipilih (min. 3)</p>
        {:else}
          <p class="text-slate-500 text-center py-8">Tidak ada data interests</p>
        {/if}
      </div>

    {:else if currentStep === 5}
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Foto Profil</h1>
          <p class="text-slate-500 mt-1">Tambahkan minimal 1 foto (maksimal 6)</p>
        </div>

        <div class="space-y-4">
          <input
            type="file"
            accept="image/*"
            multiple
            bind:this={fileInput}
            onchange={handleFileSelect}
            class="hidden"
          />

          <button
            type="button"
            onclick={() => fileInput?.click()}
            ondragover={(e) => { e.preventDefault(); isDragging = true; }}
            ondragleave={() => isDragging = false}
            ondrop={handleDrop}
            disabled={isUploading || uploadedPhotos.length >= 6}
            class="w-full py-12 px-4 rounded-2xl border-2 border-dashed transition-all
              {isDragging ? 'border-pink-500 bg-pink-50' : 'border-slate-300 hover:border-pink-400 hover:bg-pink-50/50'}
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isUploading}
              <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin h-10 w-10 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span class="text-sm text-slate-500">Mengupload...</span>
              </div>
            {:else}
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-slate-700">Klik atau drag foto ke sini</p>
                  <p class="text-xs text-slate-400 mt-1">JPG, PNG, WebP • Maks 5MB per foto</p>
                </div>
              </div>
            {/if}
          </button>

          {#if uploadedPhotos.length > 0}
            <div class="grid grid-cols-3 gap-3">
              {#each uploadedPhotos as photo, index}
                <div class="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 group">
                  <img
                    src={photo.previewUrl}
                    alt="Foto {index + 1}"
                    class="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onclick={() => removePhoto(index)}
                    aria-label="Hapus foto {index + 1}"
                    class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {#if index === 0}
                    <div class="absolute bottom-1 left-1 px-2 py-0.5 bg-pink-500 text-white text-xs font-medium rounded-full">
                      Utama
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
            <p class="text-sm text-slate-400 text-center">{uploadedPhotos.length}/6 foto • Foto pertama akan jadi foto utama</p>
          {/if}

          {#if uploadError}
            <div class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
              {uploadError}
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
          disabled={
            (currentStep === 1 && !canProceedStep1) || 
            (currentStep === 2 && !canProceedStep2) || 
            (currentStep === 3 && !canProceedStep3) ||
            (currentStep === 4 && !canProceedStep4)
          }
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

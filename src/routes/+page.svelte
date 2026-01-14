<script lang="ts">
  import { goto } from '$app/navigation';
  import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { AUTH_REDIRECT } from '$lib/stores/auth';
  import { 
    HeartIcon, 
    SparklesIcon, 
    UserIcon, 
    CircleCheckIcon,
    ArrowRightIcon,
    ZapIcon,
    ChevronRightIcon
  } from 'lucide-svelte';
  import * as m from '$lib/paraglide/messages';
  import { i18n } from '$lib/i18n';
  
  // Import images
  import gifImage from '$lib/assets/gif.jpg';
  import mikelImage from '$lib/assets/mikel.jpg';
  import unsrateImage from '$lib/assets/unsrate.png';

  const auth = useAuth();

  const features = [
    {
      icon: CircleCheckIcon,
      title: "Verified Community",
      description: "Connect with verified students and alumni from UNSRAT"
    },
    {
      icon: ZapIcon,
      title: "Simple Design",
      description: "Easy to use interface designed for students"
    },
    {
      icon: HeartIcon,
      title: "Meaningful Connections",
      description: "Build friendships, find study partners, and more"
    }
  ];

  const steps = [
    {
      number: 1,
      icon: UserIcon,
      title: "Create Profile",
      description: "Sign up with your university email"
    },
    {
      number: 2,
      icon: SparklesIcon,
      title: "Complete Profile",
      description: "Add your interests and preferences"
    },
    {
      number: 3,
      icon: HeartIcon,
      title: "Start Matching",
      description: "Browse and connect with others"
    },
    {
      number: 4,
      icon: ZapIcon,
      title: "Chat & Connect",
      description: "Start conversations with your matches"
    }
  ];

  // Redirect if already authenticated
  $effect(() => {
    if (auth.isLoading) return;
    if (auth.isAuthenticated) {
      goto(AUTH_REDIRECT, { replaceState: true });
    }
  });

  const featureCards = [
    {
      tag: "Khusus untuk satu kampus",
      title: "Komunitas yang terverifikasi",
      description: "Setiap pengguna diverifikasi menggunakan email kampus, jadi kamu hanya berinteraksi dengan mahasiswa atau alumni dari universitas yang sama.",
      colorClass: "bg-brand-100/20 text-brand-700"
    },
    {
      tag: "Lebih dari sekadar dating",
      title: "Desain simpel, cocok untuk mahasiswa",
      description: "Tanpa fitur berlebihan. Cukup daftar, lengkapi profil, dan mulai terhubung. Dirancang agar kamu bisa langsung fokus pada kenalan baru.",
      colorClass: "bg-brand-300/20 text-brand-900"
    },
    {
      tag: "Lebih dari sekadar dating",
      title: "Bangun koneksi, bukan hanya romansa",
      description: "Cari teman satu minat, partner diskusi, atau bahkan teman nonton bareng. Platform ini mendukung hubungan dalam berbagai bentuk.",
      colorClass: "bg-brand-500/20 text-brand-900"
    },
    {
      tag: "Jalan dua arah",
      title: "Hanya cocok jika kalian berdua setuju",
      description: "Kami menerapkan sistem saling menyukai. Tidak ada pesan yang bisa dikirim tanpa kecocokan dari kedua belah pihak, untuk mencegah spam atau gangguan.",
      colorClass: "bg-brand-700/20 text-brand-900"
    }
  ];

  const faqs = [
    {
      question: "Siapa saja yang bisa bergabung di situs ini?",
      answer: "Hanya mahasiswa aktif dan alumni dari UNSRAT yang bisa bergabung. Kami melakukan verifikasi alamat email universitas saat pendaftaran untuk memastikan bahwa komunitas ini tetap spesifik untuk lingkungan kampus dan autentik."
    },
    {
      question: "Apakah saya masih bisa menggunakan platform ini setelah lulus?",
      answer: "Ya, alumni masih dapat menggunakan situs ini hingga 2 tahun setelah kelulusan, asalkan sudah diverifikasi saat masih terdaftar sebagai mahasiswa. Setelah itu, akses mungkin akan dibatasi."
    },
    {
      question: "Apa yang membedakan platform ini dari aplikasi dating lainnya?",
      answer: "Platform ini dibuat khusus untuk komunitas UNSRAT, jadi kamu lebih mungkin terhubung dengan orang-orang yang mengikuti kelas yang sama, memiliki minat serupa, atau berbagi pengalaman hidup sebagai mahasiswa. Seperti bertemu seseorang di kampus—hanya saja secara online."
    },
    {
      question: "Apakah platform ini aman untuk digunakan?",
      answer: "Kami mengutamakan keamanan. Jika ada seseorang yang mengirim pesan tidak senonoh, pengguna dapat melaporkan atau memblokir orang tersebut. Kami juga mewajibkan akun mahasiswa untuk mengurangi akun palsu."
    }
  ];

  let openFaqIndex = $state<number | null>(null);
  let flippedCards = $state<Set<number>>(new Set());

  function toggleFaq(index: number) {
    openFaqIndex = openFaqIndex === index ? null : index;
  }

  function toggleFlip(cardIndex: number) {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardIndex)) {
      newFlipped.delete(cardIndex);
    } else {
      newFlipped.add(cardIndex);
    }
    flippedCards = newFlipped;
  }

  function handleGetStarted() {
    goto(i18n.route('/login'));
  }
</script>

<!-- Mobile-First Landing Page -->
<main class="pt-4 overflow-x-hidden">
  
  <!-- Top Clouds Decoration -->
  <div class="absolute inset-0 top-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-24 -left-24 w-72 h-72 bg-gradient-soft opacity-30 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute top-20 -right-20 w-64 h-64 bg-gradient-soft opacity-20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
  </div>

  <!-- Navigation -->
  <nav class="relative z-10 px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:px-12">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <a href={i18n.route('/')} class="flex items-center gap-2 group">
        <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
          <HeartIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-text-main">
          UNS<span class="text-gradient-brand">RATE</span>
        </h1>
      </a>
      
      <button 
        onclick={handleGetStarted}
        class="px-4 py-2 sm:px-6 sm:py-2.5 inline-flex items-center gap-2 sm:gap-3 bg-gradient-brand text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {m.landing_cta_login()}
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative z-10 px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-text-main leading-tight">
        {m.landing_hero_title()}
        <br />
        <span class="text-gradient-brand ">
          {m.landing_hero_campus()}
        </span>
      </h1>
      
      <p class="text-base sm:text-lg md:text-xl text-grey-500 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
        {m.landing_hero_subtitle()}
      </p>
      
      <button 
        onclick={handleGetStarted}
        class="group inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-brand text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <ZapIcon class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
        {m.landing_cta_start()}
        <ArrowRightIcon class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </section>

  <!-- Landing Cards Section -->
  <section id="landing-cards" class="w-full px-4 mx-auto gap-5 mt-12 sm:mt-16 md:mt-20 md:flex md:justify-center lg:gap-4 md:gap-4 max-w-7xl">
    <!-- Card 1 -->
    <div class="flip-card-container h-80 sm:h-96 md:h-100 w-full max-w-75 mx-auto md:mx-0 md:-rotate-2 lg:mt-20 mb-6 md:mb-0">
      <button 
        onclick={() => toggleFlip(0)}
        class="flip-card w-full h-full {flippedCards.has(0) ? 'flipped' : ''}"
        aria-label="Flip card 1"
      >
        <div class="flip-card-inner">
          <!-- Front -->
          <div class="flip-card-face flip-card-front bg-gradient-brand rounded-3xl shadow-xl flex items-center justify-center">
            <UserIcon class="w-32 h-32 text-white opacity-50" strokeWidth={1} />
          </div>
          <!-- Back -->
          <div class="flip-card-face flip-card-back bg-gradient-brand rounded-3xl shadow-xl overflow-hidden">
            <img 
              src={gifImage} 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </button>
    </div>
    
    <!-- Card 2 -->
    <div class="flip-card-container h-80 sm:h-96 md:h-100 w-full max-w-75 mx-auto md:mx-0 md:rotate-2 lg:rotate-0 mb-6 md:mb-0">
      <button 
        onclick={() => toggleFlip(1)}
        class="flip-card w-full h-full {flippedCards.has(1) ? 'flipped' : ''}"
        aria-label="Flip card 2"
      >
        <div class="flip-card-inner">
          <!-- Front -->
          <div class="flip-card-face flip-card-front bg-primary rounded-3xl shadow-xl flex items-center justify-center">
            <HeartIcon class="w-32 h-32 text-white opacity-50" fill="currentColor" strokeWidth={1} />
          </div>
          <!-- Back -->
          <div class="flip-card-face flip-card-back bg-primary rounded-3xl shadow-xl overflow-hidden">
            <img 
              src={unsrateImage} 
              alt="UNSRATE Logo" 
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </button>
    </div>
    
    <!-- Card 3 - Hidden on mobile, shown on lg -->
    <div class="flip-card-container h-80 sm:h-96 md:hidden lg:block md:h-100 w-full max-w-75 mx-auto md:mx-0 md:rotate-2 lg:mt-20">
      <button 
        onclick={() => toggleFlip(2)}
        class="flip-card w-full h-full {flippedCards.has(2) ? 'flipped' : ''}"
        aria-label="Flip card 3"
      >
        <div class="flip-card-inner">
          <!-- Front -->
          <div class="flip-card-face flip-card-front bg-primary-hover rounded-3xl shadow-xl flex items-center justify-center">
            <SparklesIcon class="w-32 h-32 text-white opacity-50" strokeWidth={1} />
          </div>
          <!-- Back -->
          <div class="flip-card-face flip-card-back bg-primary-hover rounded-3xl shadow-xl overflow-hidden">
            <img 
              src={mikelImage} 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </button>
    </div>
  </section>

  <!-- Features Section -->
  <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <h2 class="text-primary text-2xl sm:text-3xl font-bold mt-8 sm:mt-16 mb-4 text-center">
        Satu kampus, banyak cerita
      </h2>
      <p class="tracking-wide text-base text-grey-500 text-center leading-relaxed max-w-2xl mx-auto">
        Lebih gampang nyambung karena kalian ngerti struggle yang sama.
      </p>
      <p class="tracking-wide text-base text-grey-500 text-center leading-relaxed max-w-2xl mx-auto mb-8">
        Gak usah cari di kolom komentar kampus di sini tempatnya yang serius tapi santai.
      </p>

      <!-- Feature Cards -->
      <div class="space-y-4 mt-8">
        {#each featureCards as feature, index}
          <div 
            class="md:flex justify-center items-center gap-4 sm:gap-6 md:gap-8 {feature.colorClass} px-4 sm:px-6 py-6 rounded-3xl sm:rounded-4xl hover:shadow-lg transition-all duration-300"
            style="animation: fadeInUp 0.6s ease-out {index * 0.1}s backwards;"
          >
            <div class="flex-1">
              <p class="uppercase text-xs sm:text-sm font-black pt-2 pb-2 tracking-tight">
                {feature.tag}
              </p>
              <h3 class="font-bold text-2xl sm:text-[28px] leading-tight mb-4">
                {feature.title}
              </h3>
              <p class="text-sm sm:text-base leading-relaxed pb-4">
                {feature.description}
              </p>
            </div>
            <div class="shrink-0 md:max-w-[40%] lg:max-w-[35%]">
              <div class="w-full aspect-video bg-white/20 rounded-2xl flex items-center justify-center">
                {#if index === 0}
                  <CircleCheckIcon class="w-16 h-16 sm:w-20 sm:h-20 opacity-40" strokeWidth={1.5} />
                {:else if index === 1}
                  <ZapIcon class="w-16 h-16 sm:w-20 sm:h-20 opacity-40" strokeWidth={1.5} />
                {:else if index === 2}
                  <UserIcon class="w-16 h-16 sm:w-20 sm:h-20 opacity-40" strokeWidth={1.5} />
                {:else}
                  <HeartIcon class="w-16 h-16 sm:w-20 sm:h-20 opacity-40" strokeWidth={1.5} />
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
    <div class="container mx-auto max-w-3xl">
      <h2 class="text-2xl sm:text-3xl font-bold mb-8 text-center text-text-main">
        Frequently Asked Questions
      </h2>
      
      <ul class="bg-bg-card shadow-lg rounded-2xl overflow-hidden">
        {#each faqs as faq, index}
          <li class="border-b border-grey-400/10 last:border-b-0">
            <button
              onclick={() => toggleFaq(index)}
              class="w-full flex items-center gap-3 px-4 sm:px-6 py-4 font-medium text-left hover:bg-grey-50 transition-colors duration-200"
            >
              <ChevronRightIcon 
                class="w-5 h-5 text-grey-500 transition-transform duration-200 shrink-0 {openFaqIndex === index ? 'rotate-90' : ''}"
              />
              <span class="text-sm sm:text-base text-text-main">{faq.question}</span>
            </button>

            {#if openFaqIndex === index}
              <div class="px-4 sm:px-6 pb-4 pl-12 sm:pl-14">
                <p class="text-sm sm:text-base text-grey-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <!-- Footer with Bottom Clouds -->
  <footer class="pt-12 sm:pt-16 relative mt-12">
    <!-- Bottom Clouds Decoration -->
    <div class="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none">
      <div class="absolute -bottom-24 left-1/4 w-96 h-96 bg-gradient-soft opacity-20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 right-1/4 w-80 h-80 bg-gradient-soft opacity-25 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Footer Content -->
    <div class="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-8 bg-bg-card border-t border-grey-400/10">
      <div class="max-w-6xl mx-auto">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div class="sm:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center shadow-md">
                <HeartIcon class="w-5 h-5 text-white" fill="white" />
              </div>
              <h3 class="text-xl font-bold text-text-main">
                UNS<span class="text-gradient-brand">RATE</span>
              </h3>
            </div>
            <p class="text-sm text-grey-500 leading-relaxed max-w-sm">
              {m.landing_footer_about()}
            </p>
          </div>
          
          <div>
            <h4 class="font-semibold text-text-main mb-3 sm:mb-4">
              {m.landing_footer_product()}
            </h4>
            <ul class="space-y-2 text-sm text-grey-500">
              <li>
                <a href={i18n.route('/explore')} class="hover:text-primary transition-colors duration-200">
                  {m.landing_footer_explore()}
                </a>
              </li>
              <li>
                <a href={i18n.route('/matches')} class="hover:text-primary transition-colors duration-200">
                  {m.landing_footer_matches()}
                </a>
              </li>
              <li>
                <a href={i18n.route('/chat')} class="hover:text-primary transition-colors duration-200">
                  {m.landing_footer_chat()}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-text-main mb-3 sm:mb-4">
              {m.landing_footer_support()}
            </h4>
            <ul class="space-y-2 text-sm text-grey-500">
              <li>
                <a href={i18n.route('/help')} class="hover:text-primary transition-colors duration-200">
                  {m.landing_footer_help()}
                </a>
              </li>
              <li>
                <a href={i18n.route('/privacy')} class="hover:text-primary transition-colors duration-200">
                  {m.landing_footer_privacy()}
                </a>
              </li>
              <li>
                <a href={i18n.route('/terms')} class="hover:text-primary transition-colors duration-200">
                  {m.landing_footer_terms()}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-grey-400/10 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-grey-500">
          © 2026 UNSRATE. {m.landing_footer_rights()}.
        </div>
      </div>
    </div>
  </footer>
</main>

<style>
  /* Animation Keyframes */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradient {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s ease infinite;
  }

  /* Flip Card Styles */
  .flip-card-container {
    perspective: 1000px;
  }

  .flip-card {
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0;
  }

  /* Hover effect for desktop only */
  @media (hover: hover) and (pointer: fine) {
    .flip-card:hover {
      transform: scale(1.05);
    }
  }

  .flip-card.flipped .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .flip-card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .flip-card-front {
    z-index: 2;
  }

  .flip-card-back {
    transform: rotateY(180deg);
  }

  /* Touch feedback for mobile */
  @media (hover: none) and (pointer: coarse) {
    .flip-card:active {
      opacity: 0.9;
    }
  }

  /* Ensure images fit properly */
  .flip-card-back img {
    display: block;
  }
</style>

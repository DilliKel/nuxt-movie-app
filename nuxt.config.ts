// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: [
    'assets/css/main.css'
  ],

  // Nuxt requer que a configuração do PostCSS seja feita aqui.
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

    // FIX para impedir o @vue/devtools-kit de rodar no SSR
  devtools: {
    enabled: true,
    },

  // --------------------------------------------------

  // --- 2. MELHORIA PARA A API (Pra conseguir configurar no .env) ---
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.NUXT_PUBLIC_TMDB_API_KEY,
      tmdbBaseUrl: process.env.NUXT_PUBLIC_TMDB_BASE_URL,
      tmdbImageBaseUrl: process.env.NUXT_PUBLIC_TMDB_IMAGE_BASE_URL,
    }
  },
  // -------------------------------------------------------------

  compatibilityDate: '2025-11-05'
})

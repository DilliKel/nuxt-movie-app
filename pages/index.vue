<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NuxtLink } from '#components'

definePageMeta({ layout: 'default' })

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  overview?: string
}

// runtime config (pega NUXT_PUBLIC_TMDB_API_KEY da .env)
const config = useRuntimeConfig()
const API_KEY = config.public.tmdbApiKey || ''

const route = useRoute()
const q = computed(() => (route.query.q ? String(route.query.q) : ''))

const movies = ref<Movie[]>([])
const pending = ref(false)
const error = ref<string | null>(null)

// base da imagem
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'

// função que chama a API TMDB (endpoint ex: '/movie/popular' ou '/search/movie')
async function fetchFromTmdb(endpoint: string, params: Record<string, string | number> = {}) {
  error.value = null
  pending.value = true
  try {
    const url = new URL(`https://api.themoviedb.org/3${endpoint}`)
    url.searchParams.set('api_key', API_KEY)
    url.searchParams.set('language', 'pt-BR')
    for (const k in params) {
      if (params[k] !== undefined && params[k] !== null && String(params[k]).length)
        url.searchParams.set(k, String(params[k]))
    }
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`TMDB error ${res.status}`)
    const data = await res.json()

    // quando vem objeto com results
    if (Array.isArray(data.results)) {
      movies.value = data.results
    } else if (Array.isArray(data)) {
      movies.value = data
    } else {
      movies.value = []
    }
  } catch (err: any) {
    error.value = err.message || String(err)
    movies.value = []
  } finally {
    pending.value = false
  }
}

// decide o que buscar dependendo da query
async function loadMovies() {
  if (!API_KEY) {
    error.value = 'API key não encontrada. Configure NUXT_PUBLIC_TMDB_API_KEY'
    movies.value = []
    pending.value = false
    return
  }

  const term = q.value?.trim()
  if (term) {
    // busca por termo
    await fetchFromTmdb('/search/movie', { query: term, page: 1 })
  } else {
    // populares
    await fetchFromTmdb('/movie/popular', { page: 1 })
  }
}

// carrega inicialmente
onMounted(() => {
  loadMovies()
})

// REAGE quando a query muda (sem F5)
watch(q, () => {
  loadMovies()
})
</script>

<template>
  <div>
    <h1 class="text-4xl font-extrabold text-black-200 mb-6">
      {{ q ? `Resultados para "${q}"` : 'Catálogo de Filmes Populares' }}
    </h1>

    <div v-if="pending" class="text-center py-12 text-gray-400">Carregando filmes...</div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      <p>Erro: {{ error }}</p>
    </div>

    <div v-else-if="movies.length === 0" class="text-center py-12 text-gray-400">
      <p>Nenhum filme encontrado{{ q ? ` para "${q}"` : '' }}.</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <NuxtLink
        v-for="m in movies"
        :key="m.id"
        :to="`/movies/${m.id}`"
        class="bg-gray-800 text-white rounded-lg overflow-hidden shadow hover:scale-[1.02] transition"
      >
        <div class="w-full aspect-[2/3] bg-gray-700">
          <img
            v-if="m.poster_path"
            :src="`${IMAGE_BASE_URL}w500${m.poster_path}`"
            :alt="m.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
            Sem pôster
          </div>
        </div>

        <div class="p-3">
          <h2 class="text-sm font-semibold line-clamp-2">{{ m.title }}</h2>
          <p class="text-xs text-gray-300 mt-1">⭐ {{ m.vote_average?.toFixed(1) || 'N/A' }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
  
/* mantém as imagens proporcionais */
img {
  display: block;
}
</style>

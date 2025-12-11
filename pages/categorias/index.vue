<script setup lang="ts">
import { useTmdbFetch } from '~/utils/api'

definePageMeta({
  layout: 'default'
})

// Tipagem simples
interface Genre {
  id: number
  name: string
}

// Endpoint dos gêneros
const { data, pending, error } = await useTmdbFetch<{ genres: Genre[] }>(
  '/genre/movie/list'
)

const genres = computed(() => data.value?.genres || [])
</script>

<template>
  <div>
    <h1 class="text-4xl font-extrabold text-gray-800 mb-6">
      Categorias de Filmes
    </h1>

    <!-- LOADING -->
    <div v-if="pending" class="text-center py-10 text-xl text-blue-500">
      Carregando categorias...
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="text-center text-red-600 py-10">
      Erro ao carregar categorias.
    </div>

    <!-- LISTA DE CATEGORIAS -->
    <div 
      v-else 
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
             gap-4 mt-6"
    >
      <NuxtLink
        v-for="genre in genres"
        :key="genre.id"
        :to="`/categorias/${genre.id}`"
        class="bg-gray-800 text-white p-4 rounded-lg shadow-md 
               font-semibold text-center hover:bg-gray-700 
               transition cursor-pointer"
      >
        {{ genre.name }}
      </NuxtLink>
    </div>
  </div>
</template>

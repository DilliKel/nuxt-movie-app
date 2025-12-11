<script setup lang="ts">
import { computed } from 'vue';
import { useTmdbFetch, useImageBaseUrl } from '~/utils/api';

definePageMeta({
  layout: 'default'
});

// Tipagem mínima
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

const route = useRoute();
const categoryId = route.params.id as string;
const categoryName = route.query.name as string || 'Categoria';

// Buscar filmes da categoria
const { data, pending, error } = await useTmdbFetch<{ results: Movie[] }>(
  '/discover/movie',
  {
    with_genres: categoryId
  }
);

const movies = computed(() => data.value?.results || []);
const IMAGE_BASE_URL = useImageBaseUrl();
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Filmes em: {{ categoryName }}</h1>

    <div v-if="pending" class="text-blue-500">Carregando...</div>

    <div v-else-if="error" class="text-red-500">
      Erro ao carregar filmes.
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <NuxtLink
        v-for="movie in movies"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="bg-white rounded-lg shadow hover:scale-105 transition"
      >
        <img
          v-if="movie.poster_path"
          :src="`${IMAGE_BASE_URL}w500${movie.poster_path}`"
          class="w-full h-64 object-cover"
        />
        <div v-else class="w-full h-64 bg-gray-300 flex items-center justify-center">
          Sem poster
        </div>

        <p class="p-3 font-semibold text-center truncate">
          {{ movie.title }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

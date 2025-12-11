<script setup lang="ts">
import { computed } from 'vue';
import { useTmdbFetch, useImageBaseUrl } from '~/utils/api'; 

definePageMeta({
  layout: 'default'
})

// Tipagens
interface MovieDetail {
  title: string;
  overview: string; 
  poster_path: string; 
  release_date: string; 
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

const IMAGE_BASE_URL = useImageBaseUrl();

const route = useRoute();
const movieId = route.params.id as string;

// --- 1) Dados do filme
const { data: movieData, pending, error } = await useTmdbFetch<MovieDetail>(`/movie/${movieId}`);

// --- 2) Elenco
const { data: creditsData } = await useTmdbFetch<{ cast: CastMember[] }>(`/movie/${movieId}/credits`);

const cast = computed(() => creditsData.value?.cast || []);

const posterUrl = computed(() => {
  const path = movieData.value?.poster_path;
  return path ? `${IMAGE_BASE_URL}w500${path}` : null;
});

useHead({
  title: movieData.value ? `${movieData.value.title} - Detalhes` : 'Carregando...',
});
</script>

<template>
  <div class="p-6">
    <div v-if="pending" class="text-center py-12">
      <p class="text-lg text-blue-500">Carregando detalhes do filme...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-lg text-red-600">
        Erro ao carregar os detalhes do filme (ID: {{ movieId }}).
      </p>
    </div>

    <div v-else-if="movieData" class="bg-white shadow-2xl rounded-xl overflow-hidden md:flex">
      
      <!-- PÔSTER -->
      <div class="md:w-1/3">
        <img 
          :src="posterUrl || 'placeholder-image.png'" 
          :alt="`Pôster de ${movieData.title}`" 
          class="w-full h-full object-cover"
        />
      </div>

      <!-- DETALHES -->
      <div class="md:w-2/3 p-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ movieData.title }}</h1>
        
        <p class="text-xl font-semibold text-gray-600 mb-6">
          Avaliação Média: 
          <span class="text-yellow-500 font-bold">{{ movieData.vote_average.toFixed(1) }}</span> / 10
        </p>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Sinopse</h2>
        <p class="text-gray-700 leading-relaxed mb-6">{{ movieData.overview || 'Sinopse indisponível.' }}</p>

        <!-- CATEGORIAS -->
        <div class="flex flex-wrap gap-4 text-sm mt-8 ">      
          <p class="bg-gray-200 p-2 rounded-lg font-medium">Categorias:</p>
          <p
            v-for="genre in movieData.genres"
            :key="genre.id"
            class="bg-indigo-500 text-white p-2 rounded-lg font-medium"
          >
            {{ genre.name }}
          </p>
        </div>

        <!-- BOTÃO VOLTAR -->
        <div class="flex mt-10">
          <NuxtLink
            to="/"
            class="mt-8 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition ml-auto"
          >
            ← Voltar para o Catálogo
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- =========================== -->
    <!-- SEÇÃO DE ELENCO (AQUI) -->
    <!-- =========================== -->
    <div class="mt-12 bg-white p-6 rounded-xl shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Elenco</h2>

      <div
        v-if="cast.length === 0"
        class="text-gray-600 text-center"
      >
        Nenhuma informação de elenco encontrada.
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <div
          v-for="actor in cast"
          :key="actor.id"
          class="bg-gray-100 rounded-lg shadow p-3 hover:scale-105 transition cursor-pointer"
        >
          <img
            v-if="actor.profile_path"
            :src="`${IMAGE_BASE_URL}w300${actor.profile_path}`"
            :alt="actor.name"
            class="rounded-lg w-full h-48 object-cover"
          />
          <div v-else class="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-600">
            Sem Foto
          </div>

          <h3 class="font-bold mt-3 text-gray-900 text-sm">
            {{ actor.name }}
          </h3>
          <p class="text-gray-600 text-xs">
            como <span class="font-medium">{{ actor.character }}</span>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTmdbFetch, useImageBaseUrl } from '~/utils/api';

definePageMeta({
  layout: 'default'
});

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

interface MovieCard {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

const IMAGE_BASE_URL = useImageBaseUrl();
const route = useRoute();
const movieId = route.params.id as string;

// --- 1) Dados do filme
const { data: movieData, pending, error } = await useTmdbFetch<MovieDetail>(`/movie/${movieId}`);

// --- 2) Elenco
const { data: creditsData } = await useTmdbFetch<{ cast: CastMember[] }>(`/movie/${movieId}/credits`);
const cast = computed(() => creditsData.value?.cast || []);

// --- 3) Trailer
const { data: videosData } = await useTmdbFetch<{ results: any[] }>(`/movie/${movieId}/videos`);

const trailerKey = computed(() => {
  return (
    videosData.value?.results.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    )?.key || null
  );
});

// --- 4) Filmes Similares
const { data: similarData } = await useTmdbFetch<{ results: MovieCard[] }>(
  `/movie/${movieId}/similar`
);
const similarMovies = computed(() => similarData.value?.results || []);

// --- 5) Recomendações
const { data: recommendedData } = await useTmdbFetch<{ results: MovieCard[] }>(
  `/movie/${movieId}/recommendations`
);
const recommendedMovies = computed(() => recommendedData.value?.results || []);

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
    
    <!-- LOADING -->
    <div v-if="pending" class="text-center py-12">
      <p class="text-lg text-blue-500">Carregando detalhes do filme...</p>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-lg text-red-600">
        Erro ao carregar o filme (ID: {{ movieId }}).
      </p>
    </div>

    <!-- DADOS DO FILME -->
    <div v-else class="bg-white shadow-2xl rounded-xl overflow-hidden md:flex">
      
      <!-- POSTER -->
      <div class="md:w-1/3">
        <img 
        :src="posterUrl || ''"
          :alt="`Pôster de ${movieData?.title}`"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- INFO -->
      <div class="md:w-2/3 p-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ movieData?.title }}</h1>
        
        <p class="text-xl font-semibold text-gray-600 mb-6">
          Avaliação: <span class="text-yellow-500 font-bold">{{ movieData?.vote_average?.toFixed(1) }}</span>/10
        </p>

        <h2 class="text-2xl font-bold text-gray-800 mb-3">Sinopse</h2>
        <p class="text-gray-700 leading-relaxed mb-6">{{ movieData?.overview }}</p>

        <!-- GÊNEROS -->
        <div class="flex flex-wrap gap-3 mt-6">
          <span class="bg-gray-200 p-2 rounded-lg font-medium">Categorias:</span>
          <span
            v-for="genre in movieData?.genres"
            :key="genre.id"
            class="bg-indigo-500 text-white p-2 rounded-lg font-medium"
          >
            {{ genre.name }}
          </span>
        </div>

        <!-- BOTÃO VOLTAR -->
        <div class="flex mt-10">
          <NuxtLink
            to="/"
            class="mt-8 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition ml-auto"
          >
            ← Voltar
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ======================== -->
    <!-- TRAILER -->
    <!-- ======================== -->
    <div v-if="trailerKey" class="mt-12 bg-white p-6 rounded-xl shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Trailer Oficial</h2>

      <div class="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          :src="`https://www.youtube.com/embed/${trailerKey}`"
          class="w-full h-full"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- ======================== -->
<!-- ELENCO -->
<!-- ======================== -->
<div class="mt-12 bg-white p-6 rounded-xl shadow-xl">
  <h2 class="text-3xl font-bold text-gray-900 mb-4">Elenco</h2>

  <div v-if="cast.length === 0" class="text-gray-600 text-center">
    Nenhuma informação de elenco encontrada.
  </div>

  <div
    v-else
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
  >
    <NuxtLink
      v-for="actor in cast"
      :key="actor.id"
      :to="`/atores/${actor.id}`"
      class="bg-gray-100 rounded-lg shadow p-3 hover:scale-105 transition cursor-pointer block"
    >
      <img
        v-if="actor.profile_path"
        :src="`${IMAGE_BASE_URL}w300${actor.profile_path}`"
        :alt="actor.name"
        class="rounded-lg w-full h-48 object-cover"
      />

      <div
        v-else
        class="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-600"
      >
        Sem Foto
      </div>

      <h3 class="font-bold mt-3 text-gray-900 text-sm">
        {{ actor.name }}
      </h3>

      <p class="text-gray-600 text-xs">
        como <span class="font-medium">{{ actor.character }}</span>
      </p>
    </NuxtLink>
  </div>
</div>


    <!-- ======================== -->
    <!-- FILMES SIMILARES -->
    <!-- ======================== -->
    <div class="mt-12" v-if="similarMovies.length">
      <h2 class="text-3xl font-bold mb-4">Filmes Similares</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <NuxtLink
          v-for="movie in similarMovies"
          :key="movie.id"
          :to="`/movies/${movie.id}`"
          class="bg-white rounded-xl shadow hover:scale-105 transition overflow-hidden"
        >
          <img
            v-if="movie.poster_path"
            :src="`${IMAGE_BASE_URL}w300${movie.poster_path}`"
            class="w-full h-48 object-cover"
          />
          <div class="p-3">
            <p class="font-semibold text-sm truncate">{{ movie.title }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- ======================== -->
    <!-- RECOMENDAÇÕES -->
    <!-- ======================== -->
    <div class="mt-12" v-if="recommendedMovies.length">
      <h2 class="text-3xl font-bold mb-4">Recomendações</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <NuxtLink
          v-for="movie in recommendedMovies"
          :key="movie.id"
          :to="`/movies/${movie.id}`"
          class="bg-white rounded-xl shadow hover:scale-105 transition overflow-hidden"
        >
          <img
            v-if="movie.poster_path"
            :src="`${IMAGE_BASE_URL}w300${movie.poster_path}`"
            class="w-full h-48 object-cover"
          />
          <div class="p-3">
            <p class="font-semibold text-sm truncate">{{ movie.title }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

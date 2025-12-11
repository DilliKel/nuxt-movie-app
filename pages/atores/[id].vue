<script setup lang="ts">
import { computed } from 'vue';
import { useTmdbFetch, useImageBaseUrl } from '~/utils/api';

definePageMeta({
  layout: 'default'
});

// Tipagem do ator
interface ActorDetail {
  id: number;
  name: string;
  biography: string | null;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
}

interface MovieCast {
  id: number;
  title: string;
  poster_path: string | null;
  character: string;
}

const IMAGE_BASE_URL = useImageBaseUrl();

const route = useRoute();
const actorId = route.params.id as string;

// --- 1) Dados do ator
const { data: actorData, pending, error } = await useTmdbFetch<ActorDetail>(`/person/${actorId}`);

// --- 2) Filmes do ator
const { data: creditsData } = await useTmdbFetch<{ cast: MovieCast[] }>(
  `/person/${actorId}/movie_credits`
);

const actor = computed<ActorDetail | null>(() => actorData.value || null);
const movies = computed<MovieCast[]>(() => creditsData.value?.cast || []);

const profileUrl = computed(() => {
  return actor.value?.profile_path
    ? `${IMAGE_BASE_URL}w500${actor.value.profile_path}`
    : null;
});

useHead({
  title: actor.value ? `${actor.value.name}` : 'Carregando...'
});
</script>

<template>
  <div class="p-6">

    <div v-if="pending" class="text-center py-12">
      <p class="text-xl text-blue-500">Carregando ator...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-xl text-red-600">Erro ao carregar ator.</p>
    </div>

    <div v-else-if="actor" class="bg-white rounded-xl shadow-xl p-6 md:flex gap-8">

      <!-- FOTO -->
      <div class="md:w-1/3">
        <img
          v-if="profileUrl"
          :src="profileUrl"
          :alt="actor.name"
          class="rounded-xl shadow-lg"
        />
        <div v-else class="w-full h-80 bg-gray-300 rounded-xl flex items-center justify-center">
          Sem Foto
        </div>
      </div>

      <!-- INFO DO ATOR -->
      <div class="md:w-2/3">
        <h1 class="text-4xl font-bold mb-4">{{ actor.name }}</h1>

        <p class="text-gray-600 mb-4">
          <strong>Nascimento:</strong>
          {{ actor.birthday || 'Desconhecido' }}
        </p>

        <p class="text-gray-600 mb-4">
          <strong>Local:</strong>
          {{ actor.place_of_birth || 'Desconhecido' }}
        </p>

        <h2 class="text-2xl font-bold mt-6 mb-2">Biografia</h2>
        <p class="text-gray-700 leading-relaxed">
          {{ actor.biography || 'Biografia não disponível.' }}
        </p>
      </div>

    </div>

    <!-- FILMES DO ATOR -->
    <div class="mt-12">
      <h2 class="text-3xl font-bold mb-4">Filmes</h2>

      <div v-if="movies.length === 0" class="text-gray-500">
        Nenhum filme encontrado.
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <NuxtLink
          v-for="movie in movies"
          :key="movie.id"
          :to="`/movies/${movie.id}`"
          class="bg-white rounded-xl shadow hover:scale-105 transition overflow-hidden"
        >
          <img
            v-if="movie.poster_path"
            :src="`${IMAGE_BASE_URL}w300${movie.poster_path}`"
            class="w-full h-48 object-cover"
          />

          <div v-else class="w-full h-48 bg-gray-300 flex items-center justify-center">
            Sem poster
          </div>

          <div class="p-2 text-sm text-center">
            <p class="font-semibold truncate">{{ movie.title }}</p>
            <p class="text-gray-600">{{ movie.character }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

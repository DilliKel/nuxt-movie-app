<script setup lang="ts">
import MovieSearch from '~/components/MovieSearch.vue'
</script>

<template>
  <header class="bg-gray-800 text-white sticky top-0 z-50 shadow-lg py-4">
    <div class="container mx-auto flex justify-between items-center gap-4">

      <!-- Logo -->
      <NuxtLink to="/" class="text-xl font-bold hover:text-yellow-400">
        MOVIE APP
      </NuxtLink>

      <!-- Barra de Busca -->
      <div class="flex-1 flex justify-center">
        <MovieSearch class="w-full max-w-lg" />
      </div>

      <!-- Botão de Categorias -->
      <NuxtLink to="/categorias"
      class="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-600">
        CATEGORIAS
      </NuxtLink>
    </div>
  </header>
</template>

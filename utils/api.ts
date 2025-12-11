// utils/api.ts
import { useRuntimeConfig, useFetch } from '#imports';

/**
 * Retorna a URL base para as imagens do TMDb.
 * É um composable para garantir que o useRuntimeConfig seja chamado no contexto correto.
 */
export const useImageBaseUrl = () => {
    return useRuntimeConfig().public.tmdbImageBaseUrl as string;
}

// Define a tipagem de um composable de fetch do Nuxt.
// O tipo 'Ref' é importado globalmente pelo Nuxt/Vite para o TypeScript.
interface FetchReturn<T> {
  // O tipo 'Ref' aqui será reconhecido (globalmente)
  data: Ref<T | null>; 
  pending: Ref<boolean>;
  error: Ref<any>;
  refresh: (opts?: {
    force?: boolean
    dedupe?: boolean
  }) => Promise<void>;
}

/**
 * Composable customizado para buscar dados da API do TMDb.
 */
export async function useTmdbFetch<T>(
  endpoint: string, 
  params: Record<string, string | number> = {}
): Promise<FetchReturn<T>> {
  
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;
  const baseUrl = config.public.tmdbBaseUrl;

  if (!apiKey) {
    throw new Error("API Key not found in runtime config.");
  }
  
  // Parâmetros padrão: api_key e idioma PT-BR
  const defaultParams = {
    api_key: apiKey,
    language: 'pt-BR',
    ...params,
  };

  // Converte os parâmetros em string de query
  const query = new URLSearchParams(defaultParams as Record<string, string>).toString();
  const url = `${baseUrl}${endpoint}?${query}`;

  // useFetch do Nuxt para requisições com SSR
  const { data, pending, error, refresh } = await useFetch<T>(url, {
    key: endpoint, // Garante que o Nuxt faça o cache correto
    server: true,  // Força o SSR
  });

  return { data, pending, error, refresh } as FetchReturn<T>;
}
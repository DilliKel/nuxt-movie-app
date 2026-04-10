# nuxt-movie-app
> Aplicação web para explorar e salvar filmes, integrando com API pública de catálogo, construída em Nuxt 3.

## Sobre
Este projeto foi desenvolvido como parte do desafio técnico para a vaga de front-end na A&3. A proposta era construir uma aplicação que permitisse pesquisar, explorar, visualizar detalhes e organizar uma lista pessoal de filmes, usando tecnologias modernas (Nuxt 3/Vue 3).  
Todo o desenvolvimento, desde a concepção da UI ao consumo da API, foi feito individualmente. O objetivo era mostrar domínio de componentes Vue, roteamento dinâmico, integração com API, controle de estado, estilização moderna e boas práticas de arquitetura em um app realista de catálogo de filmes.  
Durante o processo, o projeto foi avaliado e aprovado pela equipe sênior da empresa, servindo como critério para contratação.

## Funcionalidades
- [x] Busca de filmes por título e navegação por resultados
- [x] Listagem dos filmes mais populares em destaque na home
- [x] Visualização de detalhes de cada filme (sinopse, nota, atores, gênero, poster)
- [x] Paginação de filmes populares e resultados de busca
- [x] Listagem de categorias/gêneros e exibição de filmes por categoria
- [x] Detalhamento de atores (com filmes relacionados)
- [x] Organização de lista pessoal de filmes salvos
- [ ] Login/cadastro de usuário (não implementado)
- [ ] Avaliação ou comentários em filmes (não implementado)
- [ ] Personalização de temas ou preferências de usuário (não implementado)

## Stack utilizada
- **Nuxt 3**: Framework principal e renderização SSR/SPA
- **Vue 3**: Construção dos componentes da interface
- **Vue Router**: Navegação entre páginas/rotas dinâmicas de filmes, atores e categorias
- **Pinia**: Controle de estados simples e global (para listas e controle prático)
- **TailwindCSS**: Estilização moderna e responsiva das páginas e listas
- **TMDB API**: Consulta de informações e imagens de filmes em tempo real (API pública)
- **Vercel**: Deploy da aplicação para acesso online

## Como rodar localmente
1. Clone o repositório:
   ```bash
   git clone https://github.com/DilliKel/nuxt-movie-app.git
   cd nuxt-movie-app
   ```
2. Crie um arquivo `.env` com sua chave da API do TMDB:
   ```
   NUXT_PUBLIC_TMDB_API_KEY=<SUA_CHAVE>
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000` no navegador.

> **Obs.:** É necessário ter uma conta gratuita no [TMDB](https://www.themoviedb.org/) para obter uma API key válida.

Ou acesse online: [movie-app-ten-opal-62.vercel.app](https://movie-app-ten-opal-62.vercel.app/)

## Aprendizados
- Prática real de roteamento dinâmico e SSR com Nuxt 3 em projeto autoral
- Integração total com API pública (TMDB) e manipulação de dados assíncronos no Vue/Nuxt
- Organização de estrutura de pastas, pages e componentes seguindo convenções do Nuxt
- Uso prático de Pinia para manipulação de listas e controle de estado global simples
- Customização avançada de UI com TailwindCSS para responsividade e performance visual

## Status do projeto
Concluído  
Aplicação estável, todas as rotas previstas estão funcionais, app publicado em produção. Refatorações e melhorias futuras são desejadas.

---

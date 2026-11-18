---
name: web-architecture
description: LUMM-web structure and patterns: page folders with use<Page>Page hooks, the api/ layer with axios interceptors and TanStack Query key factories, zustand stores, react-router routes and guards, shadcn/ui. Use for any feature, page or API-consumption change in LUMM-web.
---

# Web architecture (LUMM-web)

## Where things go

| Need                | Put it in                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New page            | `src/pages/<page>/index.tsx` + `use<Page>Page.ts(x)`; sub-parts in `components/`, `hooks/`; `schema.ts`, `types.ts`, `utils.ts`, `constants.ts` as needed |
| Register route      | `src/router.tsx` (`React.lazy` import; under `/:lang`; Portuguese slug for both languages)                                                                |
| Protected route     | wrap with `<AuthGuard />`, `<AuthGuard requireCurator />`, `<AuthGuard requireAdmin />`                                                                   |
| API call            | `src/api/<resource>/index.ts` (async fn, optional `signal`, returns `response.data`)                                                                      |
| API types           | `src/api/<resource>/types/I<Name>.ts` or shared `src/api/types/`                                                                                          |
| Query keys          | `src/api/query-keys.ts` factories (`speciesKeys`, `changeRequestKeys`, `userKeys`; add a new factory per resource)                                        |
| Shared component    | `src/components/<kebab-name>.tsx` (export via `components/index.ts` if it is part of the barrel)                                                          |
| UI primitive        | `src/components/ui/` — shadcn-generated (`components.json`, new-york); add with the shadcn CLI only after approval; ESLint ignores this folder            |
| Global client state | `src/stores/use<Name>Store.ts` (zustand; persist only what must survive reloads)                                                                          |
| Pure helpers        | `src/utils/` or `src/lib/`                                                                                                                                |

## Data fetching

- Components never import axios. Hooks call `useQuery`/`useMutation` with functions from `src/api/` and keys from
  `query-keys.ts`; pass `signal` through for cancellation.
- Invalidate with key prefixes (`queryClient.invalidateQueries({ queryKey: speciesKeys.lists() })`).
- Defaults (`lib/query-client.ts`): staleTime 2 min, retry 1, no refetch on focus — override per query only with reason.
- Errors are shown globally by `api/errors-interceptor.ts` (sweetalert, PT/EN by language). For flows that handle
  errors inline, wrap in `runWithSilencedApiErrors()` and use `getLocalizedError(error)`.
- Auth: `api/auth-interceptor.ts` adds Bearer and refreshes once on 401; `X-Skip-Auth-Refresh` opts out.
  Session lives in `useAuthStore` (sessionStorage).

## Conventions

- Imports via `@/` alias. TypeScript strict; no `any` without justification; `import type` for types (`verbatimModuleSyntax`).
- Follow local naming in the folder you edit (kebab-case in `components/`, camelCase cards in `pages/species/components/`);
  do not mass-rename.
- All user-visible text through `t()` (see `web-i18n`); accessibility rules from `jsx-a11y` apply.
- Tailwind 4 utilities + `cn()` from `lib/utils.ts`; icons from `lucide-react` (also `react-icons` exists).
- No `console.*` (ESLint error).
- Public pre-rendered routes are listed in **both** `vite.config.ts` and `src/prerender.ts` — update both.
- Server contract changes → `cross-repo-impact`.

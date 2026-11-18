# LUMM-web — Project Context

> Primary architecture reference for Claude Code. Read this before exploring the codebase.
> **Verified against:** GitHub `main` @ `7182ce3` (release 1.58.1); local tree identical, 2026-11-11.
> If code and this file diverge, propose an update (QM category: Documentation, priority QM-PB).

## 1. Purpose

Public website and curator panel of LUMM, a scientific repository of bioluminescent fungi (G2BC, UNEB).
Public area: home, explore/search, species page (taxonomy, luminescence, characteristics, conservation,
molecular data, observation map, references, similar species), distribution, glossary, guidance,
publications, contributors, data download, contact, species-update requests.
Panel (`/:lang/painel`): profile, users (admin), species CRUD/photos/references/outdated (curator+),
change-request review.

- Backend: **LUMM-server** (Flask API) at `https://api.lumm.uneb.br`. This repo is its only first-party client.
- Production `https://lumm.uneb.br`; staging `https://lumm-web.onrender.com` (from `vite.config.ts`).
- LUMM-docs exists but is out of scope; this file is the architecture reference for Claude Code.

## 2. Stack (from `package.json`)

| Area             | Choice                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime          | Node **22** (`.nvmrc`, CI, Dockerfile); README still says 20+                                                                                                          |
| Build            | Vite 6, TypeScript ~5.8 (`tsc -b && vite build`), `@vitejs/plugin-react`                                                                                               |
| UI               | React 19, Tailwind CSS 4 (`@tailwindcss/vite`), shadcn/ui (style new-york, Radix primitives, lucide icons), sweetalert2 (`components/alert.tsx`), embla carousel, vaul |
| Routing          | `react-router` 7 (declarative `<Routes>`, `React.lazy` pages)                                                                                                          |
| Server state     | TanStack Query 5 (`lib/query-client.ts`: staleTime 2 min, retry 1, no refetch on focus)                                                                                |
| Client state     | zustand 5 (`stores/useAuthStore` → sessionStorage; `useLanguageStore` persisted)                                                                                       |
| HTTP             | axios (`api/index.ts`, timeout 30 s, `X-API-Key` header)                                                                                                               |
| Forms            | react-hook-form 7 + zod 4 via `@hookform/resolvers`                                                                                                                    |
| i18n             | i18next + react-i18next, lazy JSON locales (`pt`, `en`), `i18n-iso-countries`                                                                                          |
| Maps             | leaflet + react-leaflet                                                                                                                                                |
| Build plugins    | `vite-prerender-plugin` (SEO pre-render), `vite-plugin-sitemap` (+ robots), `vite-plugin-pwa` (Workbox)                                                                |
| Quality          | ESLint 9 flat config (typescript-eslint, react, react-hooks, jsx-a11y, react-refresh), Prettier 3.5.3, husky + lint-staged                                             |
| E2E              | Playwright configured (`testDir: ./e2e`) — **directory absent, no tests**                                                                                              |
| Analytics / a11y | Microsoft Clarity (prod, `VITE_CLARITY_ID`), VLibras widget (in `index.html`)                                                                                          |

## 3. Directory map

```
src/
  main.tsx               initI18n → QueryClientProvider → BrowserRouter → AuthBootstrap → Suspense → Router
  router.tsx             all routes; /:lang (LanguageGuard) → BaseLayout public pages | painel (AuthGuard)
  prerender.ts           pre-render entry (route list duplicated from vite.config.ts — keep both in sync)
  api/                   API instance, interceptors, query-keys.ts, one module per resource:
                         auth/, species/ (+ types/), contact/, snapshot/, types/ (shared I* interfaces)
  auth/bootstrap.ts      session bootstrap
  components/            shared app components (kebab-case files); components/ui/ = shadcn (generated, ESLint-ignored)
  hooks/                 shared hooks (use-is-mobile, useIucnIcon, useCountryTypeFlags, useLangRedirect)
  lib/                   i18n.ts, lang.ts, query-client.ts, utils.ts (cn), country-names.ts
  locales/               en.json (source of truth) + pt.json — identical key trees
  pages/<page>/          index.tsx + components/ + hooks/ + use<Page>Page.ts(x) + schema(s).ts + types.ts + utils.ts + constants.ts
  stores/                zustand stores
  types/, utils/         global typings, small pure helpers
scripts/validate-locales.mjs   CI locale parity check
public/                  static assets, icons
```

Path alias: `@/` → `src/` (tsconfig + vite).

## 4. Architecture patterns

**Page = view + hook.** Each page folder exposes `index.tsx` (presentational) and a `use<Name>Page`
hook that owns queries, mutations and navigation (e.g. `pages/species/useSpeciesPage.tsx`,
`pages/panel/useSpeciesRequestsPage.ts`). Larger pages split into `components/` and `hooks/`
(`panel/species-edit/hooks/use-species-edit-form.ts`).

**API layer.** Pages never call axios directly.

- `api/<resource>/index.ts` exports async functions (`searchEspecies`, `fetchSpecies`, `fetchSpeciesNcbi`…)
  that accept an optional `signal` and return `response.data` typed with interfaces from `api/**/types/I*.ts`.
- `api/query-keys.ts` holds hierarchical key factories (`speciesKeys`, `changeRequestKeys`, `userKeys`);
  every `useQuery`/`invalidateQueries` uses them.
- `api/setup-interceptors.ts` (imported once in `main.tsx`) registers:
  - **auth interceptor**: adds `Authorization: Bearer`, single-flight refresh on 401 (skip with
    `X-Skip-Auth-Refresh` header), clears session on failure;
  - **error interceptor**: shows a deduplicated sweetalert using `message_pt`/`message_en`
    (by current language), `detail`, or `errors`. Wrap calls in `runWithSilencedApiErrors()` to suppress it.
- `getLocalizedError(error)` for inline error text.

**Server contract dependencies (change both repos together):**

- error body `{code, status, message_pt, message_en}`;
- pagination `{items, total, page, per_page, pages}` (`api/types/IPagination.ts`);
- JWT claims `role` (`researcher` | `curator` | `admin`) and `must_change_password`;
- bilingual content fields `<field>` / `<field>_pt`;
- species fields mirrored in `api/species/types/ISpecie.ts` (e.g. tri-state `lum_*` booleans,
  `mycobank_index_fungorum_id`, `ncbi_taxonomy_id`, `inaturalist_taxon_id`, `unite_taxon_id`, `iucn_redlist`).

**Routing and auth.** All user-facing paths are `/:lang/<slug>` with **Portuguese slugs for both
languages** (`explorar`, `especie/:species`, `painel/especies/:species/editar`…). `LanguageGuard`
validates `:lang`; `AuthGuard` supports `requireAdmin`, `requireCurator`, `requireUser={false}`.
Pages are `React.lazy` imports registered in `router.tsx`.

**Forms.** zod schema factory receiving `t` for localized messages
(`createSpeciesEditSchema(t: TFunction)`), used through `zodResolver` with react-hook-form.
Form values are strings/enums (tri-state and boolean form enums in `species-edit/types.ts`) converted to
API payloads in `utils.ts`. Exception: `pages/contact/schemas.ts` has hard-coded Portuguese messages.

**i18n.** Single namespace `translation`; locale chunks lazy-loaded (`locale-<lang>` manual chunk);
`DEFAULT_LOCALE = "en"`; detection order path → navigator → htmlTag. Every new key goes into
**both** `en.json` and `pt.json` with identical placeholders (`{{name}}`) — enforced by
`npm run validate:locales` in CI. Country names via `i18n-iso-countries`.
Glossary terms (incl. HispS, H3H, peak emission wavelength) live in `pages/glossary/terms.ts` + locales.

**Guidance & Orientation page** (`pages/guidance-&-orientations.tsx`, route `/:lang/guia`, text in `guidance.*`) is
LUMM's curation protocol: general principles ("Unknown" preferable to a guess), section-by-section field rules
(observations, Bioluminescent Anatomy, taxonomy, ecology, IUCN, molecular, references/media) and a
bioluminescence photography guide. Domain skills treat it as the project's authoritative reference.

**Naming observed (follow locally, do not mass-rename):** shared components kebab-case
(`species-combobox-async.tsx`); species page components camelCase (`taxonomyCard.tsx`); hooks
`useX` or `use-x`; interfaces `I<Name>`; some identifiers in Portuguese (`searchEspecies`, `dados`).

## 5. Build, PWA and SEO

- `VITE_*` variables are inlined at build time. `vite.config.ts` loads `.env.vault` via `dotenv`
  (`DOTENV_KEY`) before `loadEnv`. Anything in `VITE_*` (including `VITE_API_KEY`) is **public** in the bundle.
- Pre-rendered routes: `/`, `/pt|en` + `explorar, sobre, publicacoes, distribuicao, contato, colaboradores`
  (listed in `vite.config.ts` **and** `src/prerender.ts`).
- Sitemap/robots generated per mode (prod allows `/`, disallows `/painel`, `/trocar-senha`; non-prod disallows all).
- PWA: `autoUpdate`, NetworkFirst for documents/scripts/styles and `api.lumm.uneb.br` GETs, CacheFirst for
  images and Google Fonts; locale chunks excluded from precache.
- Docker: multi-stage (`base` → `dev` on 5173 | `build` with `DOTENV_KEY` arg → `prod` nginx 1.29
  alpine on port 80, SPA fallback, healthcheck `GET /pt`). Prod compose maps `4001:80`.

## 6. Configuration and secrets

- Template `.env.sample`: `VITE_SITE_URL`, `VITE_API_URL`, `VITE_API_KEY`, `VITE_ROBOTS`,
  `VITE_PUBLIC_STORAGE_BASE_URL`, `VITE_CLARITY_ID`, `NODE_ENV`.
- Local `.env` (git-ignored); CI/CD uses versioned `.env.vault` + `DOTENV_KEY` secret.
- Never read, print or commit `.env`; never stage `.env.vault` unless explicitly asked.
- New variable ⇒ `VITE_` prefix, add the name to `.env.sample`, declare it in `src/vite-env.d.ts`
  (today only `VITE_PUBLIC_STORAGE_BASE_URL` is declared there).

## 7. CI/CD and release

| Workflow      | Trigger                                                                                | What it does                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`      | PR → `main` (skips release PRs)                                                        | `npm ci --ignore-scripts`, `npm run lint`, `npm run validate:locales`, `npm run build` (with `DOTENV_KEY`); Trivy scan + EPV gate |
| `release.yml` | push to `main`                                                                         | semantic-release (`.releaserc.json`) → `CHANGELOG.md`, `package.json` version, tag, `chore(main): release X.Y.Z`                  |
| `cd.yml`      | release published / manual                                                             | build + push `ghcr.io/g2bc/lumm-web` image (`DOTENV_KEY` build arg)                                                               |
| `deploy.yml`  | CD success / manual                                                                    | self-hosted runner: checkout tag, pull image, `docker compose up web`                                                             |
| `dast.yml`    | cron `0 3 */14 * *`, manual (its `workflow_run` trigger names a non-existent workflow) | OWASP ZAP scan                                                                                                                    |

**CI does not run `prettier:check`; there are no tests.** Local gates before a PR:
`npm run lint`, `npm run prettier:check`, `npm run validate:locales`, `npm run build`.
Pre-commit hook: `lint-staged` → `eslint --fix` + `prettier --write` on staged files.

**ESLint notable rules:** `no-console: error`, `prefer-const: error`, react-hooks recommended,
`jsx-a11y` recommended, `react/self-closing-comp`, `react/jsx-boolean-value: never`.
Prettier: double quotes, semicolons, width 100, trailing commas es5, LF.

**Versioning:** conventional commits — `feat:` → minor, `fix:` → patch, breaking → major,
`chore:`/`refactor:`/`docs:` → none. Scopes are used (`fix(api): …`, `feat(v-libras): …`).

## 8. Commands

```bash
npm install                 # (husky installs hooks via "prepare")
npm run dev                 # Vite dev server, http://localhost:5173
npm run lint | lint:fix
npm run prettier:check | prettier:format
npm run validate:locales
npm run build               # tsc -b && vite build (needs VITE_* env)
npm run preview
make run-dev                # docker compose -f docker-compose.dev.yml up --build
```

## 9. Git conventions observed

- Single long-lived branch `main` (protected by convention); no dev branch.
- Topic branches `feat/…`, `fix/…`, `refactor/…`, `chore/…`.
- Conventional commit subjects in English, optional scope.

## 10. Known issues and open observations (evidence: `main` @ 7182ce3)

| #   | Observation                                                                                                                                                                                                                                                                                                                                                                                                   | Proposed QM                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | CI does not run `prettier:check` (eslint-plugin-prettier is loaded but `prettier/prettier` rule not enabled)                                                                                                                                                                                                                                                                                                  | QM-PB — add CI step                                                                                 |
| 2   | README says Node 20+; `.nvmrc`/CI/Docker use 22                                                                                                                                                                                                                                                                                                                                                               | QM-PB — fix README                                                                                  |
| 3   | No tests; Playwright `./e2e` missing                                                                                                                                                                                                                                                                                                                                                                          | QM-PB — add test suite                                                                              |
| 4   | Pre-render route list duplicated in `vite.config.ts` and `src/prerender.ts`                                                                                                                                                                                                                                                                                                                                   | QM-PB — single source                                                                               |
| 5   | `pages/contact/schemas.ts` validation messages hard-coded in Portuguese                                                                                                                                                                                                                                                                                                                                       | QM-PB — move to locales                                                                             |
| 6   | `en.json` `lineages_list` contains Portuguese text ("Linhagem …")                                                                                                                                                                                                                                                                                                                                             | QM-PB — translate                                                                                   |
| 7   | **Verify first — higher urgency.** PWA API-cache exclusion regex targets `/api/auth`, but server routes are `/auth/*` (and admin data is under `/admin/*`). If authenticated GET responses (e.g. `/auth/me`, `/admin/...`) are cached by the service worker, user data may remain in the browser cache after logout on shared machines. Check DevTools → Application → Cache Storage `api` after login/logout | QM-PM (Bug Fix) if confirmed — verify before any other PWA change                                   |
| 8   | Makefile `run-prod` references `docker-compose.prod.yml`, which does not exist                                                                                                                                                                                                                                                                                                                                | QM-PB                                                                                               |
| 9   | `dast.yml` `workflow_run` listens to `"Nova release"`; no workflow has that name (they are CI, Release, CD, Deploy, DAST), so DAST never runs after a release                                                                                                                                                                                                                                                 | QM-PB — point to `Deploy` as LUMM-server does                                                       |
| 10  | Guidance page describes fields absent from the data model and forms: gene accessions (HispS, H3H, Luz, CPH, NpgA), biochemical-pathway field, altitude band/metres, biome/vegetation/microhabitat, photo exposure metadata; Section 1 omits BOLD although it is synced and shown                                                                                                                              | Requirements decision (New Requirements: migration + web) or Documentation fix of the guidance text |

---
name: web-quality-gates
description: Local and CI quality gates for LUMM-web (eslint, prettier, validate:locales, tsc/vite build, Trivy/EPV, lint-staged) and the definition of done while no test suite exists. Use before every PR.
---

# Web quality gates

## Required locally before every PR (all must pass)

```bash
npm run lint                 # eslint . (fix: npm run lint:fix)
npm run prettier:check       # fix: npm run prettier:format
npm run validate:locales
npm run build                # tsc -b && vite build (needs VITE_* env; never print values)
```

`prettier:check` is required even though **CI does not run it yet**. The husky pre-commit hook runs
`lint-staged` (`eslint --fix` + `prettier --write` on staged files) — do not bypass it (`--no-verify`).
Use Node 22 (`.nvmrc`).

## What CI enforces (`ci.yml`, PRs to `main`)

`npm ci --ignore-scripts` · `npm run lint` · `npm run validate:locales` · `npm run build` (with `DOTENV_KEY`) ·
Trivy scan + EPV gate. New dependencies can fail the EPV gate — and need prior approval anyway.

## Manual verification (no automated tests exist)

Do **not** claim tests passed. Report what you checked, e.g.:

- `npm run dev` → page renders in **both** `/pt/...` and `/en/...`
- affected flows exercised (logged out / researcher / curator / admin as relevant)
- loading, empty and error states; mobile width
- browser console free of errors; no new ESLint warnings in touched files
- `npm run build && npm run preview` if PWA, pre-render, sitemap or env handling changed

## Definition of done (web)

- [ ] Gates above pass; summary in PR
- [ ] Manual verification listed with results
- [ ] QM key/category/priority in PR; conventional commits
- [ ] Cross-repo impact stated; companion PR linked if any
- [ ] PROJECT_CONTEXT.md update proposed if architecture changed

## Open QM proposals (QM-PB) — mention when relevant, do not implement unasked

1. Add `npm run prettier:check` to CI.
2. Fix README Node version (says 20+; project uses 22).
3. Add a test suite (Playwright e2e in `./e2e` is already configured; unit tests TBD), then gate it in CI.

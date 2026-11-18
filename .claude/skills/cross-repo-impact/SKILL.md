---
name: cross-repo-impact
description: Checklist for changes that cross the LUMM-server ↔ LUMM-web contract (API fields, data model, errors, pagination, auth claims, bilingual fields). Use whenever a model, schema, endpoint or API type changes.
---

# Cross-repo impact (LUMM-server ↔ LUMM-web)

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/cross-repo-impact/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## The contract (change only with paired PRs)

1. **Error body** `{"code", "status", "message_pt", "message_en"}` — server `app/utils/bilingual.py` + JWT loaders
   in `app/__init__.py`; web `api/errors-interceptor.ts`, `api/get-localized-error.ts`.
2. **Pagination** `{items, total, page, per_page, pages}`; `page`/`per_page` optional (absent → unpaginated),
   `per_page` ≤ 100 — server `app/utils/pagination.py`; web `api/types/IPagination.ts`.
3. **JWT claims** `role` ∈ {`researcher`,`curator`,`admin`}, `must_change_password` — server `app/services/auth.py`,
   `app/utils/permissions.py`; web `stores/useAuthStore.ts`, `components/auth-guard.tsx`.
4. **Bilingual content**: `<field>` (EN) + `<field>_pt` (PT) sibling columns.
5. **Endpoint paths/prefixes** (`/species`, `/admin/...`, `/auth/...`) and the `X-API-Key` header.

## Adding / changing a species field — touch points (verified via `unite_taxon_id`, `cultivation_pt`)

**LUMM-server**

- [ ] `app/models/<model>.py` (+ export in `app/models/__init__.py` if new model)
- [ ] migration (`db-migrations` skill — expand/contract)
- [ ] `app/schemas/species_schemas.py` (request + detail/response schemas)
- [ ] `app/services/species_service.py` (field lists used for create/patch)
- [ ] change-request flow if curators/users can propose it: `services/species_change_request/{validation,service}.py`,
      `repositories/species_change_request_repository.py`
- [ ] `scripts/snapshot_db.py` (public data export columns)
- [ ] sync scripts if a source populates it

**LUMM-web**

- [ ] `src/api/species/types/ISpecie.ts` (+ `api/species/index.ts` payload mapping)
- [ ] panel forms: `pages/panel/species-edit/{schema,types,utils,constants}.ts`, `index.tsx`, components;
      `pages/panel/species-create/{schema,utils}.ts`, `index.tsx`
- [ ] change-request review: `pages/panel/useSpeciesRequestsPage.ts`; request form `pages/species-request/`
- [ ] public display: `pages/species/components/*Card.tsx`, `pages/species/utils.ts`
- [ ] `src/locales/en.json` **and** `pt.json` (labels, glossary if a new domain term)

## Ordering (production applies migrations after the new API container starts)

1. **Server PR first** — additive, backward compatible (new nullable column / new optional field).
2. **Web PR second** — consumes the field; tolerates `null`/absence.
3. **Contract PR later** (separate release) — remove/rename old field, make NOT NULL, drop column.
   Never ship a web change that requires a server field not yet released.

## In each PR

- "Cross-repo impact" section: list contract items touched and link the companion PR.
- State whether LUMM-docs would need an update (out of scope for Claude Code; tell the user).

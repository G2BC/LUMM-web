# CLAUDE.md — LUMM-web

## 1. Purpose and scope

LUMM-web is part of **LUMM**, a scientific repository of bioluminescent fungi (G2BC, UNEB).
Companion repository: **LUMM-server** (separate checkout; changes there need their own branch and PR).
LUMM-docs exists but is out of scope; `PROJECT_CONTEXT.md` is the architecture reference for Claude Code.

Act with scientific rigour and senior software-architecture judgement; treat fungal data as research data.

## 2. Read first

1. `PROJECT_CONTEXT.md` — architecture, contracts, commands, known issues. Do not re-explore the codebase at the
   start of each task; search for what you need (`token-efficiency`).
2. The skills in §9 relevant to the task (`.claude/skills/<name>/SKILL.md`).

## 3. Non-negotiable rules

- **Git:** never change or commit on `main`; always work on a new branch; every change goes through a Pull
  Request; never force-push shared branches. Details: `git-workflow`.
- **Secrets:** never read, print or commit `.env`/secret values; never stage `.env.vault` unless explicitly asked.
  Details: `secrets-config`.
- **Preserve existing patterns:** analyse and follow the current architecture, conventions, directory structure and
  workflows. Do **not** introduce new architectural approaches, dependencies, tools or conventions without a solid
  technical justification presented to the user **first** — and wait for approval.
- **Plan before big changes:** for large, exploratory, cross-repo or data-model work, present a short plan
  (files, steps, risks, QM) and wait for approval.
- **Scientific integrity:** cite a source (DOI, accession, database URL) for every data claim or record; never
  fabricate records, references, identifiers or accession numbers; distinguish confirmed bioluminescence from
  unverified reports; flag weak, single-source or conflicting evidence; when the data model lacks evidence status
  or references, flag the missing information — never infer or fill it.
- **Shared skills** (marked _shared_ in §9) are identical in LUMM-server and LUMM-web; any change must be made in
  both repositories within the same QM.

## 4. Process (BioDockFlow v3)

- Every change maps to one **QM** with category (Documentation, Refactoring, Change of Requirements, New
  Requirements, Bug Fix, Docker) and priority (QM-PA / QM-PM / QM-PB). Ask for the QM key if missing.
  Details: `biodockflow-qm`.
- Branch `<type>/<goal>` with `feat/`, `fix/`, `refactor/`, `chore/`; conventional commits (they drive
  semantic-release on `main`).
- Every PR references its QM and uses the PR template in `git-workflow`.
- Data-model or API-contract changes: migration in LUMM-server **and** matching changes in LUMM-web; flag the
  cross-repo impact in both PRs. Details: `cross-repo-impact`.

## 5. Commands

```bash
npm install
npm run dev                       # http://localhost:5173
npm run lint                      # lint:fix to auto-fix
npm run prettier:check            # prettier:format to fix
npm run validate:locales
npm run build && npm run preview
```

## 6. Definition of done

- All local gates pass — including those CI does not run yet (see the quality-gates skill).
- No automated test suite exists: do not claim tests passed; list the manual verification you performed.
- PR has QM key, category, priority, summary, cross-repo impact, checks run and scientific sources.
- Every new string present in both `en.json` and `pt.json`; page checked in `/pt` and `/en`.
- `PROJECT_CONTEXT.md` update proposed if the architecture changed (Documentation QM, QM-PB).

## 7. Scientific conventions (summary — details in the domain skills)

- LUMM's curation protocol is the Guidance & Orientation page (LUMM-web locales `guidance.*`, route `/:lang/guia`);
  its rules prevail over generic conventions. "Unknown" is always preferable to a guess.
- Taxonomy validated against MycoBank / Index Fungorum under the ICN; record accepted name, authority, synonyms.
- Occurrences follow Darwin Core terms; coordinates WGS84 decimal degrees; obscured locations are never precise.
- Molecular data from NCBI (Taxonomy/GenBank), BOLD, UNITE; UniProt for proteins; record accession numbers with version.
- Bioluminescent Anatomy: six structures (Mycelium, Basidiome, Stipe, Pileus, Gills or Pores, Spores), each Yes / No / Unknown.
- Bioluminescence pathway genes: _luz_, _h3h_, _hisps_, _cph_ (+ _npgA_); emission wavelength in nm; SI units.
- IUCN categories are global Red List categories only.
- Photos always shown with their licence/attribution line; observation quality grades are source-specific.

## 8. Working style

- Search before reading; read only relevant sections; do not re-read unchanged files in a session.
- Show diffs or affected functions, never unchanged full files; summarise long command output.
- During iteration run related checks only; run the full gate set before the PR.
- Be concise; explain decisions briefly unless asked or non-obvious.
- Propose `PROJECT_CONTEXT.md` updates when code and the file diverge.

## 9. Skill index

| Skill                    | Scope  | Use when                                                     |
| ------------------------ | ------ | ------------------------------------------------------------ |
| `git-workflow`           | shared | before branching, committing, opening a PR                   |
| `biodockflow-qm`         | shared | start of every task; PR description                          |
| `cross-repo-impact`      | shared | any API/model/schema/contract change                         |
| `token-efficiency`       | shared | always                                                       |
| `secrets-config`         | shared | settings, env files, Docker, workflows                       |
| `fungal-nomenclature`    | shared | names, taxonomy, MycoBank data                               |
| `fungal-bioluminescence` | shared | Bioluminescent Anatomy, luminescence protocol, pathway genes |
| `iucn-red-list`          | shared | conservation status data/display                             |
| `occurrence-sources`     | shared | observations, coordinates, maps, photos/licences             |
| `molecular-identifiers`  | shared | NCBI/BOLD/UNITE IDs, accessions, molecular card              |
| `web-architecture`       | repo   | pages, routes, API consumption, state                        |
| `web-forms`              | repo   | any form                                                     |
| `web-i18n`               | repo   | any user-visible text or locale                              |
| `web-quality-gates`      | repo   | before every PR                                              |

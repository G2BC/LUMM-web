---
name: git-workflow
description: Branching, conventional commits, PR preparation and Git safety rules for LUMM. Use before creating a branch, committing, or opening a pull request.
---

# Git workflow (LUMM)

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/git-workflow/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## Non-negotiable

- **Never** commit, merge, rebase or push on `main`. `main` is the only protected branch; there is no dev branch.
- Start every change from an up-to-date `main` on a **new branch**; all changes reach `main` through a Pull Request.
- Never force-push a shared branch; never rewrite published history.
- Never stage `.env` or `.env.vault` (or any secret) unless the user explicitly asks. Stage files by path; never `git add -A`/`git add .` blindly — check `git status` first.
- Never create commits whose subject starts with `chore(main): release` (reserved for semantic-release).
- Every lint/format/build/CI-equivalent check must pass locally before opening a PR (see the repo's quality-gates skill).

## Branch names — `<type>/<goal>`

Repo convention (deviates from BioDockFlow's `feature/`/`refact/`, see `biodockflow-qm`):

| Prefix      | Use for                                  | Example                           |
| ----------- | ---------------------------------------- | --------------------------------- |
| `feat/`     | New Requirements, Change of Requirements | `feat/species-wavelength-field`   |
| `fix/`      | Bug Fix                                  | `fix/observation-map-obscured`    |
| `refactor/` | Refactoring                              | `refactor/species-routes-session` |
| `chore/`    | Docker, CI, Documentation, dependencies  | `chore/ci-add-ruff`               |

Goal: short, lowercase, kebab-case or snake_case (both exist; prefer kebab-case for new branches). Optionally append the QM key: `fix/qm-123-observation-map`.

## Commits — Conventional Commits (drive semantic-release on `main`)

`<type>(<optional scope>): <imperative summary in English>`

| Type                                                        | Release effect | Typical QM category                       |
| ----------------------------------------------------------- | -------------- | ----------------------------------------- |
| `feat`                                                      | minor          | New Requirements / Change of Requirements |
| `fix`                                                       | patch          | Bug Fix                                   |
| `perf`                                                      | patch          | Refactoring (performance)                 |
| `refactor`, `chore`, `docs`, `ci`, `build`, `style`, `test` | none           | Refactoring / Docker / Documentation      |
| `feat!:` or footer `BREAKING CHANGE:`                       | major          | only with explicit user approval          |

- Focused commits: one logical change each; no unrelated formatting churn.
- Body (optional): why, not what. Footer: `Refs: <QM key>`.
- Match existing style: `feat: add BOLD synchronization workflow`, `fix(api): update species endpoints`.

## Opening the PR

1. `git fetch origin && git rebase origin/main` (on your branch only) or merge `origin/main` into it.
2. Run the full local gate set; summarise results.
3. Push the branch; open the PR against `main` (`gh pr create` if available, otherwise give the user the title/body).
4. PR title = conventional-commit style summary. PR body:

```markdown
## QM

Key: <JIRA-KEY> · Category: <one of the six> · Priority: <QM-PA | QM-PM | QM-PB>

## Summary

<what and why, 2–4 lines>

## Changes

- <bullet per notable change>

## Cross-repo impact

<none | linked PR in LUMM-server/LUMM-web + contract items touched>

## Data / migrations

<none | migration id, expand/contract phase, backward-compatibility note>

## Checks run locally

- [ ] <command> — pass

## Scientific sources

<DOIs / accessions / database URLs for any data or domain claim, or "n/a">
```

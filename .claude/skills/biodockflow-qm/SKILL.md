---
name: biodockflow-qm
description: BioDockFlow v3 maintenance-issue (QM) classification: six categories, QM-PA/PM/PB priorities, TR-QM, and how LUMM applies the process. Use at the start of every task and when writing a PR.
---

# BioDockFlow v3 — Maintenance Issues (QM)

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/biodockflow-qm/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

Source: G2BC/BioDockFlow (v3 process document + README). The process docs are in Portuguese; names in parentheses.

## Rule

Every change maps to **one QM** (registered in Jira) with a **category** and a **priority**.
If the user did not give a QM key, ask for it before creating a branch. If no QM exists yet, propose one
(summary, reason, category, priority, impact, risk) for the user to register — do not invent a key.

## Six categories

| Category               | (PT)                  | Default priority                                         |
| ---------------------- | --------------------- | -------------------------------------------------------- |
| Docker                 | Docker                | **QM-PA**                                                |
| Bug Fix                | Correção de Bugs      | **QM-PM** if it blocks use of the system, else **QM-PB** |
| Refactoring            | Refatoração           | **QM-PM** if it blocks use of the system, else **QM-PB** |
| Change of Requirements | Mudança de Requisitos | QM-PB                                                    |
| New Requirements       | Novos Requisitos      | QM-PB                                                    |
| Documentation          | Documentação          | QM-PB                                                    |

"Blocks use" = a main use case (browse/search species, view species page, curator editing, login) is unavailable or produces wrong data.

## Priorities and TR-QM

| Priority       | Weight | Scope                                                                                     |
| -------------- | ------ | ----------------------------------------------------------------------------------------- |
| QM-PA (high)   | 1      | all Docker issues                                                                         |
| QM-PM (medium) | 0.5    | Refactoring/Bug Fix that block use                                                        |
| QM-PB (low)    | 0.25   | non-blocking Refactoring/Bug Fix, Change of Requirements, New Requirements, Documentation |

TR-QM = Σ(completed QMs × weight) / Σ(all QMs × weight) — the process effectiveness metric. Prefer resolving
higher-weight QMs first when the user asks what to do next.

## QM fields (per v3 document)

At registration: reason, summary, maintenance type. During analysis: risk, impact, category, responsible person,
estimate/deadline. At delivery: the PR URL. (The v3 PDF does not define a "priority" field — LUMM uses the
README priority rules above.)

## How LUMM applies v3 (deviations — intentional, approved)

- **Branch prefixes:** `feat/`, `fix/`, `refactor/`, `chore/` (repo convention aligned with conventional
  commits) instead of v3's `feature/`, `fix/`, `refact/`.
- **No dev branch:** v3's "update application in development" step (merge to a dev branch first) is not used;
  only `main` exists. Merge to `main` = release (semantic-release) → CD → deploy.
- **Branch + PR for every category**, including Docker and Documentation (v3 has no branch/PR step on those
  tracks; LUMM is stricter).

## Classification checklist (put the result in the PR)

1. Which category? (one only — split the work if it spans two)
2. Does it block use of the system? → PM vs PB for Bug Fix/Refactoring.
3. Cross-repo? → one QM per repo or one QM referenced by both PRs (ask the user).
4. Data model change? → also follow `cross-repo-impact`.

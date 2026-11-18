---
name: token-efficiency
description: Rules for working economically in LUMM repos: context reuse, targeted search and reads, concise output, planning gates. Applies to every task.
---

# Token efficiency

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/token-efficiency/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## Context

- **PROJECT_CONTEXT.md is the architecture reference.** Read it once per session; do not re-explore the
  codebase at the start of each task.
- Do not re-read a file already read in this session unless it changed (you edited it, or `git status`/diff shows it).

## Finding code

- Search before reading: file name (`glob`), symbol, or keyword (`grep -n`). Then read only the relevant range.
- For large files (e.g. `species_routes.py`, `species_schemas.py`, `en.json`/`pt.json`, `species-edit/`), read the
  matched section ± context, not the whole file.
- Prefer one targeted search over several broad ones.

## Output

- Show diffs or the affected functions only — never reprint unchanged full files.
- Summarise long command output: one-line result, then errors, then only the relevant lines.
- Keep responses concise; explain decisions briefly unless asked or non-obvious.

## Checks

- While iterating: run only checks related to the change (e.g. `ruff check <file>`, `eslint <file>`,
  `npm run validate:locales` after locale edits).
- Before the PR: run the full local gate set (quality-gates skill).

## Planning gate

- Large, exploratory, cross-repo or data-model work: present a short plan (files, steps, risks, QM) and
  **wait for approval** before editing.

## Skills

- Keep each skill small and single-topic; load only the skills the task needs.
- When an architectural change makes PROJECT_CONTEXT.md outdated, propose the exact update (Documentation QM, QM-PB).

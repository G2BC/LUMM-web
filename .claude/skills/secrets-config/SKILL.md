---
name: secrets-config
description: Configuration and secret handling in LUMM (Dotenv Vault, .env templates, VITE_* build-time variables, GitHub Actions secrets). Use when adding/changing settings or touching env files, Docker or workflows.
---

# Secrets and configuration

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/secrets-config/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## Hard rules

- Never read, print, log, echo or commit `.env`, decrypted vault contents, tokens, passwords or API keys.
- Never stage `.env.vault` unless the user explicitly asks (it changes only via the Dotenv Vault workflow).
- Never paste secret values into code, tests, docs, PR text or commit messages. Use variable **names** only.
- Never weaken CI secret scanning (Trivy `--scanners secret`) or move secrets into workflow YAML.

## How config flows

|                                  | LUMM-server                                              | LUMM-web                                            |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| Template (names only, versioned) | `.env.example`                                           | `.env.sample`                                       |
| Local values (git-ignored)       | `.env`                                                   | `.env`                                              |
| Prod/CI                          | `.env.vault` + `DOTENV_KEY` secret (GitHub Actions)      | same; decrypted at **build** time                   |
| Loader                           | `dotenv_vault.load_dotenv()` in `app/config/__init__.py` | `dotenv` config in `vite.config.ts`, then `loadEnv` |
| Access                           | `Config` class attributes / `current_app.config[...]`    | `import.meta.env.VITE_*`                            |

## Adding a setting

- **Server:** add to `Config` with a safe non-secret default (empty string for credentials), parse type explicitly
  (`int(...)`, `float(...)`, bool via `in {"1","true","yes"}`), add the name to `.env.example`. Tell the user the
  value must be added to Dotenv Vault for each environment (development, ci, staging, production).
- **Web:** must start with `VITE_`; add the name to `.env.sample`; declare it in `src/vite-env.d.ts`.
  **Everything in `VITE_*` is public** in the bundle — never put a secret there.

## Facts to keep in mind

- `VITE_API_KEY` / server `API_KEY` (`X-API-Key`) is a client identifier, **not** a secret boundary
  (it ships in the public JS). Authorisation relies on JWT + roles.
- Sync workflows and deploy read secrets from GitHub Actions (`secrets.*`, `vars.*`); do not add new secrets
  without telling the user which ones they must create.

---
name: web-i18n
description: Internationalisation in LUMM-web: i18next with lazy pt/en JSON locales, validate:locales parity, language-prefixed routes, bilingual API fields and messages, glossary terms. Use whenever user-visible text, locales or language handling change.
---

# Internationalisation (pt / en)

## Setup

- `src/lib/i18n.ts`: single namespace `translation`, lazy-loaded `src/locales/{en,pt}.json` (chunk `locale-<lang>`),
  detection path → navigator → htmlTag, `DEFAULT_LOCALE = "en"` (`lib/lang.ts`), `SUPPORTED_LOCALES = ["pt","en"]`.
- URLs are `/:lang/<slug>`; slugs are Portuguese in both languages — do not translate slugs.
- Country names via `i18n-iso-countries` (`lib/country-names.ts`, `utils/translateCountryName.ts`).

## Rules

1. Every user-visible string uses `t("section.key")`. No literals in JSX, alerts, zod messages or aria labels.
2. Add every key to **both** `en.json` (source of truth for the validator) and `pt.json` with the same nesting,
   type and `{{placeholders}}`. Run `npm run validate:locales` (CI gate) after any locale edit.
3. Put keys in the existing section of the page (`species_page.*`, `panel_page.*`, `errors.*`, `glossary.*`…);
   follow the existing key style of that section.
4. Translations must be real translations — never copy Portuguese into `en.json` or vice versa
   (`en.json` `lineages_list` currently has a Portuguese fragment — known issue).
5. API content: show `<field>_pt` when language is `pt`, else `<field>`; fall back to the other language only
   if empty, never to a hard-coded string. API errors use `message_pt` / `message_en` (interceptor does this).
6. Scientific names are not translated; keep italics via markup, not inside the translation string when avoidable.
7. Glossary terms: `pages/glossary/terms.ts` + locale entries `<Term>` / `<Term>_description` in both files;
   domain content must carry a source (see the domain skills).
8. Large locale files: search for the key path and edit the section only — do not reformat the whole file.

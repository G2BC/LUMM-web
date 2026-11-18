---
name: web-forms
description: Form conventions in LUMM-web: react-hook-form + zod schema factories with localized messages, string/tri-state form values, payload conversion utils. Use when creating or changing forms (species create/edit, species request, contact, auth, users).
---

# Forms (react-hook-form + zod)

## Pattern (see `pages/panel/species-edit/`)

- `schema.ts`: a **factory** receiving `t` so messages are localized:
  ```ts
  export function createThingSchema(t: TFunction) {
    return z.object({
      name: z.string().trim().min(1, t("panel_page.thing_validation_name")),
    });
  }
  ```
- `types.ts`: form value types (`z.infer<...>`) and enums such as `TRI_STATE_FORM_VALUES` / `BOOLEAN_FORM_VALUES`.
- `utils.ts`: convert API data → form defaults and form values → API payload (trim, `""` → `null`,
  decimal comma → dot, numeric IDs from strings).
- Hook (`hooks/use-<x>-form.ts`): `useForm({ resolver: zodResolver(schema), defaultValues })`, submit via a
  `useMutation`, invalidate relevant query keys, show success with `Alert`.

## Rules

- Validation messages come from locale keys in **both** `en.json` and `pt.json` — never hard-coded strings
  (`pages/contact/schemas.ts` is a known exception to fix under its own QM).
- Tri-state scientific fields (e.g. `lum_*`, `edible`) must keep three states (yes / no / unknown) end to end;
  never default unknown to `false`.
- Numeric identifiers (MycoBank/IF, NCBI taxid, UNITE, iNat) are validated as digit strings; do not coerce invalid
  input silently.
- Server validation is authoritative; surface server errors through the existing interceptor/`getLocalizedError`.
- New field ⇒ follow the web half of the `cross-repo-impact` checklist (types, schema, utils, constants, components, locales).

---
name: iucn-red-list
description: IUCN Red List categories and how LUMM stores and displays conservation status (sync_iucn_red_list, conservation_status, assessment year/URL, icons). Use when touching conservation data or its display.
---

# IUCN Red List

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/iucn-red-list/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## Categories (IUCN Red List Categories and Criteria v3.1 — https://www.iucnredlist.org)

| Code | Category              | Group              |
| ---- | --------------------- | ------------------ |
| EX   | Extinct               | —                  |
| EW   | Extinct in the Wild   | —                  |
| CR   | Critically Endangered | threatened         |
| EN   | Endangered            | threatened         |
| VU   | Vulnerable            | threatened         |
| NT   | Near Threatened       | —                  |
| LC   | Least Concern         | —                  |
| DD   | Data Deficient        | not a threat level |
| NE   | Not Evaluated         | not a threat level |

## LUMM storage (`scripts/sync_iucn_red_list.py`, IUCN API v4 `taxa/scientific_name`)

- Picks the assessment flagged `latest`; writes:
  - `species_characteristics.conservation_status` ← `red_list_category_code`
  - `species_characteristics.iucn_assessment_year` ← `year_published`
  - `species_characteristics.iucn_assessment_url` ← assessment `url`
  - `species.iucn_redlist` ← **`assessment_id`** (an ID, not a category — do not display it as a status)
- Web: `hooks/useIucnIcon.ts` + `assets/IUCN_Red_List_icons/{EX,EW,CR,EN,VU,NT,LC,DD,NE}.svg`;
  `pages/species/components/conservationStatusCard.tsx`.
- API token is a secret (GitHub Actions); never log it.

## Rules

1. `null` conservation status = not synced / no global assessment found. Do **not** display or export it as LC;
   show NE only when IUCN itself lists the taxon as Not Evaluated or the UI explicitly defines that mapping.
2. DD is not "safe" and not "threatened"; keep it distinct in filters and statistics.
3. Global IUCN categories ≠ national/regional red lists (e.g. Brazilian lists). Never mix them in the same field;
   a regional status needs its own field and source (requirements decision).
4. Always show the assessment year and link to the assessment URL with the category.
5. Category names come from IUCN; do not translate codes, translate only labels (both locales).

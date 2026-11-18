---
name: fungal-bioluminescence
description: Scientific rules for fungal bioluminescence data in LUMM — the Bioluminescent Anatomy section (six structures, Yes/No/Unknown), LUMM's own observation and photography protocol, the photo lumm flag, luciferin pathway genes (luz, h3h, hisps, cph, npgA) and emission wavelength. Use when touching luminescence data, species content, guidance or glossary text.
---

# Fungal bioluminescence

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/fungal-bioluminescence/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## LUMM's own reference (authoritative for this project)

LUMM's curation protocol is the **Guidance & Orientation** page: LUMM-web `src/pages/guidance-&-orientations.tsx`,
text in `src/locales/{en,pt}.json` → `guidance.*` (route `/:lang/guia`). Follow it; do not substitute other
classification schemes. Key principles (`guidance.principles`):

- _"'Unknown' is always preferable to a guess."_
- Use controlled vocabulary first; free text only for what the options cannot capture.
- Range fields: measure at least 5 mature basidiomes and report the mean.

## Bioluminescent Anatomy (`guidance.sec2`, `species_page.lumm.*`)

Six structures, each assessed **independently** and recorded as **Yes / No / Unknown**:

| Structure (EN label)            | PT label                                  | Field (`species_characteristics`) |
| ------------------------------- | ----------------------------------------- | --------------------------------- |
| Mycelium                        | Micélio                                   | `lum_mycelium`                    |
| Basidiome (Whole fruiting body) | Basidioma (Corpo de frutificação inteiro) | `lum_basidiome`                   |
| Stipe (Stem)                    | Estipe (Caule)                            | `lum_stipe`                       |
| Pileus (Cap)                    | Píleo (Chapéu)                            | `lum_pileus`                      |
| Gills or Pores                  | Lamelas ou Poros                          | `lum_lamellae`                    |
| Spores                          | Esporos                                   | `lum_spores`                      |

- Storage: nullable Boolean — `true` = Yes, `false` = No, `null` = Unknown. Web `lumCard.tsx` renders the three
  states with hierarchy basidiome → stipe/pileus → gills or pores/spores. Use these exact labels in UI, exports and text.
- Contributors propose values in the species-request form ("Suggested Bioluminescent Anatomy"); a curator reviews
  every contribution before publication.
- Field protocol behind a value (`guidance.sec2`): eyes dark-adapted 10–15 min; no red torch; assess each structure
  while covering the others; fresh, moist specimens glow most; desiccation and cold (< 10 °C in many species)
  suppress emission. A "No" recorded under unfavourable conditions is weak evidence — flag it rather than treat it
  as a confirmed absence.

## Rules

1. `Unknown` (`null`) is the default. Never turn it into Yes/No without a citable source; never infer one structure
   from another (e.g. Basidiome Yes ⇏ Pileus Yes) or from related species.
2. Yes ≠ No ≠ Unknown: never collapse `false` and `null` in code, filters, statistics, exports or UI.
3. Per project rules, distinguish experimentally confirmed bioluminescence from unverified reports. LUMM records
   _where_ light is emitted but stores no evidence status and no reference per structure, so:
   cite the supporting reference (DOI) for every proposed value in the PR "Scientific sources", and
   **flag the missing information** when it cannot be traced — never infer or fill it.
4. `species_photos.lumm` / `species_photo_requests.lumm` = "the mushroom is bioluminescent in this photo": a property of
   the photo, not by itself evidence for a structure or species.
5. Bioluminescence photographs: follow `guidance.photo_guide` (ambient-light reference photo first; tripod; ISO
   3200–12800; widest aperture; 30 s–5 min exposures; record the required metadata). LUMM does not store camera/exposure
   metadata — flag when a task needs it.
6. Flag weak, single-source or conflicting evidence explicitly. The bibliography should include every paper that
   describes the species' bioluminescence, including early or preliminary reports (`guidance.sec7`).

## Biochemistry and genes (`guidance.sec2`, `guidance.sec6`)

- Pathway (caffeic acid cycle; Kotlobay et al. 2018, doi:10.1073/pnas.1803615115): caffeic acid → hispidin
  (**HispS**, activated by **NpgA**) → 3-hydroxyhispidin (**H3H**) → light + oxyluciferin (**Luz**, luciferase, + O₂)
  → caffeic acid regenerated via caffeylpyruvate (**CPH**). One system is shared by all known luminous lineages
  (Oliveira et al. 2012, doi:10.1039/c2pp25032b); cluster evolution: Ke et al. 2020, doi:10.1073/pnas.2010761117.
- Lineages as curated in LUMM (`lineages_list`): Omphalotaceae, Physalacriaceae, Mycenaceae, Lucentipes lineage,
  Cyphellopsidaceae (Silva-Filho et al. 2023, doi:10.3390/jof9101004).
- Gene symbols italic lower-case (_hisps_, _h3h_, _luz_, _cph_, _npgA_); proteins roman (HispS, H3H, Luz, CPH, NpgA).
- Gene accession fields: GenBank accessions **only** when the sequence was obtained from **this species**, never from
  a related reference organism. "Hispidin pathway — inferred from phylogeny" is an inference, not confirmation.
- Emission: report λmax in **nm** with source and method (in vivo / in vitro); the glossary gives ~520 nm (green) for
  the fungal system. Never store a species wavelength without a reference.

## Guidance ahead of the data model (do not invent fields)

The guidance describes gene accession fields (HispS, H3H, Luz, CPH, NpgA), a biochemical-pathway field and
photo-metadata fields that **do not exist** in LUMM-server models or LUMM-web forms (verified 2026-11-11).
Adding them is a New Requirements QM (migration + web; see `cross-repo-impact`). Until then, flag the gap; never
store this information in free-text fields as a workaround.

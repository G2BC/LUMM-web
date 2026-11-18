---
name: occurrence-sources
description: Occurrence/observation data rules for LUMM: iNaturalist, Mushroom Observer, speciesLink, BOLD; Darwin Core mapping; WGS84 coordinates; location_obscured; source-specific quality_grade; photo licence and attribution. Use when touching observations, maps, sync scripts or species photos.
---

# Occurrence sources, coordinates and media rights

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/occurrence-sources/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## Sources in LUMM (`observations.source`, unique on `(source, external_id)`)

| Source              | Sync                               | `quality_grade` holds                           | `location_obscured`                | Coordinates                                              |
| ------------------- | ---------------------------------- | ----------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `inaturalist`       | `sync_inaturalist.py` (API v1)     | iNat grade: `research`, `needs_id`, `casual`    | iNat `obscured` flag               | point as returned (obscured ones are randomised by iNat) |
| `mushroom_observer` | `sync_mushroom_observer.py` (api2) | always `null`                                   | `gps_hidden` **or** no precise GPS | precise GPS, else **centroid of the location box**       |
| `specieslink`       | `sync_specieslink.py`              | **`basisOfRecord`** value (not a quality grade) | always `false`                     | GeoJSON `[lng, lat]`                                     |
| `bold`              | `sync_bold.py` (portal API)        | `"<marker> \| <BIN>"` (not a quality grade)     | always `false`                     | parsed from record                                       |

**`quality_grade` is source-specific.** Never compare, rank or filter it across sources; the web treats
"research grade" only for `inaturalist`. A new value needs locale keys `species_page.observations.quality_<value>`.

## Coordinates

- Stored as `Numeric(10,6)` decimal degrees, assumed **WGS84** (EPSG:4326). Validate −90 ≤ lat ≤ 90, −180 ≤ lng ≤ 180,
  reject (0,0) unless the source asserts it; GeoJSON order is `[lng, lat]`.
- `location_obscured = true` (and MO box centroids) ⇒ **not precise**: never present as an exact locality, never use
  for fine-scale distribution or type-locality claims, never try to de-obscure. Show the obscured notice
  (`observationMapCard.tsx` does).
- Coordinate uncertainty, datum and georeference protocol are **not stored** (gap) — flag when a task needs them.

## Darwin Core (reference vocabulary; doi:10.1371/journal.pone.0029715)

| LUMM                                  | DwC term                                                          |
| ------------------------------------- | ----------------------------------------------------------------- |
| `external_id` (+ source)              | `occurrenceID` / `catalogNumber`                                  |
| `latitude`, `longitude`               | `decimalLatitude`, `decimalLongitude` (+ `geodeticDatum` = WGS84) |
| `observed_on`                         | `eventDate` (ISO 8601)                                            |
| `location_obscured`                   | `informationWithheld` / `dataGeneralizations`                     |
| speciesLink `quality_grade`           | `basisOfRecord`                                                   |
| `url`                                 | `references`                                                      |
| photo `license_code`, `rights_holder` | `license`, `rightsHolder`                                         |

Use DwC names for any new occurrence field or export. GBIF is **not integrated** (only an outbound link on the
species page); use it as a manual cross-check, and cite the GBIF occurrence/dataset URL when you do.
The same specimen can appear in several sources; LUMM does not de-duplicate across sources — do not sum counts
across sources as independent records without saying so.

## Photos: licence and attribution (`species_photos`, `app/utils/photo_attribution.py`)

- Fields: `license_code`, `attribution` (uploader), `rights_holder`, `source_url`, `source` (default `iNaturalist`),
  `declaration_accepted_at` (contributor declaration), `lumm`, `featured`.
- Display string = `format_attribution_display()`: `(c) <holder>, <some|all|no> rights reserved (<LICENSE>), uploaded by <uploader>`;
  CC0 → "no rights reserved", `all-rights-reserved` → "all rights reserved", missing → "LICENSE NOT PROVIDED".
- Rules: never show a photo without its attribution line; never strip, shorten or alter licence/attribution;
  never add a photo whose licence is unknown without flagging it; respect NC/ND terms (no derivatives,
  no commercial reuse); keep `source_url` to the original record.
- Web renders the server-built attribution (`pages/species/components/slide.tsx`); do not rebuild it client-side.

## Rules for sync/data changes

Cite the source record URL for each occurrence; never fabricate occurrences or coordinates; respect each API's
terms and rate limits; flag conflicting identifications between sources.

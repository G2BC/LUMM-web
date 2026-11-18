---
name: fungal-nomenclature
description: Fungal nomenclature and taxonomy rules for LUMM data: ICN, MycoBank/Index Fungorum identifiers, accepted names, synonyms, basionyms, authorities, the is_outdated_mycobank flag. Use when touching names, Taxon data, MycoBank sync or taxonomy display.
---

# Fungal nomenclature and taxonomy

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/fungal-nomenclature/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## Authorities and sources

- Governing code: **International Code of Nomenclature for algae, fungi, and plants (ICN)**. Shenzhen Code 2018
  (doi:10.12705/Code.2018); a Madrid Code (2025) edition exists — check the current edition before citing article numbers.
  Fungal-specific provisions are in Chapter F (registration of names, one fungus = one name, sanctioning).
- Name repositories: **MycoBank** (https://www.mycobank.org) and **Index Fungorum** (https://www.indexfungorum.org).
  Since 2013, a new fungal name is validly published only if it cites an identifier issued by a recognised repository.
- LUMM stores one `species.mycobank_index_fungorum_id`. Per LUMM guidance (`guidance.sec3`), MycoBank and Index
  Fungorum are different databases with the same numbering system, and this ID is **mandatory** for every species
  (★ — the DB column is nullable, so enforce it in review, not by assumption). Confirm the ID resolves in both
  databases before relying on it; report a mismatch instead of picking one.
- Per `guidance.sec3`, always verify the accepted name against MycoBank **and** Index Fungorum before submission.

## LUMM data model

- `species.scientific_name` — the name LUMM displays; `lineage`, `family`, `group_name`, `section`.
- `taxon` (1:1, MycoBank-derived): `classification`, `authors`, `years_of_effective_publication`, `basionym`,
  `synonyms`, `name_type`, `gender` (grammatical gender of the genus name).
- `species.is_outdated_mycobank` — set by `scripts/sync_mycobank.py` when MycoBank's **current name** record ID
  differs from the stored ID, i.e. the LUMM name is no longer MycoBank's current name. Curators review these in
  the panel ("desatualizadas"). The sync **never renames** a species.

## Rules

1. Record **accepted (current) name + authority**, synonyms and basionym, each traceable to a MycoBank/IF record.
2. Never change `scientific_name` automatically or from memory; name changes are curator decisions with a source.
3. Never invent or "complete" authorities, years or synonym lists. If MycoBank/IF cannot be reached or disagrees
   with stored data, **flag it** (state both values and the source) — do not choose silently.
4. When MycoBank and Index Fungorum disagree on the current name, report the conflict with both record URLs.
5. Formatting (display/text): genus and epithet in _italics_; rank and authors roman. Basionym authors in parentheses
   before the combining author: _Genus epithet_ (Basionym Author) Combining Author. Keep authority abbreviations
   exactly as the repository gives them.
6. Infraspecific and invalid/illegitimate names: preserve the repository's status markers (e.g. "nom. inval.");
   do not drop them.
7. Lineage/family placement follows the LUMM curated content (Omphalotaceae, Physalacriaceae, Mycenaceae,
   Lucentipes lineage, Cyphellopsidaceae); changes need a phylogenetic reference (DOI).

## When the data model lacks information

If a task needs evidence the model cannot store (e.g. a reference for a synonymy decision), **flag the missing
information** to the user; never infer or fill it.

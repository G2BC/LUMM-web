---
name: molecular-identifiers
description: Rules for molecular and taxonomic identifiers in LUMM: NCBI Taxonomy ID and Entrez record counts, GenBank accessions, BOLD process IDs/BINs, UNITE IDs, UniProt. Use when touching ncbi_service, molecular data display, BOLD sync or identifier fields.
---

# Molecular data and identifiers

> **Shared skill** — identical copy in LUMM-server and LUMM-web (`.claude/skills/molecular-identifiers/SKILL.md`).
> Any change must be made in **both** repositories within the same QM.

## What LUMM stores today

| Field / data                                                | Meaning                                                                     | Populated by                 |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------- |
| `species.ncbi_taxonomy_id` (unique)                         | NCBI Taxonomy taxid                                                         | curators                     |
| `species.unite_taxon_id` (unique)                           | UNITE taxon identifier                                                      | curators (no sync)           |
| `species.inaturalist_taxon_id`, `mushroom_observer_name_id` | external taxon IDs                                                          | curators / imports           |
| `observations` with `source="bold"`                         | BOLD records: `external_id` = process ID; `quality_grade` = `marker \| BIN` | `sync_bold.py`               |
| `/species/<id>/ncbi`                                        | **counts** of NCBI records per Entrez database + search links               | `NCBIService` (live, cached) |

No GenBank accession, gene, or UniProt fields exist (gap → requirements decision).

## NCBIService (`app/services/ncbi_service.py`)

- Requires `NCBI_EMAIL` and `NCBI_API_KEY`; returns `{}` when missing (feature silently off).
- For each Entrez DB (taxonomy, bioproject, biosample, assembly, nuccore, gene, gds, sra, protein, ipg, structure, pmc)
  runs `esearch` with `txid<id>[Organism:noexp]` (direct) and `txid<id>[Organism:exp]` (subtree); caches the result in
  Redis (`lumm:ncbi:species:<taxid>:v1`, TTL `NCBI_CACHE_TTL_SECONDS`, default 24 h). Bump the `v1` suffix when the
  payload shape changes (and update the web type in the same QM).
- Respect NCBI E-utilities usage policy (identify with email/API key; stay within the per-second request limit).
- Web: `pages/species/components/molecularCard.tsx` via `normalizeSpeciesNcbiRecords` (`pages/species/utils.ts`).

## Rules

1. Never fabricate taxids, accessions, BINs or process IDs; never "guess" an ID from a name. Resolve it against the
   database and cite the record URL.
2. GenBank/ENA/DDBJ accessions are recorded **with version** (`ACCESSION.version`) plus database and retrieval date.
3. A sequence's organism label is the submitter's identification — flag when it conflicts with LUMM's name
   (common for ITS in fungi). ITS is the fungal barcode (Schoch et al. 2012, doi:10.1073/pnas.1117018109).
4. Distinguish **record counts** (what LUMM shows) from verified sequences of the taxon; do not present counts as
   evidence of identity or of pathway genes.
5. Pathway genes (HispS, H3H, Luz, CPH, NpgA — `guidance.sec6`): a GenBank accession is valid for a species **only**
   if the sequence was obtained from **that species**, never from a related reference organism. Cite the source paper;
   gene presence in a genome ≠ confirmed luminescence (see `fungal-bioluminescence`). These accession fields exist in
   the guidance text but **not** in the data model — flag the gap; do not store accessions in free text.
6. The NCBI Taxonomy ID is the anchor for the molecular section (`guidance.sec6`): it drives the Entrez links.
7. When the model has no field for a needed identifier or reference, **flag the missing information**; never infer or fill it.

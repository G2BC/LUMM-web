import type { CreateSpeciesPayload } from "@/api/species";
import { buildSpeciesCreatePayload } from "../species-edit/utils";
import type { SpeciesCreateFormValues } from "./types";

function toOptionalInteger(value: string): number | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isInteger(parsed) ? parsed : undefined;
}

export function buildCreateSpeciesPayload(values: SpeciesCreateFormValues): CreateSpeciesPayload {
  const basePayload = buildSpeciesCreatePayload(values);
  const scientificName = values.scientific_name.trim();

  return {
    ...basePayload,
    type_country: basePayload.type_country ?? undefined,
    ...(scientificName ? { scientific_name: scientificName } : {}),
    ncbi_taxonomy_id: toOptionalInteger(values.ncbi_taxonomy_id),
    inaturalist_taxon_id: toOptionalInteger(values.inaturalist_taxon_id),
    unite_taxon_id: toOptionalInteger(values.unite_taxon_id),
    iucn_redlist: toOptionalInteger(values.iucn_redlist),
  };
}

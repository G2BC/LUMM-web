import type { TFunction } from "i18next";
import { z } from "zod";
import { createSpeciesEditSchema } from "../species-edit/schema";

export function createSpeciesCreateSchema(t: TFunction) {
  const baseSchema = createSpeciesEditSchema(t);
  const optionalIntegerStringSchema = z.string().refine((value) => {
    const normalized = value.trim();
    if (!normalized) return true;
    return /^\d+$/.test(normalized);
  }, t("panel_page.species_create_validation_integer_id"));

  const createSchema = z.object({
    scientific_name: z
      .string()
      .trim()
      .min(1, t("panel_page.species_create_validation_scientific_name")),
    ncbi_taxonomy_id: optionalIntegerStringSchema,
    inaturalist_taxon_id: optionalIntegerStringSchema,
    unite_taxon_id: optionalIntegerStringSchema,
    iucn_redlist: optionalIntegerStringSchema,
  });

  return z.intersection(baseSchema, createSchema);
}

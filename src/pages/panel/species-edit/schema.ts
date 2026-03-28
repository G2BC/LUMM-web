import { z } from "zod";
import type { TFunction } from "i18next";
import { SPECIES_LINEAGE_OPTIONS } from "./constants";
import { BOOLEAN_FORM_VALUES, TRI_STATE_FORM_VALUES } from "./types";

export function createSpeciesEditSchema(t: TFunction) {
  const triStateFieldSchema = z.enum(TRI_STATE_FORM_VALUES);
  const booleanFieldSchema = z.enum(BOOLEAN_FORM_VALUES);
  const monthFieldSchema = z.string().refine((value) => {
    const normalized = value.trim();
    if (!normalized) return true;

    const month = Number(normalized);
    return Number.isInteger(month) && month >= 1 && month <= 12;
  }, t("panel_page.species_edit_validation_season_month"));

  return z
    .object({
      lineage: z
        .string()
        .min(1, t("panel_page.species_edit_validation_lineage"))
        .refine(
          (value) =>
            SPECIES_LINEAGE_OPTIONS.includes(value as (typeof SPECIES_LINEAGE_OPTIONS)[number]),
          t("panel_page.species_edit_validation_lineage")
        ),
      is_visible: booleanFieldSchema,
      mycobank_index_fungorum_id: z.string(),
      family: z.string(),
      size_cm: z
        .string()
        .refine(
          (value) =>
            value.trim() === "" ||
            (/^\d+([.,]\d+)?$/.test(value) && Number(value.replace(",", ".")) > 0),
          t("panel_page.species_edit_validation_size_cm")
        ),
      season_start_month: monthFieldSchema,
      season_end_month: monthFieldSchema,
      edible: triStateFieldSchema,
      similar_species_ids: z.array(z.number()).catch([]),
      growth_forms: z.array(z.number()).catch([]),
      nutrition_modes: z.array(z.number()).catch([]),
      substrates: z.array(z.number()).catch([]),
      habitats: z.array(z.number()).catch([]),
      colors_pt: z.string(),
      colors: z.string(),
      cultivation_pt: z.string(),
      cultivation: z.string(),
      finding_tips_pt: z.string(),
      finding_tips: z.string(),
      nearby_trees_pt: z.string(),
      nearby_trees: z.string(),
      curiosities_pt: z.string(),
      curiosities: z.string(),
      general_description_pt: z.string(),
      general_description: z.string(),
      ncbi_taxonomy_id: z.string(),
      conservation_status: z.string(),
      iucn_redlist: z.string(),
      lum_mycelium: triStateFieldSchema,
      lum_basidiome: triStateFieldSchema,
      lum_stipe: triStateFieldSchema,
      lum_pileus: triStateFieldSchema,
      lum_lamellae: triStateFieldSchema,
      lum_spores: triStateFieldSchema,
    })
    .superRefine((value, context) => {
      const start = value.season_start_month?.trim();
      const end = value.season_end_month?.trim();

      if ((start && !end) || (!start && end)) {
        context.addIssue({
          code: "custom",
          path: ["season_start_month"],
          message: t("panel_page.species_edit_validation_season_range"),
        });
        context.addIssue({
          code: "custom",
          path: ["season_end_month"],
          message: t("panel_page.species_edit_validation_season_range"),
        });
      }
    });
}

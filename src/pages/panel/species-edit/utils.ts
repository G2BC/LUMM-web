import type { ISpecie } from "@/api/species/types/ISpecie";
import type { UpdateSpeciesPayload } from "@/api/species";
import type { TFunction } from "i18next";
import {
  EDITABLE_PENDING_FIELDS,
  LUMINESCENT_FIELDS,
  SPECIES_EDIT_FORM_INITIAL_VALUES,
} from "./constants";
import type {
  BooleanFormValue,
  LuminescentRow,
  PendingFieldChange,
  SpeciesEditFieldConfig,
  SpeciesEditFormValues,
  SpeciesEditOption,
  TriStateFormValue,
} from "./types";

export function toTriStateFormValue(value: boolean | null | undefined): TriStateFormValue {
  if (value === true) return "true";
  if (value === false) return "false";
  return "unknown";
}

function toBooleanFormValue(value: boolean | null | undefined): BooleanFormValue {
  return value === true ? "true" : "false";
}

export function createSpeciesEditFormDefaults(speciesData: ISpecie): SpeciesEditFormValues {
  const lumMycelium =
    speciesData.lum_mycelium ?? speciesData.species_characteristics?.lum_mycelium ?? null;
  const lumBasidiome =
    speciesData.lum_basidiome ?? speciesData.species_characteristics?.lum_basidiome ?? null;
  const lumStipe = speciesData.lum_stipe ?? speciesData.species_characteristics?.lum_stipe ?? null;
  const lumPileus =
    speciesData.lum_pileus ?? speciesData.species_characteristics?.lum_pileus ?? null;
  const lumLamellae =
    speciesData.lum_lamellae ?? speciesData.species_characteristics?.lum_lamellae ?? null;
  const lumSpores =
    speciesData.lum_spores ?? speciesData.species_characteristics?.lum_spores ?? null;
  const similarSpeciesIdsFromCharacteristics = (
    speciesData.species_characteristics?.similar_species ?? []
  )
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));
  const similarSpeciesIdsFromTopLevel = (speciesData.similar_species ?? [])
    .map((item) => Number(item.id))
    .filter((value) => Number.isFinite(value));

  return {
    lineage: speciesData.lineage ?? "",
    is_visible: toBooleanFormValue(speciesData.is_visible),
    mycobank_index_fungorum_id: speciesData.mycobank_index_fungorum_id ?? "",
    family: speciesData.family ?? "",
    size_cm: String(speciesData.species_characteristics?.size_cm ?? ""),
    season_start_month:
      speciesData.species_characteristics?.season_start_month === null ||
      speciesData.species_characteristics?.season_start_month === undefined
        ? ""
        : String(speciesData.species_characteristics?.season_start_month),
    season_end_month:
      speciesData.species_characteristics?.season_end_month === null ||
      speciesData.species_characteristics?.season_end_month === undefined
        ? ""
        : String(speciesData.species_characteristics?.season_end_month),
    edible: toTriStateFormValue(speciesData.species_characteristics?.edible),
    similar_species_ids:
      similarSpeciesIdsFromCharacteristics.length > 0
        ? similarSpeciesIdsFromCharacteristics
        : similarSpeciesIdsFromTopLevel,
    growth_forms: (speciesData.species_characteristics?.growth_forms ?? []).map((item) => item.id),
    nutrition_modes: (speciesData.species_characteristics?.nutrition_modes ?? []).map(
      (item) => item.id
    ),
    substrates: (speciesData.species_characteristics?.substrates ?? []).map((item) => item.id),
    habitats: (speciesData.species_characteristics?.habitats ?? []).map((item) => item.id),
    colors_pt: speciesData.species_characteristics?.colors_pt ?? "",
    colors: speciesData.species_characteristics?.colors ?? "",
    cultivation_pt: speciesData.species_characteristics?.cultivation_pt ?? "",
    cultivation: speciesData.species_characteristics?.cultivation ?? "",
    finding_tips_pt: speciesData.species_characteristics?.finding_tips_pt ?? "",
    finding_tips: speciesData.species_characteristics?.finding_tips ?? "",
    nearby_trees_pt: speciesData.species_characteristics?.nearby_trees_pt ?? "",
    nearby_trees: speciesData.species_characteristics?.nearby_trees ?? "",
    curiosities_pt: speciesData.species_characteristics?.curiosities_pt ?? "",
    curiosities: speciesData.species_characteristics?.curiosities ?? "",
    general_description_pt: speciesData.species_characteristics?.general_description_pt ?? "",
    general_description: speciesData.species_characteristics?.general_description ?? "",
    ncbi_taxonomy_id:
      speciesData.ncbi_taxonomy_id === null || speciesData.ncbi_taxonomy_id === undefined
        ? ""
        : String(speciesData.ncbi_taxonomy_id),
    inaturalist_taxon_id:
      speciesData.inaturalist_taxon_id === null || speciesData.inaturalist_taxon_id === undefined
        ? ""
        : String(speciesData.inaturalist_taxon_id),
    conservation_status:
      speciesData.species_characteristics?.conservation_status === null ||
      speciesData.species_characteristics?.conservation_status === undefined
        ? ""
        : String(speciesData.species_characteristics?.conservation_status),
    iucn_redlist:
      speciesData.iucn_redlist === null || speciesData.iucn_redlist === undefined
        ? ""
        : String(speciesData.iucn_redlist),
    lum_mycelium: toTriStateFormValue(lumMycelium),
    lum_basidiome: toTriStateFormValue(lumBasidiome),
    lum_stipe: toTriStateFormValue(lumStipe),
    lum_pileus: toTriStateFormValue(lumPileus),
    lum_lamellae: toTriStateFormValue(lumLamellae),
    lum_spores: toTriStateFormValue(lumSpores),
  };
}

export function buildPendingFieldChanges(
  values: SpeciesEditFormValues,
  originalValues: SpeciesEditFormValues
): PendingFieldChange[] {
  return EDITABLE_PENDING_FIELDS.reduce<PendingFieldChange[]>((changes, fieldConfig) => {
    const nextValue = String(values[fieldConfig.name] ?? "");
    const previousValue = String(originalValues[fieldConfig.name] ?? "");

    if (nextValue !== previousValue) {
      changes.push({ name: fieldConfig.name, value: nextValue, labelKey: fieldConfig.labelKey });
    }

    return changes;
  }, []);
}

function toTriStateApiValue(value: TriStateFormValue): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function toBooleanApiValue(value: BooleanFormValue): boolean {
  return value === "true";
}

function normalizeIdArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(value.map((item) => Number(item)).filter((item) => Number.isFinite(item)))
  ).sort((a, b) => a - b);
}

function parseOptionalNumber(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) return null;
  const parsed = Number(normalized.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalMonth(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNullableText(value: string): string | null {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeForCompare(name: SpeciesEditFieldConfig["name"], value: unknown): unknown {
  if (
    name === "growth_forms" ||
    name === "nutrition_modes" ||
    name === "substrates" ||
    name === "habitats" ||
    name === "similar_species_ids"
  ) {
    return normalizeIdArray(value);
  }

  if (
    name === "lum_mycelium" ||
    name === "lum_basidiome" ||
    name === "lum_stipe" ||
    name === "lum_pileus" ||
    name === "lum_lamellae" ||
    name === "lum_spores" ||
    name === "edible"
  ) {
    return toTriStateApiValue(String(value ?? "") as TriStateFormValue);
  }

  if (name === "is_visible") {
    return toBooleanApiValue(String(value ?? "false") as BooleanFormValue);
  }

  if (name === "size_cm") {
    return parseOptionalNumber(String(value ?? ""));
  }

  if (name === "season_start_month" || name === "season_end_month") {
    return parseOptionalMonth(String(value ?? ""));
  }

  if (name === "lineage") {
    return String(value ?? "").trim();
  }

  return toNullableText(String(value ?? ""));
}

function toApiFieldValue(name: SpeciesEditFieldConfig["name"], value: unknown): unknown {
  return normalizeForCompare(name, value);
}

export function buildSpeciesUpdatePayload(
  values: SpeciesEditFormValues,
  originalValues: SpeciesEditFormValues
): UpdateSpeciesPayload {
  const payload: Record<string, unknown> = {};

  EDITABLE_PENDING_FIELDS.forEach((fieldConfig) => {
    const fieldName = fieldConfig.name;
    const nextComparable = normalizeForCompare(fieldName, values[fieldName]);
    const previousComparable = normalizeForCompare(fieldName, originalValues[fieldName]);

    if (JSON.stringify(nextComparable) === JSON.stringify(previousComparable)) {
      return;
    }

    payload[fieldName] = toApiFieldValue(fieldName, values[fieldName]);
  });

  return payload as UpdateSpeciesPayload;
}

export function buildSpeciesCreatePayload(values: SpeciesEditFormValues): UpdateSpeciesPayload {
  return {
    ...buildSpeciesUpdatePayload(values, SPECIES_EDIT_FORM_INITIAL_VALUES),
    is_visible: toBooleanApiValue(values.is_visible),
  };
}

export function getLuminescentLevelClass(level: 0 | 1 | 2) {
  if (level === 1) return "pl-8";
  if (level === 2) return "pl-14";
  return "";
}

export function getTriStateValueLabel(value: string, t: TFunction) {
  if (value === "true") return t("species_page.lumm.yes");
  if (value === "false") return t("species_page.lumm.no");
  return t("species_page.fields.no_information");
}

export function getLuminescenceStatusPillClass(value: string) {
  if (value === "true") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (value === "false") return "border-rose-200 bg-rose-50 text-rose-800";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function resolveOptionLabel(option: SpeciesEditOption, t: TFunction) {
  return option.isLabelKey ? t(option.label) : option.label;
}

export function getFieldDisplayValue(
  fieldConfig: SpeciesEditFieldConfig,
  fieldValue: string,
  t: TFunction
) {
  if (fieldConfig.inputType !== "select") {
    return fieldValue || t("panel_page.species_edit_empty_value");
  }

  const selectedOption = fieldConfig.options?.find((option) => option.value === fieldValue);
  if (!selectedOption) return t("panel_page.species_edit_empty_value");

  return resolveOptionLabel(selectedOption, t);
}

export function buildLuminescentRows(speciesData: ISpecie, t: TFunction): LuminescentRow[] {
  return LUMINESCENT_FIELDS.map((field) => {
    const topLevelValue = speciesData[field.key];
    const characteristicsValue = speciesData.species_characteristics?.[field.key];
    const value = topLevelValue ?? characteristicsValue ?? null;
    const statusValue: TriStateFormValue =
      value === true ? "true" : value === false ? "false" : "unknown";

    return {
      ...field,
      statusValue,
      valueLabel: getTriStateValueLabel(statusValue, t),
    };
  });
}

function getLocalizedOptionLabels(
  options: Array<{ label_pt: string; label_en: string }> | null | undefined,
  isPtLanguage: boolean
) {
  if (!options?.length) return "";

  return options
    .map((item) => (isPtLanguage ? item.label_pt : item.label_en))
    .filter(Boolean)
    .join(", ");
}

export function buildDomainViewValueMap(speciesData: ISpecie, isPtLanguage: boolean) {
  const similarSpeciesFromCharacteristics = (
    speciesData.species_characteristics?.similar_species ?? []
  )
    .map((item) => item.label || item.name || "")
    .filter(Boolean)
    .join(", ");
  const similarSpeciesFromTopLevel = (speciesData.similar_species ?? [])
    .map((item) => item.name || item.label || "")
    .filter(Boolean)
    .join(", ");

  return {
    similar_species_ids: similarSpeciesFromCharacteristics || similarSpeciesFromTopLevel,
    growth_forms: getLocalizedOptionLabels(
      speciesData.species_characteristics?.growth_forms,
      isPtLanguage
    ),
    nutrition_modes: getLocalizedOptionLabels(
      speciesData.species_characteristics?.nutrition_modes,
      isPtLanguage
    ),
    substrates: getLocalizedOptionLabels(
      speciesData.species_characteristics?.substrates,
      isPtLanguage
    ),
    habitats: getLocalizedOptionLabels(speciesData.species_characteristics?.habitats, isPtLanguage),
  };
}

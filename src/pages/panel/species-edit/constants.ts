import type { LuminescentFieldConfig, PendingFieldConfig, SpeciesEditFieldConfig } from "./types";
import type { BooleanFormValue, SpeciesEditFormValues, TriStateFormValue } from "./types";

export const SPECIES_LINEAGE_OPTIONS = [
  "Lucentipes",
  "Armillaria",
  "Eoscyphella",
  "Omphalotus",
  "Mycenoid",
] as const;

export const TRISTATE_SELECT_OPTIONS: Array<{ value: TriStateFormValue; labelKey: string }> = [
  { value: "unknown", labelKey: "species_page.fields.no_information" },
  { value: "true", labelKey: "species_page.lumm.yes" },
  { value: "false", labelKey: "species_page.lumm.no" },
];

export const BOOLEAN_SELECT_OPTIONS: Array<{ value: BooleanFormValue; labelKey: string }> = [
  { value: "true", labelKey: "species_page.lumm.yes" },
  { value: "false", labelKey: "species_page.lumm.no" },
];

export const SPECIES_EDIT_FIELDS: SpeciesEditFieldConfig[] = [
  {
    name: "lineage",
    labelKey: "panel_page.species_edit_field_lineage",
    placeholderKey: "panel_page.species_edit_lineage_placeholder",
    inputType: "select",
    options: SPECIES_LINEAGE_OPTIONS.map((value) => ({ value, label: value })),
  },
  {
    name: "is_visible",
    labelKey: "panel_page.species_edit_field_is_visible",
    placeholderKey: "panel_page.species_edit_is_visible_placeholder",
    inputType: "select",
    options: BOOLEAN_SELECT_OPTIONS.map((option) => ({
      value: option.value,
      label: option.labelKey,
      isLabelKey: true,
    })),
  },
  {
    name: "mycobank_index_fungorum_id",
    labelKey: "panel_page.species_edit_field_mycobank_id",
    placeholderKey: "panel_page.species_edit_mycobank_id_placeholder",
    inputType: "text",
  },
  {
    name: "inaturalist_taxon_id",
    labelKey: "panel_page.species_edit_field_inaturalist_taxon_id",
    placeholderKey: "panel_page.species_create_inaturalist_taxon_id_placeholder",
    inputType: "text",
  },
  {
    name: "unite_taxon_id",
    labelKey: "panel_page.species_edit_field_unite_taxon_id",
    placeholderKey: "panel_page.species_create_unite_taxon_id_placeholder",
    inputType: "text",
  },
  {
    name: "size_cm",
    labelKey: "panel_page.species_edit_field_size_cm",
    placeholderKey: "panel_page.species_edit_size_cm_placeholder",
    inputType: "number",
  },
  {
    name: "cultivation_possible",
    labelKey: "panel_page.species_edit_field_cultivation_possible",
    placeholderKey: "panel_page.species_edit_cultivation_possible_placeholder",
    inputType: "select",
    fullWidth: true,
    options: TRISTATE_SELECT_OPTIONS.map((option) => ({
      value: option.value,
      label: option.labelKey,
      isLabelKey: true,
    })),
  },
  {
    name: "edible",
    labelKey: "panel_page.species_edit_field_edible",
    placeholderKey: "panel_page.species_edit_edible_placeholder",
    inputType: "select",
    fullWidth: true,
    options: TRISTATE_SELECT_OPTIONS.map((option) => ({
      value: option.value,
      label: option.labelKey,
      isLabelKey: true,
    })),
  },
  {
    name: "type_country",
    labelKey: "panel_page.species_edit_field_type_country",
    placeholderKey: "panel_page.species_create_type_country_placeholder",
    inputType: "country-select",
  },
  {
    name: "distributions",
    labelKey: "panel_page.species_edit_field_distributions",
    placeholderKey: "panel_page.species_edit_domain_multi_placeholder",
    inputType: "distribution-multi-async",
  },
  {
    name: "season_start_month",
    labelKey: "panel_page.species_edit_field_season_start_month",
    placeholderKey: "panel_page.species_edit_season_start_month_placeholder",
    inputType: "select",
  },
  {
    name: "season_end_month",
    labelKey: "panel_page.species_edit_field_season_end_month",
    placeholderKey: "panel_page.species_edit_season_end_month_placeholder",
    inputType: "select",
  },
  {
    name: "growth_forms",
    labelKey: "panel_page.species_edit_field_growth_forms",
    placeholderKey: "panel_page.species_edit_domain_multi_placeholder",
    inputType: "domain-multi-async",
    domain: "growth_form",
  },
  {
    name: "nutrition_modes",
    labelKey: "panel_page.species_edit_field_nutrition_modes",
    placeholderKey: "panel_page.species_edit_domain_multi_placeholder",
    inputType: "domain-multi-async",
    domain: "nutrition_mode",
  },
  {
    name: "substrates",
    labelKey: "panel_page.species_edit_field_substrates",
    placeholderKey: "panel_page.species_edit_domain_multi_placeholder",
    inputType: "domain-multi-async",
    domain: "substrate",
  },
  {
    name: "decay_types",
    labelKey: "panel_page.species_edit_field_decay_types",
    placeholderKey: "panel_page.species_edit_domain_multi_placeholder",
    inputType: "domain-multi-async",
    domain: "decay_type",
  },
  {
    name: "habitats",
    labelKey: "panel_page.species_edit_field_habitats",
    placeholderKey: "panel_page.species_edit_domain_multi_placeholder",
    inputType: "domain-multi-async",
    domain: "habitat",
  },
  {
    name: "similar_species_ids",
    labelKey: "panel_page.species_edit_field_similar_species",
    placeholderKey: "panel_page.species_edit_similar_species_placeholder",
    inputType: "species-multi-async",
    fullWidth: true,
  },
  {
    name: "colors_pt",
    labelKey: "panel_page.species_edit_field_colors_pt",
    placeholderKey: "panel_page.species_edit_colors_pt_placeholder",
    inputType: "textarea",
    rows: 2,
  },
  {
    name: "colors",
    labelKey: "panel_page.species_edit_field_colors",
    placeholderKey: "panel_page.species_edit_colors_placeholder",
    inputType: "textarea",
    rows: 2,
  },
  {
    name: "cultivation_pt",
    labelKey: "panel_page.species_edit_field_cultivation_pt",
    placeholderKey: "panel_page.species_edit_cultivation_pt_placeholder",
    inputType: "textarea",
    rows: 3,
  },
  {
    name: "cultivation",
    labelKey: "panel_page.species_edit_field_cultivation",
    placeholderKey: "panel_page.species_edit_cultivation_placeholder",
    inputType: "textarea",
    rows: 3,
  },
  {
    name: "finding_tips_pt",
    labelKey: "panel_page.species_edit_field_finding_tips_pt",
    placeholderKey: "panel_page.species_edit_finding_tips_pt_placeholder",
    inputType: "textarea",
    rows: 3,
  },
  {
    name: "finding_tips",
    labelKey: "panel_page.species_edit_field_finding_tips",
    placeholderKey: "panel_page.species_edit_finding_tips_placeholder",
    inputType: "textarea",
    rows: 3,
  },
  {
    name: "nearby_trees_pt",
    labelKey: "panel_page.species_edit_field_nearby_trees_pt",
    placeholderKey: "panel_page.species_edit_nearby_trees_pt_placeholder",
    inputType: "textarea",
    rows: 2,
  },
  {
    name: "nearby_trees",
    labelKey: "panel_page.species_edit_field_nearby_trees",
    placeholderKey: "panel_page.species_edit_nearby_trees_placeholder",
    inputType: "textarea",
    rows: 2,
  },
  {
    name: "curiosities_pt",
    labelKey: "panel_page.species_edit_field_curiosities_pt",
    placeholderKey: "panel_page.species_edit_curiosities_pt_placeholder",
    inputType: "textarea",
    rows: 3,
  },
  {
    name: "curiosities",
    labelKey: "panel_page.species_edit_field_curiosities",
    placeholderKey: "panel_page.species_edit_curiosities_placeholder",
    inputType: "textarea",
    rows: 3,
  },
  {
    name: "general_description_pt",
    labelKey: "panel_page.species_edit_field_general_description_pt",
    placeholderKey: "panel_page.species_edit_general_description_pt_placeholder",
    inputType: "textarea",
    rows: 4,
  },
  {
    name: "general_description",
    labelKey: "panel_page.species_edit_field_general_description",
    placeholderKey: "panel_page.species_edit_general_description_placeholder",
    inputType: "textarea",
    rows: 4,
  },
  {
    name: "ncbi_taxonomy_id",
    labelKey: "panel_page.species_edit_field_ncbi_taxonomy_id",
    placeholderKey: "panel_page.species_create_ncbi_taxonomy_id_placeholder",
    inputType: "text",
  },
];

export const EDITABLE_SPECIES_EDIT_FIELDS = SPECIES_EDIT_FIELDS.filter(
  (field) => !field.detailOnly
);

export const LUMINESCENT_FIELDS: LuminescentFieldConfig[] = [
  { key: "lum_mycelium", labelKey: "species_page.lumm.mycelium", level: 0 },
  { key: "lum_basidiome", labelKey: "species_page.lumm.basidiome", level: 0 },
  { key: "lum_stipe", labelKey: "species_page.lumm.stipe", level: 1 },
  { key: "lum_pileus", labelKey: "species_page.lumm.pileus", level: 1 },
  { key: "lum_lamellae", labelKey: "species_page.lumm.lamellae", level: 2 },
  { key: "lum_spores", labelKey: "species_page.lumm.spores", level: 2 },
];

export const EDITABLE_PENDING_FIELDS: PendingFieldConfig[] = [
  ...EDITABLE_SPECIES_EDIT_FIELDS.map((field) => ({ name: field.name, labelKey: field.labelKey })),
  ...LUMINESCENT_FIELDS.map((field) => ({ name: field.key, labelKey: field.labelKey })),
];

export const SPECIES_EDIT_FORM_INITIAL_VALUES: SpeciesEditFormValues = {
  lineage: "",
  is_visible: "false",
  mycobank_index_fungorum_id: "",
  family: "",
  size_cm: "",
  season_start_month: "",
  season_end_month: "",
  edible: "unknown",
  similar_species_ids: [],
  growth_forms: [],
  nutrition_modes: [],
  substrates: [],
  decay_types: [],
  habitats: [],
  colors_pt: "",
  colors: "",
  cultivation_pt: "",
  cultivation: "",
  finding_tips_pt: "",
  finding_tips: "",
  nearby_trees_pt: "",
  nearby_trees: "",
  curiosities_pt: "",
  curiosities: "",
  general_description_pt: "",
  general_description: "",
  ncbi_taxonomy_id: "",
  inaturalist_taxon_id: "",
  unite_taxon_id: "",
  cultivation_possible: "unknown",
  conservation_status: "",
  iucn_redlist: "",
  type_country: "",
  distributions: [],
  lum_mycelium: "unknown",
  lum_basidiome: "unknown",
  lum_stipe: "unknown",
  lum_pileus: "unknown",
  lum_lamellae: "unknown",
  lum_spores: "unknown",
};

export const DETAIL_VALUE_TEXT_CLASS = "text-sm leading-6 font-normal text-slate-900";

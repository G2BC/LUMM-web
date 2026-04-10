import type { SpeciesDomainSelectType } from "@/api/species";

export const TRI_STATE_FORM_VALUES = ["unknown", "true", "false"] as const;
export const BOOLEAN_FORM_VALUES = ["true", "false"] as const;

export type TriStateFormValue = (typeof TRI_STATE_FORM_VALUES)[number];
export type BooleanFormValue = (typeof BOOLEAN_FORM_VALUES)[number];

export type SpeciesEditFormValues = {
  lineage: string;
  is_visible: BooleanFormValue;
  mycobank_index_fungorum_id: string;
  family: string;
  size_cm: string;
  season_start_month: string;
  season_end_month: string;
  edible: TriStateFormValue;
  similar_species_ids: number[];
  growth_forms: number[];
  nutrition_modes: number[];
  substrates: number[];
  habitats: number[];
  colors_pt: string;
  colors: string;
  cultivation_pt: string;
  cultivation: string;
  finding_tips_pt: string;
  finding_tips: string;
  nearby_trees_pt: string;
  nearby_trees: string;
  curiosities_pt: string;
  curiosities: string;
  general_description_pt: string;
  general_description: string;
  ncbi_taxonomy_id: string;
  inaturalist_taxon_id: string;
  conservation_status: string;
  iucn_redlist: string;
  type_country: string;
  distributions: number[];
  lum_mycelium: TriStateFormValue;
  lum_basidiome: TriStateFormValue;
  lum_stipe: TriStateFormValue;
  lum_pileus: TriStateFormValue;
  lum_lamellae: TriStateFormValue;
  lum_spores: TriStateFormValue;
};

export type SpeciesEditFieldName = keyof SpeciesEditFormValues;

export type SpeciesEditOption = {
  value: string;
  label: string;
  isLabelKey?: boolean;
};

export type SpeciesEditFieldConfig = {
  name: SpeciesEditFieldName;
  labelKey: string;
  placeholderKey: string;
  inputType:
    | "text"
    | "textarea"
    | "select"
    | "number"
    | "domain-multi-async"
    | "species-multi-async"
    | "country-select"
    | "distribution-multi-async";
  domain?: SpeciesDomainSelectType;
  options?: SpeciesEditOption[];
  rows?: number;
  fullWidth?: boolean;
  detailOnly?: boolean;
};

export type PendingFieldChange = {
  name: SpeciesEditFieldName;
  value: string;
  labelKey: string;
};

export type LuminescentFieldKey =
  | "lum_mycelium"
  | "lum_basidiome"
  | "lum_stipe"
  | "lum_pileus"
  | "lum_lamellae"
  | "lum_spores";

export type LuminescentFieldConfig = {
  key: LuminescentFieldKey;
  labelKey: string;
  level: 0 | 1 | 2;
};

export type PendingFieldConfig = {
  name: SpeciesEditFieldName;
  labelKey: string;
};

export type LuminescentRow = LuminescentFieldConfig & {
  statusValue: TriStateFormValue;
  valueLabel: string;
};

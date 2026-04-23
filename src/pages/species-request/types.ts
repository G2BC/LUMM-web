import type { LuminescentPartId } from "@/pages/species-request/constants";

export type LuminescentPartAction = "none" | "add" | "remove";
export type LuminescentPartsForm = Record<LuminescentPartId, LuminescentPartAction>;

export type SpeciesRequestFormValues = {
  requester_name: string;
  requester_email: string;
  requester_institution?: string;
  request_note?: string;
  references_raw?: string;
  colors?: string;
  cultivation_possible?: string;
  cultivation?: string;
  finding_tips?: string;
  nearby_trees?: string;
  curiosities?: string;
  general_description?: string;
  size_cm?: string;
  season_start_month?: string;
  season_end_month?: string;
  growth_forms: number[];
  nutrition_modes: number[];
  substrates: number[];
  decay_types: number[];
  habitats: number[];
  luminescent_parts: LuminescentPartsForm;
};

export type PhotoLegalForm = {
  license_code: string;
  attribution: string;
  rights_holder: string;
  source_url: string;
  lumm: boolean;
  declaration_confirmed: boolean;
};

export type PhotoLegalErrors = Partial<
  Record<
    "license_code" | "attribution" | "rights_holder" | "source_url" | "declaration_confirmed",
    string
  >
>;

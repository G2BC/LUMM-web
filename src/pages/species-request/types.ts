import type { LuminescentPartId } from "@/pages/species-request/constants";

export type LuminescentPartAction = "none" | "add" | "remove";
export type LuminescentPartsForm = Record<LuminescentPartId, LuminescentPartAction>;

export type SpeciesRequestFormValues = {
  requester_name: string;
  requester_email: string;
  requester_institution?: string;
  request_note?: string;
  type_country?: string;
  lineage?: string;
  family?: string;
  references_raw?: string;
  luminescent_parts: LuminescentPartsForm;
};

export type PhotoLegalForm = {
  license_code: string;
  attribution: string;
  rights_holder: string;
  source_url: string;
  declaration_confirmed: boolean;
};

export type PhotoLegalErrors = Partial<
  Record<
    "license_code" | "attribution" | "rights_holder" | "source_url" | "declaration_confirmed",
    string
  >
>;

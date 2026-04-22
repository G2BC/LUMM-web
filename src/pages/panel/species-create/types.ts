import type { SpeciesEditFormValues } from "../species-edit/types";

export type SpeciesCreateFormValues = SpeciesEditFormValues & {
  scientific_name: string;
};

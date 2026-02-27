export const SPECIES_REQUEST_STEPS = ["identity", "species", "photos", "review"] as const;

export const PHOTO_LICENSE_OPTIONS = [
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "CC-BY-NC-4.0",
  "CC0-1.0",
  "ALL-RIGHTS-RESERVED",
] as const;

export const LUMINESCENT_PART_OPTIONS = [
  { id: "mycelium", proposedField: "lum_mycelium", labelKey: "species_request.lum_part_mycelium" },
  {
    id: "basidiome",
    proposedField: "lum_basidiome",
    labelKey: "species_request.lum_part_basidiome",
  },
  { id: "stipe", proposedField: "lum_stipe", labelKey: "species_request.lum_part_stipe" },
  { id: "pileus", proposedField: "lum_pileus", labelKey: "species_request.lum_part_pileus" },
  { id: "lamellae", proposedField: "lum_lamellae", labelKey: "species_request.lum_part_lamellae" },
  { id: "spores", proposedField: "lum_spores", labelKey: "species_request.lum_part_spores" },
] as const;

export type LuminescentPartId = (typeof LUMINESCENT_PART_OPTIONS)[number]["id"];

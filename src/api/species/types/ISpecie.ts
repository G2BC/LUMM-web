import type { IDistribution } from "@/api/types/IDistribution";
import type { IReference } from "@/api/types/IReference";

interface Taxonomy {
  authors: string;
  classification: string;
  gender: string | null;
  synonyms: string;
  basionym: string | null;
  years_of_effective_publication: string;
}

export interface SpeciesLocalizedOption {
  id: number;
  label_en: string;
  label_pt: string;
}

export interface SpeciesSimpleOption {
  id: number;
  label?: string;
  name?: string;
}

export interface SpeciesTopLevelSimpleOption {
  id: number | string;
  name: string;
  label?: string;
}

export interface SpeciesCharacteristics {
  colors?: string | null;
  colors_pt?: string | null;
  conservation_status?: string | null;
  cultivation?: string | null;
  cultivation_pt?: string | null;
  curiosities?: string | null;
  curiosities_pt?: string | null;
  edible?: boolean | null;
  finding_tips?: string | null;
  finding_tips_pt?: string | null;
  general_description?: string | null;
  general_description_pt?: string | null;
  growth_forms?: SpeciesLocalizedOption[];
  habitats?: SpeciesLocalizedOption[];
  lum_mycelium?: boolean | null;
  lum_basidiome?: boolean | null;
  lum_stipe?: boolean | null;
  lum_pileus?: boolean | null;
  lum_lamellae?: boolean | null;
  lum_spores?: boolean | null;
  nearby_trees?: string | null;
  nearby_trees_pt?: string | null;
  nutrition_modes?: SpeciesLocalizedOption[];
  season_end_month?: number | null;
  season_start_month?: number | null;
  similar_species?: SpeciesSimpleOption[];
  size_cm?: number | null;
  species_id?: number;
  substrates?: SpeciesLocalizedOption[];
  cultivation_possible: boolean | null;
  iucn_assessment_url: string | null;
  iucn_assessment_year: string | null;
}

export interface ISpecie {
  id: number;
  lineage: string;
  is_visible?: boolean;
  similar_species?: SpeciesTopLevelSimpleOption[];
  photos: SpeciePhoto[];
  family: string;
  scientific_name: string;
  taxonomy?: Taxonomy;
  species_characteristics?: SpeciesCharacteristics;
  mycobank_type?: string | null;
  mycobank_index_fungorum_id?: string | null;
  lum_mycelium?: boolean | null;
  lum_basidiome?: boolean | null;
  lum_stipe?: boolean | null;
  lum_pileus?: boolean | null;
  lum_lamellae?: boolean | null;
  lum_spores?: boolean | null;
  cultivation_possible?: boolean | null;
  ncbi_taxonomy_id: number | null;
  inaturalist_taxon_id?: string | null;
  unite_taxon_id?: string | null;
  iucn_redlist?: string | null;
  type_country: string | null;
  references: IReference[];
  distributions: IDistribution[];
  section: string | null;
}

export interface SpeciePhoto {
  attribution?: string | null;
  attribution_display?: string | null;
  license_code?: string | null;
  rights_holder?: string | null;
  source_url?: string | null;
  medium_url?: string | null;
  original_url?: string | null;
  photo_id: number;
  lumm: boolean | null;
  featured: boolean | null;
}

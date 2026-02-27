interface Taxonomy {
  authors: string;
  classification: string;
  gender: string | null;
  synonyms: string;
  years_of_effective_publication: string;
}

export interface ISpecie {
  id: number;
  lineage: string;
  photos: SpeciePhoto[];
  family: string;
  scientific_name: string;
  taxonomy: Taxonomy;
  mycobank_type: string | null;
  mycobank_index_fungorum_id: string | null;
  lum_mycelium: boolean | null;
  lum_basidiome: boolean | null;
  lum_stipe: boolean | null;
  lum_pileus: boolean | null;
  lum_lamellae: boolean | null;
  lum_spores: boolean | null;
}

export interface SpeciePhoto {
  attribution: string;
  license_code: string;
  rights_holder?: string | null;
  medium_url?: string;
  original_url?: string;
  photo_id: number;
  lumm: boolean | null;
  featured: boolean | null;
}

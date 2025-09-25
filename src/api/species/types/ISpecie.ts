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
}

export interface SpeciePhoto {
  attribution: string;
  license_code: string;
  medium_url?: string;
  original_url?: string;
  photo_id: number;
  lumm: boolean | null;
  featured: boolean | null;
}

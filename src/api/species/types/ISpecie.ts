export interface ISpecie {
  id: number;
  lineage: string;
  photos: SpeciePhoto[];
  scientific_name: string;
}

export interface SpeciePhoto {
  attribution: string;
  license_code: string;
  medium_url?: string;
  original_url?: string;
  photo_id: number;
  lumm: boolean | null;
}

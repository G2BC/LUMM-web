export type SpeciesDirectPhotoUploadUrlRequest = {
  filename: string;
  mime_type: string;
  size_bytes: number;
};

export type SpeciesDirectPhotoUploadUrlResponse = {
  upload_url: string;
  fields: Record<string, string>;
  bucket_name: string;
  object_key: string;
  expires_at: string;
};

export type CreateSpeciesPhotoPayload = {
  object_key: string;
  bucket_name: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  attribution: string;
  license_code: string;
  rights_holder: string;
  source_url?: string;
  featured: boolean;
  lumm: boolean;
};

export type UpdateSpeciesPhotoPayload = {
  license_code?: string | null;
  attribution?: string | null;
  rights_holder?: string | null;
  source_url?: string | null;
  featured?: boolean;
  lumm?: boolean;
};

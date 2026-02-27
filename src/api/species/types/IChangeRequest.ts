import type { IPagination } from "@/api/types/IPagination";

export type SpeciesRequestStatus = "pending" | "approved" | "partial_approved" | "rejected";
export type SpeciesReviewDecision = "approve" | "reject";

export type SpeciesPhotoUploadUrlRequest = {
  filename: string;
  mime_type: string;
  size_bytes: number;
  species_id?: number;
};

export type SpeciesPhotoUploadUrlResponse = {
  upload_url: string;
  fields: Record<string, string>;
  bucket_name: string;
  object_key: string;
  expires_at: string;
};

export type SpeciesPhotoRequestPayload = {
  bucket_name?: string;
  object_key: string;
  caption?: string;
  license_code?: string;
  attribution?: string;
  rights_holder?: string;
  source_url?: string;
  declaration_accepted_at?: string;
};

export type SpeciesChangeRequestCreatePayload = {
  species_id: number;
  proposed_data?: Record<string, unknown>;
  request_note?: string;
  requester_name?: string;
  requester_email?: string;
  requester_institution?: string;
  photos?: SpeciesPhotoRequestPayload[];
};

export type SpeciesPhotoRequest = {
  id: string;
  object_key: string;
  bucket_name?: string | null;
  original_filename?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  caption?: string | null;
  license_code?: string | null;
  attribution?: string | null;
  rights_holder?: string | null;
  source_url?: string | null;
  preview_url?: string | null;
  declaration_accepted_at?: string | null;
  status: SpeciesRequestStatus;
  created_at: string;
};

export type SpeciesChangeRequest = {
  id: string;
  species_id: string;
  requested_by_user_id?: string | null;
  requester_name?: string | null;
  requester_email?: string | null;
  requester_institution?: string | null;
  request_note?: string | null;
  proposed_data: Record<string, unknown>;
  current_data?: Record<string, unknown>;
  status: SpeciesRequestStatus;
  review_note?: string | null;
  reviewed_by_user_id?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
  photos: SpeciesPhotoRequest[];
};

export type SpeciesChangeRequestPagination = {
  items: SpeciesChangeRequest[];
} & IPagination;

export type SpeciesPhotoReviewDecisionPayload = {
  photo_request_id: number;
  decision: SpeciesReviewDecision;
};

export type SpeciesChangeRequestReviewPayload = {
  decision?: SpeciesReviewDecision;
  proposed_data_decision?: SpeciesReviewDecision;
  photos?: SpeciesPhotoReviewDecisionPayload[];
  review_note?: string;
};

export type CleanupTmpUploadsResponse = {
  bucket: string;
  retention_days: number;
  candidates: number;
  deleted: number;
  dry_run: boolean;
};

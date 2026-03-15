import type { AxiosResponse } from "axios";
import { API } from "..";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import type { ISpecie, SpeciePhoto } from "./types/ISpecie";
import type { IPagination } from "../types/IPagination";
import type { ISelect } from "../types/ISelect";
import type { ISelectLocalized } from "../types/ISelectLocalized";
import type {
  CreateSpeciesPhotoPayload,
  SpeciesDirectPhotoUploadUrlRequest,
  SpeciesDirectPhotoUploadUrlResponse,
  UpdateSpeciesPhotoPayload,
} from "./types/ISpeciesPhotoManagement";
import type {
  CleanupTmpUploadsResponse,
  SpeciesChangeRequest,
  SpeciesChangeRequestCreatePayload,
  SpeciesChangeRequestPagination,
  SpeciesChangeRequestReviewPayload,
  SpeciesPhotoUploadUrlRequest,
  SpeciesPhotoUploadUrlResponse,
  SpeciesRequestStatus,
} from "./types/IChangeRequest";

export interface SearchEspeciesProps {
  search?: string;
  lineage?: string;
  country?: string;
  page?: number;
  per_page?: number;
  signal?: AbortController["signal"];
}

export type ISearchEspecies = { items: ISpecie[] } & IPagination;

export const searchEspecies = async ({
  search,
  lineage,
  country,
  page,
  per_page,
  signal,
}: SearchEspeciesProps): Promise<ISearchEspecies> => {
  const resposta: AxiosResponse<ISearchEspecies> = await API.get("/species/list", {
    params: { search, lineage, country, page, per_page },
    signal,
  });

  return resposta.data;
};

export const selectLineage = async (search?: string, signal?: AbortController["signal"]) => {
  const resposta: AxiosResponse<ISelect[]> = await API.get("/species/lineage/select", {
    params: { search },
    signal,
  });

  return resposta.data;
};

export const selectSpeciesCountry = async (search?: string, signal?: AbortController["signal"]) => {
  const resposta: AxiosResponse<ISelect[]> = await API.get("/species/country/select", {
    params: { search },
    signal,
  });

  return resposta.data;
};

export const selectSpeciesFamily = async (search?: string, signal?: AbortController["signal"]) => {
  const resposta: AxiosResponse<ISelect[]> = await API.get("/species/family/select", {
    params: { search },
    signal,
  });

  return resposta.data;
};

export type SpeciesDomainSelectType = "growth_form" | "nutrition_mode" | "substrate" | "habitat";

export const selectSpeciesDomain = async (
  domain: SpeciesDomainSelectType,
  search?: string,
  signal?: AbortController["signal"]
) => {
  const resposta: AxiosResponse<ISelectLocalized[]> = await API.get("/species/domains/select", {
    params: { domain, search },
    signal,
  });

  return resposta.data;
};

export const fetchSpecies = async (species?: string): Promise<ISpecie> => {
  const resposta: AxiosResponse<ISpecie> = await API.get(`/species/${species}`);

  return resposta.data;
};

export const generateSpeciesDirectPhotoUploadUrl = async (
  speciesId: number,
  payload: SpeciesDirectPhotoUploadUrlRequest
): Promise<SpeciesDirectPhotoUploadUrlResponse> => {
  const response = await API.post<SpeciesDirectPhotoUploadUrlResponse>(
    `/species/${speciesId}/photos/upload-url`,
    payload
  );
  return response.data;
};

export const createSpeciesPhoto = async (
  speciesId: number,
  payload: CreateSpeciesPhotoPayload
): Promise<SpeciePhoto> => {
  const response = await API.post<SpeciePhoto>(`/species/${speciesId}/photos`, payload);
  return response.data;
};

export const updateSpeciesPhoto = async (
  speciesId: number,
  photoId: number | string,
  payload: UpdateSpeciesPhotoPayload
): Promise<SpeciePhoto> => {
  const response = await API.patch<SpeciePhoto>(
    `/species/${speciesId}/photos/${encodeURIComponent(String(photoId))}`,
    payload
  );
  return response.data;
};

export const deleteSpeciesPhoto = async (
  speciesId: number,
  photoId: number | string
): Promise<void> => {
  await API.delete(`/species/${speciesId}/photos/${encodeURIComponent(String(photoId))}`);
};

export const fetchSpeciesNcbi = async (
  species?: string,
  signal?: AbortController["signal"]
): Promise<unknown> => {
  return runWithSilencedApiErrors(async () => {
    const response: AxiosResponse<unknown> = await API.get(`/species/${species}/ncbi`, {
      signal,
      timeout: 45_000,
    });
    return response.data;
  });
};

export const generateSpeciesPhotoUploadUrl = async (
  payload: SpeciesPhotoUploadUrlRequest
): Promise<SpeciesPhotoUploadUrlResponse> => {
  const response = await API.post<SpeciesPhotoUploadUrlResponse>(
    "/species/requests/upload-url",
    payload
  );
  return response.data;
};

export const createSpeciesChangeRequest = async (
  payload: SpeciesChangeRequestCreatePayload
): Promise<SpeciesChangeRequest> => {
  const response = await API.post<SpeciesChangeRequest>("/species/requests", payload);
  return response.data;
};

export const listSpeciesChangeRequests = async (params?: {
  status?: SpeciesRequestStatus;
  page?: number;
  per_page?: number;
}): Promise<SpeciesChangeRequestPagination> => {
  const response = await API.get<SpeciesChangeRequestPagination>("/species/requests", { params });
  return response.data;
};

export const reviewSpeciesChangeRequest = async (
  requestId: string,
  payload: SpeciesChangeRequestReviewPayload
): Promise<SpeciesChangeRequest> => {
  const response = await API.patch<SpeciesChangeRequest>(
    `/species/requests/${requestId}/review`,
    payload
  );
  return response.data;
};

export const cleanupTmpSpeciesUploads = async (params?: {
  retention_days?: number;
  dry_run?: boolean;
}): Promise<CleanupTmpUploadsResponse> => {
  const response = await API.post<CleanupTmpUploadsResponse>(
    "/species/requests/cleanup-tmp",
    null,
    {
      params,
    }
  );
  return response.data;
};

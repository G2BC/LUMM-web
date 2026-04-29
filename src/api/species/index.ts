import type { AxiosResponse } from "axios";
import { API } from "..";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import type { ISpecie, SpeciePhoto } from "./types/ISpecie";
import type { IReference } from "../types/IReference";
import type { IPagination } from "../types/IPagination";
import type { ISelect } from "../types/ISelect";
import type { IDistribution } from "../types/IDistribution";
import type { ISelectLocalized } from "../types/ISelectLocalized";
import type { ISpeciesSelect } from "./types/ISpeciesSelect";
import type {
  CreateSpeciesPhotoPayload,
  SpeciesDirectPhotoUploadUrlRequest,
  SpeciesDirectPhotoUploadUrlResponse,
  UpdateSpeciesPhotoPayload,
} from "./types/ISpeciesPhotoManagement";
import type { IObservationList } from "./types/IObservation";
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
  distributions?: string;
  page?: number;
  per_page?: number;
  signal?: AbortController["signal"];
  isVisible?: boolean;
}

export type ISearchEspecies = { items: ISpecie[] } & IPagination;

export const searchEspecies = async ({
  search,
  lineage,
  country,
  distributions,
  page,
  per_page,
  signal,
  isVisible,
}: SearchEspeciesProps): Promise<ISearchEspecies> => {
  const resposta: AxiosResponse<ISearchEspecies> = await API.get("/species/list", {
    params: { search, lineage, country, distributions, page, per_page, is_visible: isVisible },
    signal,
  });

  return resposta.data;
};

export const selectDistributions = async (signal?: AbortController["signal"]) => {
  const resposta: AxiosResponse<IDistribution[]> = await API.get("/species/distributions/select", {
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

export type SpeciesDomainSelectType =
  | "growth_form"
  | "nutrition_mode"
  | "substrate"
  | "decay_type"
  | "habitat";

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

export const selectSpecies = async (params?: {
  search?: string;
  exclude_species_id?: number;
  signal?: AbortController["signal"];
}) => {
  const { search, exclude_species_id, signal } = params ?? {};
  const resposta: AxiosResponse<ISpeciesSelect[]> = await API.get("/species/select", {
    params: { search, exclude_species_id },
    signal,
  });

  return resposta.data;
};

export const fetchSpecies = async (
  species?: string,
  signal?: AbortController["signal"]
): Promise<ISpecie> => {
  const resposta: AxiosResponse<ISpecie> = await API.get(`/species/${species}`, {
    signal,
  });

  return resposta.data;
};

export type CreateSpeciesPayload = UpdateSpeciesPayload &
  Partial<{
    scientific_name: string;
    family: string;
    group_name: string;
    section: string;
    type_country: string;
    mycobank_type: string;
    ncbi_taxonomy_id: number;
    inaturalist_taxon_id: number;
    unite_taxon_id: number;
    iucn_redlist: number;
    references_raw: string;
    distribution_regions: string;
  }>;

export const createSpecies = async (payload: CreateSpeciesPayload): Promise<ISpecie> => {
  const response = await API.post<ISpecie>("/species", payload);
  return response.data;
};

export type UpdateSpeciesPayload = Partial<{
  lineage: string;
  is_visible: boolean;
  is_outdated_mycobank: boolean;
  mycobank_index_fungorum_id: string | null;
  size_cm: number | null;
  edible: boolean | null;
  season_start_month: number | null;
  season_end_month: number | null;
  growth_forms: number[];
  nutrition_modes: number[];
  substrates: number[];
  habitats: number[];
  similar_species_ids: number[];
  colors_pt: string | null;
  colors: string | null;
  cultivation_pt: string | null;
  cultivation: string | null;
  finding_tips_pt: string | null;
  finding_tips: string | null;
  nearby_trees_pt: string | null;
  nearby_trees: string | null;
  curiosities_pt: string | null;
  curiosities: string | null;
  general_description_pt: string | null;
  general_description: string | null;
  lum_mycelium: boolean | null;
  lum_basidiome: boolean | null;
  lum_stipe: boolean | null;
  lum_pileus: boolean | null;
  lum_lamellae: boolean | null;
  lum_spores: boolean | null;
  inaturalist_taxon_id: number | string | null;
  unite_taxon_id: number | string | null;
  cultivation_possible: boolean | null;
  type_country: string | null;
  distributions: number[];
}>;

export const updateSpecies = async (
  speciesId: number | string,
  payload: UpdateSpeciesPayload
): Promise<void> => {
  await API.patch(`/species/${encodeURIComponent(String(speciesId))}`, payload);
};

export const deleteSpecies = async (speciesId: number | string): Promise<void> => {
  await API.delete(`/species/${encodeURIComponent(String(speciesId))}`);
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

export type CreateAndAssociateReferencePayload = {
  apa?: string | null;
  doi?: string | null;
  url?: string | null;
};

export type UpdateReferencePayload = Partial<{
  apa: string | null;
  doi: string | null;
  url: string | null;
}>;

export const searchReferences = async (search?: string, signal?: AbortController["signal"]) => {
  const response = await API.get<IReference[]>("/references/select", {
    params: { search },
    signal,
  });
  return response.data;
};

export const associateExistingReference = async (
  speciesId: number,
  referenceId: number
): Promise<IReference> => {
  const response = await API.post<IReference>(`/species/${speciesId}/references/associate`, {
    reference_id: referenceId,
  });
  return response.data;
};

export const createAndAssociateReference = async (
  speciesId: number,
  payload: CreateAndAssociateReferencePayload
): Promise<IReference> => {
  const response = await API.post<IReference>(`/species/${speciesId}/references`, payload);
  return response.data;
};

export const updateReference = async (
  referenceId: number,
  payload: UpdateReferencePayload
): Promise<IReference> => {
  const response = await API.patch<IReference>(`/references/${referenceId}`, payload);
  return response.data;
};

export const disassociateReference = async (
  speciesId: number,
  referenceId: number
): Promise<void> => {
  await API.delete(`/species/${speciesId}/references/${referenceId}`);
};

export interface OutdatedSpeciesItem {
  id: number;
  scientific_name: string;
  mycobank_index_fungorum_id: string | null;
}

export type IOutdatedSpecies = { items: OutdatedSpeciesItem[] } & IPagination;

export const listOutdatedSpecies = async (params?: {
  page?: number;
  per_page?: number;
  signal?: AbortController["signal"];
}): Promise<IOutdatedSpecies> => {
  const { page, per_page, signal } = params ?? {};
  const response: AxiosResponse<IOutdatedSpecies> = await API.get("/species/outdated", {
    params: { page, per_page },
    signal,
  });
  return response.data;
};

export const fetchSpeciesObservations = async (
  speciesId: number,
  signal?: AbortController["signal"]
): Promise<IObservationList> => {
  const response = await API.get<IObservationList>(`/species/${speciesId}/observations`, {
    signal,
  });
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

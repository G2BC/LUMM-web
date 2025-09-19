import type { AxiosResponse } from "axios";
import { API } from "..";
import type { ISpecie } from "./types/ISpecie";
import type { IPagination } from "../types/IPagination";
import type { ISelect } from "../types/ISelect";

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
  const resposta: AxiosResponse<ISearchEspecies> = await API.get("/species", {
    params: { search, lineage, country, page, per_page },
    signal,
  });

  return resposta.data;
};

export const selectLineage = async (search?: string, signal?: AbortController["signal"]) => {
  const resposta: AxiosResponse<ISelect[]> = await API.get("/species/select/lineage", {
    params: { search },
    signal,
  });

  return resposta.data;
};

export const selectSpeciesCountry = async (search?: string, signal?: AbortController["signal"]) => {
  const resposta: AxiosResponse<ISelect[]> = await API.get("/species/select/country", {
    params: { search },
    signal,
  });

  return resposta.data;
};

import type { AxiosResponse } from "axios";
import { API } from "..";
import type { ISpecie } from "./types/ISpecie";
import type { IPagination } from "../types/IPagination";

export interface SearchEspeciesProps {
  search?: string;
  page?: number;
  per_page?: number;
  signal?: AbortController["signal"];
}

export type ISearchEspecies = { items: ISpecie[] } & IPagination;

export const searchEspecies = async ({
  search,
  page,
  per_page,
  signal,
}: SearchEspeciesProps): Promise<ISearchEspecies> => {
  const resposta: AxiosResponse<ISearchEspecies> = await API.get("/species", {
    params: { search, page, per_page },
    signal,
  });

  return resposta.data;
};

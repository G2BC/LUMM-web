import { searchEspecies, type ISearchEspecies, type SearchEspeciesProps } from "@/api/species";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export function useExplore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") ?? "";

  const pageParam = parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const [page, setPage] = useState<number>(pageParam);

  const lineageParam = searchParams.get("lineage") ?? "";
  const [lineage, setLineage] = useState<string>(lineageParam);

  const countryParam = searchParams.get("country") ?? "";
  const [country, setCountry] = useState<string>(countryParam);

  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(searchParam);
  const [fetchedSearch, setFetchedSearch] = useState<string>(searchParam);
  const [dados, setDados] = useState<ISearchEspecies | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const getSpecies = async (params: SearchEspeciesProps) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await searchEspecies({ ...params, signal: controller.signal });
      setDados(res);
      setFetchedSearch(params.search?.trim() ?? "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if ("name" in err && err?.name !== "AbortError") {
        setDados({ items: [], total: 0, page: null, per_page: null, pages: null });
        setFetchedSearch(params.search?.trim() ?? "");
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeSearch = (value: string) => {
    setSearch(value);
  };

  const submitSearch = (raw?: string) => {
    const q = (raw ?? search).trim();
    const nextParams: Record<string, string> = {};
    if (q) nextParams.search = q;
    nextParams.page = "1";
    setSearchParams(nextParams);
    setPage(1);
  };

  const handleSearch = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<SVGSVGElement>
  ) => {
    if (search === fetchedSearch) return;

    if ("key" in e && e.type === "keydown") {
      if (e.key === "Enter") {
        submitSearch();
      }
      return;
    }

    if (e.type === "click") {
      submitSearch();
    }
  };

  const handleClearInput = () => {
    setSearch("");
    setSearchParams({ page: "1" });
    setPage(1);
  };

  const changePage = (newPage: number) => {
    if (page === newPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setPage(newPage);
    const params: Record<string, string> = {};
    if (search.trim()) params.search = search.trim();
    params.page = newPage.toString();
    setSearchParams(params);
  };

  const changeLineage = (newLineage: string) => {
    if (lineage === newLineage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLineage(newLineage);
    const params: Record<string, string> = {};
    if (lineage.trim()) params.lineage = lineage.trim();
    params.lineage = newLineage.toString();
    setSearchParams(params);
  };

  const changeCountry = (newCountry: string) => {
    if (country === newCountry) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCountry(newCountry);
    const params: Record<string, string> = {};
    if (country.trim()) params.country = country.trim();
    params.country = newCountry.toString();
    setSearchParams(params);
  };

  useEffect(() => {
    setSearch(searchParam);
    setPage(pageParam);
    getSpecies({
      search: searchParam,
      lineage: lineageParam,
      country: countryParam,
      page: pageParam,
    });
  }, [searchParam, pageParam, lineageParam, countryParam]);

  return {
    dados,
    search,
    onChangeSearch,
    handleSearch,
    loading,
    fetchedSearch,
    handleClearInput,
    page,
    changePage,
    changeLineage,
    lineage,
    country,
    changeCountry,
  };
}

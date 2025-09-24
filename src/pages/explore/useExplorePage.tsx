import { searchEspecies, type ISearchEspecies, type SearchEspeciesProps } from "@/api/species";
import { paramsToObject } from "@/utils/paramsToObject";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";

const scrollTopSmooth = () =>
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));

export function useExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";
  const lineageParam = searchParams.get("lineage") ?? "";
  const countryParam = searchParams.get("country") ?? "";
  const pageParam = useMemo(
    () => parseInt(searchParams.get("page") ?? "1", 10) || 1,
    [searchParams]
  );

  const [page, setPage] = useState<number>(pageParam);
  const [lineage, setLineage] = useState<string>(lineageParam);
  const [country, setCountry] = useState<string>(countryParam);
  const [search, setSearch] = useState<string>(searchParam);

  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedSearch, setFetchedSearch] = useState<string>(searchParam);
  const [dados, setDados] = useState<ISearchEspecies | null>(null);

  const upsertFilterParams = (
    patch: Partial<{ search: string; lineage: string; country: string; page: number | string }>,
    opts?: { resetPage?: boolean; replace?: boolean }
  ) => {
    const curr = paramsToObject(searchParams);
    const next: Record<string, string> = { ...curr };

    const setOrDelete = (key: "search" | "lineage" | "country", val?: string) => {
      const v = (val ?? "").trim();
      if (v) next[key] = v;
      else delete next[key];
    };

    if ("search" in patch) setOrDelete("search", String(patch.search ?? ""));
    if ("lineage" in patch) setOrDelete("lineage", String(patch.lineage ?? ""));
    if ("country" in patch) setOrDelete("country", String(patch.country ?? ""));

    if (opts?.resetPage) next.page = "1";
    if ("page" in patch && patch.page != null) next.page = String(patch.page);

    const nextQS = new URLSearchParams(next);

    if (nextQS.toString() !== searchParams.toString()) {
      setSearchParams(nextQS, { replace: opts?.replace ?? true });
    }
  };

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

  const onChangeSearch = (value: string) => setSearch(value);

  const submitSearch = (raw?: string) => {
    const q = (raw ?? search).trim();
    upsertFilterParams({ search: q }, { resetPage: true });
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
    upsertFilterParams({ search: "" }, { resetPage: true });
    setPage(1);
  };

  const changePage = (newPage: number) => {
    if (page === newPage) {
      scrollTopSmooth();
      return;
    }
    setPage(newPage);
    upsertFilterParams({ page: newPage });
    scrollTopSmooth();
  };

  const changeLineage = (newLineage: string) => {
    if (lineage === newLineage) {
      return;
    }
    setLineage(newLineage);
    upsertFilterParams({ lineage: newLineage }, { resetPage: true });
    setPage(1);
    scrollTopSmooth();
  };

  const changeCountry = (newCountry: string) => {
    if (country === newCountry) {
      return;
    }
    setCountry(newCountry);
    upsertFilterParams({ country: newCountry }, { resetPage: true });
    setPage(1);
    scrollTopSmooth();
  };

  useEffect(() => {
    setSearch(searchParam);
    setLineage(lineageParam);
    setCountry(countryParam);
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
    loading,
    fetchedSearch,
    search,
    lineage,
    country,
    page,
    onChangeSearch,
    handleSearch,
    handleClearInput,
    changePage,
    changeLineage,
    changeCountry,
  };
}

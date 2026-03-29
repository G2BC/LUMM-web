import { searchEspecies, type ISearchEspecies, type SearchEspeciesProps } from "@/api/species";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { paramsToObject } from "@/utils/paramsToObject";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

const SPECIE_CARD_WIDTH = 280;
const SPECIE_CARD_GAP = 24;
const EXPLORE_CONTAINER_HORIZONTAL_PADDING = 32;
const MAX_AUTO_LOAD_PAGES = 2;

const getExploreContainerMaxWidth = (viewportWidth: number) => {
  if (viewportWidth >= 1536) return 1536;
  if (viewportWidth >= 1280) return 1280;
  if (viewportWidth >= 1024) return 1024;
  if (viewportWidth >= 768) return 768;
  if (viewportWidth >= 640) return 640;
  return viewportWidth;
};

const getExplorePerPage = (viewportWidth: number) => {
  const containerWidth = Math.min(viewportWidth, getExploreContainerMaxWidth(viewportWidth));
  const availableWidth = Math.max(0, containerWidth - EXPLORE_CONTAINER_HORIZONTAL_PADDING);
  const columns = Math.max(
    1,
    Math.floor((availableWidth + SPECIE_CARD_GAP) / (SPECIE_CARD_WIDTH + SPECIE_CARD_GAP))
  );

  // Keep the amount close to the previous baseline while preserving full grid rows.
  const rows = Math.max(2, Math.min(4, Math.round(16 / columns)));
  return columns * rows;
};

const appendUniqueSpecies = (currentItems: ISpecie[], nextItems: ISpecie[]) => {
  if (!currentItems.length) return nextItems;

  const ids = new Set(currentItems.map((item) => item.id));
  const merged = [...currentItems];

  for (const specie of nextItems) {
    if (ids.has(specie.id)) continue;
    ids.add(specie.id);
    merged.push(specie);
  }

  return merged;
};

export function useExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";
  const lineageParam = searchParams.get("lineage") ?? "";
  const countryParam = searchParams.get("country") ?? "";

  const [lineage, setLineage] = useState<string>(lineageParam);
  const [country, setCountry] = useState<string>(countryParam);
  const [search, setSearch] = useState<string>(searchParam);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [autoLoadsUsed, setAutoLoadsUsed] = useState<number>(0);
  const [fetchedSearch, setFetchedSearch] = useState<string>(searchParam);
  const [dados, setDados] = useState<ISearchEspecies | null>(null);
  const [perPage, setPerPage] = useState<number>(() => {
    if (typeof window === "undefined") return 16;
    return getExplorePerPage(window.innerWidth);
  });

  const abortRef = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef<boolean>(false);
  const autoLoadsUsedRef = useRef<number>(0);
  const activeFiltersRef = useRef<{
    search: string;
    lineage: string;
    country: string;
    per_page: number;
  }>({
    search: searchParam,
    lineage: lineageParam,
    country: countryParam,
    per_page: perPage,
  });
  const activeQueryKeyRef = useRef<string>("");

  const upsertFilterParams = (
    patch: Partial<{ search: string; lineage: string; country: string }>,
    opts?: { replace?: boolean }
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

    delete next.page;

    const nextQS = new URLSearchParams(next);

    if (nextQS.toString() !== searchParams.toString()) {
      setSearchParams(nextQS, { replace: opts?.replace ?? true });
    }
  };

  const onChangeSearch = (value: string) => setSearch(value);

  const submitSearch = (raw?: string) => {
    const q = (raw ?? search).trim();
    upsertFilterParams({ search: q });
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
    upsertFilterParams({ search: "" });
  };

  const changeLineage = (newLineage: string) => {
    if (lineage === newLineage) {
      return;
    }
    setLineage(newLineage);
    upsertFilterParams({ lineage: newLineage });
  };

  const changeCountry = (newCountry: string) => {
    if (country === newCountry) {
      return;
    }
    setCountry(newCountry);
    upsertFilterParams({ country: newCountry });
  };

  useEffect(() => {
    const onResize = () => {
      const nextPerPage = getExplorePerPage(window.innerWidth);
      setPerPage((prevPerPage) => (prevPerPage === nextPerPage ? prevPerPage : nextPerPage));
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    setSearch(searchParam);
    setLineage(lineageParam);
    setCountry(countryParam);

    const queryKey = `${searchParam}::${lineageParam}::${countryParam}::${perPage}`;
    activeQueryKeyRef.current = queryKey;
    activeFiltersRef.current = {
      search: searchParam,
      lineage: lineageParam,
      country: countryParam,
      per_page: perPage,
    };

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setLoadingMore(false);
    loadingMoreRef.current = false;
    setAutoLoadsUsed(0);
    autoLoadsUsedRef.current = 0;

    const params: SearchEspeciesProps = {
      search: searchParam,
      lineage: lineageParam,
      country: countryParam,
      page: 1,
      per_page: perPage,
      signal: controller.signal,
      isVisible: true,
    };

    void searchEspecies(params)
      .then((res) => {
        if (activeQueryKeyRef.current !== queryKey) return;

        setDados({
          ...res,
          page: res.page ?? 1,
          items: res.items ?? [],
        });
        setFetchedSearch(searchParam.trim());
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return;
        if (activeQueryKeyRef.current !== queryKey) return;

        setDados({ items: [], total: 0, page: 1, per_page: perPage, pages: 1 });
        setFetchedSearch(searchParam.trim());
      })
      .finally(() => {
        if (activeQueryKeyRef.current === queryKey) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [searchParam, lineageParam, countryParam, perPage]);

  const hasMore = Boolean(dados?.pages && dados?.page && dados.page < dados.pages);
  const canAutoLoadMore = hasMore && autoLoadsUsed < MAX_AUTO_LOAD_PAGES;
  const showManualLoadMore = hasMore && !canAutoLoadMore;

  const loadMore = useCallback(
    async (mode: "auto" | "manual" = "auto") => {
      if (!dados || loading || loadingMore || loadingMoreRef.current || !hasMore) return;
      if (mode === "auto" && autoLoadsUsedRef.current >= MAX_AUTO_LOAD_PAGES) return;

      const nextPage = (dados.page ?? 1) + 1;
      const queryKey = activeQueryKeyRef.current;

      loadingMoreRef.current = true;
      setLoadingMore(true);

      try {
        const res = await searchEspecies({
          ...activeFiltersRef.current,
          page: nextPage,
          isVisible: true,
        });

        if (activeQueryKeyRef.current !== queryKey) return;

        setDados((prev) => {
          const currentItems = prev?.items ?? [];
          const nextItems = res.items ?? [];
          const mergedItems = appendUniqueSpecies(currentItems, nextItems);

          return {
            ...res,
            items: mergedItems,
            page: res.page ?? nextPage,
          };
        });
        if (mode === "auto") {
          autoLoadsUsedRef.current += 1;
          setAutoLoadsUsed(autoLoadsUsedRef.current);
        }
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;
      } finally {
        if (activeQueryKeyRef.current === queryKey) {
          setLoadingMore(false);
        }
        loadingMoreRef.current = false;
      }
    },
    [dados, hasMore, loading, loadingMore]
  );

  return {
    dados,
    loading,
    loadingMore,
    canAutoLoadMore,
    showManualLoadMore,
    hasMore,
    loadMore,
    fetchedSearch,
    search,
    lineage,
    country,
    onChangeSearch,
    handleSearch,
    handleClearInput,
    changeLineage,
    changeCountry,
  };
}

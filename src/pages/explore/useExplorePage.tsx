import { searchEspecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { paramsToObject } from "@/utils/paramsToObject";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
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
  const rows = Math.max(2, Math.min(4, Math.round(16 / columns)));
  return columns * rows;
};

export function useExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";
  const lineageParam = searchParams.get("lineage") ?? "";
  const countryParam = searchParams.get("country") ?? "";
  const distributionsParam = searchParams.get("distributions") ?? "";

  const [lineage, setLineage] = useState<string>(lineageParam);
  const [country, setCountry] = useState<string>(countryParam);
  const [distributions, setDistributions] = useState<string[]>(() =>
    distributionsParam ? distributionsParam.split(",") : []
  );
  const [search, setSearch] = useState<string>(searchParam);
  const [autoLoadsUsed, setAutoLoadsUsed] = useState(0);
  const [perPage, setPerPage] = useState<number>(() => {
    if (typeof window === "undefined") return 16;
    return getExplorePerPage(window.innerWidth);
  });

  // Sync local input state when URL changes (e.g. back/forward navigation)
  useEffect(() => {
    setSearch(searchParam);
    setLineage(lineageParam);
    setCountry(countryParam);
    setDistributions(distributionsParam ? distributionsParam.split(",") : []);
  }, [searchParam, lineageParam, countryParam, distributionsParam]);

  // Reset auto-load counter whenever filters change
  useEffect(() => {
    setAutoLoadsUsed(0);
  }, [searchParam, lineageParam, countryParam, distributionsParam, perPage]);

  // Responsive per_page
  useEffect(() => {
    const onResize = () => {
      const nextPerPage = getExplorePerPage(window.innerWidth);
      setPerPage((prev) => (prev === nextPerPage ? prev : nextPerPage));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: speciesKeys.explore({
        search: searchParam,
        lineage: lineageParam,
        country: countryParam,
        distributions: distributionsParam,
        perPage,
      }),
      queryFn: ({ pageParam, signal }) =>
        searchEspecies({
          search: searchParam || undefined,
          lineage: lineageParam || undefined,
          country: countryParam || undefined,
          distributions: distributionsParam || undefined,
          page: pageParam as number,
          per_page: perPage,
          signal,
          isVisible: true,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const page = lastPage.page ?? 0;
        const pages = lastPage.pages ?? 1;
        return page < pages ? page + 1 : undefined;
      },
    });

  // Build a shape compatible with the old `dados` contract
  const lastPage = data?.pages[data.pages.length - 1];
  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const dados = data
    ? {
        items: allItems,
        total: lastPage?.total ?? 0,
        pages: lastPage?.pages ?? 1,
        page: lastPage?.page ?? 1,
        per_page: perPage,
      }
    : null;

  const loading = isFetching && !isFetchingNextPage;
  const loadingMore = isFetchingNextPage;
  const hasMore = Boolean(hasNextPage);
  const canAutoLoadMore = hasMore && autoLoadsUsed < MAX_AUTO_LOAD_PAGES;
  const showManualLoadMore = hasMore && !canAutoLoadMore;
  const fetchedSearch = searchParam.trim();

  const loadMore = useCallback(
    async (mode: "auto" | "manual" = "auto") => {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;
      if (mode === "auto" && autoLoadsUsed >= MAX_AUTO_LOAD_PAGES) return;

      await fetchNextPage();
      if (mode === "auto") {
        setAutoLoadsUsed((prev) => prev + 1);
      }
    },
    [isLoading, isFetchingNextPage, hasNextPage, autoLoadsUsed, fetchNextPage]
  );

  const upsertFilterParams = (
    patch: Partial<{ search: string; lineage: string; country: string; distributions: string }>,
    opts?: { replace?: boolean }
  ) => {
    const curr = paramsToObject(searchParams);
    const next: Record<string, string> = { ...curr };

    const setOrDelete = (key: "search" | "lineage" | "country" | "distributions", val?: string) => {
      const v = (val ?? "").trim();
      if (v) next[key] = v;
      else delete next[key];
    };

    if ("search" in patch) setOrDelete("search", String(patch.search ?? ""));
    if ("lineage" in patch) setOrDelete("lineage", String(patch.lineage ?? ""));
    if ("country" in patch) setOrDelete("country", String(patch.country ?? ""));
    if ("distributions" in patch) setOrDelete("distributions", String(patch.distributions ?? ""));

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
      if (e.key === "Enter") submitSearch();
      return;
    }

    if (e.type === "click") submitSearch();
  };

  const handleClearInput = () => {
    setSearch("");
    upsertFilterParams({ search: "" });
  };

  const changeLineage = (newLineage: string) => {
    if (lineage === newLineage) return;
    setLineage(newLineage);
    upsertFilterParams({ lineage: newLineage });
  };

  const changeCountry = (newCountry: string) => {
    if (country === newCountry) return;
    setCountry(newCountry);
    upsertFilterParams({ country: newCountry });
  };

  const changeDistributions = (newDistributions: string[]) => {
    const joined = newDistributions.join(",");
    if (distributions.join(",") === joined) return;
    setDistributions(newDistributions);
    upsertFilterParams({ distributions: joined });
  };

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
    distributions,
    onChangeSearch,
    handleSearch,
    handleClearInput,
    changeLineage,
    changeCountry,
    changeDistributions,
  };
}

import React from "react";
import { SpecieCard } from "@/pages/explore/components/specie-card";
import { SpecieCardSkeleton } from "@/pages/explore/components/specie-card-skeleton";
import { useExplorePage } from "./useExplorePage";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FilterModal } from "./components/filter-modal";
import { FilterTags } from "./components/filter-tags";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorePage() {
  const {
    dados,
    search,
    loading,
    loadingMore,
    canAutoLoadMore,
    showManualLoadMore,
    loadMore,
    fetchedSearch,
    handleClearInput,
    lineage,
    country,
    distributions,
    filterLabels,
    changeLineage,
    changeCountry,
    changeDistributions,
    applyFilters,
  } = useExplorePage();
  const { t } = useTranslation();

  const loadMoreSentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!canAutoLoadMore) return;
    const target = loadMoreSentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          void loadMore("auto");
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canAutoLoadMore, loadMore]);

  return (
    <section className="container mx-auto my-10 px-4">
      <div className="mt-10 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,280px)] gap-x-6 gap-y-3 justify-center">
        <div className="md:col-span-full flex items-center justify-between">
          {loading ? (
            <Skeleton className="hidden md:block h-6 w-48" />
          ) : (
            <p className="hidden md:block font-semibold text-[16px] text-white">
              {dados?.total
                ? `${dados.total} ${t("explore_page.result_label")}`
                : t("explore_page.result_label_empty")}
            </p>
          )}
          <FilterModal
            search={search}
            lineage={lineage}
            country={country}
            distributions={distributions}
            filterLabels={filterLabels}
            onApply={applyFilters}
          />
        </div>
        <div className="col-span-full">
          <FilterTags
            search={fetchedSearch}
            lineage={lineage}
            country={country}
            distributions={distributions}
            filterLabels={filterLabels}
            onClearSearch={handleClearInput}
            onClearLineage={() => changeLineage("")}
            onClearCountry={() => changeCountry("")}
            onClearDistributions={() => changeDistributions([], {})}
          />
        </div>
        {loading ? (
          <Skeleton className="md:hidden col-span-full h-6 w-48" />
        ) : (
          <p className="md:hidden col-span-full font-semibold text-[16px] text-white">
            {dados?.total
              ? `${dados.total} ${t("explore_page.result_label")}`
              : t("explore_page.result_label_empty")}
          </p>
        )}
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SpecieCardSkeleton key={i} />)
          : dados?.items.map((specie) => <SpecieCard key={specie.id} {...specie} />)}
      </div>

      {!loading && (
        <>
          {canAutoLoadMore && <div ref={loadMoreSentinelRef} className="h-12 w-full" />}

          {showManualLoadMore && (
            <div className="w-full flex justify-center my-4">
              <Button
                className="cursor-pointer h-[40px]"
                onClick={() => void loadMore("manual")}
                disabled={loadingMore}
              >
                {t("common.view_more")}
              </Button>
            </div>
          )}

          {loadingMore && (
            <div className="w-full h-full flex flex-col justify-center items-center my-6">
              <Loader2 className="w-7 h-7 text-primary animate-spin mb-2" />
              <p className="text-[#00C000] text-sm font-semibold">{t("common.loading")}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

import React from "react";
import { SpecieCard } from "@/pages/explore/components/specie-card";
import { useExplorePage } from "./useExplorePage";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { ComboboxAsync, type ComboboxOption } from "@/components/combobox-async";
import { selectDistributions, selectLineage, selectSpeciesCountry } from "@/api/species";
import { getCountryName } from "@/lib/country-names";
import type { Locale } from "@/lib/lang";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  const {
    dados,
    search,
    onChangeSearch,
    handleSearch,
    loading,
    loadingMore,
    canAutoLoadMore,
    showManualLoadMore,
    loadMore,
    fetchedSearch,
    handleClearInput,
    changeLineage,
    lineage,
    country,
    changeCountry,
    distributions,
    changeDistributions,
  } = useExplorePage();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;

  const fetchLineageOptions = React.useCallback(
    async (search: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectLineage(search, signal);
      return res.map((item) => ({ id: item.value, label: item.label }));
    },
    []
  );

  const fetchCountryOptions = React.useCallback(
    async (search: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectSpeciesCountry(search, signal);
      return res.map((item) => ({
        id: item.value,
        label: getCountryName(item.label, lang) || item.label,
      }));
    },
    [lang]
  );

  const fetchDistributionOptions = React.useCallback(
    async (_search: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectDistributions(signal);
      const isPt = lang === "pt";
      return res.map((item) => ({
        id: item.slug,
        label: `${item.slug} - ${isPt ? item.label_pt : item.label_en}`,
      }));
    },
    [lang]
  );

  const baseClassNameIcons =
    "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 tr transition-colors cursor-pointer";
  const classNameIconsColor = !loading && search ? "text-white" : "text-white opacity-50";
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
      {
        rootMargin: "300px 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canAutoLoadMore, loadMore]);

  return (
    <section className="container mx-auto my-10 px-4">
      <div className="mt-10 mb-6 grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center ">
        <div className="relative col-span-1/2 max-md:col-span-1">
          <Input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="h-10 pr-10 placeholder:text-white placeholder:opacity-50 border-white focus-visible:ring-white text-white"
            placeholder={t("explore_page.input_placeholder")}
          />
          {search && fetchedSearch === search ? (
            <X
              onClick={handleClearInput}
              className={clsx(baseClassNameIcons, classNameIconsColor)}
            />
          ) : (
            <Search
              onClick={handleSearch}
              className={clsx(baseClassNameIcons, classNameIconsColor)}
            />
          )}
        </div>
        <div className="col-span-1/2">
          <ComboboxAsync
            placeholder={t("explore_page.select_lineage")}
            fetchOptions={fetchLineageOptions}
            value={lineage || null}
            onSelect={(id) => changeLineage(id ? String(id) : "")}
          />
        </div>
        <div className="col-span-1/2">
          <ComboboxAsync
            placeholder={t("explore_page.select_country")}
            fetchOptions={fetchCountryOptions}
            value={country || null}
            onSelect={(id) => changeCountry(id ? String(id) : "")}
          />
        </div>
        <div className="col-span-2">
          <ComboboxAsync
            multiple
            placeholder={t("explore_page.select_distributions")}
            fetchOptions={fetchDistributionOptions}
            value={distributions}
            onSelect={(ids) => changeDistributions(ids.map(String))}
          />
        </div>
      </div>
      {!loading && (
        <div className="mb-10 grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center ">
          <p className="font-semibold text-[16px] col-span-2 max-md:col-span-1 text-white">
            {dados?.total
              ? `${dados?.total} ${t("explore_page.result_label")}`
              : t("explore_page.result_label_empty")}{" "}
            {fetchedSearch
              ? `${t("explore_page.resulta_label_connection")} "${fetchedSearch}"`
              : ""}
          </p>
        </div>
      )}
      {!loading ? (
        <>
          <div className="w-full grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center">
            {dados?.items.map((specie) => <SpecieCard key={specie.id} {...specie} />)}
          </div>

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
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center my-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[#00C000] font-semibold">{t("common.loading")}</p>
        </div>
      )}
    </section>
  );
}

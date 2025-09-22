import React from "react";
import { SpecieCard } from "@/components/specie-card";
import { useExplorePage } from "./useExplorePage";
import { Input } from "@/components/ui/input";
import { FileWarning, Loader2, Search, X } from "lucide-react";
import clsx from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ComboboxAsync } from "@/components/combobox-async";
import { selectLineage, selectSpeciesCountry } from "@/api/species";

export default function ExplorePage() {
  const {
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
  } = useExplorePage();
  const { t } = useTranslation();

  const baseClassNameIcons =
    "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 tr transition-colors cursor-pointer";
  const classNameIconsColor = !loading && search ? "text-white" : "text-white opacity-50";

  const pageUnavailable = Boolean(dados?.pages && page > dados?.pages);

  return (
    <section className="container mx-auto my-10 px-4">
      {!pageUnavailable && (
        <>
          <div className="mt-10 mb-6 grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center ">
            <div className="relative col-span-2 max-md:col-span-1">
              <Input
                value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="h-10 pr-10 placeholder:text-white placeholder:opacity-50 border-white focus-visible:ring-white text-white"
                placeholder={t("explore.input_placeholder")}
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
                placeholder={t("explore.select_lineage")}
                api={(search) => selectLineage(search)}
                onSelect={(value) => changeLineage(value)}
                value={lineage}
              />
            </div>
            <div className="col-span-1/2">
              <ComboboxAsync
                placeholder={t("explore.select_country")}
                api={(search) => selectSpeciesCountry(search)}
                onSelect={(value) => changeCountry(value)}
                value={country}
              />
            </div>
          </div>
          {!loading && (
            <div className="mb-10 grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center ">
              <p className="font-semibold text-[16px] col-span-2 max-md:col-span-1 text-white">
                {dados?.total
                  ? `${dados?.total} ${t("explore.result_label")}`
                  : t("explore.result_label_empty")}{" "}
                {fetchedSearch ? `${t("explore.resulta_label_connection")} "${fetchedSearch}"` : ""}
              </p>
            </div>
          )}
        </>
      )}
      {!loading ? (
        <>
          <div className="w-full grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center">
            {React.Children.toArray(dados?.items.map((specie) => <SpecieCard {...specie} />))}
          </div>

          {pageUnavailable && (
            <div className="w-full flex flex-col justify-center items-center gap-10 mt-10">
              <FileWarning className="w-12 h-12 text-gray-600" />
              <p className="text-center font-bold leading-[30px] text-[18px]">
                {t("explore.page_unavailable")} <br />
                {t("explore.page_unavailable_text")}
              </p>
              <Button className="cursor-pointer h-[40px]" onClick={() => changePage(1)}>
                {t("explore.page_unavailable_btn")}
              </Button>
            </div>
          )}

          {Boolean(!pageUnavailable && dados?.items?.length) && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem className="cursor-pointer select-none">
                  <PaginationPrevious
                    itemScope
                    inert={page === 1}
                    onClick={() => changePage(page - 1)}
                  />
                </PaginationItem>
                {React.Children.toArray(
                  Array(dados?.pages ?? 0)
                    .fill(1)
                    .map((_, index) => (
                      <PaginationItem className="cursor-pointer select-none">
                        <PaginationLink
                          isActive={page === index + 1}
                          onClick={() => changePage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))
                )}
                <PaginationItem className="cursor-pointer select-none">
                  <PaginationNext
                    inert={page === (dados?.pages ?? 1)}
                    onClick={() => changePage(page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center my-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[#00C000] font-semibold">Carregando...</p>
        </div>
      )}
    </section>
  );
}

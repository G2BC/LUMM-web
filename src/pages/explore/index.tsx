import React from "react";
import { SpecieCard } from "@/components/specie-card";
import { useExplore } from "./useExplore";
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
  } = useExplore();

  const baseClassNameIcons =
    "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 tr transition-colors cursor-pointer";
  const classNameIconsColor = !loading && search ? "text-[#0A100B]" : "text-gray-500";

  const pageUnavailable = dados?.pages && page > dados?.pages;

  return (
    <section className="container mx-auto my-10 px-4">
      {!pageUnavailable && (
        <>
          <div className="mt-10 mb-6 grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center ">
            <div className="relative col-span-2">
              <Input
                value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="h-10 pr-10"
                placeholder="Pesquise por espécie ou linhagem"
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
          </div>
          <div className="mb-10 grid grid-cols-[repeat(auto-fill,280px)] gap-6 justify-center ">
            <p className="font-semibold text-[16px] col-span-2">
              {dados?.total
                ? `${dados?.total} espécie(s) encontrada(s)`
                : "Nenhuma espécie encontrada"}{" "}
              {fetchedSearch ? `para "${fetchedSearch}"` : ""}
            </p>
          </div>
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
                A página solicitada não está disponível. <br />
                Utilize o botão abaixo para recomeçar a consulta.
              </p>
              <Button className="cursor-pointer h-[40px]" onClick={() => changePage(1)}>
                Recomeçar
              </Button>
            </div>
          )}

          {!pageUnavailable && (
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
        <div className="w-full h-full flex justify-center items-center">
          <Loader2 className="w-10 h-10 text-[#0A100B] animate-spin mb-4" />
        </div>
      )}
    </section>
  );
}

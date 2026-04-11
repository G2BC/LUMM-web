import { searchEspecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import type { ISpecie } from "@/api/species/types/ISpecie";
import specieCardDefault from "@/assets/specie-card-default.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { SpeciesActionsMenu } from "@/pages/panel/components/species-actions-menu";
import { UsersPagination } from "@/pages/panel/components/users-pagination";
import { useAuthStore } from "@/stores/useAuthStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

const SPECIES_PER_PAGE = 20;

function parsePageParam(value: string | null) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

function getSpeciesThumb(species: ISpecie) {
  const featuredPhoto = species.photos?.find((photo) => photo.featured);
  const firstPhoto = featuredPhoto ?? species.photos?.[0];
  return firstPhoto?.medium_url || firstPhoto?.original_url || specieCardDefault;
}

function getPublishedBadgeClass(isVisible?: boolean) {
  if (isVisible) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  return "border-rose-200 bg-rose-50 text-rose-700";
}

export default function PanelSpeciesPage() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const locale = lang ?? DEFAULT_LOCALE;
  const role = (user?.role ?? "").toLowerCase();
  const canManageSpecies = Boolean(role === "admin" || role === "curator");
  const canRequestUpdate = role === "researcher";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(() => parsePageParam(searchParams.get("page")));

  useEffect(() => {
    const nextPage = parsePageParam(searchParams.get("page"));
    setPage((currentPage) => (currentPage === nextPage ? currentPage : nextPage));
  }, [searchParams]);

  const updatePageQuery = useCallback(
    (nextPage: number) => {
      setSearchParams((previousParams) => {
        const nextParams = new URLSearchParams(previousParams);
        if (nextPage <= 1) {
          nextParams.delete("page");
        } else {
          nextParams.set("page", String(nextPage));
        }
        return nextParams;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const {
    data,
    isLoading,
    isError: hasError,
  } = useQuery({
    queryKey: speciesKeys.list({ search: debouncedSearch, page }),
    queryFn: ({ signal }) =>
      searchEspecies({
        search: debouncedSearch || undefined,
        page,
        per_page: SPECIES_PER_PAGE,
        signal,
      }),
    placeholderData: keepPreviousData,
  });

  const items: ISpecie[] = data?.items ?? [];
  const pages = Math.max(1, data?.pages ?? 1);
  const total = data?.total ?? 0;

  useEffect(() => {
    if (data && page > Math.max(1, data.pages ?? 1)) {
      const nextPages = Math.max(1, data.pages ?? 1);
      setPage(nextPages);
      updatePageQuery(nextPages);
    }
  }, [data, page, updatePageQuery]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    updatePageQuery(1);
  }

  const queryString = searchParams.toString();
  const isDesktop = useIsDesktop();

  return (
    <section className="text-slate-900">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-x-6">
        <span>
          <h2 className="text-2xl font-semibold">{t("panel_page.species_title")}</h2>
          <p className="mt-1 text-slate-600 mb-6">{t("panel_page.species_subtitle")}</p>
          <div className="mb-4 md:max-w-sm">
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t("panel_page.species_search_placeholder")}
              className="text-slate-900 caret-slate-900 placeholder:text-slate-400"
            />
          </div>
        </span>

        {canManageSpecies ? (
          <Link to={`/${locale}/painel/especies/cadastro`}>
            <Button className="text-white bg-[#118A2A] hover:bg-[#0E7323] font-medium">
              <PlusIcon /> {t("panel_page.species_add_new")}
            </Button>
          </Link>
        ) : null}
      </div>

      {isLoading ? <p className="text-slate-600">{t("panel_page.loading_species")}</p> : null}

      {!isLoading && hasError ? (
        <div className="rounded-lg border border-dashed border-red-300 px-4 py-8 text-center">
          <p className="text-sm text-red-700">{t("panel_page.species_load_error")}</p>
        </div>
      ) : null}

      {!isLoading && !hasError && items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">{t("panel_page.no_species_found")}</p>
        </div>
      ) : null}

      {!isLoading && !hasError && items.length > 0 ? (
        <>
          {isDesktop ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-[880px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="px-4 py-3">{t("panel_page.col_species_name")}</th>
                    <th className="px-4 py-3">{t("panel_page.col_lineage")}</th>
                    <th className="px-4 py-3">{t("panel_page.col_published")}</th>
                    <th className="px-4 py-3 text-right">{t("panel_page.col_actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getSpeciesThumb(item)}
                            alt={item.scientific_name}
                            className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = specieCardDefault;
                            }}
                          />
                          <Link
                            to={`/${locale}/especie/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 hover:underline"
                          >
                            {item.scientific_name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 pr-3">{item.lineage || "-"}</td>
                      <td className="px-4 py-3 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPublishedBadgeClass(
                            item.is_visible
                          )}`}
                        >
                          {item.is_visible ? t("species_page.lumm.yes") : t("species_page.lumm.no")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <SpeciesActionsMenu
                          locale={locale}
                          speciesId={item.id}
                          queryString={queryString || undefined}
                          actionsLabel={t("panel_page.col_actions")}
                          managePhotosLabel={t("panel_page.action_manage_photos")}
                          manageReferencesLabel={t("panel_page.action_manage_references")}
                          manageSpeciesLabel={t("panel_page.action_manage")}
                          detailsSpeciesLabel={t("panel_page.action_details")}
                          requestUpdateLabel={t("species_page.request_update_cta")}
                          canManageSpecies={canManageSpecies}
                          canManagePhotos={canManageSpecies}
                          canManageReferences={canManageSpecies}
                          canRequestUpdate={canRequestUpdate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getSpeciesThumb(item)}
                      alt={item.scientific_name}
                      className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = specieCardDefault;
                      }}
                    />
                    <Link
                      to={`/${locale}/especie/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      {item.scientific_name}
                    </Link>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {t("panel_page.col_lineage")}: {item.lineage || "-"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                    <span>{t("panel_page.col_published")}:</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPublishedBadgeClass(
                        item.is_visible
                      )}`}
                    >
                      {item.is_visible ? t("species_page.lumm.yes") : t("species_page.lumm.no")}
                    </span>
                  </p>
                  <div className="mt-3">
                    <SpeciesActionsMenu
                      locale={locale}
                      speciesId={item.id}
                      queryString={queryString || undefined}
                      actionsLabel={t("panel_page.col_actions")}
                      managePhotosLabel={t("panel_page.action_manage_photos")}
                      manageReferencesLabel={t("panel_page.action_manage_references")}
                      manageSpeciesLabel={t("panel_page.action_manage")}
                      detailsSpeciesLabel={t("panel_page.action_details")}
                      requestUpdateLabel={t("species_page.request_update_cta")}
                      canManageSpecies={canManageSpecies}
                      canManagePhotos={canManageSpecies}
                      canManageReferences={canManageSpecies}
                      canRequestUpdate={canRequestUpdate}
                      mobile
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          <UsersPagination
            page={page}
            pages={pages}
            perPage={SPECIES_PER_PAGE}
            total={total}
            previousLabel={t("panel_page.pagination_previous")}
            nextLabel={t("panel_page.pagination_next")}
            summaryLabel={({ start, end, total: summaryTotal }) =>
              t("panel_page.species_pagination_summary", { start, end, total: summaryTotal })
            }
            onPageChange={(nextPage) => {
              setPage(nextPage);
              updatePageQuery(nextPage);
            }}
          />
        </>
      ) : null}
    </section>
  );
}

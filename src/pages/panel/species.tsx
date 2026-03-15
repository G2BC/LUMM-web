import { searchEspecies } from "@/api/species";
import type { ISpecie } from "@/api/species/types/ISpecie";
import specieCardDefault from "@/assets/specie-card-default.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { UsersPagination } from "@/pages/panel/components/users-pagination";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

const SPECIES_PER_PAGE = 20;

function getSpeciesThumb(species: ISpecie) {
  const featuredPhoto = species.photos?.find((photo) => photo.featured);
  const firstPhoto = featuredPhoto ?? species.photos?.[0];
  return firstPhoto?.medium_url || firstPhoto?.original_url || specieCardDefault;
}

export default function PanelSpeciesPage() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;

  const [items, setItems] = useState<ISpecie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);

    void searchEspecies({
      search: debouncedSearch || undefined,
      page,
      per_page: SPECIES_PER_PAGE,
      signal: controller.signal,
    })
      .then((response) => {
        const nextPages = Math.max(1, response.pages ?? 1);

        if (page > nextPages) {
          setPage(nextPages);
          return;
        }

        setItems(response.items);
        setTotal(response.total);
        setPages(nextPages);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setHasError(true);
        setItems([]);
        setTotal(0);
        setPages(1);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, page]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <section className="text-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{t("panel_page.species_title")}</h2>
        <p className="mt-1 text-slate-600">{t("panel_page.species_subtitle")}</p>
      </div>

      <div className="mb-4 md:max-w-sm">
        <Input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder={t("panel_page.species_search_placeholder")}
          className="text-slate-900 caret-slate-900 placeholder:text-slate-400"
        />
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
          <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-4 py-3">{t("panel_page.col_species_name")}</th>
                  <th className="px-4 py-3">{t("panel_page.col_lineage")}</th>
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
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" disabled>
                        {t("panel_page.action_coming_soon")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
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
                <div className="mt-3">
                  <Button size="sm" variant="outline" disabled>
                    {t("panel_page.action_coming_soon")}
                  </Button>
                </div>
              </article>
            ))}
          </div>

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
            onPageChange={setPage}
          />
        </>
      ) : null}
    </section>
  );
}

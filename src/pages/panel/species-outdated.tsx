import { listOutdatedSpecies, updateSpecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { confirmAction } from "@/components/confirm-action";
import { UsersPagination } from "@/pages/panel/components/users-pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router";
import { DEFAULT_LOCALE } from "@/lib/lang";

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

const OUTDATED_PER_PAGE = 30;

function parsePageParam(value: string | null) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

export default function PanelSpeciesOutdatedPage() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => parsePageParam(searchParams.get("page")));
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextPage = parsePageParam(searchParams.get("page"));
    setPage((current) => (current === nextPage ? current : nextPage));
  }, [searchParams]);

  const updatePageQuery = useCallback(
    (nextPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextPage <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(nextPage));
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const {
    data,
    isLoading,
    isError: hasError,
  } = useQuery({
    queryKey: speciesKeys.outdated({ page }),
    queryFn: ({ signal }) => listOutdatedSpecies({ page, per_page: OUTDATED_PER_PAGE, signal }),
    placeholderData: keepPreviousData,
  });

  const {
    mutate: markResolved,
    isPending: isResolving,
    variables: resolvingId,
  } = useMutation({
    mutationFn: (speciesId: number) => updateSpecies(speciesId, { is_outdated_mycobank: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: speciesKeys.outdated({}) });
    },
  });

  async function handleMarkResolved(speciesId: number) {
    const confirmed = await confirmAction({
      title: t("panel_page.outdated_confirm_title"),
      text: t("panel_page.outdated_confirm_text"),
      confirmButtonText: t("panel_page.outdated_confirm_yes"),
      cancelButtonText: t("panel_page.outdated_confirm_no"),
    });
    if (!confirmed) return;
    markResolved(speciesId);
  }

  const items = data?.items ?? [];
  const pages = Math.max(1, data?.pages ?? 1);
  const total = data?.total ?? 0;
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (data && page > Math.max(1, data.pages ?? 1)) {
      const nextPages = Math.max(1, data.pages ?? 1);
      setPage(nextPages);
      updatePageQuery(nextPages);
    }
  }, [data, page, updatePageQuery]);

  return (
    <section className="text-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{t("panel_page.outdated_title")}</h2>
        <p className="mt-1 text-slate-600">{t("panel_page.outdated_subtitle")}</p>
      </div>

      {isLoading ? <p className="text-slate-600">{t("panel_page.outdated_loading")}</p> : null}

      {!isLoading && hasError ? (
        <div className="rounded-lg border border-dashed border-red-300 px-4 py-8 text-center">
          <p className="text-sm text-red-700">{t("panel_page.outdated_load_error")}</p>
        </div>
      ) : null}

      {!isLoading && !hasError && items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">{t("panel_page.outdated_empty")}</p>
        </div>
      ) : null}

      {!isLoading && !hasError && items.length > 0 ? (
        <>
          {isDesktop ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="px-4 py-3">{t("panel_page.col_species_name")}</th>
                    <th className="px-4 py-3">{t("panel_page.outdated_col_mycobank_id")}</th>
                    <th className="px-4 py-3 text-right">{t("panel_page.col_actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium">{item.scientific_name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.mycobank_index_fungorum_id ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isResolving && resolvingId === item.id}
                            onClick={() => handleMarkResolved(item.id)}
                            className="text-sm font-medium text-emerald-700 hover:underline disabled:opacity-50"
                          >
                            {isResolving && resolvingId === item.id
                              ? t("panel_page.outdated_resolving")
                              : t("panel_page.outdated_mark_resolved")}
                          </button>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("panel_page.col_actions")}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuItem asChild>
                                <Link to={`/${locale}/painel/especies/${item.id}/editar`}>
                                  <Edit2 className="h-4 w-4" />
                                  {t("panel_page.action_manage")}
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
                  <p className="font-semibold text-slate-900">{item.scientific_name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {t("panel_page.outdated_col_mycobank_id")}:{" "}
                    {item.mycobank_index_fungorum_id ?? "-"}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isResolving && resolvingId === item.id}
                      onClick={() => handleMarkResolved(item.id)}
                      className="text-sm font-medium text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      {isResolving && resolvingId === item.id
                        ? t("panel_page.outdated_resolving")
                        : t("panel_page.outdated_mark_resolved")}
                    </button>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("panel_page.col_actions")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem asChild>
                          <Link to={`/${locale}/painel/especies/${item.id}/editar`}>
                            <Edit2 className="h-4 w-4" />
                            {t("panel_page.action_manage")}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </article>
              ))}
            </div>
          )}

          <UsersPagination
            page={page}
            pages={pages}
            perPage={OUTDATED_PER_PAGE}
            total={total}
            previousLabel={t("panel_page.pagination_previous")}
            nextLabel={t("panel_page.pagination_next")}
            summaryLabel={({ start, end, total: summaryTotal }) =>
              t("panel_page.outdated_pagination_summary", { start, end, total: summaryTotal })
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

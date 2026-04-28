import { listOutdatedSpecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { DEFAULT_LOCALE } from "@/lib/lang";

export default function PanelOverviewPage() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const user = useAuthStore((state) => state.user);
  const role = (user?.role ?? "").toLowerCase();
  const canSeeOutdated = role === "admin" || role === "curator";

  const { data: outdatedData } = useQuery({
    queryKey: speciesKeys.outdated({ page: 1, per_page: 1 }),
    queryFn: ({ signal }) => listOutdatedSpecies({ page: 1, per_page: 1, signal }),
    enabled: canSeeOutdated,
  });

  const outdatedTotal = outdatedData?.total ?? 0;

  return (
    <div className="py-2 space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">
        {t("panel_page.welcome", { name: user?.name ?? "" })}
      </h2>

      {canSeeOutdated && outdatedTotal > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-900">{t("panel_page.outdated_alert_title")}</p>
              <p className="mt-0.5 text-sm text-amber-700">
                {t("panel_page.outdated_alert_text", { count: outdatedTotal })}
              </p>
            </div>
            <Link
              to={`/${locale}/painel/especies/desatualizadas`}
              className="shrink-0 text-sm font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900"
            >
              {t("panel_page.outdated_alert_cta")}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

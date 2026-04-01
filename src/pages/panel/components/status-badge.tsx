import type { SpeciesRequestStatus } from "@/api/species/types/IChangeRequest";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export function StatusBadge({ status }: { status: SpeciesRequestStatus }) {
  const { t } = useTranslation();
  const label =
    status === "approved"
      ? t("panel_requests.status_approved")
      : status === "rejected"
        ? t("panel_requests.status_rejected")
        : status === "partial_approved"
          ? t("panel_requests.status_partial_approved")
          : t("panel_requests.status_pending");

  if (status === "approved") return <Badge className="bg-emerald-600">{label}</Badge>;
  if (status === "rejected") return <Badge variant="destructive">{label}</Badge>;
  if (status === "partial_approved") return <Badge className="bg-sky-600">{label}</Badge>;
  return <Badge className="bg-amber-500 text-black">{label}</Badge>;
}

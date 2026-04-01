import type { SpeciesReviewDecision } from "@/api/species/types/IChangeRequest";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DecisionToggle({
  value,
  onChange,
}: {
  value: SpeciesReviewDecision;
  onChange: (_: SpeciesReviewDecision) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex gap-1 rounded-md border border-slate-300 bg-white p-1">
      <Button
        type="button"
        size="sm"
        variant={value === "approve" ? "default" : "ghost"}
        className={
          value === "approve"
            ? "h-7 bg-[#118A2A] px-2 text-xs text-white hover:bg-[#0E7323]"
            : "h-7 px-2 text-xs text-[#118A2A] hover:bg-emerald-50 hover:text-[#0E7323]"
        }
        onClick={() => onChange("approve")}
      >
        <Check className="mr-1 h-3 w-3" />
        {t("panel_requests.approve")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === "reject" ? "destructive" : "ghost"}
        className={
          value === "reject"
            ? "h-7 px-2 text-xs"
            : "h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
        }
        onClick={() => onChange("reject")}
      >
        <X className="mr-1 h-3 w-3" />
        {t("panel_requests.reject")}
      </Button>
    </div>
  );
}

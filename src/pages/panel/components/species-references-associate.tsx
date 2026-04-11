import { ComboboxAsync, type ComboboxOption } from "@/components/combobox-async";
import { Button } from "@/components/ui/button";
import { Link2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type SpeciesReferencesAssociateProps = {
  selectedReferenceId: number | null;
  message: string | null;
  isAssociating: boolean;
  fetchOptions: (_search: string, _signal: AbortController["signal"]) => Promise<ComboboxOption[]>;
  onSelect: (_id: number | null) => void;
  onAssociate: () => void;
};

export function SpeciesReferencesAssociate({
  selectedReferenceId,
  message,
  isAssociating,
  fetchOptions,
  onSelect,
  onAssociate,
}: SpeciesReferencesAssociateProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          {t("panel_page.species_references_associate_title")}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          {t("panel_page.species_references_associate_hint")}
        </p>
      </div>

      {message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </div>
      ) : null}

      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <ComboboxAsync
            fetchOptions={fetchOptions}
            placeholder={t("panel_page.species_references_associate_search_placeholder")}
            variant="light"
            value={selectedReferenceId}
            onSelect={(id) => onSelect(id !== null ? Number(id) : null)}
          />
        </div>
        <Button
          type="button"
          onClick={onAssociate}
          disabled={isAssociating || !selectedReferenceId}
          className="shrink-0"
        >
          {isAssociating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {t("panel_page.species_references_associate_cta")}
        </Button>
      </div>
    </div>
  );
}

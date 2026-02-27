import type { SpeciesRequestFormValues } from "@/pages/species-request/types";
import { LUMINESCENT_PART_OPTIONS } from "@/pages/species-request/constants";
import { useTranslation } from "react-i18next";

type ReviewStepProps = {
  values: SpeciesRequestFormValues;
  selectedFileCount: number;
};

export function ReviewStep({ values, selectedFileCount }: ReviewStepProps) {
  const { t } = useTranslation();
  const selectedLuminescentParts = LUMINESCENT_PART_OPTIONS.filter((option) => {
    const action = values.luminescent_parts[option.id];
    return action === "add" || action === "remove";
  }).map((option) => {
    const action = values.luminescent_parts[option.id];
    const actionLabel =
      action === "remove" ? t("species_page.lumm.no") : t("species_page.lumm.yes");
    return `${t(option.labelKey)} (${actionLabel})`;
  });
  const hasLuminescentParts = selectedLuminescentParts.length > 0;
  const hasReferences = Boolean(values.references_raw?.trim());
  const hasRequestNote = Boolean(values.request_note?.trim());
  const hasSpeciesSectionData = hasLuminescentParts || hasReferences || hasRequestNote;

  return (
    <section className="space-y-4 text-sm">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-white/60">
          {t("species_request.review_identity")}
        </p>
        <p>{values.requester_name || "-"}</p>
        <p>{values.requester_email || "-"}</p>
        <p>{values.requester_institution || "-"}</p>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-wide text-white/60">
          {t("species_request.review_species")}
        </p>
        {hasSpeciesSectionData ? (
          <>
            {hasLuminescentParts ? (
              <p>
                {t("species_request.luminescent_parts")}: {selectedLuminescentParts.join(", ")}
              </p>
            ) : null}
            {hasReferences ? <p>{values.references_raw}</p> : null}
            {hasRequestNote ? <p>{values.request_note}</p> : null}
          </>
        ) : (
          <p>-</p>
        )}
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-wide text-white/60">
          {t("species_request.review_photos")}
        </p>
        <p>{t("species_request.files_selected", { count: selectedFileCount })}</p>
      </div>
    </section>
  );
}

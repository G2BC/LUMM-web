import type { SpeciesRequestFormValues } from "@/pages/species-request/types";
import { LUMINESCENT_PART_OPTIONS } from "@/pages/species-request/constants";
import { selectSpeciesDomain } from "@/api/species";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ReviewStepProps = {
  values: SpeciesRequestFormValues;
  selectedFileCount: number;
};

export function ReviewStep({ values, selectedFileCount }: ReviewStepProps) {
  const { t, i18n } = useTranslation();
  const [domainLabelsById, setDomainLabelsById] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const isPt = i18n.language.toLowerCase().startsWith("pt");

    void Promise.all([
      selectSpeciesDomain("growth_form"),
      selectSpeciesDomain("nutrition_mode"),
      selectSpeciesDomain("substrate"),
      selectSpeciesDomain("habitat"),
    ])
      .then(([growthForms, nutritionModes, substrates, habitats]) => {
        if (!active) return;
        const merged = [...growthForms, ...nutritionModes, ...substrates, ...habitats];
        const next: Record<string, string> = {};
        for (const option of merged) {
          next[String(option.value)] = isPt ? option.label_pt : option.label_en;
        }
        setDomainLabelsById(next);
      })
      .catch(() => {
        if (!active) return;
        setDomainLabelsById({});
      });

    return () => {
      active = false;
    };
  }, [i18n.language]);

  const formatDomainValues = useMemo(
    () => (ids: Array<string | number>) =>
      ids.map((id) => domainLabelsById[String(id)] ?? String(id)).join(", "),
    [domainLabelsById]
  );
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
  const hasGrowthForms = values.growth_forms.length > 0;
  const hasNutritionModes = values.nutrition_modes.length > 0;
  const hasSubstrates = values.substrates.length > 0;
  const hasHabitats = values.habitats.length > 0;
  const hasSizeCm = Boolean(values.size_cm?.trim());
  const hasSeasonRange = Boolean(
    values.season_start_month?.trim() && values.season_end_month?.trim()
  );
  const hasReferences = Boolean(values.references_raw?.trim());
  const hasRequestNote = Boolean(values.request_note?.trim());
  const formatMonth = (value?: string) => {
    const month = Number(value);
    if (!Number.isFinite(month) || month < 1 || month > 12) return "";
    const label = new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(
      new Date(2020, month - 1, 1)
    );
    return label.charAt(0).toUpperCase() + label.slice(1);
  };
  const hasSpeciesSectionData =
    hasLuminescentParts ||
    hasGrowthForms ||
    hasNutritionModes ||
    hasSubstrates ||
    hasHabitats ||
    hasSizeCm ||
    hasSeasonRange ||
    hasReferences ||
    hasRequestNote;

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
            {hasGrowthForms ? (
              <p>
                {t("species_request.growth_forms")}: {formatDomainValues(values.growth_forms)}
              </p>
            ) : null}
            {hasNutritionModes ? (
              <p>
                {t("species_request.nutrition_modes")}: {formatDomainValues(values.nutrition_modes)}
              </p>
            ) : null}
            {hasSubstrates ? (
              <p>
                {t("species_request.substrates")}: {formatDomainValues(values.substrates)}
              </p>
            ) : null}
            {hasHabitats ? (
              <p>
                {t("species_request.habitats")}: {formatDomainValues(values.habitats)}
              </p>
            ) : null}
            {hasSizeCm ? (
              <p>
                {t("species_request.size_cm")}: {values.size_cm}
              </p>
            ) : null}
            {hasSeasonRange ? (
              <p>
                {t("species_request.seasonality")}: {formatMonth(values.season_start_month)}{" "}
                {t("species_request.season_range_separator")} {formatMonth(values.season_end_month)}
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

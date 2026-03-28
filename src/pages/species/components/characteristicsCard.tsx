import type { SpeciesCharacteristics } from "@/api/species/types/ISpecie";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getLocalizedCharacteristicValue,
  getLocalizedOptionLabels,
  withNoInformationFallback,
} from "../utils";

interface CharacteristicsCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  rowLabelClass: string;
  rowValueClass: string;
  characteristics: SpeciesCharacteristics | undefined;
  isPtLanguage: boolean;
  conservationStatusCode: string;
  noInformationLabel: string;
  conservationStatusDescription: string;
}

export function CharacteristicsCard({
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  rowLabelClass,
  rowValueClass,
  characteristics,
  isPtLanguage,
  conservationStatusCode,
  noInformationLabel,
  conservationStatusDescription,
}: CharacteristicsCardProps) {
  const { t } = useTranslation();

  const nutritionModesValue = getLocalizedOptionLabels(
    characteristics?.nutrition_modes,
    isPtLanguage
  );
  const growthFormsValue = getLocalizedOptionLabels(characteristics?.growth_forms, isPtLanguage);
  const substratesValue = getLocalizedOptionLabels(characteristics?.substrates, isPtLanguage);
  const habitatsValue = getLocalizedOptionLabels(characteristics?.habitats, isPtLanguage);
  const conservationStatusLabel = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.name`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.name"),
    }
  );

  const characteristicRows: Array<{
    label: string;
    value: string | number;
    longText?: boolean;
    tooltip?: string;
    tooltipTitle?: string;
  }> = [
    {
      label: t("species_page.fields.size_cm"),
      value: withNoInformationFallback(characteristics?.size_cm, noInformationLabel),
    },
    {
      label: t("species_page.fields.colors"),
      value: withNoInformationFallback(
        getLocalizedCharacteristicValue(characteristics, "colors", isPtLanguage),
        noInformationLabel
      ),
    },
    {
      label: t("species_page.fields.edible"),
      value:
        characteristics?.edible === true
          ? t("species_page.lumm.yes")
          : characteristics?.edible === false
            ? t("species_page.lumm.no")
            : t("species_page.fields.no_information"),
    },
    {
      label: t("species_page.fields.growth_forms"),
      value: withNoInformationFallback(growthFormsValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.nutrition_modes"),
      value: withNoInformationFallback(nutritionModesValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.substrates"),
      value: withNoInformationFallback(substratesValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.habitats"),
      value: withNoInformationFallback(habitatsValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.conservation_status"),
      value: conservationStatusLabel,
      tooltipTitle: `${conservationStatusCode} — ${conservationStatusLabel}`,
      tooltip: conservationStatusDescription,
    },
    {
      label: t("species_page.fields.general_description"),
      value:
        getLocalizedCharacteristicValue(characteristics, "general_description", isPtLanguage) ||
        t("species_page.fields.no_information"),
      longText: true,
    },
  ];

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <FileText className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.sections.characteristics")}</p>
        </div>
        {characteristicRows.length ? (
          <div className="space-y-2">
            {characteristicRows.map((row) =>
              (() => {
                const useLongTextLayout =
                  row.longText || (typeof row.value === "string" && row.value.length > 70);
                return (
                  <div
                    key={row.label}
                    className={`border-b border-white/10 pb-2 last:border-b-0 ${
                      useLongTextLayout ? "space-y-1" : "flex items-center justify-between gap-4"
                    }`}
                  >
                    <p className={rowLabelClass}>{row.label}</p>
                    <div
                      className={`flex items-center gap-1.5 ${
                        useLongTextLayout ? "justify-start" : "max-w-[55%] justify-end"
                      }`}
                    >
                      <p
                        className={`${rowValueClass} ${
                          useLongTextLayout
                            ? "text-left leading-relaxed text-white/88"
                            : "break-words text-right"
                        }`}
                      >
                        {row.value}
                      </p>
                      {row.tooltip ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center"
                                aria-label={row.tooltipTitle || row.tooltip}
                              >
                                <Info className="h-3.5 w-3.5 text-white/50" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-80 border border-white/20 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/90 shadow-lg"
                            >
                              {row.tooltipTitle ? (
                                <p className="font-semibold text-white">{row.tooltipTitle}</p>
                              ) : null}
                              <p className={row.tooltipTitle ? "mt-1" : ""}>{row.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        ) : (
          <p className="text-sm text-white/55">{t("common.unavailable")}</p>
        )}
      </CardContent>
    </Card>
  );
}

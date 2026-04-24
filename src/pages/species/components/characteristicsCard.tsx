import type { ISpecie, SpeciesCharacteristics } from "@/api/species/types/ISpecie";
import { Card, CardContent } from "@/components/ui/card";
import { HoverPopover } from "@/components/hover-popover";
import { FileText, Info } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  formatLocalizedMonth,
  getLocalizedCharacteristicValue,
  getLocalizedOptionLabels,
  withNoInformationFallback,
} from "../utils";
import { SimilarSpecies } from "./similarSpecies";

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
  noInformationLabel: string;
  conservationStatusCode: string;
  conservationStatusDescription: string;
  species: ISpecie | null | undefined;
  locale: string;
}

type CharacteristicRow = {
  label: string;
  value?: string | number;
  content?: ReactNode;
  longText?: boolean;
  tooltip?: string;
  tooltipTitle?: string;
};

type CharacteristicGroup = {
  title: string;
  rows: CharacteristicRow[];
};

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
  noInformationLabel,
  species,
  locale,
}: CharacteristicsCardProps) {
  const { t } = useTranslation();

  const nutritionModesValue = getLocalizedOptionLabels(
    characteristics?.nutrition_modes,
    isPtLanguage
  );
  const growthFormsValue = getLocalizedOptionLabels(characteristics?.growth_forms, isPtLanguage);
  const substratesValue = getLocalizedOptionLabels(characteristics?.substrates, isPtLanguage);
  const decayTypesValue = getLocalizedOptionLabels(characteristics?.decay_types, isPtLanguage);
  const habitatsValue = getLocalizedOptionLabels(characteristics?.habitats, isPtLanguage);

  const distributionsValue = species?.distributions?.length
    ? species.distributions
        .map((d) => (isPtLanguage ? d.label_pt : d.label_en))
        .filter(Boolean)
        .join(", ")
    : null;

  const similarSpeciesList = characteristics?.similar_species ?? [];

  const seasonStart = formatLocalizedMonth(locale, characteristics?.season_start_month);
  const seasonEnd = formatLocalizedMonth(locale, characteristics?.season_end_month);
  const seasonValue =
    seasonStart && seasonEnd ? `${seasonStart} – ${seasonEnd}` : (seasonStart ?? seasonEnd ?? null);

  const groups: CharacteristicGroup[] = [
    {
      title: t("species_page.sections.characteristics_trophic"),
      rows: [
        {
          label: t("species_page.fields.growth_forms"),
          value: withNoInformationFallback(growthFormsValue, noInformationLabel),
        },
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
          label: t("species_page.fields.nutrition_modes"),
          value: withNoInformationFallback(nutritionModesValue, noInformationLabel),
        },
      ],
    },
    {
      title: t("species_page.sections.characteristics_substrate"),
      rows: [
        {
          label: t("species_page.fields.substrates"),
          value: withNoInformationFallback(substratesValue, noInformationLabel),
        },
        {
          label: t("species_page.fields.decay_types"),
          value: withNoInformationFallback(decayTypesValue, noInformationLabel),
        },
      ],
    },
    {
      title: t("species_page.sections.characteristics_habitat"),
      rows: [
        {
          label: t("species_page.fields.habitats"),
          value: withNoInformationFallback(habitatsValue, noInformationLabel),
        },
      ],
    },
    {
      title: t("species_page.sections.characteristics_distribution"),
      rows: [
        {
          label: t("species_page.fields.occurrence"),
          value: withNoInformationFallback(distributionsValue, noInformationLabel),
        },
        {
          label: t("species_page.fields.season"),
          value: withNoInformationFallback(seasonValue, noInformationLabel),
        },
        {
          label: t("species_page.fields.nearby_trees"),
          value: withNoInformationFallback(
            getLocalizedCharacteristicValue(characteristics, "nearby_trees", isPtLanguage),
            noInformationLabel
          ),
        },
        {
          label: t("species_page.fields.similar_species"),
          content: <SimilarSpecies similarSpecies={similarSpeciesList} locale={locale} />,
          longText: true,
        },
        {
          label: t("species_page.fields.finding_tips"),
          value: withNoInformationFallback(
            getLocalizedCharacteristicValue(characteristics, "finding_tips", isPtLanguage),
            noInformationLabel
          ),
          longText: true,
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
          label: t("species_page.fields.cultivation_possible"),
          value:
            characteristics?.cultivation_possible === true
              ? t("species_page.lumm.yes")
              : characteristics?.cultivation_possible === false
                ? t("species_page.lumm.no")
                : t("species_page.fields.no_information"),
        },
        ...(characteristics?.cultivation_possible === true
          ? [
              {
                label: t("species_page.fields.cultivation"),
                value: withNoInformationFallback(
                  getLocalizedCharacteristicValue(characteristics, "cultivation", isPtLanguage),
                  noInformationLabel
                ),
                longText: true,
              },
            ]
          : []),
      ],
    },
  ];

  const hasAnyContent = groups.some((g) => g.rows.length > 0);

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <FileText className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.sections.characteristics")}</p>
        </div>
        {hasAnyContent ? (
          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-3 flex items-center gap-3">
                  <p className="shrink-0 text-[0.95rem] font-semibold tracking-wide text-primary/80">
                    {group.title}
                  </p>
                  <div className="h-px flex-1 bg-primary/30" />
                </div>
                <div className="space-y-2">
                  {group.rows.map((row) => {
                    const useLongTextLayout =
                      row.longText || (typeof row.value === "string" && row.value.length > 70);
                    return (
                      <div
                        key={row.label}
                        className={`border-b border-white/10 pb-2 last:border-b-0 ${
                          useLongTextLayout
                            ? "space-y-1"
                            : "flex items-center justify-between gap-4"
                        }`}
                      >
                        <p className={rowLabelClass}>{row.label}</p>
                        {row.content ? (
                          <div className="text-[0.98rem] leading-relaxed text-white/88">
                            {row.content}
                          </div>
                        ) : (
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
                              <HoverPopover
                                trigger={<Info className="size-4 text-white/50" />}
                                triggerClassName="inline-flex items-center"
                                contentClassName="max-w-80 border border-white/20 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/90 shadow-lg"
                                content={
                                  <>
                                    {row.tooltipTitle ? (
                                      <p className="font-semibold text-white">{row.tooltipTitle}</p>
                                    ) : null}
                                    <p className={row.tooltipTitle ? "mt-1" : ""}>{row.tooltip}</p>
                                  </>
                                }
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/55">{t("common.unavailable")}</p>
        )}
      </CardContent>
    </Card>
  );
}

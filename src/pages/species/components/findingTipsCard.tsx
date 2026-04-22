import { Card, CardContent } from "@/components/ui/card";
import { HoverPopover } from "@/components/hover-popover";
import { Search, Users } from "lucide-react";
import { SimilarSpecies } from "./similarSpecies";
import { useTranslation } from "react-i18next";
import { getLocalizedCharacteristicValue, withNoInformationFallback } from "../utils";
import type { ISpecie } from "@/api/species/types/ISpecie";

interface FindingTipsCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  rowLabelClass: string;
  isPtLanguage: boolean;
  noInformationLabel: string;
  seasonStart: string | null;
  seasonEnd: string | null;
  findingTipsValue: string;
  species: ISpecie | null;
  locale: string;
}

export function FindingTipsCard({
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  rowLabelClass,
  isPtLanguage,
  noInformationLabel,
  seasonStart,
  seasonEnd,
  findingTipsValue,
  species,
  locale,
}: FindingTipsCardProps) {
  const { t } = useTranslation();

  if (!species) return null;

  const characteristics = species.species_characteristics;

  const nearbyTreesValue = withNoInformationFallback(
    getLocalizedCharacteristicValue(characteristics ?? undefined, "nearby_trees", isPtLanguage),
    noInformationLabel
  );
  const seasonValue =
    seasonStart && seasonEnd
      ? `${seasonStart} à ${seasonEnd}`
      : t("species_page.fields.no_information");
  const useNearbyTreesLongText =
    typeof nearbyTreesValue === "string" && nearbyTreesValue.length > 70;
  const similarSpecies = (characteristics?.similar_species ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    label: item.label,
  }));

  const occurrenceDistributions =
    species.distributions && !!species.distributions?.length ? species.distributions : null;

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <Search className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.fields.finding_tips")}</p>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-white/88 whitespace-pre-line">
          {findingTipsValue}
        </p>
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-start justify-between gap-4">
            <p className={rowLabelClass}>{t("species_page.fields.season")}</p>
            <p className="max-w-[60%] break-words text-right text-[0.98rem] font-medium text-white/90">
              {seasonValue}
            </p>
          </div>
          <div
            className={
              useNearbyTreesLongText ? "space-y-1" : "flex items-start justify-between gap-4"
            }
          >
            <p className={rowLabelClass}>{t("species_page.fields.nearby_trees")}</p>
            <div
              className={`flex items-start ${
                useNearbyTreesLongText ? "justify-start" : "max-w-[60%] justify-end"
              }`}
            >
              <p
                className={`text-[0.98rem] font-medium text-white/90 ${
                  useNearbyTreesLongText ? "text-left leading-relaxed" : "break-words text-right"
                }`}
              >
                {nearbyTreesValue}
              </p>
            </div>
          </div>
          <div className="flex items-start justify-between gap-4">
            <p className={rowLabelClass}>{t("species_page.fields.occurrence")}</p>
            <p className="max-w-[60%] break-words text-right text-[0.98rem] font-medium text-white/90">
              {occurrenceDistributions ? (
                <>
                  {occurrenceDistributions.map((d, i) => (
                    <span key={d.id}>
                      <HoverPopover
                        trigger={d.slug}
                        content={`${d.slug} - ${isPtLanguage ? d.label_pt : d.label_en}`}
                      />
                      {i < occurrenceDistributions.length - 1 && ", "}
                    </span>
                  ))}
                </>
              ) : (
                t("species_page.fields.no_information")
              )}
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary/90" />
            <p className={rowLabelClass}>{t("species_page.fields.similar_species")}</p>
          </div>
          <div className="text-[0.98rem] leading-relaxed text-white/88">
            <SimilarSpecies similarSpecies={similarSpecies} locale={locale} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

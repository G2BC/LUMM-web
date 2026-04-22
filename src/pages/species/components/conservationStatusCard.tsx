import type { SpeciesCharacteristics } from "@/api/species/types/ISpecie";
import { Card, CardContent } from "@/components/ui/card";
import { HoverPopover } from "@/components/hover-popover";
import { ShieldCheck, Info, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { normalizeConservationStatusCode } from "../utils";

interface ConservationStatusCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  rowLabelClass: string;
  rowValueClass: string;
  characteristics: SpeciesCharacteristics | undefined;
  noInformationLabel: string;
}

export function ConservationStatusCard({
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  rowLabelClass,
  rowValueClass,
  characteristics,
  noInformationLabel,
}: ConservationStatusCardProps) {
  const { t } = useTranslation();

  const conservationStatusCode = normalizeConservationStatusCode(
    characteristics?.conservation_status
  );
  const conservationStatusLabel = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.name`,
    { defaultValue: t("species_page.fields.conservation_status_values.NE.name") }
  );
  const conservationStatusDescription = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.description`,
    { defaultValue: "" }
  );

  const assessmentYear = characteristics?.iucn_assessment_year ?? null;
  const assessmentUrl = characteristics?.iucn_assessment_url ?? null;

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.sections.conservation_status")}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
            <p className={rowLabelClass}>{t("species_page.fields.conservation_status")}</p>
            <div className="flex items-center gap-1.5">
              <p className={`${rowValueClass} break-words text-right`}>{conservationStatusLabel}</p>
              {conservationStatusDescription ? (
                <HoverPopover
                  trigger={<Info className="size-4 text-white/50" />}
                  triggerClassName="inline-flex items-center"
                  contentClassName="max-w-80 border border-white/20 bg-black/90 px-3 py-2 text-xs leading-relaxed text-white/90 shadow-lg"
                  content={
                    <>
                      <p className="font-semibold text-white">
                        {conservationStatusCode} — {conservationStatusLabel}
                      </p>
                      <p className="mt-1">{conservationStatusDescription}</p>
                    </>
                  }
                />
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
            <p className={rowLabelClass}>{t("species_page.fields.iucn_assessment_year")}</p>
            <p className={`${rowValueClass} break-words text-right`}>
              {assessmentYear ?? noInformationLabel}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 pb-2">
            <p className={rowLabelClass}>{t("species_page.fields.iucn_assessment_url")}</p>
            {assessmentUrl ? (
              <a
                href={assessmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-right text-sm font-medium text-emerald-400 hover:underline"
              >
                {t("common.open_link")}
                <ExternalLink className="size-3.5" />
              </a>
            ) : (
              <p className={`${rowValueClass} break-words text-right`}>{noInformationLabel}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

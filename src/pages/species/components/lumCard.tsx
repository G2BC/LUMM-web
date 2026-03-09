import type { ISpecie } from "@/api/species/types/ISpecie";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LumCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  characteristics: ISpecie["species_characteristics"];
}

export function LumCard({
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  characteristics,
}: LumCardProps) {
  const { t } = useTranslation();

  const lumStatusChipClass = (status: "yes" | "no" | "unknown") => {
    if (status === "yes") return "border-emerald-400/45 bg-emerald-500/15 text-emerald-200";
    if (status === "no") return "border-rose-400/45 bg-rose-500/15 text-rose-200";
    return "border-white/20 bg-white/5 text-white/70";
  };

  const lumHierarchyRows: Array<{
    label: string;
    value: boolean | null | undefined;
    level: 0 | 1 | 2;
  }> = [
    { label: t("species_page.lumm.mycelium"), value: characteristics?.lum_mycelium, level: 0 },
    { label: t("species_page.lumm.basidiome"), value: characteristics?.lum_basidiome, level: 0 },
    { label: t("species_page.lumm.stipe"), value: characteristics?.lum_stipe, level: 1 },
    { label: t("species_page.lumm.pileus"), value: characteristics?.lum_pileus, level: 1 },
    { label: t("species_page.lumm.lamellae"), value: characteristics?.lum_lamellae, level: 2 },
    { label: t("species_page.lumm.spores"), value: characteristics?.lum_spores, level: 2 },
  ];

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <Sparkles className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.lumm.section_title")}</p>
        </div>
        <div className="space-y-1">
          {lumHierarchyRows.map((row) => {
            const status =
              row.value === true ? "yes" : row.value === false ? "no" : ("unknown" as const);
            return (
              <div
                key={`${row.level}-${row.label}`}
                className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0"
              >
                <div
                  className="flex items-center gap-2"
                  style={{ marginLeft: `${row.level * 18}px` }}
                >
                  {row.level > 0 ? <span className="text-white/45">↳</span> : null}
                  <p
                    className={
                      row.level === 0 ? "text-base font-semibold text-white/95" : "text-white/85"
                    }
                  >
                    {row.label}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${lumStatusChipClass(
                    status
                  )}`}
                >
                  {status === "yes"
                    ? t("species_page.lumm.yes")
                    : status === "no"
                      ? t("species_page.lumm.no")
                      : t("species_page.fields.no_information")}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

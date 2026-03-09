import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { parseClassification, taxonomyLabels } from "../utils";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { BookOpenText } from "lucide-react";

interface TaxonomyCardProps {
  show: boolean;
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  rowLabelClass: string;
  rowValueClass: string;
  species: ISpecie | null;
}

export function TaxonomyCard({
  show,
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  species,
  rowLabelClass,
  rowValueClass,
}: TaxonomyCardProps) {
  const { t } = useTranslation();

  if (!show || !species) return null;

  const taxonomyRows = parseClassification(species?.taxonomy?.classification)
    .map((item, index) => {
      const label = taxonomyLabels[index];
      if (!label || !item) return null;
      return {
        label: t(label),
        value: item,
        level: index,
        italicValue: label === "species_page.taxonomy.genus",
      };
    })
    .filter((item): item is { label: string; value: string; level: number; italicValue: boolean } =>
      Boolean(item)
    )
    .concat({
      label: t("species_page.taxonomy.species"),
      value: (species?.scientific_name?.trim().split(/\s+/).pop() || "").trim(),
      level: taxonomyLabels.length,
      italicValue: true,
    })
    .concat({
      label: t("species_page.taxonomy.authors"),
      value: species?.taxonomy?.authors || "",
      level: 0,
      italicValue: false,
    })
    .concat({
      label: t("species_page.taxonomy.year_of_publication"),
      value: species?.taxonomy?.years_of_effective_publication || "",
      level: 0,
      italicValue: false,
    });

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <BookOpenText className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("common.taxonomy")}</p>
        </div>
        <div className="space-y-2">
          {taxonomyRows
            .filter((row) => Boolean(String(row.value || "").trim()))
            .map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-white/10 pb-2 last:border-b-0"
              >
                <div
                  className="flex items-center gap-2"
                  style={{ marginLeft: `${row.level * 12}px` }}
                >
                  {row.level > 0 ? <span className="text-white/45">↳</span> : null}
                  <p className={rowLabelClass}>{row.label}</p>
                </div>
                <p className={`${rowValueClass} ${row.italicValue ? "italic" : ""}`}>{row.value}</p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { parseClassification, splitTaxonName, taxonomyLabels } from "../utils";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { BookOpenText } from "lucide-react";
import { getCountryName } from "@/lib/country-names";

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

type TaxonomyRow = { label: string; value: string; level: number; italicValue: boolean };

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
  const { t, i18n } = useTranslation();

  if (!show || !species) return null;

  const speciesNames = splitTaxonName(species.scientific_name);

  const taxonomyRows = parseClassification(species?.taxonomy?.classification)
    .map((item, index) => {
      const label = taxonomyLabels[index];
      if (!label || !item) return null;

      const isGenus = label === "species_page.taxonomy.genus";

      return {
        label: t(label),
        value: isGenus ? speciesNames.genus || item : item,
        level: index,
        italicValue: isGenus,
      };
    })
    .concat({
      label: t("species_page.taxonomy.section"),
      value: species.section || "",
      level: 6,
      italicValue: true,
    })
    .concat({
      label: t("species_page.taxonomy.epithet"),
      value: speciesNames.epithet || "",
      level: 7,
      italicValue: true,
    })
    .concat({
      label: t("species_page.taxonomy.infraspecific_taxon"),
      value: speciesNames.infraspecific_taxon || "",
      level: 8,
      italicValue: false,
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
    })
    .concat({
      label: t("species_page.taxonomy.basionym"),
      value: species?.taxonomy?.basionym || "",
      level: 0,
      italicValue: false,
    })
    .concat({
      label: t("species_page.taxonomy.synonyms"),
      value: species?.taxonomy?.synonyms || "",
      level: 0,
      italicValue: false,
    })
    .concat({
      label: t("species_page.taxonomy.type_country"),
      value: getCountryName(species?.type_country, i18n.language),
      level: 0,
      italicValue: false,
    })
    .concat({
      label: t("species_page.taxonomy.lineage"),
      value: species?.lineage || "",
      level: 0,
      italicValue: false,
    })
    .filter((item): item is TaxonomyRow => Boolean(item && item.label));

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
            .map((row) => {
              const isLong = row.value.length > 50;
              return (
                <div
                  key={row.label}
                  className={`flex border-b border-white/10 pb-2 last:border-b-0 ${isLong ? "flex-col gap-0.5" : "flex-wrap items-start justify-between gap-1"}`}
                >
                  <div
                    className="flex items-center gap-2 shrink-0"
                    style={{ marginLeft: `${row.level * 12}px` }}
                  >
                    {row.level > 0 ? <span className="text-white/45">↳</span> : null}
                    <p className={rowLabelClass}>{row.label}</p>
                  </div>
                  <p
                    className={`${rowValueClass} ${row.italicValue ? "italic" : ""} ${isLong ? "" : "max-w-[65%] text-right"}`}
                  >
                    {row.value}
                  </p>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

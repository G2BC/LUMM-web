import { Card, CardContent } from "@/components/ui/card";
import { Dna, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SpeciesNcbiRecord } from "../utils";

interface MolecularCardProps {
  isLoading: boolean;
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  ncbiRecords: SpeciesNcbiRecord[];
}

export function MolecularCard({
  isLoading,
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  ncbiRecords,
}: MolecularCardProps) {
  const { t } = useTranslation();
  const renderCell = (cell: SpeciesNcbiRecord["directLinks"]) => {
    const value = cell?.label ?? "0";
    if (!cell?.url) return value;

    return (
      <a
        className="text-primary underline underline-offset-2 hover:opacity-85"
        href={cell.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    );
  };

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <Dna className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.molecular_info.title")}</p>
        </div>
        {isLoading ? (
          <div className="rounded-xl border border-white/10 px-3 py-4 text-sm text-white/65">
            <div className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              {t("common.loading")}
            </div>
          </div>
        ) : ncbiRecords.length ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="border-b border-white/10 bg-white/[0.06] px-3 py-2 text-center text-base font-semibold text-white/90">
              {t("species_page.molecular_info.entrez_records")}
            </div>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="w-1/2 whitespace-nowrap px-3 py-2 text-left text-xs font-semibold text-white/80">
                    {t("species_page.molecular_info.database_name")}
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold text-white/80">
                    {t("species_page.molecular_info.direct_links")}
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold text-white/80">
                    {t("species_page.molecular_info.subtree_links")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ncbiRecords.map((record) => (
                  <tr
                    key={`${record.databaseName}-${record.directLinks?.label ?? "0"}-${record.subtreeLinks?.label ?? "0"}`}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <td className="px-3 py-2 text-[0.98rem] text-white/88">
                      {record.databaseName}
                    </td>
                    <td className="px-3 py-2 text-[0.98rem] font-medium text-white/92">
                      {renderCell(record.directLinks)}
                    </td>
                    <td className="px-3 py-2 text-[0.98rem] font-medium text-white/92">
                      {renderCell(record.subtreeLinks)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[0.98rem] text-white/72">
            {t("species_page.molecular_info.no_records")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

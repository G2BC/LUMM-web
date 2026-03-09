import type { ISpecie } from "@/api/species/types/ISpecie";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExternalLinksCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  species: ISpecie | null;
}

export function ExternalLinksCard({
  species,
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
}: ExternalLinksCardProps) {
  const { t } = useTranslation();

  if (!species) return null;

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <Link2 className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("common.external_links")}</p>
        </div>
        {species?.mycobank_index_fungorum_id ? (
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            href={`https://www.mycobank.org/MB/${species.mycobank_index_fungorum_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" /> Mycobank
          </a>
        ) : species?.mycobank_type ? (
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            href={`https://www.mycobank.org/details/${species.mycobank_type}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" /> Mycobank
          </a>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link2 className="h-4 w-4" /> Mycobank ({t("common.unavailable")?.toLowerCase()})
          </p>
        )}
      </CardContent>
    </Card>
  );
}

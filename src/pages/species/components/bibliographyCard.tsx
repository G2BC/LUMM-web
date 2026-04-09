import { Card, CardContent } from "@/components/ui/card";
import type { BibliographyLink } from "@/pages/species/utils";
import { BookOpenText, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BibliographyCardProps {
  links: BibliographyLink[];
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
}

export function BibliographyCard({
  links,
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
}: BibliographyCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <BookOpenText className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.bibliography.title")}</p>
        </div>

        {links.length ? (
          <div className="flex flex-wrap gap-2">
            {links.map((item) => (
              <a
                key={`${item.url}-${item.labelKey}`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                {t(item.labelKey, { defaultValue: item.fallbackLabel || item.labelKey })}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-[0.98rem] text-white/72">{t("species_page.fields.no_information")}</p>
        )}
      </CardContent>
    </Card>
  );
}

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
          <div className="flex flex-col gap-2">
            {links.map((item) => (
              <a
                key={`${item.url}-${item.labelKey}`}
                className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary/80 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                <span className="leading-relaxed">
                  {t(item.labelKey, { defaultValue: item.fallbackLabel || item.labelKey })}
                </span>
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

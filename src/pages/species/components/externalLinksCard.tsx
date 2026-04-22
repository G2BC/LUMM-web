import type { ISpecie } from "@/api/species/types/ISpecie";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { extractSpeciesExternalLinks } from "../utils";

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
  const { t, i18n } = useTranslation();

  if (!species) return null;

  const { general, fungal_links, molecular_links } = extractSpeciesExternalLinks(
    species,
    i18n.language.toLowerCase().startsWith("pt") ? "pt" : "en"
  );
  const sections = [
    { titleKey: "species_page.external_links.groups.general", links: general },
    { titleKey: "species_page.external_links.groups.fungal", links: fungal_links },
    { titleKey: "species_page.external_links.groups.molecular", links: molecular_links },
  ].filter((section) => section.links.length);

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <Link2 className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("common.external_links")}</p>
        </div>
        {sections.map((section) => (
          <div key={section.titleKey} className="space-y-2">
            <p className="text-sm font-semibold text-white/90">{t(section.titleKey)}</p>
            <div className="flex flex-wrap gap-2">
              {section.links.map((link) => (
                <a
                  key={`${section.titleKey}-${link.labelKey}-${link.url}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm text-primary/75 transition-colors hover:bg-primary/12 hover:text-primary hover:border-primary/45"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                  {t(link.labelKey, { defaultValue: link.fallbackLabel || link.labelKey })}
                </a>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

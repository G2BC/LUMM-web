import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CultivarionCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  cultivation: string;
}

export function CultivationCard({
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  cultivation,
}: CultivarionCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <FlaskConical className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.fields.cultivation")}</p>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-white/88 whitespace-pre-line">
          {cultivation}
        </p>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CuriositiesCardProps {
  sectionCardClass: string;
  sectionCardContentClass: string;
  sectionTitleWrapClass: string;
  sectionIconWrapClass: string;
  sectionTitleClass: string;
  curiosities: string;
  show: boolean;
}

export function CuriositiesCard({
  sectionCardClass,
  sectionCardContentClass,
  sectionTitleWrapClass,
  sectionIconWrapClass,
  sectionTitleClass,
  curiosities,
  show,
}: CuriositiesCardProps) {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <Card className={sectionCardClass}>
      <CardContent className={sectionCardContentClass}>
        <div className={sectionTitleWrapClass}>
          <span className={sectionIconWrapClass}>
            <Lightbulb className="h-4 w-4" />
          </span>
          <p className={sectionTitleClass}>{t("species_page.fields.curiosities")}</p>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-white/88 whitespace-pre-line">
          {curiosities}
        </p>
      </CardContent>
    </Card>
  );
}

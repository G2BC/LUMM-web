import { useTranslation } from "react-i18next";
import distributionEn from "@/assets/distribution_en.webp";
import distributionPt from "@/assets/distribution_pt.webp";

export default function DistributionPage() {
  const { i18n, t } = useTranslation();

  const language = i18n.language;

  return (
    <section className="container mx-auto pt-10 px-4">
      <h1 className="font-bold text-[22px] sm:text-[28px]">{t("distribution.title")}</h1>
      <div className="py-10 overflow-x-auto mb-10 scrollbar-hide">
        <div className="min-w-max md:min-w-0">
          {language === "en" ? (
            <img src={distributionEn} alt="Distribution of species " />
          ) : (
            <img src={distributionPt} alt="Distribuição das espécies " />
          )}
        </div>
      </div>
    </section>
  );
}

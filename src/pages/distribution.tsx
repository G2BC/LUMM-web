import { useTranslation } from "react-i18next";
import distributionEn from "@/assets/distribution_en.webp";
import distributionPt from "@/assets/distribution_pt.webp";
import { useState } from "react";

export default function DistributionPage() {
  const [loaded, setLoaded] = useState(false);
  const { i18n, t } = useTranslation();

  const language = i18n.language;

  const src = language === "en" ? distributionEn : distributionPt;
  const alt = language === "en" ? "Distribution of species" : "Distribuição das espécies";

  return (
    <section className="container mx-auto pt-10 px-4">
      <h1 className="font-bold text-[22px] sm:text-[28px]">{t("distribution.title")}</h1>
      <div className="py-10 overflow-x-auto mb-10 scrollbar-hide">
        <div className="min-w-max md:min-w-0">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}

          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
    </section>
  );
}

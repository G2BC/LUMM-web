import { useTranslation } from "react-i18next";
import distributionEn from "@/assets/distribution_en.png";
import distributionPt from "@/assets/distribution_pt.png";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DistributionPage() {
  const [loaded, setLoaded] = useState(false);
  const { i18n, t } = useTranslation();

  const language = i18n.language;

  const src = language === "en" ? distributionEn : distributionPt;
  const alt = language === "en" ? "Distribution of species" : "Distribuição das espécies";

  return (
    <section className="container mx-auto pt-10 px-4">
      <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] text-white">
        {t("distribution.title")}
      </h1>
      <div className="py-10 overflow-x-auto mb-10 scrollbar-hide">
        <div className="min-w-max md:min-w-0">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A100B]">
              <Loader2 className="w-8 h-8 text-[#00C000] animate-spin mb-4" />
              <p className="text-[#00C000] font-semibold">{t("common.loading")}</p>
            </div>
          )}

          <img
            src={src}
            alt={alt}
            loading="eager"
            onLoad={() => setLoaded(true)}
            className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        <p className="text-white mt-4 text-right font-bold">
          {t("common.source")}:{" "}
          <a
            className="hover:underline font-normal"
            href="https://doi.org/10.3390/jof11010019"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://doi.org/10.3390/jof11010019
          </a>
        </p>
      </div>
    </section>
  );
}

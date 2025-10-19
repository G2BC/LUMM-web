import { useTranslation } from "react-i18next";
import LogoPartners from "./logo-partners";
import CafeicCicle from "@/assets/about/cafeic-cicle.webp";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 py-16 text-white">
      <h1 className="text-[50px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] mb-12">
        {t("about_page.title")}
      </h1>

      <div className="mx-auto space-y-6">
        <p className="text-lg leading-relaxed">{t("about_page.paragraph1")}</p>
        <p className="text-lg leading-relaxed">{t("about_page.paragraph2")}</p>
        <p className="text-lg leading-relaxed">{t("about_page.paragraph3")}</p>
        <h2 className="text-lg leading-relaxed whitespace-pre-wrap pl-4">
          {t("about_page.lineages_list")}
        </h2>
        <p className="text-lg leading-relaxed">{t("about_page.paragraph4")}</p>
        <p className="text-lg leading-relaxed">{t("about_page.paragraph5")}</p>
        <p className="text-lg leading-relaxed">{t("about_page.paragraph6")}</p>

        <div className="max-w-[600px] mx-auto space-y-0">
          <img
            src={CafeicCicle}
            alt="Imagem do ciclo ácido cafeico"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <p className="text-lg leading-relaxed">{t("about_page.paragraph7")}</p>
        <p className="text-lg leading-relaxed">{t("about_page.paragraph8")}</p>
      </div>

      <h3 className="mt-12 text-[34px] xl:text-[30px] font-semibold leading-[38px] xl:leading-[54px] mb-12">
        {t("about_page.references")}
      </h3>
      <ul className="mx-auto space-y-6">
        <li className="list-none">
          <p className="text-lg leading-relaxed">{t("about_page.reference1")}</p>
          <a
            href="https://doi.org/10.3390/jof11010019"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline ml-1" // ml-1 adiciona um pequeno espaço antes do link
          >
            https://doi.org/10.3390/jof11010019
          </a>
        </li>

        <li className="list-none">
          <p className="text-lg leading-relaxed">{t("about_page.reference2")}</p>
          <a
            href="https://doi.org/10.1073/pnas.1803615115"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline ml-1" // ml-1 adiciona um pequeno espaço antes do link
          >
            https://doi.org/10.1073/pnas.1803615115
          </a>
        </li>
      </ul>
      <LogoPartners title={t("about_page.partners")} />
    </section>
  );
}

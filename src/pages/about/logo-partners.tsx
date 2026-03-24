import React from "react";
import logoG2BC from "@/assets/about/logo-g2bc.webp";
import logoLBF from "@/assets/about/logo-lbf.webp";
import logoUNESP from "@/assets/about/logo-unesp.webp";
import logoUNEB from "@/assets/about/logo_uneb.webp";
import logoUSP from "@/assets/about/logo-usp.webp";
import logoFUNSYNBIO from "@/assets/about/logo-funsynbio.webp";
import { useTranslation } from "react-i18next";

interface Institution {
  id: number;
  logoSrc: string;
  alt: string;
  url: string;
  category: "instituicao" | "grupo";
}

const institutions: Institution[] = [
  { id: 1, logoSrc: logoG2BC, alt: "Logo G2BC", url: "https://g2bc.uneb.br/", category: "grupo" },
  {
    id: 2,
    logoSrc: logoFUNSYNBIO,
    alt: "Logo FunSynBio",
    url: "https://www.instagram.com/funsynbio/",
    category: "grupo",
  },
  {
    id: 3,
    logoSrc: logoLBF,
    alt: "Logo LBF",
    url: "https://www.stevanilab.com",
    category: "grupo",
  },
  {
    id: 4,
    logoSrc: logoUNEB,
    alt: "Logo UNEB",
    url: "https://portal.uneb.br/",
    category: "instituicao",
  },
  {
    id: 5,
    logoSrc: logoUSP,
    alt: "Logo USP",
    url: "https://www5.usp.br/",
    category: "instituicao",
  },
  {
    id: 6,
    logoSrc: logoUNESP,
    alt: "Logo UNESP",
    url: "https://www2.unesp.br/",
    category: "instituicao",
  },
];

const LogoGrid = ({ items }: { items: Institution[] }) => (
  <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-16 mb-20">
    {items.map((inst) => (
      <a
        key={inst.id}
        href={inst.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0"
      >
        <img
          src={inst.logoSrc}
          alt={inst.alt}
          className="h-55 w-auto max-w-[150px] max-w-[220px] object-contain transition-opacity duration-300 hover:opacity-80"
        />
      </a>
    ))}
  </div>
);

const LogoPartners: React.FC = () => {
  const universidades = institutions.filter((i) => i.category === "instituicao");
  const gruposPesquisa = institutions.filter((i) => i.category === "grupo");
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <h2 className="mt-12 text-[34px] xl:text-[30px] font-semibold leading-[38px] xl:leading-[54px] mb-12">
        {t("about_page.partners")}
      </h2>
      <LogoGrid items={universidades} />

      <h2 className="mt-12 text-[34px] xl:text-[30px] font-semibold leading-[38px] xl:leading-[54px] mb-12">
        {t("about_page.research_groups")}
      </h2>
      <LogoGrid items={gruposPesquisa} />
    </div>
  );
};

export default LogoPartners;

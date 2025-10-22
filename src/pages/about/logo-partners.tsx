import React from "react";
import logoG2BC from "@/assets/about/logo-g2bc.webp";
import logoLBF from "@/assets/about/logo-lbf.webp";
import logoUNESP from "@/assets/about/logo-unesp.webp";
import logoUNEB from "@/assets/about/logo_uneb.webp";
import logoUSP from "@/assets/about/logo-usp.webp";
import logoFUNSYNBIO from "@/assets/about/logo-funsynbio.webp";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Institution {
  id: number;
  logoSrc: string;
  alt: string;
  url: string;
}
const institutions: Institution[] = [
  {
    id: 1,
    logoSrc: logoG2BC,
    alt: "Logo G2BC - Grupo de Pesquisa em Bioinformática e Biologia Computacional da UNEB",
    url: "https://g2bc.uneb.br/",
  },
  {
    id: 2,
    logoSrc: logoLBF,
    alt: "Logo LBF - Laboratório de Bioluminescência de Fungos",
    url: "https://www.stevanilab.com",
  },
  {
    id: 3,
    logoSrc: logoUNESP,
    alt: "Logo UNESP - Universidade Estadual Paulista",
    url: "https://www2.unesp.br/",
  },
  {
    id: 4,
    logoSrc: logoUNEB,
    alt: "Logo UNEB - Universidade do Estado da Bahia",
    url: "https://portal.uneb.br/",
  },
  {
    id: 5,
    logoSrc: logoUSP,
    alt: "Logo USP - Universidade de São Paulo",
    url: "https://www5.usp.br/",
  },
  {
    id: 6,
    logoSrc: logoFUNSYNBIO,
    alt: "Logo FunSynBio - Fungal Synthetic Biology Group",
    url: "https://www.instagram.com/funsynbio/",
  },
];

interface LogoPartnersProps {
  title: string;
}

const LogoPartners: React.FC<LogoPartnersProps> = ({ title }) => {
  return (
    <div className="py-12">
      <h2 className="mt-12 text-[34px] xl:text-[30px] font-semibold leading-[38px] xl:leading-[54px] mb-12">
        {title}
      </h2>
      <ScrollArea className="w-full rounded-md whitespace-nowrap border-0">
        <div className="flex w-full justify-between items-center space-x-10 pb-8">
          {institutions.map((inst) => (
            <a
              key={inst.id}
              href={inst.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex"
            >
              <img
                src={inst.logoSrc}
                alt={inst.alt}
                className="h-20 w-auto object-contain transition-opacity duration-300 hover:opacity-80"
              />
            </a>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-50" />
      </ScrollArea>
    </div>
  );
};

export default LogoPartners;

/*
    Use translations:
        Badge:
        Roles:
    
    Use icons:
      Mail
      Github
      Link
*/

import { Github, Link, Mail } from "lucide-react";
import { LiaOrcid } from "react-icons/lia";
import ALenz from "@/assets/contributors/A_Lenz.jpeg";
import EJunior from "@/assets/contributors/E_Junior.jpg";

export const contributors = [
  {
    avatar: ALenz,
    name: "Alexandre R. Lenz",
    bio: {
      pt: "Doutor em Biotecnologia pela Universidade de Caxias do Sul (Caxias do Sul, RS, Brasil), com período de doutorado sanduíche na Universidad Nacional Autónoma de México (UNAM), Yucatán (2020). É Professor Adjunto de Sistemas de Informação no Campus I da Universidade do Estado da Bahia (UNEB) e Professor Colaborador do Programa de Pós-Graduação em Ciências Farmacêuticas (PPGFARMA), do Departamento de Ciências da Vida, Campus I, da UNEB. Líder do Grupo de Pesquisa em Bioinformática e Biologia Computacional (G2BC — @g2bc.uneb), na linha de bioinformática de fungos. Possui experiência em bioinformática, com ênfase em genômica e regulação gênica de fungos, atuando principalmente nos seguintes temas: (i) montagem e anotação de genomas; (ii) análises filogenéticas e evolutivas; (iii) construção de redes regulatórias gênicas; (iv) prospecção de moléculas bioativas a partir de fungos ascomicetos e basidiomicetos; e (v) micoturismo.",
      en: "PhD in Biotechnology (University of Caxias do Sul, Caxias do Sul, RS, Brazil) with a Doctoral Exchange Program at the Universidad Nacional Autónoma de México, Yucatán (2020). He is Adjunct Professor in Information Systems at Campus I of the State University of Bahia, and Collaborating Professor in the Postgraduate Program in Pharmaceutical Sciences (PPGFARMA), in the Department of Life Sciences of Campus I of the State University of Bahia. Leader of the Bioinformatics and Computational Biology Research Group (G2BC - @g2bc.uneb): Fungal bioinformatics research line. He has experience in the area of bioinformatics, with an emphasis on genomics and gene regulation of fungi, working mainly on the following topics: (i) assembly and annotation of genomes; (ii) phylogenetic and evolutionary analyses; (iii) construction of gene regulatory networks; iv) prospecting for bioactive molecules from ascomycete and basidiomycete fungi and v) mycotourism.",
    },
    links: [
      {
        icon: <Mail className="w-5 h-5" />,
        href: "mailto:alenz@uneb.br",
        title: "Email",
      },
      {
        icon: <Link className="w-5 h-5" />,
        href: "http://lattes.cnpq.br/9063268848566672",
        title: "Lattes",
      },
      {
        icon: <LiaOrcid className="w-5 h-5" />,
        href: "https://orcid.org/0000-0001-6699-2899",
        title: "ORCID",
      },
    ],
  },
  {
    avatar: EJunior,
    name: "Ernesto S. M. N. Júnior",
    bio: {
      pt: "Desenvolvedor de software full stack e graduando em Sistemas de Informação na Universidade do Estado da Bahia (UNEB). Atua profissionalmente no desenvolvimento de aplicações web e APIs, com experiência em JavaScript/TypeScript, React/Node e Python/Django, além de integrações e arquitetura de microsserviços. No âmbito acadêmico, contribui para o LUMM, um banco de dados web voltado à divulgação científica sobre fungos luminescentes, e desenvolve interesse em engenharia de software aplicada à bioinformática, com ênfase em segurança de aplicações web conteinerizadas.",
      en: "Full-stack software developer and undergraduate student in Information Systems at the State University of Bahia (UNEB). Works professionally on the development of web applications and APIs, with experience in JavaScript/TypeScript, React/Node, and Python/Django, as well as integrations and microservices architecture. In the academic context, contributes to LUMM, a web database focused on the scientific dissemination of bioluminescent fungi, and develops interest in software engineering applied to bioinformatics, with an emphasis on the security of containerized web applications.",
    },
    links: [
      {
        icon: <Mail className="w-5 h-5" />,
        href: "mailto:ernesto.sjunior@hotmail.com",
        title: "Email",
      },
      {
        icon: <Link className="w-5 h-5" />,
        href: "https://lattes.cnpq.br/0556706706006912",
        title: "Lattes",
      },
      {
        icon: <Github className="w-5 h-5" />,
        href: "https://github.com/ernestosjunior",
        title: "GitHub",
      },
    ],
  },
];

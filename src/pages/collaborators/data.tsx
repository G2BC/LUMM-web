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
import DMendel from "@/assets/contributors/D_Mendel.jpeg";
import CStevani from "@/assets/contributors/C_Stevani.jpeg";

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
        icon: <LiaOrcid className="w-6 h-6" />,
        href: "https://orcid.org/0000-0001-6699-2899",
        title: "ORCID",
      },
    ],
  },
  {
    avatar: CStevani,
    name: "Cassius Vinicius Stevani",
    bio: {
      pt: "Obteve seu bacharelado em Química pelo Instituto de Química da Universidade de São Paulo (USP) em 1992 e concluiu o doutorado em Química Orgânica em 1997, sob a orientação do Prof. Dr. Josef Wilhelm Baader, com a tese intitulada Estudo Mecanístico do Sistema Peróxi-Oxalato. Em seguida, realizou pesquisa de pós-doutorado no mesmo instituto, agora no Departamento de Bioquímica, atuando no grupo de pesquisa liderado pelo Prof. Dr. Etelvino José Henriques Bechara. Atualmente, é Professor Associado, lecionando aulas sobre Química Ambiental e Orgânica na Universidade de São Paulo, onde coordena pesquisas sobre bioluminescência fúngica. Sua especialidade abrange bioluminescência, bioquímica, quimiluminescência, metagenômica e química orgânica. Reconhecido internacionalmente em sua área, Stevani fez contribuições pioneiras para a elucidação dos mecanismos químicos que permitem a emissão de luz por fungos, incluindo a descoberta do Ciclo do Ácido Cafeico essencial para a bioluminescência em determinadas espécies fúngicas. Sua pesquisa tem aprofundado de forma significativa a compreensão científica dos sistemas naturais emissores de luz e de suas possíveis aplicações biotecnológicas, como em bioimagem, biossensores e biologia sintética. Além de sua atuação científica, também se dedica intensamente ao ensino e à orientação de estudantes de graduação e pós-graduação nas áreas de química, fotoquímica e biologia molecular. Seu laboratório é amplamente reconhecido por adotar uma abordagem multidisciplinar, integrando métodos químicos, bioquímicos e fotoquímicos para investigar sistemas bioluminescentes em diversos organismos, como fungos, dípteros, espécies marinhas e centopeias.",
      en: "He earned his Bachelors degree in Chemistry from the Institute of Chemistry at the University of São Paulo (USP) in 1992 and completed his Ph.D. in Organic Chemistry in 1997 under the supervision of Prof. Dr. Josef Wilhelm Baader, with a dissertation titled Mechanistic Study of the Peroxyoxalate System. He then conducted postdoctoral research at the same institute, this time in the Department of Biochemistry, working within the research group led by Prof. Dr. Etelvino José Henriques Bechara. He is currently an Associate Professor, teaching courses in Environmental and Organic Chemistry at the University of São Paulo, where he leads research on fungal bioluminescence. His expertise includes bioluminescence, biochemistry, chemiluminescence, metagenomics, and organic chemistry. Internationally recognized in his field, Stevani has made pioneering contributions to unraveling the chemical mechanisms behind fungal light emission, including the discovery of the Caffeic Acid Cycleessential for bioluminescence in certain fungal species. His research has significantly deepened scientific understanding of natural light-emitting systems and their potential biotechnological applications, such as in bioimaging, biosensors, and synthetic biology. In addition to his scientific work, he is also deeply committed to teaching and mentoring both undergraduate and graduate students in the areas of chemistry, photochemistry, and molecular biology. His laboratory is widely recognized for its multidisciplinary approach, integrating chemical, biochemical, and photophysical methods to investigate bioluminescent systems in a range of organisms, including fungi, dipterans, marine species, and millipedes.",
    },
    links: [
      {
        icon: <Mail className="w-5 h-5" />,
        href: "mailto:stevani@iq.usp.br",
        title: "Email",
      },
      {
        icon: <Link className="w-5 h-5" />,
        href: "https://lattes.cnpq.br/9931178094449488",
        title: "Lattes",
      },
      {
        icon: <LiaOrcid className="w-6 h-6" />,
        href: "https://orcid.org/0000-0002-7209-7476",
        title: "ORCID",
      },
    ],
  },
  {
    avatar: DMendel,
    name: "Douglas M. Mendel Soares",
    bio: {
      pt: "Biólogo (Universidade Federal do Espírito Santo - UFES, 2014) e Doutor em Ciências Biológicas/Bioquímica (Instituto de Química da Universidade de São Paulo, IQ-USP, 2019) com estágio de curta duração na University of Cambridge (Inglaterra). Foi bolsista de Pós-Doutorado da Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP) entre 2019 e 2024 no Laboratório de Bioluminescência de Fungos (IQ-USP), incluindo períodos como pesquisador visitante na California State University East Bay (California, EUA), Virginia State University (Virginia, EUA) e Imperial College London (Londres, Inglaterra). Durante o Doutorado (2014-2019), caracterizou a sequência codificadora para uma dioxigenase envolvida na biossíntese de betalaínas e higroaurinas, pigmentos fúngicos raros, a partir do cogumelo agário-das-moscas (Amanita muscaria). Em paralelo, atuou como Pesquisador associado no Projeto Aquarela (Programa Natura Campus; 2014-2018), na área de Biotecnologia de pigmentos naturais. Faz parte da Rede Brasileira de Biologia Sintética, é voluntário na Associação Brasileira de Biologia Sintética (SynBioBR) e atualmente coordena a Olimpíada Brasileira de Biologia Sintética (OBBS). É Professor Assistente no Departamento de Engenharia de Bioprocessos e Biotecnologia da Faculdade de Ciências Farmacêuticas de Araraquara na Universidade Estadual Paulista (UNESP), onde lidera o recém-criado grupo de pesquisa em Biologia Sintética de Fungos (funSynBio). Atualmente, o seu interesse em pesquisa é voltado à prospecção, caracterização funcional e manipulação genética de megassintases fúngicas para a produção de novos bioativos; e o desenvolvimento de partes biológicas para a promoção de Basidiomicetos como chassis em projetos de biologia sintética. Além disso, colabora na orientação de nove alunos de Doutorado em projetos sobre a bioluminescência de fungos, centopeias e organismos marinhos; e metagenômica ambiental pelo sequenciamento de DNA por nanoporos.",
      en: "Biologist and Ph.D. in Biochemistry (University of São Paulo, Brazil), including a short-term internship at University of Cambridge (UK). During his Ph.D., he characterized a dioxygenase involved in the biosynthesis of betalains and hygroaurins, rare fungal pigments, from the fly agaric mushroom (Amanita muscaria). Since 2019, he is a Postdoctoral researcher at the Fungal Bioluminescence Lab (Institute of Chemistry, University of São Paulo, Brazil), including periods as visiting researcher at California State University East Bay (California, USA), Virginia State University (Virginia, USA), and Imperial College London (London, UK). He collaborated as a research associate in a biotech project (2014-2018) granted by Natura (a Brazilian cosmetics company) and as a teaching assistant of Biochemistry and Molecular Biology for the Medicine, Pharmacy, and Chemistry courses at University of São Paulo, Brazil. Currently he is also a volunteer at the Brazilian Association of Synthetic Biology (SynBioBR). His main interest research topics include: bioluminescence of fungi, millipedes, and marine organisms; omics and synthetic biology of basidiomycete fungi; bioprospection of valuable metabolites and megasynthases from fungi; and environmental metagenomics using nanopore sequencing.",
    },
    links: [
      {
        icon: <Mail className="w-5 h-5" />,
        href: "mailto:douglas.mendel@unesp.br",
        title: "Email",
      },
      {
        icon: <Link className="w-5 h-5" />,
        href: "https://lattes.cnpq.br/9881543977135448",
        title: "Lattes",
      },
      {
        icon: <LiaOrcid className="w-6 h-6" />,
        href: "https://orcid.org/0000-0001-8450-2080",
        title: "ORCID",
      },
    ],
  },
  {
    avatar: EJunior,
    name: "Ernesto S. M. Neto Júnior",
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
        icon: <LiaOrcid className="w-6 h-6" />,
        href: "https://orcid.org/0009-0002-6069-932X",
        title: "ORCID",
      },
      {
        icon: <Github className="w-5 h-5" />,
        href: "https://github.com/ernestosjunior",
        title: "GitHub",
      },
    ],
  },
];

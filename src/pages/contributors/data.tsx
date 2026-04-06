import { Github, Link, Mail, Instagram } from "lucide-react";
import { LiaOrcid } from "react-icons/lia";
import ALenz from "@/assets/contributors/A_Lenz.jpeg";
import EJunior from "@/assets/contributors/E_Junior.jpg";
import DMendel from "@/assets/contributors/D_Mendel.jpeg";
import CStevani from "@/assets/contributors/C_Stevani.jpeg";
import JArthur from "@/assets/contributors/J_Arthur.jpeg";
import g2bc from "@/assets/contributors/G2BC.jpeg";
import funsynbio from "@/assets/contributors/funsynbio.jpeg";
import lbf from "@/assets/contributors/LBF.jpeg";
import React from "react";

export type Contributor = {
  avatar: string;
  name: string;
  bio: {
    pt: string;
    en: string;
  };
  links: {
    icon: React.JSX.Element;
    href: string;
    title: string;
  }[];
};

export const contributors: Contributor[] = [
  {
    avatar: ALenz,
    name: "Alexandre Rafael Lenz",
    bio: {
      pt: "Possui graduação em Ciência da Computação pela Universidade Luterana do Brasil (2007), Mestrado em Informática pela Universidade Federal do Paraná (2009), Doutorado em Biotecnologia pela Universidade de Caxias do Sul realizando Intercâmbio Sanduíche na Universidad Nacional Autónoma de México, Unidad Académica IIMAS, Mérida, Yucatán, México (2020). Atualmente é Professor Adjunto do Colegiado de Bacharelado em Sistemas de Informação do Campus I da Universidade do Estado da Bahia. Professor Permanente no Programa de Pós-Graduação em Ciências Farmacêuticas (PPGFARMA), no Departamento de Ciências da Vida do Campus I da Universidade do Estado da Bahia. Fundador do Grupo de Pesquisa em Bioinformática e Biologia Computacional da UNEB (G2BC), atua na linha de pesquisa em bioinformática fúngica. Tem experiência na área de Bioinformática, com ênfase em Genômica e Regulação Gênica de Fungos, atuando principalmente nos seguintes temas: (i) montagem e anotação de genomas; (ii) Análises filogenéticas e evolutivas; (iii) construção de redes de regulação de genes e iv) prospecção de compostos naturais em cogumelos. Descreveu uma espécie nova de fungo filamentoso para o gênero Penicillium, com base em materiais do Brasil e da Coreia do Sul. Está envolvido em projetos de taxonomia, filogenia, análises evolutivas e prospecção de compostos bioativos de fungos ascomicetos e basidiomicetos.",
      en: "He holds a Bachelor's degree in Computer Science from the Lutheran University of Brazil (2007), a Master's degree in Informatics from the Federal University of Paraná (2009), and a Ph.D. in Biotechnology from the University of Caxias do Sul, with a Sandwich Exchange at the National Autonomous University of Mexico, Academic Unit IIMAS, Mérida, Yucatán, Mexico (2020). He is currently an Adjunct Professor at the Bachelor’s Degree Program in Information Systems, Campus I, State University of Bahia. He is a Permanent Professor in the Graduate Program in Pharmaceutical Sciences (PPGFARMA) at the Department of Life Sciences, Campus I, State University of Bahia. Founder of the Bioinformatics and Computational Biology Research Group at UNEB (G2BC), he works in the research line of fungal bioinformatics. He has experience in Bioinformatics, with an emphasis on Fungal Genomics and Gene Regulation, mainly working on the following topics: (i) genome assembly and annotation; (ii) phylogenetic and evolutionary analyses; (iii) construction of gene regulatory networks; and (iv) bioprospecting of natural compounds in mushrooms. He described a new species of filamentous fungus for the genus Penicillium, based on materials from Brazil and South Korea. He is involved in projects on taxonomy, phylogeny, evolutionary analyses, and bioprospecting of bioactive compounds from ascomycete and basidiomycete fungi.",
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
      {
        icon: <Github className="w-5 h-5" />,
        href: "https://github.com/G2BC",
        title: "GitHub",
      },
    ],
  },
  {
    avatar: CStevani,
    name: "Cassius Vinicius Stevani",
    bio: {
      pt: "Obteve seu bacharelado em Química pelo Instituto de Química da Universidade de São Paulo (USP) em 1992 e concluiu o doutorado em Química Orgânica em 1997, sob a orientação do Prof. Dr. Josef Wilhelm Baader, com a tese intitulada Estudo Mecanístico do Sistema Peróxi-Oxalato. Em seguida, realizou pesquisa de pós-doutorado no mesmo instituto, agora no Departamento de Bioquímica, atuando no grupo de pesquisa liderado pelo Prof. Dr. Etelvino José Henriques Bechara. Atualmente, é Professor Associado, lecionando aulas sobre Química Ambiental e Orgânica na Universidade de São Paulo, onde coordena pesquisas sobre bioluminescência fúngica. Sua especialidade abrange bioluminescência, bioquímica, quimiluminescência, metagenômica e química orgânica. Reconhecido internacionalmente em sua área, Stevani fez contribuições pioneiras para a elucidação dos mecanismos químicos que permitem a emissão de luz por fungos, incluindo a descoberta do Ciclo do Ácido Cafeico essencial para a bioluminescência em determinadas espécies fúngicas. Sua pesquisa tem aprofundado de forma significativa a compreensão científica dos sistemas naturais emissores de luz e de suas possíveis aplicações biotecnológicas, como em bioimagem, biossensores e biologia sintética. Além de sua atuação científica, também se dedica intensamente ao ensino e à orientação de estudantes de graduação e pós-graduação nas áreas de química, fotoquímica e biologia molecular. Seu laboratório é amplamente reconhecido por adotar uma abordagem multidisciplinar, integrando métodos químicos, bioquímicos e fotoquímicos para investigar sistemas bioluminescentes em diversos organismos, como fungos, dípteros, espécies marinhas e centopeias.",
      en: "He earned his Bachelors degree in Chemistry from the Institute of Chemistry at the University of São Paulo (USP) in 1992 and completed his Ph.D. in Organic Chemistry in 1997 under the supervision of Prof. Dr. Josef Wilhelm Baader, with a dissertation titled Mechanistic Study of the Peroxyoxalate System. He then conducted postdoctoral research at the same institute, this time in the Department of Biochemistry, working within the research group led by Prof. Dr. Etelvino José Henriques Bechara. He is currently an Associate Professor, teaching courses in Environmental and Organic Chemistry at the University of São Paulo, where he leads research on fungal bioluminescence. His expertise includes bioluminescence, biochemistry, chemiluminescence, metagenomics, and organic chemistry. Internationally recognized in his field, Stevani has made pioneering contributions to unraveling the chemical mechanisms behind fungal light emission, including the discovery of the Caffeic Acid Cycle essential for bioluminescence in certain fungal species. His research has significantly deepened scientific understanding of natural light-emitting systems and their potential biotechnological applications, such as in bioimaging, biosensors, and synthetic biology. In addition to his scientific work, he is also deeply committed to teaching and mentoring both undergraduate and graduate students in the areas of chemistry, photochemistry, and molecular biology. His laboratory is widely recognized for its multidisciplinary approach, integrating chemical, biochemical, and photophysical methods to investigate bioluminescent systems in a range of organisms, including fungi, dipterans, marine species, and millipedes.",
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
  {
    avatar: JArthur,
    name: "J. Arthur Valente Lima",
    bio: {
      pt: "Graduando em Sistemas de Informação pela Universidade do Estado da Bahia (UNEB). Atua na área de desenvolvimento web no LUMM, um projeto que integra o Grupo de Pesquisa G2BC, onde também é voluntário. Sua participação envolve a aplicação de conhecimentos tecnológicos na criação e manutenção de soluções web para um ambiente de pesquisa.",
      en: "Graduating in Information Systems from the State University of Bahia (UNEB). Works in the area of web development at LUMM, a project that is part of the G2BC Research Group, where they also volunteer. Their involvement includes applying technological knowledge to the creation and maintenance of web solutions for a research environment.",
    },
    links: [
      {
        icon: <Mail className="w-5 h-5" />,
        href: "mailto:joaoarthurvalentelima2@gmail.com",
        title: "Email",
      },
      {
        icon: <Link className="w-5 h-5" />,
        href: "https://lattes.cnpq.br/0556706706006912",
        title: "Lattes",
      },
      // {
      //   icon: <LiaOrcid className="w-6 h-6" />,
      //   href: "https://orcid.org/0009-0002-6069-932X",
      //   title: "ORCID",
      // },
      {
        icon: <Github className="w-5 h-5" />,
        href: "https://github.com/ArthXD",
        title: "GitHub",
      },
    ],
  },
];

export const research_groups: Contributor[] = [
  {
    avatar: g2bc,
    name: "G2BC",
    bio: {
      pt: "O Grupo de Pesquisa em Bioinformática e Biologia Computacional da UNEB (G2BC) atua na intersecção entre computação e ciências da vida, desenvolvendo ferramentas computacionais e modelagens matemáticas para transformar grandes volumes de dados biológicos e médicos em conhecimento aplicado. As investigações colaborativas do grupo concentram-se em duas vertentes principais baseadas na análise de dados ômicos: a Bioinformática Fúngica, voltada ao estudo de fungos e cogumelos para identificação de espécies, detecção de patógenos e aproveitamento biotecnológico nas indústrias farmacêutica e ambiental; e a Bioinformática Viral, que foca em arbovírus e patógenos emergentes, analisando mutações e marcadores de virulência para auxiliar no desenvolvimento de vacinas e no controle de epidemias. Pautado por uma atuação multidisciplinar que une especialistas em genômica, computação e medicina, o G2BC aplica técnicas avançadas de inteligência artificial para correlacionar características genômicas a resultados fenotípicos, reafirmando seu compromisso com a produção científica rigorosa e fornecendo subsídios fundamentais para a evolução da medicina de precisão e a proteção da saúde pública global e da biodiversidade.",
      en: "The UNEB Bioinformatics and Computational Biology Research Group (G2BC) operates at the intersection of computing and life sciences, developing computational tools and mathematical modeling to transform large volumes of biological and medical data into applied knowledge. The group's collaborative investigations focus on two main lines based on the analysis of omics data: Fungal Bioinformatics, aimed at the study of fungi and mushrooms for species identification, pathogen detection, and biotechnological applications in the pharmaceutical and environmental industries; and Viral Bioinformatics, which focuses on arboviruses and emerging pathogens, analyzing mutations and virulence markers to assist in vaccine development and epidemic control. Guided by a multidisciplinary approach that unites specialists in genomics, computing, and medicine, G2BC applies advanced artificial intelligence techniques to correlate genomic characteristics with phenotypic outcomes, reaffirming its commitment to rigorous scientific production and providing fundamental support for the evolution of precision medicine and the protection of global public health and biodiversity.",
    },
    links: [
      { icon: <Link className="w-5 h-5" />, href: "https://g2bc.uneb.br/", title: "Site" },
      {
        icon: <Instagram className="w-5 h-5" />,
        href: "https://www.instagram.com/g2bc.uneb/",
        title: "Instagram",
      },
    ],
  },
  {
    avatar: lbf,
    name: "LBF",
    bio: {
      pt: "O Laboratório de Bioluminescência de Fungos (LBF) constitui o único núcleo de pesquisa brasileiro dedicado ao estudo da emissão de luz por fungos, posicionando o país em uma seleta rede científica global ao lado de grupos de excelência na Rússia, Japão e Estados Unidos. Composto por uma frente multidisciplinar de pesquisadores da USP, UFSCar e Unifesp, e em colaboração estratégica com a San Francisco State University, o LBF atua na fronteira entre a bioquímica e a biotecnologia para desvendar fenômenos biológicos que permaneceram incógnitos desde as observações de Aristóteles. Suas investigações concentram-se na vertente de Inovação Biotecnológica, voltada ao desenvolvimento de bioensaios toxicológicos que utilizam a variação da luminescência do micélio — resultante de uma reação consecutiva entre uma redutase NAD(P)H-dependente e uma luciferase de membrana — como um indicador sensível e versátil para o monitoramento de solos e a detecção de substâncias perigosas. Pautado pela integração entre a ciência básica e aplicada, o LBF transforma o entendimento do sistema luminescente fúngico em ferramentas analíticas de alto impacto, de forma análoga ao uso histórico de genes de vagalumes na biologia molecular, reafirmando seu compromisso com a produção científica rigorosa e com a proteção da biodiversidade e da saúde ambiental.",
      en: "The Fungal Bioluminescence Laboratory (LBF) is the only Brazilian research hub dedicated to the study of light emission by fungi, positioning the country within a select global scientific network alongside leading research groups in Russia, Japan, and the United States. Comprising a multidisciplinary team of researchers from USP, UFSCar, and Unifesp, and in strategic collaboration with San Francisco State University, LBF operates at the frontier between biochemistry and biotechnology to unravel biological phenomena that have remained unsolved since Aristotle's observations. Its investigations focus on the Biotechnological Innovation research line, aimed at the development of toxicological bioassays that use the variation in mycelium luminescence—resulting from a consecutive reaction between an NAD(P)H-dependent reductase and a membrane luciferase—as a sensitive and versatile indicator for soil monitoring and the detection of hazardous substances. Guided by the integration of basic and applied science, LBF transforms the understanding of the fungal luminescent system into high-impact analytical tools, analogous to the historical use of firefly genes in molecular biology, reaffirming its commitment to rigorous scientific production and the protection of biodiversity and environmental health.",
    },
    links: [
      { icon: <Link className="w-5 h-5" />, href: "https://www.stevanilab.com/", title: "Site" },
      //  { icon: <Instagram className="w-5 h-5" />,
      //    href: "https://www.instagram.com/g2bc.uneb/",
      //    title: "Instagram",
      //  }
    ],
  },
  {
    avatar: funsynbio,
    name: "FunSynBio",
    bio: {
      pt: "O Fungal Synthetic Biology Group (FunSynBio), sediado na Faculdade de Ciências Farmacêuticas do Campus de Araraquara (FCFAr/UNESP), atua na vanguarda da biologia sintética voltada ao estudo da funga brasileira, com ênfase em Basidiomicetos. O grupo dedica-se a preencher a lacuna de conhecimento sobre a biodiversidade fúngica, utilizando avanços em ciências ômicas para prospectar metabólitos secundários — em especial os policetídeos — e caracterizar funcionalmente as complexas enzimas policetídeo sintases (PKS). Sua principal linha de atuação, focada na Engenharia de Biossíntese e Biofábricas, integra estratégias de aprendizagem de máquina ao desenho racional de PKS e ao desenvolvimento de ferramentas moleculares para Basidiomicetos, visando transformar espécies formadoras de cogumelos em plataformas de produção sustentável. Ao unir técnicas avançadas de engenharia genética, clonagem e produção de proteínas recombinantes,  o FunSynBio busca expandir a diversidade química de compostos bioativos para as indústrias farmacêutica e agrícola, reafirmando seu compromisso com a pesquisa científica de alto nível e com a aplicação dos princípios de economia circular e química verde no aproveitamento sustentável do patrimônio genético nacional.",
      en: "The Fungal Synthetic Biology Group (FunSynBio), based at the School of Pharmaceutical Sciences of the Araraquara Campus (FCFAr/UNESP), operates at the forefront of synthetic biology focused on the study of Brazilian funga, with an emphasis on Basidiomycetes. The group is dedicated to filling the knowledge gap regarding fungal biodiversity, utilizing advances in omics sciences to prospect for secondary metabolites—specifically polyketides—and functionally characterize complex polyketide synthase (PKS) enzymes. Its main research line, focused on Biosynthesis Engineering and Biofactories, integrates machine learning strategies with the rational design of PKS and the development of molecular tools for Basidiomycetes, aiming to transform mushroom-forming species into sustainable production platforms. By combining advanced techniques in genetic engineering, cloning, and recombinant protein production, FunSynBio seeks to expand the chemical diversity of bioactive compounds for the pharmaceutical and agricultural industries, reaffirming its commitment to high-level scientific research and the application of circular economy and green chemistry principles in the sustainable use of the national genetic heritage.",
    },
    links: [
      //  { icon: <Link className="w-5 h-5"/>,
      //    href: "https://g2bc.uneb.br/",
      //    title: "Site",
      //  },
      {
        icon: <Instagram className="w-5 h-5" />,
        href: "https://www.instagram.com/funsynbio/",
        title: "Instagram",
      },
    ],
  },
];

import { Github, Link, Mail } from "lucide-react";
import { LiaOrcid } from "react-icons/lia";
import ALenz from "@/assets/contributors/A_Lenz.jpeg";
import EJunior from "@/assets/contributors/E_Junior.jpg";
import DMendel from "@/assets/contributors/D_Mendel.jpeg";
import CStevani from "@/assets/contributors/C_Stevani.jpeg";
import JArthur from "@/assets/contributors/J_Arthur.jpeg";

export const contributors = [
  {
    avatar: ALenz,
    name: "Alexandre Rafael Lenz",
    bio: {
      pt: "Possui graduação em Ciência da Computação pela Universidade Luterana do Brasil (2007), Mestrado em Informática pela Universidade Federal do Paraná (2009), Doutorado em Biotecnologia pela Universidade de Caxias do Sul realizando Intercâmbio Sanduíche na Universidad Nacional Autónoma de México, Unidad Académica IIMAS, Mérida, Yucatán, México (2020). Atualmente é Professor Adjunto do Colegiado de Bacharelado em Sistemas de Informação do Campus I da Universidade do Estado da Bahia. Professor Permanente no Programa de Pós-Graduação em Ciências Farmacêuticas (PPGFARMA), no Departamento de Ciências da Vida do Campus I da Universidade do Estado da Bahia. Fundador do Grupo de Pesquisa em Bioinformática e Biologia Computacional da UNEB (G2BC), atua na linha de pesquisa em bioinformática fúngica. Tem experiência na área de Bioinformática, com ênfase em Genômica e Regulação Gênica de Fungos, atuando principalmente nos seguintes temas: (i) montagem e anotação de genomas; (ii) Análises filogenéticas e evolutivas; (iii) construção de redes de regulação de genes e iv) prospecção de compostos naturais em cogumelos. Descreveu uma espécie nova de fungo filamentoso para o gênero Penicillium, com base em materiais do Brasil e da Coreia do Sul. Está envolvido em projetos de taxonomia, filogenia, análises evolutivas e prospecção de compostos bioativos de fungos ascomicetos e basidiomicetos.",
      en: "He holds a Bachelor's degree in Computer Science from the Lutheran University of Brazil (2007), a Master's degree in Informatics from the Federal University of Paraná (2009), and a Ph.D. in Biotechnology from the University of Caxias do Sul, with a Sandwich Exchange at the National Autonomous University of Mexico, Academic Unit IIMAS, Mérida, Yucatán, Mexico (2020). He is currently an Adjunct Professor at the Bachelor’s Degree Program in Information Systems, Campus I, State University of Bahia. He is a Permanent Professor in the Graduate Program in Pharmaceutical Sciences (PPGFARMA) at the Department of Life Sciences, Campus I, State University of Bahia. Founder of the Bioinformatics and Computational Biology Research Group at UNEB (G2BC), he works in the research line of fungal bioinformatics. He has experience in Bioinformatics, with an emphasis on Fungal Genomics and Gene Regulation, mainly working on the following topics: (i) genome assembly and annotation; (ii) phylogenetic and evolutionary analyses; (iii) construction of gene regulatory networks; and (iv) bioprospecting of natural compounds in mushrooms. He described a new species of filamentous fungus for the genus Penicillium, based on materials from Brazil and South Korea. He is involved in projects on taxonomy, phylogeny, evolutionary analyses, and bioprospecting of bioactive compounds from ascomycete and basidiomycete fungi.",
      es: "Posee una licenciatura en Ciencias de la Computación por la Universidad Luterana de Brasil (2007), una maestría en Informática por la Universidad Federal de Paraná (2009) y un doctorado en Biotecnología por la Universidad de Caxias do Sul, con intercambio sanduíche en la Universidad Nacional Autónoma de México, Unidad Académica IIMAS, Mérida, Yucatán, México (2020). Actualmente es Profesor Adjunto en el Programa de Licenciatura en Sistemas de Información del Campus I de la Universidad del Estado de Bahía (UNEB). Es Profesor Permanente del Programa de Posgrado en Ciencias Farmacéuticas (PPGFARMA) en el Departamento de Ciencias de la Vida del Campus I de la UNEB. Fundador del Grupo de Investigación en Bioinformática y Biología Computacional de la UNEB (G2BC), actúa en la línea de investigación en bioinformática fúngica. Tiene experiencia en Bioinformática, con énfasis en Genómica y Regulación Génica de Hongos, trabajando principalmente en los siguientes temas: (i) ensamblaje y anotación de genomas; (ii) análisis filogenéticos y evolutivos; (iii) construcción de redes de regulación génica; y (iv) prospección de compuestos naturales en hongos. Describió una nueva especie de hongo filamentoso del género Penicillium, basada en materiales de Brasil y Corea del Sur. Participa en proyectos de taxonomía, filogenia, análisis evolutivos y prospección de compuestos bioactivos de hongos ascomicetos y basidiomicetos.",
      fr: "Il est titulaire d’une licence en informatique de l’Université luthérienne du Brésil (2007), d’un master en informatique de l’Université fédérale du Paraná (2009) et d’un doctorat en biotechnologie de l’Université de Caxias do Sul, avec un échange sandwich à l’Université nationale autonome du Mexique (UNAM), Unité académique IIMAS, Mérida, Yucatán, Mexique (2020). Il est actuellement professeur adjoint au programme de licence en systèmes d’information du Campus I de l’Université de l’État de Bahia (UNEB). Professeur permanent au programme de troisième cycle en sciences pharmaceutiques (PPGFARMA) du Département des sciences de la vie, Campus I, UNEB. Fondateur du Groupe de recherche en bioinformatique et biologie computationnelle de l’UNEB (G2BC), il travaille dans le domaine de la bioinformatique fongique. Il possède une expérience en bioinformatique, avec un accent sur la génomique et la régulation génique des champignons, travaillant principalement sur les sujets suivants : (i) assemblage et annotation de génomes ; (ii) analyses phylogénétiques et évolutives ; (iii) construction de réseaux de régulation génique ; et (iv) prospection de composés naturels dans les champignons. Il a décrit une nouvelle espèce de champignon filamenteux du genre Penicillium, basée sur des échantillons du Brésil et de la Corée du Sud. Il participe à des projets de taxonomie, de phylogénie, d’analyses évolutives et de prospection de composés bioactifs de champignons ascomycètes et basidiomycètes.",
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
      es: "Obtuvo su licenciatura en Química en el Instituto de Química de la Universidad de São Paulo (USP) en 1992 y completó su doctorado en Química Orgánica en 1997, bajo la orientación del Prof. Dr. Josef Wilhelm Baader, con la tesis titulada Estudio Mecanístico del Sistema Peroxi-Oxalato. Posteriormente, realizó una investigación posdoctoral en el mismo instituto, en el Departamento de Bioquímica, trabajando en el grupo de investigación liderado por el Prof. Dr. Etelvino José Henriques Bechara. Actualmente es Profesor Asociado, imparte clases de Química Ambiental y Orgánica en la Universidad de São Paulo, donde coordina investigaciones sobre bioluminiscencia fúngica. Su especialidad abarca bioluminiscencia, bioquímica, quimiluminiscencia, metagenómica y química orgánica. Reconocido internacionalmente en su campo, Stevani realizó contribuciones pioneras para la elucidación de los mecanismos químicos que permiten la emisión de luz en los hongos, incluyendo el descubrimiento del Ciclo del Ácido Cafeico, esencial para la bioluminiscencia en determinadas especies fúngicas. Su investigación ha profundizado significativamente la comprensión científica de los sistemas naturales emisores de luz y sus posibles aplicaciones biotecnológicas, como en bioimagen, biosensores y biología sintética. Además de su labor científica, se dedica intensamente a la enseñanza y tutoría de estudiantes de pregrado y posgrado en las áreas de química, fotoquímica y biología molecular. Su laboratorio es ampliamente reconocido por adoptar un enfoque multidisciplinario, integrando métodos químicos, bioquímicos y fotoquímicos para investigar sistemas bioluminiscentes en diversos organismos, como hongos, dípteros, especies marinas y ciempiés.",
      fr: "Il a obtenu sa licence en chimie à l’Institut de chimie de l’Université de São Paulo (USP) en 1992 et a terminé son doctorat en chimie organique en 1997, sous la direction du Prof. Dr. Josef Wilhelm Baader, avec une thèse intitulée Étude mécanistique du système peroxy-oxalate. Par la suite, il a mené des recherches postdoctorales dans le même institut, cette fois au Département de biochimie, au sein du groupe dirigé par le Prof. Dr. Etelvino José Henriques Bechara. Il est actuellement professeur associé, enseignant la chimie environnementale et organique à l’Université de São Paulo, où il dirige des recherches sur la bioluminescence fongique. Son expertise couvre la bioluminescence, la biochimie, la chimiluminescence, la métagénomique et la chimie organique. Recommandé internationalement dans son domaine, Stevani a apporté des contributions pionnières à l’élucidation des mécanismes chimiques responsables de l’émission de lumière par les champignons, notamment la découverte du cycle de l’acide caféique, essentiel à la bioluminescence de certaines espèces fongiques. Ses travaux ont considérablement approfondi la compréhension scientifique des systèmes naturels émetteurs de lumière et de leurs applications biotechnologiques potentielles, comme l’imagerie biologique, les biocapteurs et la biologie synthétique. Outre ses recherches, il se consacre activement à l’enseignement et à l’encadrement d’étudiants de licence et de doctorat en chimie, photochimie et biologie moléculaire. Son laboratoire est largement reconnu pour son approche multidisciplinaire, intégrant des méthodes chimiques, biochimiques et photochimiques afin d’étudier les systèmes bioluminescents d’une grande variété d’organismes, tels que les champignons, les diptères, les espèces marines et les mille-pattes.",
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
      es: "Biólogo (Universidad Federal del Espírito Santo - UFES, 2014) y Doctor en Ciencias Biológicas/Bioquímica (Instituto de Química de la Universidad de São Paulo, IQ-USP, 2019) con una estancia de corta duración en la Universidad de Cambridge (Reino Unido). Fue becario posdoctoral de la Fundación de Apoyo a la Investigación del Estado de São Paulo (FAPESP) entre 2019 y 2024 en el Laboratorio de Bioluminiscencia de Hongos (IQ-USP), incluyendo períodos como investigador visitante en la California State University East Bay (California, EE.UU.), Virginia State University (Virginia, EE.UU.) y el Imperial College London (Londres, Reino Unido). Durante su doctorado (2014-2019), caracterizó la secuencia codificante de una dioxigenasa involucrada en la biosíntesis de betalainas e higroaurinas, pigmentos fúngicos raros, a partir del hongo Amanita muscaria. Paralelamente, actuó como investigador asociado en el Proyecto Aquarela (Programa Natura Campus; 2014-2018), en el área de biotecnología de pigmentos naturales. Forma parte de la Red Brasileña de Biología Sintética, es voluntario en la Asociación Brasileña de Biología Sintética (SynBioBR) y actualmente coordina la Olimpiada Brasileña de Biología Sintética (OBBS). Es Profesor Asistente en el Departamento de Ingeniería de Bioprocesos y Biotecnología de la Facultad de Ciencias Farmacéuticas de Araraquara de la Universidad Estatal Paulista (UNESP), donde lidera el recientemente creado grupo de investigación en Biología Sintética de Hongos (funSynBio). Actualmente, su investigación se centra en la prospección, caracterización funcional y manipulación genética de megasintasas fúngicas para la producción de nuevos bioactivos; y en el desarrollo de partes biológicas para promover el uso de Basidiomicetos como chasis en proyectos de biología sintética. Además, colabora en la orientación de doctorandos en proyectos sobre bioluminiscencia de hongos, ciempiés y organismos marinos, así como en metagenómica ambiental mediante secuenciación de ADN por nanoporos.",
      fr: "Biologiste (Université fédérale de l’Espírito Santo - UFES, 2014) et docteur en sciences biologiques/biochimie (Institut de chimie de l’Université de São Paulo, IQ-USP, 2019), avec un stage de courte durée à l’Université de Cambridge (Royaume-Uni). Il a été chercheur postdoctoral à la Fondation de soutien à la recherche de l’État de São Paulo (FAPESP) entre 2019 et 2024, au Laboratoire de bioluminescence des champignons (IQ-USP), incluant des périodes en tant que chercheur invité à la California State University East Bay (Californie, États-Unis), à la Virginia State University (Virginie, États-Unis) et à l’Imperial College London (Londres, Royaume-Uni). Pendant son doctorat (2014-2019), il a caractérisé la séquence codante d’une dioxygénase impliquée dans la biosynthèse des bétalaïnes et des hygroaurines, pigments fongiques rares, à partir du champignon Amanita muscaria. Parallèlement, il a travaillé comme chercheur associé au Projet Aquarela (Programme Natura Campus ; 2014-2018), dans le domaine de la biotechnologie des pigments naturels. Il fait partie du Réseau brésilien de biologie synthétique, est bénévole à l’Association brésilienne de biologie synthétique (SynBioBR) et coordonne actuellement l’Olympiade brésilienne de biologie synthétique (OBBS). Il est professeur adjoint au Département de génie des bioprocédés et de biotechnologie de la Faculté des sciences pharmaceutiques d’Araraquara, à l’Université d’État Paulista (UNESP), où il dirige le nouveau groupe de recherche en biologie synthétique des champignons (funSynBio). Ses recherches portent actuellement sur la prospection, la caractérisation fonctionnelle et la manipulation génétique des mégasynthétases fongiques pour la production de nouveaux composés bioactifs, ainsi que sur le développement de modules biologiques favorisant l’utilisation des basidiomycètes comme châssis dans les projets de biologie synthétique. Il contribue également à l’encadrement de doctorants dans des projets portant sur la bioluminescence des champignons, des mille-pattes et des organismes marins, ainsi que sur la métagénomique environnementale à l’aide du séquençage de l’ADN par nanopores.",
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
      es: "Desarrollador de software full stack y estudiante de pregrado en Sistemas de Información en la Universidad del Estado de Bahía (UNEB). Actúa profesionalmente en el desarrollo de aplicaciones web y APIs, con experiencia en JavaScript/TypeScript, React/Node y Python/Django, además de integraciones y arquitectura de microservicios. En el ámbito académico, contribuye a LUMM, una base de datos web orientada a la divulgación científica sobre hongos bioluminiscentes, y desarrolla interés en la ingeniería de software aplicada a la bioinformática, con énfasis en la seguridad de aplicaciones web contenedorizadas.",
      fr: "Développeur logiciel full-stack et étudiant de premier cycle en Systèmes d’information à l’Université de l’État de Bahia (UNEB). Il travaille professionnellement au développement d’applications web et d’API, avec une expérience en JavaScript/TypeScript, React/Node et Python/Django, ainsi qu’en intégrations et en architecture de microservices. Sur le plan académique, il contribue au LUMM, une base de données web dédiée à la diffusion scientifique sur les champignons bioluminescents, et s’intéresse à l’ingénierie logicielle appliquée à la bioinformatique, avec un accent sur la sécurité des applications web conteneurisées.",
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
      es: "Estudiante de pregrado en Sistemas de Información en la Universidad del Estado de Bahía (UNEB). Trabaja en el área de desarrollo web en LUMM, un proyecto que forma parte del Grupo de Investigación G2BC, donde también es voluntario. Su participación implica la aplicación de conocimientos tecnológicos en la creación y el mantenimiento de soluciones web para un entorno de investigación.",
      fr: "Étudiant en Systèmes d’information à l’Université de l’État de Bahia (UNEB). Il travaille dans le domaine du développement web au sein du projet LUMM, qui fait partie du groupe de recherche G2BC, où il est également bénévole. Sa participation consiste à appliquer ses connaissances technologiques à la création et à la maintenance de solutions web pour un environnement de recherche.",
    },
    links: [
      {
        icon: <Mail className="w-5 h-5" />,
        href: "mailto:joaoarthurvalentelima2@gmail.com",
        title: "Email",
      },
      // {
      //   icon: <Link className="w-5 h-5" />,
      //   href: "https://lattes.cnpq.br/0556706706006912",
      //   title: "Lattes",
      // },
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

type PrerenderContext = {
  url: string;
};

type HeadElement = {
  type: "meta" | "link" | "script";
  props: Record<string, string>;
  children?: string;
};

const ROUTES = [
  "/",
  "/pt",
  "/pt/explorar",
  "/pt/sobre",
  "/pt/publicacoes",
  "/pt/distribuicao",
  "/pt/contato",
  "/pt/colaboradores",
  "/en",
  "/en/explorar",
  "/en/sobre",
  "/en/publicacoes",
  "/en/distribuicao",
  "/en/contato",
  "/en/colaboradores",
];

const TITLES: Record<string, string> = {
  "/": "LUMM - Banco de dados sobre fungos luminescentes",
  "/pt": "LUMM - Banco de dados sobre fungos luminescentes",
  "/pt/explorar": "Explorar espécies - LUMM",
  "/pt/sobre": "Sobre o projeto - LUMM",
  "/pt/publicacoes": "Publicações - LUMM",
  "/pt/distribuicao": "Distribuição geográfica - LUMM",
  "/pt/contato": "Contato - LUMM",
  "/pt/colaboradores": "Colaboradores - LUMM",
  "/en": "LUMM - Luminescent mushrooms database",
  "/en/explorar": "Explore species - LUMM",
  "/en/sobre": "About the project - LUMM",
  "/en/publicacoes": "Publications - LUMM",
  "/en/distribuicao": "Geographic distribution - LUMM",
  "/en/contato": "Contact - LUMM",
  "/en/colaboradores": "Contributors - LUMM",
};

const DESCRIPTIONS: Record<string, string> = {
  "/": "Plataforma de divulgação científica sobre fungos luminescentes com informações taxonômicas, distribuição e publicações",
  "/pt":
    "Plataforma de divulgação científica sobre fungos luminescentes com informações taxonômicas, distribuição e publicações",
  "/pt/explorar":
    "Catálogo para explorar espécies de fungos luminescentes por classificação e filtros",
  "/pt/sobre": "Conheça objetivos, equipe e contexto científico do projeto LUMM",
  "/pt/publicacoes": "Acesse publicações e referências científicas relacionadas ao projeto",
  "/pt/distribuicao": "Visualize a distribuição geográfica das espécies registradas",
  "/pt/contato": "Envie dúvidas e contribua com novas informações científicas",
  "/pt/colaboradores": "Conheça as pessoas e instituições que constroem o LUMM",
  "/en":
    "Scientific outreach platform about luminescent mushrooms with taxonomy, distribution and publications",
  "/en/explorar": "Catalog to explore luminescent mushroom species with filters and classification",
  "/en/sobre": "Learn about the goals, team and scientific context behind LUMM",
  "/en/publicacoes": "Browse publications and scientific references related to the project",
  "/en/distribuicao": "View the geographic distribution of recorded species",
  "/en/contato": "Send questions and contribute new scientific information",
  "/en/colaboradores": "Meet the people and institutions building LUMM",
};

const BASE_URL = (process.env.VITE_SITE_URL ?? "https://lumm.uneb.br").replace(/\/+$/, "");

const BREADCRUMB_LABELS = {
  pt: {
    home: "Início",
    explorar: "Explorar espécies",
    sobre: "Sobre o projeto",
    publicacoes: "Publicações",
    distribuicao: "Distribuição geográfica",
    contato: "Contato",
    colaboradores: "Colaboradores",
  },
  en: {
    home: "Home",
    explorar: "Explore species",
    sobre: "About the project",
    publicacoes: "Publications",
    distribuicao: "Geographic distribution",
    contato: "Contact",
    colaboradores: "Contributors",
  },
} as const;

function normalizeRoute(url: string) {
  if (!url) return "/";
  const pathOnly = url.split("?")[0].split("#")[0];
  if (!pathOnly || pathOnly === "/") return "/";
  return pathOnly.replace(/\/+$/, "");
}

function getLanguagePaths(route: string) {
  if (route === "/") {
    return { ptPath: "/pt", enPath: "/en", xDefaultPath: "/" };
  }

  if (route.startsWith("/pt")) {
    const suffix = route.slice(3);
    return {
      ptPath: route,
      enPath: `/en${suffix}`,
      xDefaultPath: route,
    };
  }

  if (route.startsWith("/en")) {
    const suffix = route.slice(3);
    return {
      ptPath: `/pt${suffix}`,
      enPath: route,
      xDefaultPath: `/pt${suffix}`,
    };
  }

  return { ptPath: "/pt", enPath: "/en", xDefaultPath: "/" };
}

function absoluteUrl(pathname: string) {
  return pathname === "/" ? BASE_URL : `${BASE_URL}${pathname}`;
}

function getRouteLanguage(route: string) {
  return route.startsWith("/en") ? "en" : "pt";
}

function buildWebPageSchema(canonical: string, title: string, description: string, lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    inLanguage: lang,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "LUMM",
      url: BASE_URL,
    },
  };
}

function buildBreadcrumbSchema(route: string) {
  const locale = getRouteLanguage(route);
  const labels = BREADCRUMB_LABELS[locale];
  const localePrefix = locale === "en" ? "/en" : "/pt";

  const itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: labels.home,
      item: absoluteUrl(route === "/" ? "/" : localePrefix),
    },
  ];

  if (route === "/" || route === "/pt" || route === "/en") {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    };
  }

  const segments = route.split("/").filter(Boolean);
  const contentSegments =
    segments[0] === "pt" || segments[0] === "en" ? segments.slice(1) : segments;
  let currentPath = localePrefix;

  for (const segment of contentSegments) {
    currentPath = `${currentPath}/${segment}`;
    const name =
      labels[segment as keyof typeof labels] ??
      segment.replace(/-/g, " ").replace(/^\w/, (char) => char.toUpperCase());

    itemListElement.push({
      "@type": "ListItem",
      position: itemListElement.length + 1,
      name,
      item: absoluteUrl(currentPath),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

export async function prerender({ url }: PrerenderContext) {
  const route = normalizeRoute(url);
  const title = TITLES[route] ?? TITLES["/"];
  const description = DESCRIPTIONS[route] ?? DESCRIPTIONS["/"];
  const lang = route.startsWith("/en") ? "en" : "pt-BR";
  const ogLocale = lang === "en" ? "en_US" : "pt_BR";
  const ogLocaleAlternate = lang === "en" ? "pt_BR" : "en_US";
  const canonical = absoluteUrl(route);
  const { ptPath, enPath, xDefaultPath } = getLanguagePaths(route);

  const webPageSchema = buildWebPageSchema(canonical, title, description, lang);
  const breadcrumbSchema = buildBreadcrumbSchema(route);

  const elements = new Set<HeadElement>([
    { type: "meta", props: { name: "title", content: title } },
    { type: "meta", props: { name: "description", content: description } },
    { type: "link", props: { rel: "canonical", href: canonical } },
    { type: "link", props: { rel: "alternate", hreflang: "pt-BR", href: absoluteUrl(ptPath) } },
    { type: "link", props: { rel: "alternate", hreflang: "en", href: absoluteUrl(enPath) } },
    {
      type: "link",
      props: { rel: "alternate", hreflang: "x-default", href: absoluteUrl(xDefaultPath) },
    },
    { type: "meta", props: { property: "og:url", content: canonical } },
    { type: "meta", props: { property: "og:site_name", content: "LUMM" } },
    { type: "meta", props: { property: "og:title", content: title } },
    { type: "meta", props: { property: "og:description", content: description } },
    { type: "meta", props: { property: "og:locale", content: ogLocale } },
    { type: "meta", props: { property: "og:locale:alternate", content: ogLocaleAlternate } },
    { type: "meta", props: { name: "twitter:url", content: canonical } },
    { type: "meta", props: { name: "twitter:title", content: title } },
    { type: "meta", props: { name: "twitter:description", content: description } },
    {
      type: "script",
      props: { type: "application/ld+json" },
      children: JSON.stringify(webPageSchema),
    },
    {
      type: "script",
      props: { type: "application/ld+json" },
      children: JSON.stringify(breadcrumbSchema),
    },
  ]);

  return {
    // Não injeta conteúdo no #root para evitar mudança visual na hidratação.
    html: "",
    links: new Set(ROUTES),
    data: { route },
    head: {
      lang,
      title,
      elements,
    },
  };
}

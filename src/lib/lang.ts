export const SUPPORTED_LOCALES = ["pt", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt";

export function isSupported(l?: string): l is Locale {
  return !!l && SUPPORTED_LOCALES.includes(l as Locale);
}

export function normalize(lang?: string): Locale {
  if (!lang) return DEFAULT_LOCALE;
  const base = lang.toLowerCase().split("-")[0];
  return isSupported(base) ? (base as Locale) : DEFAULT_LOCALE;
}

export function stripLeadingLang(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return isSupported(first) ? `/${rest.join("/")}` : pathname;
}

import i18n, { type BackendModule, type ResourceLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import countries from "i18n-iso-countries";
import pt from "i18n-iso-countries/langs/pt.json";
import en from "i18n-iso-countries/langs/en.json";

import { DEFAULT_LOCALE, normalize, SUPPORTED_LOCALES, type Locale } from "./lang";

countries.registerLocale(pt);
countries.registerLocale(en);

const localeLoaders: Record<Locale, () => Promise<{ default: ResourceLanguage }>> = {
  en: () => import("@/locales/en.json") as Promise<{ default: ResourceLanguage }>,
  pt: () => import("@/locales/pt.json") as Promise<{ default: ResourceLanguage }>,
};

const localeCache = new Map<Locale, Promise<ResourceLanguage>>();

function loadLocale(locale: Locale) {
  const cached = localeCache.get(locale);
  if (cached) return cached;

  const resource = localeLoaders[locale]().then((module) => module.default);
  localeCache.set(locale, resource);
  return resource;
}

const dynamicLocaleBackend: BackendModule = {
  type: "backend",
  init: () => {},
  read(language, namespace, callback) {
    loadLocale(normalize(language))
      .then((resource) => {
        callback(null, resource[namespace] ?? {});
      })
      .catch((error: unknown) => {
        callback(error instanceof Error ? error : String(error), null);
      });
  },
};

export const initI18n = i18n
  .use(dynamicLocaleBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {},
    partialBundledLanguages: true,
    ns: ["translation"],
    defaultNS: "translation",
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "navigator", "htmlTag"],
      lookupFromPathIndex: 0,
      caches: [],
    },
  });

export { countries };
export default i18n;

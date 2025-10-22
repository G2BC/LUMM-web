import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import countries from "i18n-iso-countries";
import pt from "i18n-iso-countries/langs/pt.json";
import en from "i18n-iso-countries/langs/en.json";
import es from "i18n-iso-countries/langs/es.json";
import fr from "i18n-iso-countries/langs/fr.json";

import enJSON from "@/locales/en.json";
import ptJSON from "@/locales/pt.json";
import esJSON from "@/locales/es.json";
import frJSON from "@/locales/fr.json";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./lang";

countries.registerLocale(pt);
countries.registerLocale(en);
countries.registerLocale(es);
countries.registerLocale(fr);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { ...enJSON },
      pt: { ...ptJSON },
      es: { ...esJSON },
      fr: { ...frJSON },
    },
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

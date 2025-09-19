import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import countries from "i18n-iso-countries";
import pt from "i18n-iso-countries/langs/pt.json";
import en from "i18n-iso-countries/langs/en.json";

import enJSON from "@/locales/en.json";
import ptJSON from "@/locales/pt.json";

countries.registerLocale(pt);
countries.registerLocale(en);

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    pt: { ...ptJSON },
  },
  lng: "pt",
  fallbackLng: "pt",
});

export { countries };
export default i18n;

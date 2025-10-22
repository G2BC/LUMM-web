// src/components/LanguageGuard.tsx
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import i18n from "@/lib/i18n";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { isSupported, DEFAULT_LOCALE, stripLeadingLang, type Locale } from "@/lib/lang";

export default function LanguageGuard() {
  const { lang } = useParams();
  const nav = useNavigate();
  const { pathname, search, hash } = useLocation();
  const { setLanguage, language: storedLang } = useLanguageStore();

  useEffect(() => {
    const current = isSupported(lang) ? (lang as Locale) : null;

    if (!current) {
      const fallback = storedLang ?? DEFAULT_LOCALE;
      const rest = stripLeadingLang(pathname);
      nav(`/${fallback}${rest}${search}${hash}`, { replace: true });
      return;
    }

    if (i18n.language !== current) setLanguage(current);

    document.documentElement.lang = current;
  }, [lang, pathname, search, hash, nav, setLanguage, storedLang]);

  return <Outlet />;
}

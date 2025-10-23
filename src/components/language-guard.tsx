import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import i18n from "@/lib/i18n";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { isSupported, DEFAULT_LOCALE, stripLeadingLang, type Locale } from "@/lib/lang";

const EXCLUDE_PATHS = [
  /^\/sitemap(\.xml)?$/i,
  /^\/robots\.txt$/i,
  /^\/manifest(\.webmanifest)?$/i,
  /^\/(favicon\.ico|apple-touch-icon.*\.png)$/i,
  /^\/(assets|static|img|images|fonts)\//i,
];

function isFilePath(p: string) {
  return /\.[a-z0-9]+($|\?)/i.test(p);
}

export default function LanguageGuard() {
  const { lang } = useParams();
  const nav = useNavigate();
  const { pathname, search, hash } = useLocation();
  const { setLanguage, language: storedLang } = useLanguageStore();

  useEffect(() => {
    if (isFilePath(pathname) || EXCLUDE_PATHS.some((r) => r.test(pathname))) return;

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

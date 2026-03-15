import { useEffect } from "react";
import { useLocation } from "react-router";

const THEME_COLOR_META_NAME = "theme-color";
const PUBLIC_THEME_COLOR = "#0A100B";
const PANEL_THEME_COLOR = "#FFFFFF";

function resolveThemeColor(pathname: string) {
  return /\/painel(\/|$)/.test(pathname) ? PANEL_THEME_COLOR : PUBLIC_THEME_COLOR;
}

export function RouteAwareThemeColor() {
  const { pathname } = useLocation();

  useEffect(() => {
    const content = resolveThemeColor(pathname);
    let meta = document.querySelector<HTMLMetaElement>(`meta[name="${THEME_COLOR_META_NAME}"]`);

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", THEME_COLOR_META_NAME);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
    document.documentElement.style.backgroundColor = content;
    document.body.style.backgroundColor = content;
  }, [pathname]);

  return null;
}

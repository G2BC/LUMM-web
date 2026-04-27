import { LummLogo } from "./logo";
import { HeaderNav } from "./header-nav";
import { Button } from "./ui/button";
import { Link, useNavigate, useParams } from "react-router";
import LanguageSwitcher from "./languege-switcher";
import { useTranslation } from "react-i18next";
import { HeaderMenuNav } from "./header-menu-nav";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);
  const showPanelButton = Boolean(accessToken && (user || mustChangePassword));
  const panelPath = mustChangePassword ? `/${locale}/trocar-senha` : `/${locale}/painel`;

  return (
    <header className="h-20 w-full bg-[#0A100B] flex items-center min-h-[85px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex h-full items-center gap-16">
          <Link to="/">
            <LummLogo />
          </Link>
          <HeaderNav />
        </div>
        <div className="hidden lg:flex items-center gap-3">
          {showPanelButton ? (
            <Button
              onClick={() => navigate(panelPath)}
              className="h-9 bg-primary text-black font-semibold hover:bg-primary/90"
            >
              {t("header.ctas.panel")}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-9 border-primary/60 bg-transparent text-primary hover:bg-primary/15 hover:text-primary"
                onClick={() => navigate(`/${locale}/login`)}
              >
                {t("header.ctas.login")}
              </Button>
              <Button
                className="h-9 bg-primary text-black font-semibold hover:bg-primary/90"
                onClick={() => navigate(`/${locale}/cadastro`)}
              >
                {t("header.ctas.register")}
              </Button>
            </>
          )}
          <LanguageSwitcher />
        </div>
        <div className="lg:hidden flex items-center">
          <HeaderMenuNav />
        </div>
      </div>
    </header>
  );
}

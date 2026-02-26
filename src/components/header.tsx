import { LummLogo } from "./logo";
import { HeaderNav } from "./header-nav";
import { Button } from "./ui/button";
import { Link, useNavigate, useParams } from "react-router";
import LanguageSwitcher from "./languege-switcher";
import { useTranslation } from "react-i18next";
import { HeaderMenuNav } from "./header-menu-nav";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";
import { LayoutDashboard, Lock } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);
  const showPanelButton = Boolean(accessToken && (user || mustChangePassword));

  return (
    <header className="h-20 w-full bg-[#0A100B] flex items-center min-h-[85px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex h-full items-center gap-16">
          <Link to="/">
            <LummLogo />
          </Link>
          <HeaderNav />
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-white hover:bg-primary"
            title={showPanelButton ? t("header.ctas.panel") : t("header.ctas.login")}
            onClick={() =>
              navigate(
                showPanelButton
                  ? mustChangePassword
                    ? `/${locale}/trocar-senha`
                    : `/${locale}/painel`
                  : `/${locale}/login`
              )
            }
          >
            {showPanelButton ? (
              <LayoutDashboard className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
            <span className="sr-only">
              {showPanelButton ? t("header.ctas.panel") : t("header.ctas.login")}
            </span>
          </Button>
          <LanguageSwitcher />
        </div>
        <div className="lg:hidden flex items-center">
          <HeaderMenuNav />
        </div>
      </div>
    </header>
  );
}

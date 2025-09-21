import { LummLogo } from "./logo";
import { HeaderNav } from "./header-nav";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import LanguageSwitcher from "./languege-switcher";
import { useTranslation } from "react-i18next";
import { HeaderMenuNav } from "./header-menu-nav";

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <Button className="hidden" onClick={() => navigate("/login")} variant="outline">
            {t("header.ctas.login")}
          </Button>
          <Button className="hidden" onClick={() => navigate("/cadastro")}>
            {t("header.ctas.register")}
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

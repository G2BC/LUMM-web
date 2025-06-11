import { Menu } from "lucide-react";
import { LummLogo } from "./logo";
import { HeaderNav } from "./header-nav";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import LanguageSwitcher from "./languege-switcher";
import { useTranslation } from "react-i18next";

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
          <Button onClick={() => navigate("/login")} variant="outline">
            {t("header.ctas.login")}
          </Button>
          <Button onClick={() => navigate("/cadastro")} className=" t">
            {t("header.ctas.register")}
          </Button>
          <LanguageSwitcher />
        </div>
        <div className="lg:hidden">
          <Menu className="text-[#00C000] w-8 h-8 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}

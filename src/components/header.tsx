import { Menu } from "lucide-react";
import { LummLogo } from "./logo";
import { HeaderNav } from "./header-nav";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="h-20 w-full bg-[#0D140E] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex h-full items-center gap-16">
          <Link to="/">
            <LummLogo />
          </Link>
          <HeaderNav />
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <Button onClick={() => navigate("/login")} variant="outline">
            Entrar
          </Button>
          <Button onClick={() => navigate("/cadastro")} className=" t">
            Cadastre-se
          </Button>
        </div>
        <div className="lg:hidden">
          <Menu className="text-[#00C000] w-8 h-8 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}

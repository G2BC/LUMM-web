import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LanguageSwitcher from "./languege-switcher";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { HeaderNav } from "./header-nav";
import { useState } from "react";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";

export function HeaderMenuNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);
  const showPanelButton = Boolean(accessToken && (user || mustChangePassword));
  const panelPath = mustChangePassword ? `/${locale}/trocar-senha` : `/${locale}/painel`;

  function handleClose() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="p-0">
          <Menu className="text-[#00C000] min-w-8 w-8 min-h-8 h-8 cursor-pointer" />
        </Button>
      </SheetTrigger>
      <SheetContent closeButtonClassName="text-primary" className="bg-[#0A100B] border-transparent">
        <SheetHeader>
          <SheetTitle>
            <LanguageSwitcher onClick={handleClose} />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex gap-6 px-4">
          <HeaderNav mobile onClick={handleClose} />
        </div>
        <SheetFooter className="mt-auto flex flex-col gap-2 border-t border-white/10 px-4 pt-4">
          {showPanelButton ? (
            <Button
              onClick={() => {
                navigate(panelPath);
                handleClose();
              }}
              className="w-full bg-primary text-black font-semibold hover:bg-primary/90"
            >
              {t("header.ctas.panel")}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  navigate(`/${locale}/login`);
                  handleClose();
                }}
                variant="outline"
                className="w-full border-primary/60 bg-transparent text-primary hover:bg-primary/15 hover:text-primary"
              >
                {t("header.ctas.login")}
              </Button>
              <Button
                onClick={() => {
                  navigate(`/${locale}/cadastro`);
                  handleClose();
                }}
                className="w-full bg-primary text-black font-semibold hover:bg-primary/90"
              >
                {t("header.ctas.register")}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

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

export function HeaderMenuNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;

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
        <SheetFooter className="hidden">
          <Button
            onClick={() => {
              navigate(`/${locale}/login`);
              handleClose();
            }}
            variant="outline"
          >
            {t("header.ctas.login")}
          </Button>
          <Button
            onClick={() => {
              navigate(`/${locale}/cadastro`);
              handleClose();
            }}
            className=" t"
          >
            {t("header.ctas.register")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

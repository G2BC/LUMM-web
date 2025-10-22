"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/useLanguageStore";
import flagBR from "@/assets/flags/brasil.webp";
import flagEUA from "@/assets/flags/united_states.webp";
import flagES from "@/assets/flags/spain.webp";
import flagFR from "@/assets/flags/france.webp";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const languages = [
  { code: "pt", name: "Português", flagImg: flagBR },
  { code: "en", name: "English", flagImg: flagEUA },
  { code: "es", name: "Español", flagImg: flagES },
  { code: "fr", name: "Français", flagImg: flagFR },
] as const;

type LangCode = (typeof languages)[number]["code"];

function stripLeadingLang(pathname: string) {
  const normalized = ("/" + pathname).replace(/\/{2,}/g, "/");
  const [, first, ...rest] = normalized.split("/");

  const withoutLang = ["pt", "en", "es", "fr"].includes(first ?? "")
    ? "/" + rest.join("/")
    : normalized;

  const trimmed = withoutLang.replace(/\/+$/g, "");
  return trimmed === "" ? "/" : trimmed;
}

export default function LanguageSwitcher({ onClick = () => {} }: { onClick?: VoidFunction }) {
  const { language, setLanguage } = useLanguageStore();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = useMemo(
    () => languages.find((l) => l.code === (lang ?? language)) ?? languages[0],
    [lang, language]
  );

  const goToLang = useCallback(
    (next: LangCode) => {
      const restRaw = stripLeadingLang(location.pathname);
      const rest = restRaw === "/" ? "" : restRaw;

      const nextUrl = `/${next}${rest}${location.search ?? ""}${location.hash ?? ""}`;
      setLanguage(next);
      navigate(nextUrl, { replace: true });
      onClick();
    },
    [location, navigate, setLanguage, onClick]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-0 h-10 w-10 overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors"
        >
          <img
            src={currentLang.flagImg}
            alt={`${currentLang.name} flag`}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => goToLang(l.code)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={l.flagImg}
                  alt={l.name}
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium">{l.name}</span>
            </div>
            <Check
              className={cn("h-4 w-4", l.code === currentLang.code ? "opacity-100" : "opacity-0")}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
import flagBrasil from "@/assets/flag_brasil.webp";
import flagEUA from "@/assets/flag_united_states.webp";

const languages = [
  {
    code: "pt",
    name: "Português",
    initials: "PT",
    colors: "bg-green-600",
    flagImg: flagBrasil,
  },
  {
    code: "en",
    name: "English",
    initials: "EN",
    colors: "bg-blue-600",
    flagImg: flagEUA,
  },
];

export default function LanguageSwitcher({ onClick = () => {} }: { onClick?: VoidFunction }) {
  const { language, setLanguage } = useLanguageStore();

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 h-8 w-8 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-0 h-10 w-10 overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="h-full w-full rounded-full overflow-hidden">
              <img
                src={currentLanguage.flagImg}
                alt={`${currentLanguage.name} flag`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </Button>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => {
              setLanguage(l.code as "pt" | "en");
              onClick();
            }}
            className="flex items-center justify-between cursor-pointer py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={l.flagImg}
                  alt={`${l.name} flag`}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium">{l.name}</span>
            </div>
            <Check className={cn("h-4 w-4", l.code === language ? "opacity-100" : "opacity-0")} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

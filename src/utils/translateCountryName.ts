import { countries } from "@/lib/i18n";

export function translateCountryName(
  name: string,
  fromLang: "en" | "pt",
  toLang: "en" | "pt"
): string {
  const code = countries.getAlpha2Code(name, fromLang);
  if (!code) return name;

  return countries.getName(code, toLang) ?? name;
}

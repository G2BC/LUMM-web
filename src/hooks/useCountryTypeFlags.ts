import { useEffect, useState } from "react";

const countryFlagsLoaders = import.meta.glob<{ default: string }>(
  "../assets/flags/country_types/*.webp"
);

export function useCountryTypeFlags(country: string | null) {
  const [iconUrl, setIconUrl] = useState<string>("");

  useEffect(() => {
    if (!country) return;

    const normalizedArr = country.split(" ");
    const normalized = normalizedArr.join("_").toLowerCase();

    const iconPath = `../assets/flags/country_types/${normalized}.webp`;
    const loadIcon = countryFlagsLoaders[iconPath];
    let isMounted = true;

    if (!loadIcon) {
      setIconUrl("");
      return;
    }

    loadIcon().then((module) => {
      if (isMounted) setIconUrl(module.default);
    });

    return () => {
      isMounted = false;
    };
  }, [country]);

  return iconUrl;
}

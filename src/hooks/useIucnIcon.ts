import { useEffect, useState } from "react";

const iucnIconLoaders = import.meta.glob<{ default: string }>(
  "../assets/IUCN_Red_List_icons/*.svg"
);

export function useIucnIcon(code: string) {
  const [iconUrl, setIconUrl] = useState<string>("");

  useEffect(() => {
    const iconPath = `../assets/IUCN_Red_List_icons/${code}.svg`;
    const fallbackPath = "../assets/IUCN_Red_List_icons/NE.svg";
    const loadIcon = iucnIconLoaders[iconPath] ?? iucnIconLoaders[fallbackPath];
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
  }, [code]);

  return iconUrl;
}

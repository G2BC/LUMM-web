// src/stores/useLanguageStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/lib/i18n";
import { type Locale, DEFAULT_LOCALE, normalize } from "@/lib/lang";

type State = { language: Locale; setLanguage: (_: Locale) => void };

export const useLanguageStore = create<State>()(
  persist(
    (set) => ({
      language: normalize(i18n.language) ?? DEFAULT_LOCALE,
      setLanguage: (l) => {
        i18n.changeLanguage(l);
        set({ language: l });
      },
    }),
    { name: "language" }
  )
);

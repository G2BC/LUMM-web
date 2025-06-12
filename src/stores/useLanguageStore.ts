// src/stores/useLanguageStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/lib/i18n";

type Language = "en" | "pt";

interface LanguageStore {
  language: Language;
  setLanguage: (_lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: i18n.language as Language,
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: "language-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);

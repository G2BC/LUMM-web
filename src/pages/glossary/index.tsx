import { useTranslation } from "react-i18next";
import AlphabetNavigation from "./AlphabetNavigation";
import { GLOSSARY_TERMS } from "./terms";
import { useState, useEffect, useRef } from "react";

const GLOSSARY_DATA = GLOSSARY_TERMS.map((item) => ({
  term: item.term,
  category: item.category,
  definition: item.definition,
}));

export default function GlossaryPage() {
  const { t } = useTranslation();
  const [showTopButton, setShowTopButton] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const navBottom = navRef.current.offsetTop + navRef.current.offsetHeight;
        setShowTopButton(window.scrollY > navBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  return (
    <section className="container mx-auto px-4 py-16 text-white relative">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`
    fixed z-[100] left-1/2 -translate-x-1/2 
    transition-all duration-300 ease-in-out
    
    bg-[#00c000] 
    text-black 
    font-semibold 
    py-2 px-6 
    rounded-md 
    text-sm
    
    hover:bg-[#00e000]
    flex items-center gap-2
    ${showTopButton ? "top-6 opacity-100" : "-top-20 opacity-0"}
  `}
      >
        <span className="text-base">↑</span>
        {t("glossary_page.back_to_top")}
      </button>

      <h1 className="text-[50px] xl:text-[50px] font-bold leading-[1.1] xl:leading-[1.1] mb-12">
        {t("glossary_page.title")}
      </h1>
      <p className="text-lg leading-relaxed mb-6">{t("glossary_page.paragraph1")}</p>
      <p className="text-lg leading-relaxed mb-10">{t("glossary_page.paragraph2")}</p>
      <p className="text-lg leading-relaxed text-center mb-0">{t("glossary_page.paragraph3")}</p>

      <div ref={navRef}>
        <AlphabetNavigation onLetterClick={scrollToLetter} />
      </div>

      <div className="space-y-16">
        {alphabet.map((letter) => {
          const termsInLetter = GLOSSARY_DATA.filter((item) => {
            const translatedTerm = t(`glossary_page.${item.term}`);
            const firstCharRaw = translatedTerm.charAt(0).toUpperCase();
            const firstCharNormalized = firstCharRaw
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");

            if (letter === "#") {
              return !/[A-Z]/.test(firstCharNormalized);
            }
            return firstCharNormalized === letter;
          }).sort((a, b) =>
            t(`glossary_page.${a.term}`).localeCompare(t(`glossary_page.${b.term}`))
          );

          if (termsInLetter.length === 0) return null;

          return (
            <div key={letter} id={`section-${letter}`} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-black text-[#00c000]">{letter}</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              <div className="space-y-10">
                {termsInLetter.map((item, index) => (
                  <div key={index} className="border-b border-white/5 pb-8 group">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">
                        {t(`glossary_page.${item.term}`)}
                      </h2>
                      <span className="text-xs italic text-gray-200 uppercase tracking-widest">
                        {t(`glossary_page.${item.category}`)}
                      </span>
                    </div>

                    <p className="text-lg leading-relaxed text-gray-300 ml-0 md:ml-4">
                      {t(`glossary_page.${item.definition}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

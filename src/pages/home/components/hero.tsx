import heroDesktop from "@/assets/home/hero_desktop.webp";
import heroMobile from "@/assets/home/hero_mobile.webp";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <div className="w-full bg-[#030003] h-[100vh] max-h-[800px] lg:max-h-[900px]">
      <section className="container mx-auto w-full h-full flex  flex-col lg:flex-row justify-between items-center px-4 lg:px-0 overflow-hidden">
        <div className="flex-1 w-full flex justify-center flex-col px-2 lg:pt-0 pt-12">
          <h1 className="text-white text-[32px] lg:text-[48px] font-black">
            {t("home.hero.title.first_block")} <br />
            {t("home.hero.title.second_block")}{" "}
            <span className="leading-0 font-(family-name:--font-syne) lg:text-[48px] lg:leading-[24px] text-[28px] font-extrabold">
              LUMM
            </span>
          </h1>
          <h2 className="text-white text-[22px] lg:text-[28px] font-bold mt-4">
            {t("home.hero.description.first_block")} <br className="lg:hidden" />{" "}
            {t("home.hero.description.second_block")}
          </h2>
          <Button
            onClick={() => navigate(`/${lang ?? DEFAULT_LOCALE}/explorar`)}
            className="h-12 lg:max-w-[220px] max-w-[145px] mt-8"
          >
            {t("home.hero.cta")}
          </Button>
        </div>
        <div className="flex-1 self-end select-none">
          <img
            loading="eager"
            fetchPriority="high"
            draggable="false"
            src={heroDesktop}
            alt="LUMM Banner"
            className="hidden md:block"
          />
          <img
            loading="eager"
            fetchPriority="high"
            src={heroMobile}
            alt="LUMM Banner"
            className="md:hidden"
          />
        </div>
      </section>
    </div>
  );
}

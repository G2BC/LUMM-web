import heroDesktop from "@/assets/hero_desktop.png";
import heroMobile from "@/assets/hero_mobile.png";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="w-full bg-[#010103] h-[90svh] md:max-h-[800px] lg:max-h-[700px]">
      <section className="container mx-auto w-full h-full flex  flex-col lg:flex-row justify-between items-center px-6 overflow-hidden">
        <div className="flex-1 w-full flex justify-center flex-col px-2 lg:pt-0 pt-12">
          <h1 className="text-white text-[32px] lg:text-[48px] font-black">
            Bem-vindo <br />
            ao{" "}
            <span className="leading-0 font-(family-name:--font-syne) lg:text-[48px] lg:leading-[24px] text-[28px] font-extrabold">
              LUMM
            </span>
          </h1>
          <h2 className="text-white text-[22px] lg:text-[28px] font-bold mt-4">
            Um projeto dedicado ao universo dos cogumelos <br />{" "}
            bioluminescentes
          </h2>
          <Button className="h-12 lg:max-w-[220px] max-w-[145px] mt-8">
            Explorar
          </Button>
        </div>
        <div className="flex-1 self-end select-none">
          <img
            draggable="false"
            src={heroDesktop}
            alt="LUMM Banner"
            className="hidden md:block"
          />
          <img src={heroMobile} alt="LUMM Banner" className="md:hidden" />
        </div>
      </section>
    </div>
  );
}

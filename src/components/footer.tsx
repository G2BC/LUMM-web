import { Link, useNavigate } from "react-router";
import { LummLogo } from "./logo";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const links = [
  {
    path: "/sobre",
    label: "footer.links.about",
  },
  {
    path: "/colaboradores",
    label: "footer.links.contributors",
  },
  {
    path: "/contato",
    label: "footer.links.contact",
  },
];

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col w-full mt-auto">
      <div className="flex-1 px-4  bg-[#0A100B] flex items-center min-h-[200px]">
        <div className="py-6 container mx-auto px-2 flex flex-row-reverse md:flex-row md:items-center justify-end md:justify-between">
          <div className="hidden md:flex">
            <LummLogo />
          </div>
          <div className="flex md:items-center gap-6 shrink flex-col-reverse md:flex-row">
            <div className="md:text-end text-white">
              <h2 className="font-bold mb-2">{t("footer.join_us_section.title")}</h2>
              <h3 className="font-normal mb-5">
                {t("footer.join_us_section.subtitle")}
                <br /> {t("footer.join_us_section.subtitle_end")}
              </h3>
              <Button onClick={() => navigate("/cadastro")} className="h-10">
                {t("footer.join_us_section.cta")}
              </Button>
            </div>
            <div className="h-full border-l w-[1px] border-l-white hidden md:flex min-h-[140px]" />
            <div className="flex flex-col gap-2">
              {links.map(({ label, path }) => (
                <Link className=" text-white font-semibold hover:underline" to={path}>
                  {t(label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 h-[45px] bg-[#0D140E] flex items-center">
        <span className="container mx-auto text-white font-medium text-sm">
          Copyright © {new Date().getFullYear()} Luminescent Mushrooms
        </span>
      </div>
    </footer>
  );
}

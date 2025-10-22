import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router";
import { DEFAULT_LOCALE } from "@/lib/lang";

const links = [
  { path: "/", label: "header.home" },
  { path: "/distribuicao", label: "header.distribution" },
  { path: "/explorar", label: "header.explore" },
  { path: "/sobre", label: "header.about" },
];

export function HeaderNav({
  mobile = false,
  onClick = () => {},
}: {
  mobile?: boolean;
  onClick?: VoidFunction;
}) {
  const { lang } = useParams();
  const { t } = useTranslation();

  const buildPath = (p: string) =>
    p === "/" ? `/${lang ?? DEFAULT_LOCALE}` : `/${lang ?? DEFAULT_LOCALE}${p}`;

  return (
    <div
      className={clsx(
        "h-full",
        !mobile && "hidden lg:flex justify-center gap-6",
        mobile && "flex-col flex gap-4"
      )}
    >
      {links.map(({ path, label }, index) => (
        <NavLink
          key={index}
          to={buildPath(path)}
          end={path === "/"}
          className={({ isActive }) =>
            clsx(
              "h-full flex items-center border-b-[4px] border-b-transparent transition-colors duration-500",
              isActive && "!border-b-[#00C000]",
              mobile && "max-h-[40px]"
            )
          }
          onClick={onClick}
        >
          <span className={clsx("text-white font-bold ", !mobile && "leading-0")}>{t(label)}</span>
        </NavLink>
      ))}
    </div>
  );
}

import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

const links = [
  {
    path: "/",
    label: "header.home",
  },
  {
    path: "/explorar",
    label: "header.explore",
  },
  {
    path: "/sobre",
    label: "header.about",
  },
  {
    path: "/publicacoes",
    label: "header.publications",
  },
];

export function HeaderNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div className="h-full justify-center gap-6 hidden lg:flex">
      {links.map(({ path, label }, index) => (
        <Link
          to={path}
          key={`header-nav-link-${index}`}
          className={clsx(
            "h-full flex items-center border-b-solid border-b-[4px] border-b-transparent transition-all transition-colors duration-500",
            pathname === path && "!border-b-[#00C000]"
          )}
        >
          <span className="text-white font-bold leading-0">{t(label)}</span>
        </Link>
      ))}
    </div>
  );
}

import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

const links = [
  {
    path: "/",
    label: "header.home",
  },
  {
    path: "/distribuicao",
    label: "header.distribution",
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

export function HeaderNav({
  mobile = false,
  onClick = () => {},
}: {
  mobile?: boolean;
  onClick?: VoidFunction;
}) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "h-full",
        !mobile && "hidden lg:flex justify-center gap-6",
        mobile && "flex-col flex gap-4"
      )}
    >
      {links.map(({ path, label }, index) => (
        <Link
          to={path}
          key={`header-nav-link-${index}`}
          className={clsx(
            "h-full flex items-center border-b-solid border-b-[4px] border-b-transparent transition-colors duration-500",
            pathname === path && "!border-b-[#00C000]",
            mobile && "max-h-[40px]"
          )}
          onClick={onClick}
        >
          <span className={clsx("text-white font-bold ", !mobile && "leading-0")}>{t(label)}</span>
        </Link>
      ))}
    </div>
  );
}

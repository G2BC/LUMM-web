import clsx from "clsx";
import { Link, useLocation } from "react-router";

const links = [
  {
    path: "/",
    label: "Início",
  },
  {
    path: "/explorar",
    label: "Explorar",
  },
  {
    path: "/sobre",
    label: "Sobre",
  },
  {
    path: "/publicacoes",
    label: "Publicações",
  },
];

export function HeaderNav() {
  const { pathname } = useLocation();

  return (
    <div className="h-full justify-center gap-6 hidden lg:flex">
      {links.map(({ path, label }, index) => (
        <Link
          to={path}
          key={`header-nav-link-${index}`}
          className={clsx(
            "h-full flex items-center border-b-solid border-b-[4px] border-b-transparent",
            pathname === path && "!border-b-[#00C000]",
          )}
        >
          <span className="text-white font-bold leading-0">{label}</span>
        </Link>
      ))}
    </div>
  );
}

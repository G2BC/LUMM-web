import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { DEFAULT_LOCALE } from "@/lib/lang";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainLinks = [
  { path: "/", label: "header.home" },
  { path: "/distribuicao", label: "header.distribution" },
  { path: "/explorar", label: "header.explore" },
];

const sobreLinks = [
  { path: "/sobre", label: "header.about" },
  { path: "/colaboradores", label: "header.collaborators" },
  { path: "/dados", label: "header.data" },
];

export function HeaderNav({
  mobile = false,
  onClick = () => {},
}: {
  mobile?: boolean;
  onClick?: VoidFunction;
}) {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normalizePath = (value: string) => {
    const normalized = value.replace(/\/+$/, "");
    return normalized || "/";
  };
  const currentPath = normalizePath(location.pathname);

  const buildPath = (p: string) =>
    p === "/" ? `/${lang ?? DEFAULT_LOCALE}` : `/${lang ?? DEFAULT_LOCALE}${p}`;

  const isSobreActive = sobreLinks.some(
    ({ path }) => normalizePath(buildPath(path)) === currentPath
  );

  return (
    <div
      className={clsx(
        "h-full",
        !mobile && "hidden lg:flex justify-center gap-6",
        mobile && "flex-col flex gap-4"
      )}
    >
      {mainLinks.map(({ path, label }, index) => {
        const targetPath = buildPath(path);
        const isActive = normalizePath(targetPath) === currentPath;

        return (
          <NavLink
            key={index}
            to={targetPath}
            className={clsx(
              "h-full flex items-center border-b-[4px] border-b-transparent transition-colors duration-500",
              isActive && "!border-b-[#00C000]",
              mobile && "max-h-[40px]"
            )}
            onClick={onClick}
          >
            <span className={clsx("text-white font-bold", !mobile && "leading-0")}>{t(label)}</span>
          </NavLink>
        );
      })}

      {mobile ? (
        sobreLinks.map(({ path, label }, index) => {
          const targetPath = buildPath(path);
          const isActive = normalizePath(targetPath) === currentPath;
          return (
            <NavLink
              key={index}
              to={targetPath}
              className={clsx(
                "h-full flex items-center border-b-[4px] border-b-transparent transition-colors duration-500 max-h-[40px]",
                isActive && "!border-b-[#00C000]"
              )}
              onClick={onClick}
            >
              <span className="text-white font-bold">{t(label)}</span>
            </NavLink>
          );
        })
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={clsx(
              "h-full flex items-center gap-1 border-b-[4px] border-b-transparent transition-colors duration-500 outline-none cursor-pointer",
              isSobreActive && "!border-b-[#00C000]"
            )}
          >
            <span className="text-white font-bold leading-0">{t("header.about")}</span>
            <ChevronDown className="text-white w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0A100B] border-white/10 min-w-[160px]">
            {sobreLinks.map(({ path, label }) => (
              <DropdownMenuItem
                key={path}
                className="text-white hover:text-white focus:text-white focus:bg-white/10 cursor-pointer"
                onClick={() => navigate(buildPath(path))}
              >
                {t(label)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

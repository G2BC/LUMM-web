import { DEFAULT_LOCALE } from "@/lib/lang";
import { useNavigate, useParams } from "react-router";

export function useLangRedirect() {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (to: string, replace = false) => {
    const prefix = `/${lang ?? DEFAULT_LOCALE}`;
    const path = to.startsWith("/") ? to : `/${to}`;
    navigate(`${prefix}${path}`, { replace });
  };
}

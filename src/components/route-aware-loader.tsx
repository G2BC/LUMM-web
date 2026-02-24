import { FullScreenLoader } from "@/components/full-screen-loader";
import { isPanelRoute } from "@/utils/isPanelRoute";
import { useLocation } from "react-router";

export function RouteAwareLoader() {
  const { pathname } = useLocation();
  return <FullScreenLoader variant={isPanelRoute(pathname) ? "light" : "dark"} />;
}

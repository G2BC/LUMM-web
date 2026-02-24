import { RouteAwareLoader } from "@/components/route-aware-loader";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet, useLocation, useParams } from "react-router";

type AuthGuardProps = {
  requireAdmin?: boolean;
};

export function AuthGuard({ requireAdmin = false }: AuthGuardProps) {
  const location = useLocation();
  const { lang } = useParams();

  const initialized = useAuthStore((state) => state.initialized);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const locale = lang ?? DEFAULT_LOCALE;
  const isAuthenticated = Boolean(accessToken && user);

  if (!initialized) {
    return <RouteAwareLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${locale}/login`}
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  if (requireAdmin && !user?.is_admin) {
    return <Navigate to={`/${locale}`} replace />;
  }

  return <Outlet />;
}

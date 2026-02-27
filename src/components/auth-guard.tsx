import { RouteAwareLoader } from "@/components/route-aware-loader";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet, useLocation, useParams } from "react-router";

type AuthGuardProps = {
  requireAdmin?: boolean;
  requireCurator?: boolean;
  requireUser?: boolean;
};

export function AuthGuard({
  requireAdmin = false,
  requireCurator = false,
  requireUser = true,
}: AuthGuardProps) {
  const location = useLocation();
  const { lang } = useParams();

  const initialized = useAuthStore((state) => state.initialized);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);

  const locale = lang ?? DEFAULT_LOCALE;
  const changePasswordPath = `/${locale}/trocar-senha`;
  const isChangePasswordRoute = location.pathname === changePasswordPath;
  const isAuthenticated = Boolean(accessToken && (requireUser ? user : true));

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

  if (mustChangePassword && !isChangePasswordRoute) {
    return <Navigate to={changePasswordPath} replace />;
  }

  if (!mustChangePassword && isChangePasswordRoute) {
    return <Navigate to={`/${locale}/painel`} replace />;
  }

  const role = (user?.role ?? "").toLowerCase();
  const isAdmin = Boolean(user?.is_admin || role === "admin");

  if (requireAdmin && !isAdmin) {
    return <Navigate to={`/${locale}`} replace />;
  }

  if (requireCurator) {
    const isCurator = Boolean(user?.is_curator || isAdmin || role === "curator");
    if (!isCurator) {
      return <Navigate to={`/${locale}`} replace />;
    }
  }

  return <Outlet />;
}

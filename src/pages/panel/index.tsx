import { Button } from "@/components/ui/button";
import { LummLogo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { PanelUserMenu } from "@/pages/panel/components/panel-user-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, useParams, NavLink, Outlet, useLocation, Link } from "react-router";
import { ArrowLeft, FileCheck2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function InternalPanelPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const isUsersRoute = location.pathname.endsWith("/usuarios");
  const isRequestsRoute = location.pathname.endsWith("/solicitacoes");
  const role = (user?.role ?? "").toLowerCase();
  const isAdmin = Boolean(user?.is_admin || role === "admin");
  const canReviewRequests = Boolean(isAdmin || user?.is_curator || role === "curator");
  const hasAnyPanelResource = Boolean(canReviewRequests || isAdmin);

  function handleLogout() {
    clearSession();
    navigate(`/${locale}/login`, { replace: true });
  }

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-3">
          <Link to={`/${locale}/painel`}>
            <LummLogo textClassName="text-slate-900" textOnly textStyles={{ zoom: 0.8 }} />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {canReviewRequests ? (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isRequestsRoute}>
                  <NavLink to={`/${locale}/painel/solicitacoes`}>
                    <FileCheck2 className="h-4 w-4" />
                    {t("panel_page.nav_requests")}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
            {isAdmin ? (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isUsersRoute}>
                  <NavLink to={`/${locale}/painel/usuarios`}>
                    <Users className="h-4 w-4" />
                    {t("panel_page.nav_users")}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
            {!hasAnyPanelResource ? (
              <p className="px-3 text-sm text-slate-500">{t("panel_page.no_resources")}</p>
            ) : null}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <PanelUserMenu
            displayName={displayName}
            displayEmail={displayEmail}
            initials={initials}
            logoutLabel={t("panel_page.logout")}
            onLogout={handleLogout}
          />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="h-16 border-b border-slate-200 bg-white">
          <div className="flex h-full items-center gap-2 px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />

            <Button
              variant="link"
              onClick={() => navigate(`/${locale}`)}
              className="text-slate-700 px-0 min-w-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="truncate">{t("panel_page.back_to_site")}</span>
            </Button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { LummLogo } from "@/components/logo";
import LanguageSwitcher from "@/components/languege-switcher";
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
import { FileCheck2, Users } from "lucide-react";
import { TbMushroom } from "react-icons/tb";
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
  const isSpeciesRoute = /\/painel\/especies(\/|$)/.test(location.pathname);
  const role = (user?.role ?? "").toLowerCase();
  const isAdmin = Boolean(role === "admin");
  const canAccessSpecies = Boolean(user);
  const canReviewRequests = Boolean(isAdmin || role === "curator");
  const hasAnyPanelResource = Boolean(canAccessSpecies || canReviewRequests || isAdmin);

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
    <SidebarProvider className="[--primary:#118A2A] [--primary-foreground:#ffffff]">
      <Sidebar>
        <SidebarHeader className="p-3">
          <Link to={`/${locale}/painel`}>
            <LummLogo textClassName="text-slate-900" textOnly textStyles={{ zoom: 0.8 }} />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {canAccessSpecies ? (
            <div className="mb-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isSpeciesRoute}>
                    <NavLink to={`/${locale}/painel/especies`}>
                      <TbMushroom className="h-4 w-4" />
                      {t("panel_page.nav_species")}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
              </SidebarMenu>
            </div>
          ) : null}

          {isAdmin ? (
            <div>
              <p className="px-3 pb-1 text-xs font-semibold text-slate-500">
                {t("panel_page.group_administration")}
              </p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isUsersRoute}>
                    <NavLink to={`/${locale}/painel/usuarios`}>
                      <Users className="h-4 w-4" />
                      {t("panel_page.nav_users")}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          ) : null}

          {!hasAnyPanelResource ? (
            <p className="px-3 text-sm text-slate-500">{t("panel_page.no_resources")}</p>
          ) : null}
        </SidebarContent>

        <SidebarFooter>
          <PanelUserMenu
            displayName={displayName}
            displayEmail={displayEmail}
            initials={initials}
            backToSiteLabel={t("panel_page.back_to_site")}
            backToSitePath={`/${locale}`}
            logoutLabel={t("panel_page.logout")}
            onLogout={handleLogout}
          />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="h-16 border-b border-slate-200 bg-white">
          <div className="flex h-full items-center gap-2 px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />

            <div className="ml-auto">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { listUsers } from "@/api/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LummLogo } from "@/components/logo";
import { DEFAULT_LOCALE } from "@/lib/lang";
import type { AuthUser } from "@/api/auth/types";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function InternalPanelPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!user?.is_admin) return;

    setIsLoadingUsers(true);

    try {
      const response = await listUsers({ page: 1, per_page: 10 });
      setUsers(response.items);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [user?.is_admin]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function handleLogout() {
    clearSession();
    navigate(`/${locale}/login`, { replace: true });
  }

  return (
    <section className="min-h-screen bg-white text-slate-900">
      <header className="h-20 border-b border-slate-200">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <LummLogo textClassName="text-slate-900" textOnly />
            <Button
              variant="link"
              onClick={() => navigate(`/${locale}`)}
              className="text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("panel_page.back_to_site")}
            </Button>
          </div>
          <Button
            variant="outline"
            className="border-[#118A2A] text-[#118A2A] hover:bg-[#118A2A] hover:text-white"
            onClick={handleLogout}
          >
            {t("panel_page.logout")}
          </Button>
        </div>
      </header>

      <div className="container mx-auto w-full px-4 py-10 space-y-6">
        <Card className="bg-white border-slate-200 text-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl">{t("panel_page.title")}</CardTitle>
            <CardDescription className="text-slate-600">{t("panel_page.subtitle")}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">{t("panel_page.profile")}:</span>
              <Badge variant={user?.is_admin ? "default" : "secondary"}>
                {user?.is_admin ? t("panel_page.role_admin") : t("panel_page.role_user")}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <span className="text-slate-500">{t("panel_page.name")}:</span> {user?.name}
              </p>
              <p>
                <span className="text-slate-500">{t("panel_page.email")}:</span> {user?.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {user?.is_admin && (
          <Card className="bg-white border-slate-200 text-slate-900">
            <CardHeader>
              <CardTitle>{t("panel_page.users_title")}</CardTitle>
              <CardDescription className="text-slate-600">
                {t("panel_page.users_subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <p className="text-slate-600">{t("panel_page.loading_users")}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="py-2">{t("panel_page.col_name")}</th>
                        <th className="py-2">{t("panel_page.col_email")}</th>
                        <th className="py-2">{t("panel_page.col_role")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="py-2 pr-3">{item.name}</td>
                          <td className="py-2 pr-3">{item.email}</td>
                          <td className="py-2">
                            <Badge variant={item.is_admin ? "default" : "secondary"}>
                              {item.is_admin
                                ? t("panel_page.col_role_admin_short")
                                : t("panel_page.col_role_user_short")}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

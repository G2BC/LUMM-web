import type { AuthUser } from "@/api/auth/types";
import { UserActionsMenu } from "@/pages/panel/components/user-actions-menu";
import { UsersFilters } from "@/pages/panel/components/users-filters";
import { UsersMobileList } from "@/pages/panel/components/users-mobile-list";
import { UsersPagination } from "@/pages/panel/components/users-pagination";
import { UsersStats } from "@/pages/panel/components/users-stats";
import { UsersTable } from "@/pages/panel/components/users-table";
import { usePanelUsers } from "@/pages/panel/hooks/use-panel-users";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";

export default function PanelUsersPage() {
  const { t } = useTranslation();
  const loggedUserId = useAuthStore((state) => state.user?.id);
  const {
    users,
    isLoadingUsers,
    updatingUserId,
    updatingAdminRoleUserId,
    resettingUserId,
    search,
    statusFilter,
    totals,
    pagination,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleToggleUserActive,
    handleToggleUserAdminRole,
    handleAdminResetPassword,
  } = usePanelUsers();

  function renderUserActions(item: AuthUser, mobile = false) {
    const isBusy =
      updatingUserId === item.id ||
      updatingAdminRoleUserId === item.id ||
      resettingUserId === item.id;
    const isCurrentLoggedUser = Boolean(loggedUserId && item.id === loggedUserId);

    return (
      <UserActionsMenu
        mobile={mobile}
        isBusy={isBusy}
        actionsLabel={t("panel_page.col_actions")}
        activateLabel={t("panel_page.action_activate")}
        deactivateLabel={t("panel_page.action_deactivate")}
        makeAdminLabel={t("panel_page.action_make_admin")}
        removeAdminLabel={t("panel_page.action_remove_admin")}
        resetPasswordLabel={t("panel_page.action_reset_password")}
        disableActiveToggle={isCurrentLoggedUser}
        disableAdminRoleToggle={isCurrentLoggedUser}
        item={item}
        onToggleActive={(target) => void handleToggleUserActive(target)}
        onToggleAdminRole={(target) => void handleToggleUserAdminRole(target)}
        onResetPassword={(target) => void handleAdminResetPassword(target)}
      />
    );
  }

  return (
    <section className="text-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{t("panel_page.users_title")}</h2>
        <p className="mt-1 text-slate-600">{t("panel_page.users_subtitle")}</p>
      </div>

      <div>
        <UsersStats
          totals={totals}
          totalUsersLabel={t("panel_page.total_users")}
          totalActiveLabel={t("panel_page.total_active")}
          totalInactiveLabel={t("panel_page.total_inactive")}
        />

        <UsersFilters
          search={search}
          statusFilter={statusFilter}
          searchPlaceholder={t("panel_page.search_placeholder")}
          filterAllLabel={t("panel_page.filter_all")}
          filterActiveLabel={t("panel_page.filter_active")}
          filterInactiveLabel={t("panel_page.filter_inactive")}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusFilterChange}
        />

        {isLoadingUsers ? (
          <p className="text-slate-600">{t("panel_page.loading_users")}</p>
        ) : users.length > 0 ? (
          <>
            <UsersMobileList
              users={users}
              renderActions={renderUserActions}
              roleAdminLabel={t("panel_page.col_role_admin_short")}
              roleUserLabel={t("panel_page.col_role_user_short")}
              statusActiveLabel={t("panel_page.status_active")}
              statusInactiveLabel={t("panel_page.status_inactive")}
            />

            <UsersTable
              users={users}
              colNameLabel={t("panel_page.col_name")}
              colEmailLabel={t("panel_page.col_email")}
              colRoleLabel={t("panel_page.col_role")}
              colStatusLabel={t("panel_page.col_status")}
              colActionsLabel={t("panel_page.col_actions")}
              roleAdminLabel={t("panel_page.col_role_admin_short")}
              roleUserLabel={t("panel_page.col_role_user_short")}
              statusActiveLabel={t("panel_page.status_active")}
              statusInactiveLabel={t("panel_page.status_inactive")}
              renderActions={renderUserActions}
            />

            <UsersPagination
              page={pagination.page}
              pages={pagination.pages}
              perPage={pagination.perPage}
              total={pagination.total}
              previousLabel={t("panel_page.pagination_previous")}
              nextLabel={t("panel_page.pagination_next")}
              summaryLabel={({ start, end, total }) =>
                t("panel_page.pagination_summary", { start, end, total })
              }
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
            <p className="text-sm text-slate-600">{t("panel_page.no_users_found")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

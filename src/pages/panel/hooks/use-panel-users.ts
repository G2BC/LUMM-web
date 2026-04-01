import {
  adminResetPassword,
  approveUser,
  deactivateUser,
  listUsers,
  updateUserRole,
} from "@/api/auth";
import { userKeys } from "@/api/query-keys";
import type { AuthUser, AuthUserRole } from "@/api/auth/types";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
import { resolveUserRole } from "@/pages/panel/users-utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLocalizedError } from "@/api/get-localized-error";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type StatusFilter = "all" | "active" | "inactive";
const USERS_PER_PAGE = 20;

export function usePanelUsers() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState<string | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: userKeys.list({ search: debouncedSearch, statusFilter, currentPage }),
    queryFn: () =>
      listUsers({
        page: currentPage,
        per_page: USERS_PER_PAGE,
        search: debouncedSearch || undefined,
        is_active: statusFilter === "all" ? undefined : statusFilter === "active",
      }),
    placeholderData: keepPreviousData,
  });

  const { data: totalsData } = useQuery({
    queryKey: userKeys.totals(debouncedSearch),
    queryFn: () =>
      Promise.all([
        listUsers({ page: 1, per_page: 1, search: debouncedSearch || undefined }),
        listUsers({ page: 1, per_page: 1, search: debouncedSearch || undefined, is_active: true }),
        listUsers({ page: 1, per_page: 1, search: debouncedSearch || undefined, is_active: false }),
      ]),
  });

  const users: AuthUser[] = usersData?.items ?? [];
  const totalUsers = usersData?.total ?? 0;
  const totalPages = Math.max(1, usersData?.pages ?? 1);
  const totals = {
    total: totalsData?.[0]?.total ?? 0,
    active: totalsData?.[1]?.total ?? 0,
    inactive: totalsData?.[2]?.total ?? 0,
  };

  // correct page when it goes out of bounds
  useEffect(() => {
    if (usersData && currentPage > Math.max(1, usersData.pages ?? 1)) {
      setCurrentPage(Math.max(1, usersData.pages ?? 1));
    }
  }, [usersData, currentPage]);

  const pagination = useMemo(
    () => ({ page: currentPage, perPage: USERS_PER_PAGE, total: totalUsers, pages: totalPages }),
    [currentPage, totalPages, totalUsers]
  );

  async function handleToggleUserActive(user: AuthUser) {
    if (currentUserId && user.id === currentUserId) return;

    const isDeactivateAction = user.is_active;
    const isConfirmed = await confirmAction({
      title: t("panel_page.confirm_action_title"),
      text: isDeactivateAction
        ? t("panel_page.confirm_deactivate_text")
        : t("panel_page.confirm_activate_text"),
      confirmButtonText: t("panel_page.confirm_action_yes"),
      cancelButtonText: t("panel_page.confirm_action_no"),
    });

    if (!isConfirmed) return;

    setUpdatingUserId(user.id);
    try {
      if (user.is_active) {
        await deactivateUser(user.id);
      } else {
        await approveUser(user.id);
      }
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: userKeys.totals(debouncedSearch) });
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleAdminResetPassword(user: AuthUser) {
    const isConfirmed = await confirmAction({
      title: t("panel_page.confirm_action_title"),
      text: t("panel_page.confirm_reset_password_text"),
      confirmButtonText: t("panel_page.confirm_action_yes"),
      cancelButtonText: t("panel_page.confirm_action_no"),
      requireCode: true,
      codeLabel: t("panel_page.confirm_action_code_label"),
      codePlaceholder: t("panel_page.confirm_action_code_placeholder"),
      codeInvalidMessage: t("panel_page.confirm_action_code_invalid"),
    });

    if (!isConfirmed) return;

    setResettingUserId(user.id);
    try {
      const result = await adminResetPassword(user.id);
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      await Alert({
        icon: "info",
        title: t("panel_page.reset_password_success_title"),
        html: `
          <div style="display:flex;flex-direction:column;gap:10px;text-align:left">
            <p><strong>${t("panel_page.temp_password_label")}:</strong> <code>${result.temporary_password}</code></p>
            <p>${t("panel_page.reset_password_warning")}</p>
          </div>
        `,
        confirmButtonText: "OK",
      });
    } finally {
      setResettingUserId(null);
    }
  }

  async function handleUpdateUserRole(user: AuthUser, nextRole: AuthUserRole) {
    if (currentUserId && user.id === currentUserId) return;
    if (resolveUserRole(user) === nextRole) return;

    const roleLabelMap: Record<AuthUserRole, string> = {
      researcher: t("panel_page.role_researcher"),
      curator: t("panel_page.role_curator"),
      admin: t("panel_page.role_admin"),
    };

    const isConfirmed = await confirmAction({
      title: t("panel_page.confirm_action_title"),
      text: t("panel_page.confirm_change_role_text", { role: roleLabelMap[nextRole] }),
      confirmButtonText: t("panel_page.confirm_action_yes"),
      cancelButtonText: t("panel_page.confirm_action_no"),
    });

    if (!isConfirmed) return;

    setUpdatingRoleUserId(user.id);
    try {
      await updateUserRole(user.id, nextRole);
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    } finally {
      setUpdatingRoleUserId(null);
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleStatusFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return {
    users,
    isLoadingUsers,
    updatingUserId,
    updatingRoleUserId,
    resettingUserId,
    search,
    statusFilter,
    totals,
    pagination,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleToggleUserActive,
    handleUpdateUserRole,
    handleAdminResetPassword,
  };
}

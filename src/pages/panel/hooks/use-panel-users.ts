import { adminResetPassword, approveUser, deactivateUser, listUsers } from "@/api/auth";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
import type { AuthUser } from "@/api/auth/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type StatusFilter = "all" | "active" | "inactive";
const USERS_PER_PAGE = 20;

export function usePanelUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totals, setTotals] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadTotals = useCallback(async () => {
    const [allUsers, activeUsers, inactiveUsers] = await Promise.all([
      listUsers({
        page: 1,
        per_page: 1,
        search: debouncedSearch || undefined,
      }),
      listUsers({
        page: 1,
        per_page: 1,
        search: debouncedSearch || undefined,
        is_active: true,
      }),
      listUsers({
        page: 1,
        per_page: 1,
        search: debouncedSearch || undefined,
        is_active: false,
      }),
    ]);

    setTotals({
      total: allUsers.total,
      active: activeUsers.total,
      inactive: inactiveUsers.total,
    });
  }, [debouncedSearch]);

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);

    try {
      const response = await listUsers({
        page: currentPage,
        per_page: USERS_PER_PAGE,
        search: debouncedSearch || undefined,
        is_active: statusFilter === "all" ? undefined : statusFilter === "active",
      });

      const nextTotalPages = Math.max(1, response.pages ?? 1);

      if (currentPage > nextTotalPages) {
        setCurrentPage(nextTotalPages);
        return;
      }

      setUsers(response.items);
      setTotalUsers(response.total);
      setTotalPages(nextTotalPages);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadTotals();
  }, [loadTotals]);

  const pagination = useMemo(
    () => ({
      page: currentPage,
      perPage: USERS_PER_PAGE,
      total: totalUsers,
      pages: totalPages,
    }),
    [currentPage, totalPages, totalUsers]
  );

  async function handleToggleUserActive(user: AuthUser) {
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
      await Promise.all([loadUsers(), loadTotals()]);
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

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? { ...item, must_change_password: result.must_change_password }
            : item
        )
      );

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
    resettingUserId,
    search,
    statusFilter,
    totals,
    pagination,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleToggleUserActive,
    handleAdminResetPassword,
  };
}

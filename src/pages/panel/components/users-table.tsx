import type { AuthUser } from "@/api/auth/types";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeClass, resolveUserRole } from "@/pages/panel/users-utils";
import type { ReactNode } from "react";

type UsersTableProps = {
  users: AuthUser[];
  colNameLabel: string;
  colEmailLabel: string;
  colRoleLabel: string;
  colStatusLabel: string;
  colActionsLabel: string;
  roleAdminLabel: string;
  roleCuratorLabel: string;
  roleUserLabel: string;
  statusActiveLabel: string;
  statusInactiveLabel: string;
  renderActions: (_item: AuthUser, _mobile?: boolean) => ReactNode;
};

export function UsersTable({
  users,
  colNameLabel,
  colEmailLabel,
  colRoleLabel,
  colStatusLabel,
  colActionsLabel,
  roleAdminLabel,
  roleCuratorLabel,
  roleUserLabel,
  statusActiveLabel,
  statusInactiveLabel,
  renderActions,
}: UsersTableProps) {
  const roleLabelMap = {
    admin: roleAdminLabel,
    curator: roleCuratorLabel,
    researcher: roleUserLabel,
  } as const;

  return (
    <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
      <table className="min-w-[980px] w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="px-4 py-3">{colNameLabel}</th>
            <th className="px-4 py-3">{colEmailLabel}</th>
            <th className="px-4 py-3">{colRoleLabel}</th>
            <th className="px-4 py-3">{colStatusLabel}</th>
            <th className="px-4 py-3 text-right">{colActionsLabel}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => {
            const role = resolveUserRole(item);

            return (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 pr-3">{item.name}</td>
                <td className="px-4 py-3 pr-3">{item.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className={getRoleBadgeClass(role)}>
                    {roleLabelMap[role]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="secondary"
                    className={
                      item.is_active
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-100"
                    }
                  >
                    {item.is_active ? statusActiveLabel : statusInactiveLabel}
                  </Badge>
                </td>
                <td className="px-4 py-3">{renderActions(item)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

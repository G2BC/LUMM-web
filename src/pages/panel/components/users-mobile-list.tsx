import type { AuthUser } from "@/api/auth/types";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeClass, resolveUserRole } from "@/pages/panel/users-utils";
import type { ReactNode } from "react";

type UsersMobileListProps = {
  users: AuthUser[];
  renderActions: (_item: AuthUser, _mobile?: boolean) => ReactNode;
  roleAdminLabel: string;
  roleCuratorLabel: string;
  roleUserLabel: string;
  statusActiveLabel: string;
  statusInactiveLabel: string;
};

export function UsersMobileList({
  users,
  renderActions,
  roleAdminLabel,
  roleCuratorLabel,
  roleUserLabel,
  statusActiveLabel,
  statusInactiveLabel,
}: UsersMobileListProps) {
  const roleLabelMap = {
    admin: roleAdminLabel,
    curator: roleCuratorLabel,
    researcher: roleUserLabel,
  } as const;

  return (
    <div className="grid gap-3 md:hidden">
      {users.map((item) => {
        const role = resolveUserRole(item);

        return (
          <article key={item.id} className="rounded-lg border border-slate-200 p-4">
            <p className="text-base font-semibold text-slate-900">{item.name}</p>
            <p className="mb-3 text-sm text-slate-600">{item.email}</p>

            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className={getRoleBadgeClass(role)}>
                {roleLabelMap[role]}
              </Badge>
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
            </div>

            {renderActions(item, true)}
          </article>
        );
      })}
    </div>
  );
}

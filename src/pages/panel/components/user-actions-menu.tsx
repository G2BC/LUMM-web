import type { AuthUser, AuthUserRole } from "@/api/auth/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal } from "lucide-react";
import { resolveUserRole } from "@/pages/panel/users-utils";

type UserActionsMenuProps = {
  mobile?: boolean;
  isBusy?: boolean;
  actionsLabel: string;
  activateLabel: string;
  deactivateLabel: string;
  updateRoleLabel: string;
  roleResearcherLabel: string;
  roleCuratorLabel: string;
  roleAdminLabel: string;
  resetPasswordLabel: string;
  disableActiveToggle?: boolean;
  disableRoleChange?: boolean;
  item: AuthUser;
  onToggleActive: (_item: AuthUser) => void;
  onUpdateRole: (_item: AuthUser, _role: AuthUserRole) => void;
  onResetPassword: (_item: AuthUser) => void;
};

export function UserActionsMenu({
  mobile = false,
  isBusy = false,
  actionsLabel,
  activateLabel,
  deactivateLabel,
  updateRoleLabel,
  roleResearcherLabel,
  roleCuratorLabel,
  roleAdminLabel,
  resetPasswordLabel,
  disableActiveToggle = false,
  disableRoleChange = false,
  item,
  onToggleActive,
  onUpdateRole,
  onResetPassword,
}: UserActionsMenuProps) {
  const currentRole = resolveUserRole(item);
  const roleOptions: Array<{ value: AuthUserRole; label: string }> = [
    { value: "researcher", label: roleResearcherLabel },
    { value: "curator", label: roleCuratorLabel },
    { value: "admin", label: roleAdminLabel },
  ];
  const currentRoleLabel = roleOptions.find((option) => option.value === currentRole)?.label ?? "";

  return (
    <div className={mobile ? "w-full" : "flex justify-end"}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={mobile ? "w-full justify-center gap-2" : "h-9 w-9 p-0"}
            disabled={isBusy}
          >
            {mobile ? actionsLabel : null}
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{actionsLabel}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => onToggleActive(item)}
            disabled={disableActiveToggle}
            className={
              item.is_active
                ? "text-rose-700 focus:text-rose-800"
                : "text-sky-700 focus:text-sky-800"
            }
          >
            {item.is_active ? deactivateLabel : activateLabel}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={disableRoleChange} className="gap-2">
              <span>{updateRoleLabel}</span>
              <span className="ml-auto text-xs text-slate-500">{currentRoleLabel}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56">
              {roleOptions.map((option) => {
                const selected = currentRole === option.value;

                return (
                  <DropdownMenuItem
                    key={option.value}
                    disabled={disableRoleChange || selected}
                    onClick={() => onUpdateRole(item, option.value)}
                    className="justify-between"
                  >
                    <span>{option.label}</span>
                    {selected ? <Check className="h-4 w-4 text-emerald-600" /> : null}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onResetPassword(item)}>
            {resetPasswordLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

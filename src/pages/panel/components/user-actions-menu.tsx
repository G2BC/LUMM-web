import type { AuthUser } from "@/api/auth/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type UserActionsMenuProps = {
  mobile?: boolean;
  isBusy?: boolean;
  actionsLabel: string;
  activateLabel: string;
  deactivateLabel: string;
  resetPasswordLabel: string;
  item: AuthUser;
  onToggleActive: (_item: AuthUser) => void;
  onResetPassword: (_item: AuthUser) => void;
};

export function UserActionsMenu({
  mobile = false,
  isBusy = false,
  actionsLabel,
  activateLabel,
  deactivateLabel,
  resetPasswordLabel,
  item,
  onToggleActive,
  onResetPassword,
}: UserActionsMenuProps) {
  return (
    <div className={mobile ? "w-full" : "flex justify-end"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={mobile ? "w-full justify-center gap-2" : ""}
            disabled={isBusy}
          >
            {mobile && actionsLabel}
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{actionsLabel}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onToggleActive(item)}
            className={
              item.is_active
                ? "text-rose-700 focus:text-rose-800"
                : "text-sky-700 focus:text-sky-800"
            }
          >
            {item.is_active ? deactivateLabel : activateLabel}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onResetPassword(item)}>
            {resetPasswordLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

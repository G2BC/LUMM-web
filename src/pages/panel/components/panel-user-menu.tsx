import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut } from "lucide-react";

type PanelUserMenuProps = {
  displayName: string;
  displayEmail: string;
  initials: string;
  logoutLabel: string;
  onLogout: () => void;
};

export function PanelUserMenu({
  displayName,
  displayEmail,
  initials,
  logoutLabel,
  onLogout,
}: PanelUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-0 focus:outline-none"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-200 text-slate-700">{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{displayEmail}</p>
          </div>

          <ChevronsUpDown className="h-4 w-4 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          {logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImagePlus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

type SpeciesActionsMenuProps = {
  locale: string;
  speciesId: number;
  actionsLabel: string;
  managePhotosLabel: string;
  mobile?: boolean;
};

export function SpeciesActionsMenu({
  locale,
  speciesId,
  actionsLabel,
  managePhotosLabel,
  mobile = false,
}: SpeciesActionsMenuProps) {
  return (
    <div className={mobile ? "w-full" : "flex justify-end"}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={mobile ? "w-full justify-center gap-2" : ""}
          >
            {mobile ? actionsLabel : null}
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{actionsLabel}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem asChild>
            <Link to={`/${locale}/painel/especies/${speciesId}/fotos`}>
              <ImagePlus className="h-4 w-4" />
              {managePhotosLabel}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

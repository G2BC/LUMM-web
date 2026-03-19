import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Eye, ImagePlus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

type SpeciesActionsMenuProps = {
  locale: string;
  speciesId: number;
  queryString?: string;
  actionsLabel: string;
  managePhotosLabel: string;
  manageSpeciesLabel: string;
  detailsSpeciesLabel: string;
  canManageSpecies?: boolean;
  canManagePhotos?: boolean;
  mobile?: boolean;
};

export function SpeciesActionsMenu({
  locale,
  speciesId,
  queryString,
  actionsLabel,
  managePhotosLabel,
  mobile = false,
  manageSpeciesLabel,
  detailsSpeciesLabel,
  canManageSpecies = true,
  canManagePhotos = true,
}: SpeciesActionsMenuProps) {
  const withQuery = (path: string) => (queryString ? `${path}?${queryString}` : path);

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
            <Link to={withQuery(`/${locale}/painel/especies/${speciesId}/detalhes`)}>
              <Eye className="h-4 w-4" />
              {detailsSpeciesLabel}
            </Link>
          </DropdownMenuItem>

          {canManageSpecies || canManagePhotos ? <DropdownMenuSeparator /> : null}

          {canManageSpecies ? (
            <DropdownMenuItem asChild>
              <Link to={withQuery(`/${locale}/painel/especies/${speciesId}/editar`)}>
                <Edit2 className="h-4 w-4" />
                {manageSpeciesLabel}
              </Link>
            </DropdownMenuItem>
          ) : null}

          {canManageSpecies && canManagePhotos ? <DropdownMenuSeparator /> : null}

          {canManagePhotos ? (
            <DropdownMenuItem asChild>
              <Link to={withQuery(`/${locale}/painel/especies/${speciesId}/fotos`)}>
                <ImagePlus className="h-4 w-4" />
                {managePhotosLabel}
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

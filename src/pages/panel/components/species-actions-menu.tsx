import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Edit2, Eye, ImagePlus, MoreHorizontal, Send } from "lucide-react";
import { Link } from "react-router";

type SpeciesActionsMenuProps = {
  locale: string;
  speciesId: number;
  queryString?: string;
  actionsLabel: string;
  managePhotosLabel: string;
  manageReferencesLabel: string;
  manageSpeciesLabel: string;
  detailsSpeciesLabel: string;
  requestUpdateLabel?: string;
  canManageSpecies?: boolean;
  canManagePhotos?: boolean;
  canManageReferences?: boolean;
  canRequestUpdate?: boolean;
  mobile?: boolean;
};

export function SpeciesActionsMenu({
  locale,
  speciesId,
  queryString,
  actionsLabel,
  managePhotosLabel,
  manageReferencesLabel,
  mobile = false,
  manageSpeciesLabel,
  detailsSpeciesLabel,
  requestUpdateLabel,
  canManageSpecies = true,
  canManagePhotos = true,
  canManageReferences = true,
  canRequestUpdate = false,
}: SpeciesActionsMenuProps) {
  const withQuery = (path: string) => (queryString ? `${path}?${queryString}` : path);
  const hasAdditionalActions =
    canRequestUpdate || canManageSpecies || canManagePhotos || canManageReferences;
  const hasManageActions = canManageSpecies || canManagePhotos || canManageReferences;

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

          {hasAdditionalActions ? <DropdownMenuSeparator /> : null}

          {canRequestUpdate ? (
            <DropdownMenuItem asChild>
              <Link to={`/${locale}/especie/${speciesId}/solicitar-atualizacao`}>
                <Send className="h-4 w-4" />
                {requestUpdateLabel}
              </Link>
            </DropdownMenuItem>
          ) : null}

          {canRequestUpdate && hasManageActions ? <DropdownMenuSeparator /> : null}

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

          {canManagePhotos && canManageReferences ? <DropdownMenuSeparator /> : null}

          {canManageReferences ? (
            <DropdownMenuItem asChild>
              <Link to={withQuery(`/${locale}/painel/especies/${speciesId}/referencias`)}>
                <BookOpen className="h-4 w-4" />
                {manageReferencesLabel}
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

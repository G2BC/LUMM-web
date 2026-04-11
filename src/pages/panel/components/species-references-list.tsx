import type { IReference } from "@/api/types/IReference";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EditReferenceFormValues } from "@/pages/panel/useSpeciesReferencesPage";
import { ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type SpeciesReferencesListProps = {
  references: IReference[];
  isLoadingSpecies: boolean;
  hasLoadError: boolean;
  savingReferenceId: number | null;
  deletingReferenceId: number | null;
  editingReference: IReference | null;
  editingValues: EditReferenceFormValues;
  editMessage: string | null;
  onEditReference: (_reference: IReference) => Promise<void>;
  onDisassociate: (_reference: IReference) => void;
  onCloseEditDialog: () => void;
  onUpdateEditField: (_field: keyof EditReferenceFormValues, _value: string) => void;
  onSaveEdit: () => void;
};

export function SpeciesReferencesList({
  references,
  isLoadingSpecies,
  hasLoadError,
  savingReferenceId,
  deletingReferenceId,
  editingReference,
  editingValues,
  editMessage,
  onEditReference,
  onDisassociate,
  onCloseEditDialog,
  onUpdateEditField,
  onSaveEdit,
}: SpeciesReferencesListProps) {
  const { t } = useTranslation();

  function getReferenceLink(ref: IReference): string | null {
    if (ref.doi) return `https://doi.org/${ref.doi}`;
    return ref.url ?? null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">
        {t("panel_page.species_references_list_title")}
      </h3>

      {isLoadingSpecies ? (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("panel_page.loading_species")}
        </div>
      ) : null}

      {!isLoadingSpecies && hasLoadError ? (
        <div className="rounded-lg border border-dashed border-red-300 px-4 py-8 text-center">
          <p className="text-sm text-red-700">{t("panel_page.species_references_load_error")}</p>
        </div>
      ) : null}

      {!isLoadingSpecies && !hasLoadError && references.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">{t("panel_page.species_references_list_empty")}</p>
        </div>
      ) : null}

      {!isLoadingSpecies && !hasLoadError && references.length > 0 ? (
        <div className="space-y-3">
          {references.map((ref) => {
            const link = getReferenceLink(ref);
            const isBusy = savingReferenceId === ref.id || deletingReferenceId === ref.id;
            return (
              <article
                key={ref.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  {ref.apa ? (
                    <p className="text-sm text-slate-800 leading-relaxed">{ref.apa}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {ref.doi ? (
                      <p className="text-xs text-slate-500">
                        <strong>DOI:</strong> {ref.doi}
                      </p>
                    ) : null}
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("panel_page.species_references_open_link")}
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                    onClick={() => void onEditReference(ref)}
                    disabled={isBusy}
                  >
                    <Pencil className="h-4 w-4" />
                    {t("panel_page.species_references_action_edit")}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-red-300 bg-white text-red-700 hover:bg-red-50"
                    onClick={() => onDisassociate(ref)}
                    disabled={isBusy}
                  >
                    {deletingReferenceId === ref.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {t("panel_page.species_references_action_remove")}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <Dialog
        open={Boolean(editingReference)}
        onOpenChange={(open) => (open ? null : onCloseEditDialog())}
      >
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("panel_page.species_references_edit_title")}</DialogTitle>
            <DialogDescription className="text-slate-600">
              {t("panel_page.species_references_edit_subtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {editMessage ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {editMessage}
              </div>
            ) : null}

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">
                {t("panel_page.species_references_field_apa")}
                <span className="ml-1 text-red-500">*</span>
              </p>
              <Textarea
                rows={3}
                value={editingValues.apa}
                onChange={(e) => onUpdateEditField("apa", e.target.value)}
                disabled={savingReferenceId !== null}
                className="text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700">
                  {t("panel_page.species_references_field_doi")}
                </p>
                <Input
                  value={editingValues.doi}
                  onChange={(e) => onUpdateEditField("doi", e.target.value)}
                  disabled={savingReferenceId !== null}
                  className="text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700">
                  {t("panel_page.species_references_field_url")}
                </p>
                <Input
                  type="url"
                  value={editingValues.url}
                  onChange={(e) => onUpdateEditField("url", e.target.value)}
                  disabled={savingReferenceId !== null}
                  className="text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCloseEditDialog}>
              {t("panel_page.species_references_edit_cancel")}
            </Button>
            <Button
              type="button"
              onClick={onSaveEdit}
              disabled={!editingReference || savingReferenceId === editingReference?.id}
            >
              {savingReferenceId === editingReference?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("panel_page.species_references_saving")}
                </>
              ) : (
                t("panel_page.species_references_edit_save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

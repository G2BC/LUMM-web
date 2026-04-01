import type { SpeciePhoto } from "@/api/species/types/ISpecie";
import specieCardDefault from "@/assets/specie-card-default.webp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhotoMetadataFields, type PhotoMetadataValues } from "./photo-metadata-fields";
import { getPhotoUrl } from "@/pages/species/utils";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function getPhotoDisplayUrl(photo: SpeciePhoto) {
  return getPhotoUrl(photo) || specieCardDefault;
}

type SpeciesPhotosGalleryProps = {
  photos: SpeciePhoto[];
  speciesTitle: string;
  isLoadingSpecies: boolean;
  hasLoadError: boolean;
  savingPhotoId: number | null;
  deletingPhotoId: number | null;
  editingPhoto: SpeciePhoto | null;
  editingPhotoValues: PhotoMetadataValues;
  editingPhotoMessage: string | null;
  onEditPhoto: (_photo: SpeciePhoto) => void;
  onDeletePhoto: (_photo: SpeciePhoto) => void;
  onCloseEditDialog: () => void;
  onUpdateEditingField: (_field: keyof PhotoMetadataValues, _value: string | boolean) => void;
  onSaveEditedPhoto: () => void;
};

export function SpeciesPhotosGallery({
  photos,
  speciesTitle,
  isLoadingSpecies,
  hasLoadError,
  savingPhotoId,
  deletingPhotoId,
  editingPhoto,
  editingPhotoValues,
  editingPhotoMessage,
  onEditPhoto,
  onDeletePhoto,
  onCloseEditDialog,
  onUpdateEditingField,
  onSaveEditedPhoto,
}: SpeciesPhotosGalleryProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{t("panel_page.species_photos_gallery_title")}</h3>

      {isLoadingSpecies ? (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("panel_page.loading_species")}
        </div>
      ) : null}

      {!isLoadingSpecies && hasLoadError ? (
        <div className="rounded-lg border border-dashed border-red-300 px-4 py-8 text-center">
          <p className="text-sm text-red-700">{t("panel_page.species_photos_load_error")}</p>
        </div>
      ) : null}

      {!isLoadingSpecies && !hasLoadError && photos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">{t("panel_page.species_photos_gallery_empty")}</p>
        </div>
      ) : null}

      {!isLoadingSpecies && !hasLoadError && photos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => {
            const photoUrl = getPhotoDisplayUrl(photo);
            return (
              <article
                key={`${photo.photo_id}-${index}`}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src={photoUrl}
                    alt={`${speciesTitle} ${index + 1}`}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = specieCardDefault;
                    }}
                  />
                </a>

                <div className="flex flex-1 flex-col space-y-2 p-3">
                  <div className="flex flex-wrap gap-2">
                    {photo.featured ? (
                      <Badge className="rounded-full border border-amber-300 bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950 shadow-sm">
                        {t("panel_page.species_photos_badge_featured")}
                      </Badge>
                    ) : null}
                    {photo.lumm ? (
                      <Badge className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
                        {t("panel_page.species_photos_badge_lumm")}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>{t("panel_requests.photo_license")}:</strong>{" "}
                    {photo.license_code?.trim() || t("panel_page.species_photos_meta_missing")}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>{t("panel_requests.photo_attribution")}:</strong>{" "}
                    {photo.attribution?.trim() || t("panel_page.species_photos_meta_missing")}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>{t("panel_requests.photo_rights_holder")}:</strong>{" "}
                    {photo.rights_holder?.trim() || t("panel_page.species_photos_meta_missing")}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>{t("panel_requests.photo_source")}:</strong>{" "}
                    {photo.source_url?.trim() || t("panel_page.species_photos_meta_missing")}
                  </p>

                  <div className="mt-auto flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                      onClick={() => onEditPhoto(photo)}
                      disabled={
                        savingPhotoId === photo.photo_id || deletingPhotoId === photo.photo_id
                      }
                    >
                      <Pencil className="h-4 w-4" />
                      {t("panel_page.species_photos_action_edit")}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-300 bg-white text-red-700 hover:bg-red-50"
                      onClick={() => onDeletePhoto(photo)}
                      disabled={
                        savingPhotoId === photo.photo_id || deletingPhotoId === photo.photo_id
                      }
                    >
                      {deletingPhotoId === photo.photo_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {t("panel_page.species_photos_action_delete")}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <Dialog
        open={Boolean(editingPhoto)}
        onOpenChange={(open) => (open ? null : onCloseEditDialog())}
      >
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("panel_page.species_photos_edit_title")}</DialogTitle>
            <DialogDescription className="text-slate-600">
              {t("panel_page.species_photos_edit_subtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {editingPhotoMessage ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {editingPhotoMessage}
              </div>
            ) : null}

            <PhotoMetadataFields values={editingPhotoValues} onChange={onUpdateEditingField} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCloseEditDialog}>
              {t("panel_page.species_photos_edit_cancel")}
            </Button>
            <Button
              type="button"
              onClick={onSaveEditedPhoto}
              disabled={!editingPhoto || savingPhotoId === editingPhoto.photo_id}
            >
              {savingPhotoId === editingPhoto?.photo_id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("panel_page.species_photos_uploading")}
                </>
              ) : (
                t("panel_page.species_photos_edit_save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

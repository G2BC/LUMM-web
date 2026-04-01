import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { SpeciesPhotosGallery } from "./components/species-photos-gallery";
import { SpeciesPhotosUpload } from "./components/species-photos-upload";
import { useSpeciesPhotosPage } from "./useSpeciesPhotosPage";

export default function PanelSpeciesPhotosPage() {
  const { t } = useTranslation();
  const {
    speciesData,
    speciesSlug,
    isLoadingSpecies,
    hasLoadError,
    locale,
    location,
    selectedFiles,
    previewByKey,
    photoMetadataByKey,
    isUploading,
    editingPhoto,
    editingPhotoValues,
    editingPhotoMessage,
    savingPhotoId,
    deletingPhotoId,
    handlePickFiles,
    handleDropFiles,
    removeSelectedFile,
    updatePhotoMetadata,
    toggleFeatured,
    updateEditingPhotoField,
    openEditPhotoDialog,
    closeEditPhotoDialog,
    handleSaveEditedPhoto,
    handleDeletePhoto,
    handleUploadFiles,
  } = useSpeciesPhotosPage();

  const photos = speciesData?.photos ?? [];
  const speciesTitle = speciesData?.scientific_name || `#${speciesSlug || ""}`;
  const backToSpeciesListPath = `/${locale}/painel/especies${location.search}`;

  return (
    <section className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("panel_page.species_photos_title")}</h2>
          <p className="mt-1 text-slate-600">
            {t("panel_page.species_photos_subtitle", { species: speciesTitle })}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-end">
          <Button variant="outline" className="w-full md:w-auto" asChild>
            <Link to={backToSpeciesListPath}>
              <ArrowLeft className="h-4 w-4" />
              {t("panel_page.species_photos_back")}
            </Link>
          </Button>
          {speciesData?.id ? (
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link
                to={`/${locale}/especie/${speciesData.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("panel_page.species_photos_open_public")}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <SpeciesPhotosUpload
        selectedFiles={selectedFiles}
        previewByKey={previewByKey}
        photoMetadataByKey={photoMetadataByKey}
        isUploading={isUploading}
        onPickFiles={handlePickFiles}
        onDropFiles={handleDropFiles}
        onRemoveFile={removeSelectedFile}
        onUpdateMetadata={updatePhotoMetadata}
        onToggleFeatured={toggleFeatured}
        onUpload={() => void handleUploadFiles()}
      />

      <SpeciesPhotosGallery
        photos={photos}
        speciesTitle={speciesTitle}
        isLoadingSpecies={isLoadingSpecies}
        hasLoadError={hasLoadError}
        savingPhotoId={savingPhotoId}
        deletingPhotoId={deletingPhotoId}
        editingPhoto={editingPhoto}
        editingPhotoValues={editingPhotoValues}
        editingPhotoMessage={editingPhotoMessage}
        onEditPhoto={openEditPhotoDialog}
        onDeletePhoto={(photo) => void handleDeletePhoto(photo)}
        onCloseEditDialog={closeEditPhotoDialog}
        onUpdateEditingField={updateEditingPhotoField}
        onSaveEditedPhoto={() => void handleSaveEditedPhoto()}
      />
    </section>
  );
}

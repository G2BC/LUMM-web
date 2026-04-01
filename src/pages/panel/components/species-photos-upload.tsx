import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhotoMetadataFields, type PhotoMetadataValues } from "./photo-metadata-fields";
import { formatFileSize, getFileKey } from "@/pages/species-request/utils";
import { Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ChangeEvent, DragEvent } from "react";
import { createDefaultPhotoMetadata } from "../useSpeciesPhotosPage";

type SpeciesPhotosUploadProps = {
  selectedFiles: File[];
  previewByKey: Record<string, string>;
  photoMetadataByKey: Record<string, PhotoMetadataValues>;
  isUploading: boolean;
  onPickFiles: (_event: ChangeEvent<HTMLInputElement>) => void;
  onDropFiles: (_event: DragEvent<HTMLLabelElement>) => void;
  onRemoveFile: (_fileKey: string) => void;
  onUpdateMetadata: (
    _fileKey: string,
    _field: keyof PhotoMetadataValues,
    _value: string | boolean
  ) => void;
  onToggleFeatured: (_fileKey: string, _checked: boolean) => void;
  onUpload: () => void;
};

export function SpeciesPhotosUpload({
  selectedFiles,
  previewByKey,
  photoMetadataByKey,
  isUploading,
  onPickFiles,
  onDropFiles,
  onRemoveFile,
  onUpdateMetadata,
  onToggleFeatured,
  onUpload,
}: SpeciesPhotosUploadProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 md:p-5">
      <div>
        <h3 className="text-lg font-semibold">{t("panel_page.species_photos_upload_title")}</h3>
        <p className="text-sm text-slate-600">{t("panel_page.species_photos_upload_hint")}</p>
      </div>

      <div className="space-y-2">
        <Input
          id="panel-species-photos-files"
          type="file"
          multiple
          accept="image/*"
          onChange={onPickFiles}
          className="hidden"
        />
        <label
          htmlFor="panel-species-photos-files"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDropFiles}
          className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-slate-400 hover:bg-slate-100"
        >
          <Upload className="h-5 w-5 text-slate-600" />
          <p className="text-sm font-medium text-slate-900">
            {t("panel_page.species_photos_dropzone_title")}
          </p>
          <p className="text-xs text-slate-600">{t("panel_page.species_photos_dropzone_hint")}</p>
        </label>
        {selectedFiles.length ? (
          <p className="text-xs text-slate-600">
            {t("panel_page.species_photos_selected_files", { count: selectedFiles.length })}
          </p>
        ) : null}
      </div>

      {selectedFiles.length ? (
        <div className="space-y-3">
          {selectedFiles.map((file) => {
            const fileKey = getFileKey(file);
            const metadata = photoMetadataByKey[fileKey] ?? createDefaultPhotoMetadata();

            return (
              <div key={fileKey} className="space-y-3 rounded-md border border-slate-200 p-3">
                <div className="flex items-start gap-3">
                  <img
                    src={previewByKey[fileKey]}
                    alt={file.name}
                    className="h-20 w-20 rounded-md border border-slate-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(fileKey)}
                    className="rounded-full bg-black/75 p-1 text-white transition-colors hover:bg-black"
                    aria-label={t("species_request.remove_photo")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <PhotoMetadataFields
                  values={metadata}
                  onChange={(field, value) => onUpdateMetadata(fileKey, field, value)}
                  onFeaturedChange={(checked) => onToggleFeatured(fileKey, checked)}
                />
              </div>
            );
          })}
        </div>
      ) : null}

      <div>
        <Button type="button" onClick={onUpload} disabled={isUploading || !selectedFiles.length}>
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("panel_page.species_photos_uploading")}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {t("panel_page.species_photos_upload_cta")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

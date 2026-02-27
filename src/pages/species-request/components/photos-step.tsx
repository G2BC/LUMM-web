import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHOTO_LICENSE_OPTIONS } from "@/pages/species-request/constants";
import type { PhotoLegalErrors, PhotoLegalForm } from "@/pages/species-request/types";
import { formatFileSize, getFileKey } from "@/pages/species-request/utils";
import { Upload, X } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useTranslation } from "react-i18next";

type PhotosStepProps = {
  selectedFiles: File[];
  previewByKey: Record<string, string>;
  photoLegalByKey: Record<string, PhotoLegalForm>;
  photoErrorsByKey: Record<string, PhotoLegalErrors>;
  bulkPhotoLegal: PhotoLegalForm;
  onPickFiles: (_event: ChangeEvent<HTMLInputElement>) => void;
  onDropFiles: (_event: DragEvent<HTMLLabelElement>) => void;
  removeSelectedFile: (_fileKey: string) => void;
  updatePhotoLegal: (
    _fileKey: string,
    _field: keyof PhotoLegalForm,
    _value: string | boolean
  ) => void;
  updateBulkPhotoLegal: (_field: keyof PhotoLegalForm, _value: string | boolean) => void;
  applyBulkPhotoLegalToAll: () => void;
};

export function PhotosStep({
  selectedFiles,
  previewByKey,
  photoLegalByKey,
  photoErrorsByKey,
  bulkPhotoLegal,
  onPickFiles,
  onDropFiles,
  removeSelectedFile,
  updatePhotoLegal,
  updateBulkPhotoLegal,
  applyBulkPhotoLegalToAll,
}: PhotosStepProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("species_request.photos")}</label>
        <Input
          id="species-request-files"
          type="file"
          multiple
          accept="image/*"
          onChange={onPickFiles}
          className="hidden"
        />
        <label
          htmlFor="species-request-files"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDropFiles}
          className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/30 bg-black/25 px-4 py-6 text-center transition-colors hover:border-white/60 hover:bg-black/35"
        >
          <Upload className="h-5 w-5 text-white/80" />
          <p className="text-sm font-medium text-white">{t("species_request.files_drop_title")}</p>
          <p className="text-xs text-white/65">{t("species_request.files_drop_hint")}</p>
        </label>
        {selectedFiles.length ? (
          <p className="text-xs text-white/70">
            {t("species_request.files_selected", { count: selectedFiles.length })}
          </p>
        ) : (
          <p className="text-xs text-white/50">{t("species_request.files_hint")}</p>
        )}
      </div>

      {selectedFiles.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {selectedFiles.map((file) => {
            const fileKey = getFileKey(file);
            return (
              <div
                key={fileKey}
                className="relative overflow-hidden rounded-md border border-white/15 bg-black/30"
              >
                <img
                  src={previewByKey[fileKey]}
                  alt={file.name}
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedFile(fileKey)}
                  className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white transition-colors hover:bg-black"
                  aria-label={t("species_request.remove_photo")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="space-y-1 p-2">
                  <p className="truncate text-xs font-medium text-white">{file.name}</p>
                  <p className="text-[11px] text-white/60">{formatFileSize(file.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {selectedFiles.length ? (
        <div className="space-y-4 border-t border-white/10 pt-4">
          <div className="space-y-3 rounded-md border border-emerald-400/25 bg-emerald-500/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
              {t("species_request.photo_legal_bulk_title")}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/85">
                  {t("species_request.photo_license")}
                </label>
                <Select
                  value={bulkPhotoLegal.license_code}
                  onValueChange={(value) => updateBulkPhotoLegal("license_code", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("species_request.photo_license_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PHOTO_LICENSE_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value === "ALL-RIGHTS-RESERVED"
                          ? t("species_request.photo_license_arr")
                          : value.replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/85">
                  {t("species_request.photo_attribution")}
                </label>
                <Input
                  value={bulkPhotoLegal.attribution}
                  onChange={(event) => updateBulkPhotoLegal("attribution", event.target.value)}
                  placeholder={t("species_request.photo_attribution_placeholder")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/85">
                  {t("species_request.photo_rights_holder")}
                </label>
                <Input
                  value={bulkPhotoLegal.rights_holder}
                  onChange={(event) => updateBulkPhotoLegal("rights_holder", event.target.value)}
                  placeholder={t("species_request.photo_rights_holder_placeholder")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/85">
                  {t("species_request.photo_source_url")}
                </label>
                <Input
                  type="url"
                  value={bulkPhotoLegal.source_url}
                  onChange={(event) => updateBulkPhotoLegal("source_url", event.target.value)}
                  placeholder={t("species_request.photo_source_url_placeholder")}
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-white/85">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-white/40 bg-transparent"
                checked={bulkPhotoLegal.declaration_confirmed}
                onChange={(event) =>
                  updateBulkPhotoLegal("declaration_confirmed", event.target.checked)
                }
              />
              <span>{t("species_request.photo_declaration_label")}</span>
            </label>

            <div>
              <Button type="button" variant="outline" onClick={applyBulkPhotoLegalToAll}>
                {t("species_request.photo_legal_bulk_apply")}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((file) => {
              const fileKey = getFileKey(file);
              const legal = photoLegalByKey[fileKey];
              const errors = photoErrorsByKey[fileKey] ?? {};

              return (
                <div
                  key={fileKey}
                  className="space-y-3 border-b border-white/10 pb-3 last:border-b-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <span className="text-xs text-white/60">{formatFileSize(file.size)}</span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/85">
                        {t("species_request.photo_license")}
                      </label>
                      <Select
                        value={legal?.license_code ?? ""}
                        onValueChange={(value) => updatePhotoLegal(fileKey, "license_code", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("species_request.photo_license_placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {PHOTO_LICENSE_OPTIONS.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value === "ALL-RIGHTS-RESERVED"
                                ? t("species_request.photo_license_arr")
                                : value.replace(/-/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.license_code ? (
                        <p className="text-xs text-red-300">{errors.license_code}</p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/85">
                        {t("species_request.photo_attribution")}
                      </label>
                      <Input
                        value={legal?.attribution ?? ""}
                        onChange={(event) =>
                          updatePhotoLegal(fileKey, "attribution", event.target.value)
                        }
                        placeholder={t("species_request.photo_attribution_placeholder")}
                      />
                      {errors.attribution ? (
                        <p className="text-xs text-red-300">{errors.attribution}</p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/85">
                        {t("species_request.photo_rights_holder")}
                      </label>
                      <Input
                        value={legal?.rights_holder ?? ""}
                        onChange={(event) =>
                          updatePhotoLegal(fileKey, "rights_holder", event.target.value)
                        }
                        placeholder={t("species_request.photo_rights_holder_placeholder")}
                      />
                      {errors.rights_holder ? (
                        <p className="text-xs text-red-300">{errors.rights_holder}</p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/85">
                        {t("species_request.photo_source_url")}
                      </label>
                      <Input
                        type="url"
                        value={legal?.source_url ?? ""}
                        onChange={(event) =>
                          updatePhotoLegal(fileKey, "source_url", event.target.value)
                        }
                        placeholder={t("species_request.photo_source_url_placeholder")}
                      />
                      <p className="text-[11px] text-white/55">
                        {t("species_request.photo_source_url_optional")}
                      </p>
                      {errors.source_url ? (
                        <p className="text-xs text-red-300">{errors.source_url}</p>
                      ) : null}
                    </div>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-white/85">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-white/40 bg-transparent"
                      checked={Boolean(legal?.declaration_confirmed)}
                      onChange={(event) =>
                        updatePhotoLegal(fileKey, "declaration_confirmed", event.target.checked)
                      }
                    />
                    <span>{t("species_request.photo_declaration_label")}</span>
                  </label>
                  {errors.declaration_confirmed ? (
                    <p className="text-xs text-red-300">{errors.declaration_confirmed}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

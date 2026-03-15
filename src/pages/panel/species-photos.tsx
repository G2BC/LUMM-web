import {
  createSpeciesPhoto,
  deleteSpeciesPhoto,
  fetchSpecies,
  generateSpeciesDirectPhotoUploadUrl,
  updateSpeciesPhoto,
} from "@/api/species";
import type { ISpecie, SpeciePhoto } from "@/api/species/types/ISpecie";
import specieCardDefault from "@/assets/specie-card-default.webp";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
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
import { Input } from "@/components/ui/input";
import { DEFAULT_LOCALE } from "@/lib/lang";
import {
  PhotoMetadataFields,
  type PhotoMetadataValues,
} from "@/pages/panel/components/photo-metadata-fields";
import { optimizeImageForUpload } from "@/pages/species-request/image-upload-optimizer";
import {
  formatFileSize,
  getFileKey,
  normalizeUploadUrlProtocol,
} from "@/pages/species-request/utils";
import { getPhotoUrl } from "@/pages/species/utils";
import axios from "axios";
import { ArrowLeft, ExternalLink, Loader2, Pencil, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router";
import { runWithSilencedApiErrors } from "@/api/error-silencer";

function createDefaultPhotoMetadata(): PhotoMetadataValues {
  return {
    license_code: "ALL-RIGHTS-RESERVED",
    attribution: "",
    rights_holder: "",
    source_url: "",
    lumm: false,
    featured: false,
  };
}

function createPhotoMetadataFromExistingPhoto(photo: SpeciePhoto): PhotoMetadataValues {
  return {
    license_code: photo.license_code?.trim() || "ALL-RIGHTS-RESERVED",
    attribution: photo.attribution?.trim() || "",
    rights_holder: photo.rights_holder?.trim() || "",
    source_url: photo.source_url?.trim() || "",
    lumm: Boolean(photo.lumm),
    featured: Boolean(photo.featured),
  };
}

function getPhotoDisplayUrl(photo: SpeciePhoto) {
  return getPhotoUrl(photo) || specieCardDefault;
}

export default function PanelSpeciesPhotosPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang, species } = useParams();

  const locale = lang ?? DEFAULT_LOCALE;
  const [speciesData, setSpeciesData] = useState<ISpecie | null>(null);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewByKey, setPreviewByKey] = useState<Record<string, string>>({});
  const [photoMetadataByKey, setPhotoMetadataByKey] = useState<Record<string, PhotoMetadataValues>>(
    {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<SpeciePhoto | null>(null);
  const [editingPhotoValues, setEditingPhotoValues] = useState<PhotoMetadataValues>(
    createDefaultPhotoMetadata()
  );
  const [editingPhotoMessage, setEditingPhotoMessage] = useState<string | null>(null);
  const [savingPhotoId, setSavingPhotoId] = useState<number | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

  useEffect(() => {
    const nextPreviewByKey: Record<string, string> = {};
    selectedFiles.forEach((file) => {
      const key = getFileKey(file);
      nextPreviewByKey[key] = URL.createObjectURL(file);
    });

    setPreviewByKey(nextPreviewByKey);

    return () => {
      Object.values(nextPreviewByKey).forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (!species) return;

    setIsLoadingSpecies(true);
    setHasLoadError(false);

    void fetchSpecies(species)
      .then((data) => setSpeciesData(data))
      .catch(() => {
        setHasLoadError(true);
        setSpeciesData(null);
      })
      .finally(() => setIsLoadingSpecies(false));
  }, [species]);

  function upsertFiles(filesToAdd: File[]) {
    if (!filesToAdd.length) return;

    setSelectedFiles((prev) => {
      const map = new Map<string, File>();
      prev.forEach((file) => map.set(getFileKey(file), file));
      filesToAdd.forEach((file) => map.set(getFileKey(file), file));
      return Array.from(map.values());
    });

    setPhotoMetadataByKey((prev) => {
      const next = { ...prev };
      filesToAdd.forEach((file) => {
        const fileKey = getFileKey(file);
        next[fileKey] = prev[fileKey] ?? createDefaultPhotoMetadata();
      });
      return next;
    });
  }

  function handlePickFiles(event: ChangeEvent<HTMLInputElement>) {
    upsertFiles(
      Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"))
    );
    event.target.value = "";
  }

  function handleDropFiles(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    upsertFiles(
      Array.from(event.dataTransfer.files ?? []).filter((file) => file.type.startsWith("image/"))
    );
  }

  function removeSelectedFile(fileKey: string) {
    setSelectedFiles((prev) => prev.filter((file) => getFileKey(file) !== fileKey));
    setPhotoMetadataByKey((prev) => {
      const next = { ...prev };
      delete next[fileKey];
      return next;
    });
  }

  function updatePhotoMetadata(
    fileKey: string,
    field: keyof PhotoMetadataValues,
    value: string | boolean
  ) {
    setPhotoMetadataByKey((prev) => ({
      ...prev,
      [fileKey]: {
        ...(prev[fileKey] ?? createDefaultPhotoMetadata()),
        [field]: value,
      },
    }));
  }

  function toggleFeatured(fileKey: string, checked: boolean) {
    setPhotoMetadataByKey((prev) => {
      const next: Record<string, PhotoMetadataValues> = {};

      Object.entries(prev).forEach(([key, metadata]) => {
        next[key] = { ...metadata, featured: checked ? key === fileKey : false };
      });

      if (!next[fileKey]) {
        next[fileKey] = { ...createDefaultPhotoMetadata(), featured: checked };
      }

      return next;
    });
  }

  function updateEditingPhotoField(field: keyof PhotoMetadataValues, value: string | boolean) {
    setEditingPhotoMessage(null);
    setEditingPhotoValues((prev) => ({ ...prev, [field]: value }));
  }

  function openEditPhotoDialog(photo: SpeciePhoto) {
    setEditingPhoto(photo);
    setEditingPhotoValues(createPhotoMetadataFromExistingPhoto(photo));
    setEditingPhotoMessage(null);
  }

  function closeEditPhotoDialog() {
    setEditingPhoto(null);
    setEditingPhotoValues(createDefaultPhotoMetadata());
    setEditingPhotoMessage(null);
  }

  async function reloadSpeciesPhotos() {
    if (!speciesData?.id) return;
    const refreshed = await runWithSilencedApiErrors(() => fetchSpecies(String(speciesData.id)));
    setSpeciesData(refreshed);
  }

  async function handleSaveEditedPhoto() {
    if (!speciesData?.id || !editingPhoto?.photo_id) return;
    setEditingPhotoMessage(null);

    const normalizedSourceUrl = editingPhotoValues.source_url.trim();
    if (normalizedSourceUrl) {
      try {
        new URL(normalizedSourceUrl);
      } catch {
        setEditingPhotoMessage(t("panel_page.species_photos_validation_source_url"));
        return;
      }
    }

    const originalValues = createPhotoMetadataFromExistingPhoto(editingPhoto);
    const payload: {
      license_code?: string;
      attribution?: string;
      rights_holder?: string;
      source_url?: string | null;
      featured?: boolean;
      lumm?: boolean;
    } = {};

    const nextLicenseCode = editingPhotoValues.license_code.trim();
    const nextAttribution = editingPhotoValues.attribution.trim();
    const nextRightsHolder = editingPhotoValues.rights_holder.trim();
    const previousLicenseCode = originalValues.license_code.trim();
    const previousAttribution = originalValues.attribution.trim();
    const previousRightsHolder = originalValues.rights_holder.trim();
    const previousSourceUrl = originalValues.source_url.trim();

    if (nextLicenseCode !== previousLicenseCode) payload.license_code = nextLicenseCode;
    if (nextAttribution !== previousAttribution) payload.attribution = nextAttribution;
    if (nextRightsHolder !== previousRightsHolder) payload.rights_holder = nextRightsHolder;
    if (normalizedSourceUrl !== previousSourceUrl) payload.source_url = normalizedSourceUrl || null;
    if (editingPhotoValues.featured !== originalValues.featured)
      payload.featured = editingPhotoValues.featured;
    if (editingPhotoValues.lumm !== originalValues.lumm) payload.lumm = editingPhotoValues.lumm;

    if (Object.keys(payload).length === 0) {
      setEditingPhotoMessage(t("panel_page.species_photos_edit_no_changes"));
      return;
    }

    setSavingPhotoId(editingPhoto.photo_id);

    try {
      await runWithSilencedApiErrors(() =>
        updateSpeciesPhoto(speciesData.id, editingPhoto.photo_id, payload)
      );

      closeEditPhotoDialog();
      await reloadSpeciesPhotos();

      await Alert({
        icon: "success",
        title: t("panel_page.species_photos_edit_success_title"),
        text: t("panel_page.species_photos_edit_success_text"),
      });
    } catch (error) {
      const backendMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setEditingPhotoMessage(backendMessage || t("panel_page.species_photos_edit_error_text"));
    } finally {
      setSavingPhotoId(null);
    }
  }

  async function handleDeletePhoto(photo: SpeciePhoto) {
    if (!speciesData?.id) return;

    const confirmed = await confirmAction({
      title: t("panel_page.species_photos_delete_confirm_title"),
      text: t("panel_page.species_photos_delete_confirm_text"),
      confirmButtonText: t("panel_page.species_photos_delete_confirm_yes"),
      cancelButtonText: t("panel_page.species_photos_delete_confirm_no"),
      requireCode: true,
      codeLabel: t("panel_page.species_photos_delete_confirm_code_label"),
      codePlaceholder: t("panel_page.species_photos_delete_confirm_code_placeholder"),
      codeInvalidMessage: t("panel_page.species_photos_delete_confirm_code_invalid"),
    });

    if (!confirmed) return;

    setDeletingPhotoId(photo.photo_id);
    try {
      await runWithSilencedApiErrors(() => deleteSpeciesPhoto(speciesData.id, photo.photo_id));
      await reloadSpeciesPhotos();
      await Alert({
        icon: "success",
        title: t("panel_page.species_photos_delete_success_title"),
        text: t("panel_page.species_photos_delete_success_text"),
      });
    } catch (error) {
      const backendMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      await Alert({
        icon: "error",
        title: t("panel_page.species_photos_delete_error_title"),
        text: backendMessage || t("panel_page.species_photos_delete_error_text"),
      });
    } finally {
      setDeletingPhotoId(null);
    }
  }

  async function handleUploadFiles() {
    if (!speciesData?.id) {
      navigate(`/${locale}/painel/especies`, { replace: true });
      return;
    }

    if (!selectedFiles.length) {
      await Alert({
        icon: "warning",
        title: t("panel_page.species_photos_validation_title"),
        text: t("panel_page.species_photos_validation_select_files"),
      });
      return;
    }

    for (const file of selectedFiles) {
      const fileKey = getFileKey(file);
      const metadata = photoMetadataByKey[fileKey];

      if (
        !metadata?.license_code?.trim() ||
        !metadata?.attribution?.trim() ||
        !metadata?.rights_holder?.trim()
      ) {
        await Alert({
          icon: "warning",
          title: t("panel_page.species_photos_validation_title"),
          text: t("panel_page.species_photos_validation_metadata"),
        });
        return;
      }

      const normalizedSourceUrl = metadata.source_url.trim();
      if (!normalizedSourceUrl) continue;

      try {
        new URL(normalizedSourceUrl);
      } catch {
        await Alert({
          icon: "warning",
          title: t("panel_page.species_photos_validation_title"),
          text: t("panel_page.species_photos_validation_source_url"),
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      await runWithSilencedApiErrors(async () => {
        for (const file of selectedFiles) {
          const fileKey = getFileKey(file);
          const metadata = photoMetadataByKey[fileKey] ?? createDefaultPhotoMetadata();
          const fileToUpload = await optimizeImageForUpload(file);
          const mimeType = fileToUpload.type || file.type || "application/octet-stream";

          const signed = await generateSpeciesDirectPhotoUploadUrl(speciesData.id, {
            filename: fileToUpload.name,
            mime_type: mimeType,
            size_bytes: fileToUpload.size,
          });

          const formData = new FormData();
          for (const [key, value] of Object.entries(signed.fields)) {
            formData.append(key, value);
          }
          formData.append("file", fileToUpload);

          const uploadResponse = await fetch(normalizeUploadUrlProtocol(signed.upload_url), {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error("upload_failed");
          }

          await createSpeciesPhoto(speciesData.id, {
            bucket_name: signed.bucket_name,
            object_key: signed.object_key,
            original_filename: fileToUpload.name,
            mime_type: mimeType,
            size_bytes: fileToUpload.size,
            license_code: metadata.license_code.trim(),
            attribution: metadata.attribution.trim(),
            rights_holder: metadata.rights_holder.trim(),
            source_url: metadata.source_url.trim() || undefined,
            lumm: metadata.lumm,
            featured: metadata.featured,
          });
        }
      });

      setSelectedFiles([]);
      setPhotoMetadataByKey({});
      await reloadSpeciesPhotos();

      await Alert({
        icon: "success",
        title: t("panel_page.species_photos_upload_success_title"),
        text: t("panel_page.species_photos_upload_success_text", { count: selectedFiles.length }),
      });
    } catch (error) {
      const backendMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;

      await Alert({
        icon: "error",
        title: t("panel_page.species_photos_upload_error_title"),
        text: backendMessage || t("panel_page.species_photos_upload_error_text"),
      });
    } finally {
      setIsUploading(false);
    }
  }

  const photos = speciesData?.photos ?? [];
  const speciesTitle = speciesData?.scientific_name || `#${species || ""}`;

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
            <Link to={`/${locale}/painel/especies`}>
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
            onChange={handlePickFiles}
            className="hidden"
          />
          <label
            htmlFor="panel-species-photos-files"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDropFiles}
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
                      onClick={() => removeSelectedFile(fileKey)}
                      className="rounded-full bg-black/75 p-1 text-white transition-colors hover:bg-black"
                      aria-label={t("species_request.remove_photo")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <PhotoMetadataFields
                    values={metadata}
                    onChange={(field, value) => updatePhotoMetadata(fileKey, field, value)}
                    onFeaturedChange={(checked) => toggleFeatured(fileKey, checked)}
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        <div>
          <Button
            type="button"
            onClick={() => void handleUploadFiles()}
            disabled={isUploading || !selectedFiles.length}
          >
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
                        onClick={() => openEditPhotoDialog(photo)}
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
                        onClick={() => void handleDeletePhoto(photo)}
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
      </div>

      <Dialog
        open={Boolean(editingPhoto)}
        onOpenChange={(open) => (open ? null : closeEditPhotoDialog())}
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

            <PhotoMetadataFields values={editingPhotoValues} onChange={updateEditingPhotoField} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditPhotoDialog}>
              {t("panel_page.species_photos_edit_cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveEditedPhoto()}
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
    </section>
  );
}

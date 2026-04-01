import {
  createSpeciesPhoto,
  deleteSpeciesPhoto,
  fetchSpecies,
  generateSpeciesDirectPhotoUploadUrl,
  updateSpeciesPhoto,
} from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import type { SpeciePhoto } from "@/api/species/types/ISpecie";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
import { DEFAULT_LOCALE } from "@/lib/lang";
import type { PhotoMetadataValues } from "@/pages/panel/components/photo-metadata-fields";
import { optimizeImageForUpload } from "@/pages/species-request/image-upload-optimizer";
import { getFileKey, normalizeUploadUrlProtocol } from "@/pages/species-request/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLocalizedError } from "@/api/get-localized-error";
import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { runWithSilencedApiErrors } from "@/api/error-silencer";

export function createDefaultPhotoMetadata(): PhotoMetadataValues {
  return {
    license_code: "ALL-RIGHTS-RESERVED",
    attribution: "",
    rights_holder: "",
    source_url: "",
    lumm: false,
    featured: false,
  };
}

export function createPhotoMetadataFromExistingPhoto(photo: SpeciePhoto): PhotoMetadataValues {
  return {
    license_code: photo.license_code?.trim() || "ALL-RIGHTS-RESERVED",
    attribution: photo.attribution?.trim() || "",
    rights_holder: photo.rights_holder?.trim() || "",
    source_url: photo.source_url?.trim() || "",
    lumm: Boolean(photo.lumm),
    featured: Boolean(photo.featured),
  };
}

export function useSpeciesPhotosPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, species } = useParams();
  const queryClient = useQueryClient();
  const locale = lang ?? DEFAULT_LOCALE;

  const {
    data: speciesData,
    isLoading: isLoadingSpecies,
    isError: hasLoadError,
  } = useQuery({
    queryKey: speciesKeys.detail(species!),
    queryFn: ({ signal }) => fetchSpecies(species, signal),
    enabled: !!species,
  });

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
      nextPreviewByKey[getFileKey(file)] = URL.createObjectURL(file);
    });
    setPreviewByKey(nextPreviewByKey);
    return () => {
      Object.values(nextPreviewByKey).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

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
      [fileKey]: { ...(prev[fileKey] ?? createDefaultPhotoMetadata()), [field]: value },
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
    if (!species) return;
    await queryClient.invalidateQueries({ queryKey: speciesKeys.detail(species) });
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
      setEditingPhotoMessage(
        getLocalizedError(error) || t("panel_page.species_photos_edit_error_text")
      );
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
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
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

          if (!uploadResponse.ok) throw new Error("upload_failed");

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
        text: t("panel_page.species_photos_upload_success_text", {
          count: selectedFiles.length,
        }),
      });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    } finally {
      setIsUploading(false);
    }
  }

  return {
    speciesData,
    speciesSlug: species,
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
  };
}

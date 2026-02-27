import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import type { TFunction } from "i18next";
import type { PhotoLegalErrors, PhotoLegalForm } from "@/pages/species-request/types";
import { createEmptyPhotoLegal, getFileKey } from "@/pages/species-request/utils";

export function usePhotoUploadState(t: TFunction) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewByKey, setPreviewByKey] = useState<Record<string, string>>({});
  const [photoLegalByKey, setPhotoLegalByKey] = useState<Record<string, PhotoLegalForm>>({});
  const [photoErrorsByKey, setPhotoErrorsByKey] = useState<Record<string, PhotoLegalErrors>>({});
  const [bulkPhotoLegal, setBulkPhotoLegal] = useState<PhotoLegalForm>(createEmptyPhotoLegal());

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

  function upsertFiles(filesToAdd: File[]) {
    if (!filesToAdd.length) return;

    setSelectedFiles((prev) => {
      const map = new Map<string, File>();
      prev.forEach((file) => map.set(getFileKey(file), file));
      filesToAdd.forEach((file) => map.set(getFileKey(file), file));
      return Array.from(map.values());
    });

    setPhotoLegalByKey((prev) => {
      const next: Record<string, PhotoLegalForm> = { ...prev };
      filesToAdd.forEach((file) => {
        const key = getFileKey(file);
        next[key] = prev[key] ?? createEmptyPhotoLegal();
      });
      return next;
    });
  }

  function onPickFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    upsertFiles(files);
    setPhotoErrorsByKey({});
    event.target.value = "";
  }

  function onDropFiles(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );
    upsertFiles(files);
    setPhotoErrorsByKey({});
  }

  function removeSelectedFile(fileKey: string) {
    setSelectedFiles((prev) => prev.filter((file) => getFileKey(file) !== fileKey));

    setPhotoLegalByKey((prev) => {
      const next = { ...prev };
      delete next[fileKey];
      return next;
    });

    setPhotoErrorsByKey((prev) => {
      const next = { ...prev };
      delete next[fileKey];
      return next;
    });
  }

  function updatePhotoLegal(fileKey: string, field: keyof PhotoLegalForm, value: string | boolean) {
    setPhotoLegalByKey((prev) => ({
      ...prev,
      [fileKey]: {
        ...(prev[fileKey] ?? createEmptyPhotoLegal()),
        [field]: value,
      },
    }));

    setPhotoErrorsByKey((prev) => {
      if (!prev[fileKey]?.[field as keyof PhotoLegalErrors]) return prev;
      return {
        ...prev,
        [fileKey]: {
          ...prev[fileKey],
          [field]: undefined,
        },
      };
    });
  }

  function updateBulkPhotoLegal(field: keyof PhotoLegalForm, value: string | boolean) {
    setBulkPhotoLegal((prev) => ({ ...prev, [field]: value }));
  }

  function applyBulkPhotoLegalToAll() {
    if (!selectedFiles.length) return;

    setPhotoLegalByKey((prev) => {
      const next = { ...prev };
      selectedFiles.forEach((file) => {
        next[getFileKey(file)] = {
          license_code: bulkPhotoLegal.license_code,
          attribution: bulkPhotoLegal.attribution,
          rights_holder: bulkPhotoLegal.rights_holder,
          source_url: bulkPhotoLegal.source_url,
          declaration_confirmed: bulkPhotoLegal.declaration_confirmed,
        };
      });
      return next;
    });

    setPhotoErrorsByKey({});
  }

  function validatePhotoLegal() {
    if (!selectedFiles.length) return true;

    const nextErrors: Record<string, PhotoLegalErrors> = {};

    selectedFiles.forEach((file) => {
      const key = getFileKey(file);
      const legal = photoLegalByKey[key];
      const errors: PhotoLegalErrors = {};

      if (!legal?.license_code?.trim()) {
        errors.license_code = t("species_request.validation.photo_license_required");
      }
      if (!legal?.attribution?.trim()) {
        errors.attribution = t("species_request.validation.photo_attribution_required");
      }
      if (!legal?.rights_holder?.trim()) {
        errors.rights_holder = t("species_request.validation.photo_rights_holder_required");
      }
      if (legal?.source_url?.trim()) {
        try {
          new URL(legal.source_url.trim());
        } catch {
          errors.source_url = t("species_request.validation.photo_source_url_invalid");
        }
      }
      if (!legal?.declaration_confirmed) {
        errors.declaration_confirmed = t("species_request.validation.photo_declaration_required");
      }

      if (Object.keys(errors).length) {
        nextErrors[key] = errors;
      }
    });

    setPhotoErrorsByKey(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return {
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
    validatePhotoLegal,
  };
}

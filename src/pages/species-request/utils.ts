import type { PhotoLegalForm } from "@/pages/species-request/types";

export function createEmptyPhotoLegal(): PhotoLegalForm {
  return {
    license_code: "",
    attribution: "",
    rights_holder: "",
    source_url: "",
    declaration_confirmed: false,
  };
}

export function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function normalizeUploadUrlProtocol(url: string) {
  const raw = url.trim();
  if (!raw) return raw;
  if (typeof window === "undefined") return raw;

  const isSecurePage = window.location.protocol === "https:";
  if (!isSecurePage) return raw;

  if (/^http:\/\//i.test(raw)) {
    return raw.replace(/^http:\/\//i, "https://");
  }

  return raw;
}

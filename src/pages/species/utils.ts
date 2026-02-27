import type { SpeciePhoto } from "@/api/species/types/ISpecie";

type PhotoKind = "f" | "l" | "n";

export const getKind = (p: SpeciePhoto): PhotoKind => (p.featured ? "f" : p.lumm ? "l" : "n");

const normalizePublicStorageBase = (value?: string) => {
  const raw = (value || "").trim();
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
};

const fromMinioUriToPublicUrl = (value?: string) => {
  const raw = (value || "").trim();
  if (!raw) return "";
  if (!raw.startsWith("minio://")) return raw;

  const withoutProtocol = raw.slice("minio://".length);
  const separatorIndex = withoutProtocol.indexOf("/");
  if (separatorIndex <= 0) return "";

  const bucketName = withoutProtocol.slice(0, separatorIndex).trim();
  const objectKey = withoutProtocol.slice(separatorIndex + 1).trim();
  if (!bucketName || !objectKey) return "";

  const base = normalizePublicStorageBase(import.meta.env.VITE_PUBLIC_STORAGE_BASE_URL);
  if (!base) return "";

  if (base.endsWith(`/${bucketName}`)) {
    return `${base}/${objectKey}`;
  }

  return `${base}/${bucketName}/${objectKey}`;
};

export const getPhotoUrl = (p: SpeciePhoto) => {
  const medium = fromMinioUriToPublicUrl(p.medium_url);
  if (medium) return medium;

  const original = fromMinioUriToPublicUrl(p.original_url);
  if (original) return original;

  return "";
};

export function sortPhotos(photos: SpeciePhoto[]) {
  const buckets: Record<PhotoKind, SpeciePhoto[]> = {
    f: [],
    l: [],
    n: [],
  };

  photos.forEach((p) => buckets[getKind(p)].push(p));

  const order: PhotoKind[] = ["f", "l", "n"];
  const result: SpeciePhoto[] = [];
  const total = photos.length;

  let i = 0;
  while (result.length < total) {
    const k = order[i % order.length];
    if (buckets[k].length) {
      result.push(buckets[k].shift()!);
    }
    i++;
  }

  return result
    .map((p) => ({
      photo: getPhotoUrl(p),
      attribution: p.attribution,
    }))
    .filter((x) => Boolean(x.photo));
}

export function parseClassification(classification?: string) {
  if (!classification) return [];

  const parts = classification.split(",").map((p) => p.trim());
  const mains = parts.filter((_, i) => i % 2 === 0);
  const last = parts[parts.length - 1];
  if (mains[mains.length - 1] !== last) mains.push(last);

  return [...new Set(mains)];
}

export const taxonomyLabels = [
  "species_page.taxonomy.kingdom",
  "species_page.taxonomy.phylum",
  "species_page.taxonomy.class",
  "species_page.taxonomy.order",
  "species_page.taxonomy.family",
  "species_page.taxonomy.genus",
];

export function formatLuminescence(value: boolean | null | undefined): string {
  if (value === true) return "species_page.lumm.yes";
  if (value === false) return "species_page.lumm.no";
  return "species_page.lumm.unknown";
}

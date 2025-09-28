import type { SpeciePhoto } from "@/api/species/types/ISpecie";

type PhotoKind = "f" | "l" | "n";

export const getKind = (p: SpeciePhoto): PhotoKind => (p.featured ? "f" : p.lumm ? "l" : "n");

export const getPhotoUrl = (p: SpeciePhoto) => p.medium_url ?? p.original_url ?? "";

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

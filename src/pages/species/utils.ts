import type { SpeciePhoto } from "@/api/species/types/ISpecie";

type PhotoKind = "f" | "l" | "n";

export const getKind = (p: SpeciePhoto): PhotoKind => (p.featured ? "f" : p.lumm ? "l" : "n");

export const getPhotoUrl = (p: SpeciePhoto) => p.medium_url ?? p.original_url ?? "";

export function sortPhotos(photos: SpeciePhoto[]) {
  const f: SpeciePhoto[] = [];
  const l: SpeciePhoto[] = [];
  const n: SpeciePhoto[] = [];

  photos.forEach((photo) => (photo.featured ? f : photo.lumm ? l : n).push(photo));

  const order: PhotoKind[] = ["f", "l", "n"];
  const byKind: Record<PhotoKind, SpeciePhoto[]> = { f, l, n };

  const result: SpeciePhoto[] = [];
  let consumed = 0;
  const total = f.length + l.length + n.length;

  while (consumed < total) {
    let pushedSomething = false;

    for (const k of order) {
      const bucket = byKind[k];
      if (bucket.length) {
        result.push(bucket.shift()!);
        consumed++;
        pushedSomething = true;
      }
    }

    if (!pushedSomething) break;
  }

  const photosOut = result
    .map((p) => ({
      photo: getPhotoUrl(p),
      attribution: p.attribution,
    }))
    .filter((x) => Boolean(x.photo));

  return photosOut;
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

import type { ISpecie, SpeciePhoto, SpeciesCharacteristics } from "@/api/species/types/ISpecie";

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

type LocalizedCharacteristicKey =
  | "colors"
  | "cultivation"
  | "finding_tips"
  | "nearby_trees"
  | "curiosities"
  | "general_description";

export function getLocalizedCharacteristicValue(
  characteristics: SpeciesCharacteristics | undefined,
  key: LocalizedCharacteristicKey,
  isPtLanguage: boolean
): string | null {
  if (!characteristics) return null;
  const ptKey = `${key}_pt` as keyof SpeciesCharacteristics;
  const defaultValue = characteristics[key] as string | null | undefined;
  const ptValue = characteristics[ptKey] as string | null | undefined;

  if (!isPtLanguage) return defaultValue ?? null;
  return ptValue ?? defaultValue ?? null;
}

export function formatLocalizedMonth(language: string, month?: number | null) {
  if (typeof month !== "number" || month < 1 || month > 12) return null;
  const monthLabel = new Intl.DateTimeFormat(language, { month: "long" }).format(
    new Date(2020, month - 1, 1)
  );
  return monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
}

export function withNoInformationFallback(
  value: string | number | null | undefined,
  noInformationLabel: string
) {
  if (typeof value === "string") return value.trim() ? value : noInformationLabel;
  return value ?? noInformationLabel;
}

export function getLocalizedOptionLabels(
  options: Array<{ label_pt: string; label_en: string }> | null | undefined,
  isPtLanguage: boolean
) {
  if (!options?.length) return null;
  return options
    .map((item) => (isPtLanguage ? item.label_pt : item.label_en))
    .filter(Boolean)
    .join(", ");
}

export function normalizeConservationStatusCode(value: string | null | undefined) {
  const raw = (value || "").trim().toUpperCase();
  return !raw || raw === "NONE" ? "NE" : raw;
}

interface GenericObject {
  [key: string]: unknown;
}

export interface BibliographyLink {
  labelKey: string;
  url: string;
  fallbackLabel?: string;
}

export interface SpeciesNcbiRecord {
  databaseName: string;
  linksLabel: string;
  linksCount: number | null;
  url: string | null;
}

const isObject = (value: unknown): value is GenericObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeFieldName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const pickField = (value: GenericObject, candidates: string[]) => {
  const normalizedCandidates = candidates.map(normalizeFieldName);
  for (const [key, fieldValue] of Object.entries(value)) {
    if (normalizedCandidates.includes(normalizeFieldName(key))) return fieldValue;
  }
  return undefined;
};

const toText = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
};

const toCount = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const digitsOnly = value.replace(/[^0-9]/g, "");
  if (!digitsOnly) return null;

  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCount = (value: unknown) => {
  const parsed = toCount(value);
  if (parsed !== null) return { count: parsed, label: parsed.toLocaleString("en-US") };

  const textValue = toText(value);
  return { count: null, label: textValue || "0" };
};

const toNcbiRecord = (entry: unknown, keyHint?: string): SpeciesNcbiRecord | null => {
  if (typeof entry === "string" || typeof entry === "number") {
    if (!keyHint) return null;
    const links = formatCount(entry);
    return {
      databaseName: keyHint,
      linksLabel: links.label,
      linksCount: links.count,
      url: null,
    };
  }

  if (!isObject(entry)) return null;

  const databaseName =
    toText(pickField(entry, ["database_name", "database", "databaseName", "name", "db"])) ||
    keyHint ||
    null;
  const linksRaw = pickField(entry, [
    "links",
    "count",
    "total",
    "value",
    "records",
    "quantity",
    "number",
    "num",
    "qtd",
  ]);
  const links = formatCount(linksRaw);
  const url = toText(pickField(entry, ["url", "href", "link", "ncbi_url", "ncbi_link"]));

  if (!databaseName) return null;
  if (linksRaw === undefined && links.count === null && links.label === "0") return null;

  return {
    databaseName,
    linksLabel: links.label,
    linksCount: links.count,
    url,
  };
};

export function normalizeSpeciesNcbiRecords(payload: unknown): SpeciesNcbiRecord[] {
  const rows: SpeciesNcbiRecord[] = [];
  const appendRecord = (entry: unknown, keyHint?: string) => {
    const normalized = toNcbiRecord(entry, keyHint);
    if (normalized) rows.push(normalized);
  };

  if (Array.isArray(payload)) {
    payload.forEach((item) => appendRecord(item));
    return rows;
  }

  if (!isObject(payload)) return rows;

  const recordsCandidate = pickField(payload, [
    "records",
    "items",
    "data",
    "result",
    "results",
    "ncbi",
    "ncbi_records",
    "ncbiRecords",
  ]);
  if (Array.isArray(recordsCandidate)) {
    recordsCandidate.forEach((item) => appendRecord(item));
    return rows;
  }

  if (isObject(recordsCandidate)) {
    Object.entries(recordsCandidate).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => appendRecord(item, key));
        return;
      }
      appendRecord(value, key);
    });
    if (rows.length) return rows;
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => appendRecord(item, key));
      return;
    }
    if (isObject(value)) {
      appendRecord(value, key);
      if (!rows.length) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (Array.isArray(nestedValue)) {
            nestedValue.forEach((item) => appendRecord(item, nestedKey));
            return;
          }
          appendRecord(nestedValue, nestedKey);
        });
      }
      return;
    }
    appendRecord(value, key);
  });

  return rows;
}

export function extractSpeciesBibliographyLinks(species: ISpecie | null): BibliographyLink[] {
  if (!species || !isObject(species)) return [];

  const results: BibliographyLink[] = [];

  const scientificName =
    typeof species.scientific_name === "string" ? species.scientific_name.trim() : "";

  const buildPubMedTerms = (name: string) => {
    const parts = name.split(/\s+/).filter(Boolean);
    const terms: string[] = [];

    for (let index = 0; index < parts.length; index += 1) {
      const current = parts[index];
      const next = parts[index + 1];

      if (current.toLowerCase() === "var." && next) {
        terms.push(`var.+${next}`);
        index += 1;
        continue;
      }

      terms.push(current);
    }

    return terms;
  };

  const ncbiTxid = species.ncbi_taxonomy_id;
  if (ncbiTxid) {
    results.push({
      labelKey: "species_page.bibliography.links.pubmed_central_taxid",
      url: `https://pmc.ncbi.nlm.nih.gov/search/?term=txid${ncbiTxid}[Organism:noexp]&pmfilter_Fulltext=off`,
    });
  }

  const pubMedTerms = buildPubMedTerms(scientificName);

  if (pubMedTerms.length) {
    results.push({
      labelKey: "species_page.bibliography.links.pubmed_scientific_name",
      url: `https://pubmed.ncbi.nlm.nih.gov/?cmd=Search&dopt=DocSum&term=${pubMedTerms.join(
        "+AND+"
      )}`,
    });
  }

  if (scientificName) {
    results.push({
      labelKey: "species_page.bibliography.links.google_scholar_scientific_name",
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(scientificName)}`,
    });
  }

  return results;
}

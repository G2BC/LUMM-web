import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const LOCALES_DIR = path.resolve("src/locales");
const SOURCE_LOCALE = "en";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function valueType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function placeholders(value) {
  if (typeof value !== "string") return [];

  const found = new Set();
  const pattern = /{{\s*([\w.-]+)\s*}}/g;
  let match;

  while ((match = pattern.exec(value))) {
    found.add(match[1]);
  }

  return [...found].sort();
}

function flatten(value, prefix = "") {
  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key)
    );
  }

  if (Array.isArray(value)) {
    return value.flatMap((child, index) => flatten(child, `${prefix}[${index}]`));
  }

  return [
    {
      path: prefix,
      type: valueType(value),
      placeholders: placeholders(value),
    },
  ];
}

async function readLocales() {
  const files = (await readdir(LOCALES_DIR)).filter((file) => file.endsWith(".json")).sort();

  if (!files.includes(`${SOURCE_LOCALE}.json`)) {
    throw new Error(`Missing source locale: ${SOURCE_LOCALE}.json`);
  }

  const locales = new Map();

  for (const file of files) {
    const locale = path.basename(file, ".json");
    const raw = await readFile(path.join(LOCALES_DIR, file), "utf8");

    try {
      locales.set(locale, JSON.parse(raw));
    } catch (error) {
      throw new Error(`${file} is not valid JSON: ${error.message}`);
    }
  }

  return locales;
}

function toEntryMap(data) {
  return new Map(flatten(data).map((entry) => [entry.path, entry]));
}

function diffLocale(baseLocale, baseEntries, locale, entries) {
  const errors = [];

  for (const [key, baseEntry] of baseEntries) {
    const entry = entries.get(key);

    if (!entry) {
      errors.push(`${locale}: missing key "${key}" from ${baseLocale}`);
      continue;
    }

    if (entry.type !== baseEntry.type) {
      errors.push(
        `${locale}: key "${key}" has type "${entry.type}", expected "${baseEntry.type}"`
      );
    }

    const basePlaceholders = baseEntry.placeholders.join(", ");
    const entryPlaceholders = entry.placeholders.join(", ");

    if (entryPlaceholders !== basePlaceholders) {
      errors.push(
        `${locale}: key "${key}" has placeholders [${entryPlaceholders}], expected [${basePlaceholders}]`
      );
    }
  }

  for (const key of entries.keys()) {
    if (!baseEntries.has(key)) {
      errors.push(`${locale}: extra key "${key}" not present in ${baseLocale}`);
    }
  }

  return errors;
}

const locales = await readLocales();
const baseEntries = toEntryMap(locales.get(SOURCE_LOCALE));
const errors = [];

for (const [locale, data] of locales) {
  if (locale === SOURCE_LOCALE) continue;
  errors.push(...diffLocale(SOURCE_LOCALE, baseEntries, locale, toEntryMap(data)));
}

if (errors.length > 0) {
  console.error("Locale validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${locales.size} locale files against ${SOURCE_LOCALE}.`);

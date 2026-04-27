import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCountryName } from "@/lib/country-names";
import type { Locale } from "@/lib/lang";

interface FilterTagsProps {
  search: string;
  lineage: string;
  country: string;
  distributions: string[];
  filterLabels: { lineage?: string; distributions: Record<string, string> };
  onClearSearch: () => void;
  onClearLineage: () => void;
  onClearCountry: () => void;
  onClearDistributions: () => void;
}

function Tag({ prefix, value, onRemove }: { prefix: string; value: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap max-w-[320px]">
      <span className="opacity-70 shrink-0">{prefix}:</span>
      <span className="truncate">{value}</span>
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors flex items-center shrink-0"
        aria-label={`Remover filtro ${prefix}`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export function FilterTags({
  search,
  lineage,
  country,
  distributions,
  filterLabels,
  onClearSearch,
  onClearLineage,
  onClearCountry,
  onClearDistributions,
}: FilterTagsProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;

  const distributionValue = distributions.map((d) => filterLabels.distributions[d] ?? d).join(", ");

  const tags = [
    search
      ? {
          id: "search",
          prefix: t("explore_page.input_placeholder"),
          value: search,
          onRemove: onClearSearch,
        }
      : null,
    lineage
      ? {
          id: "lineage",
          prefix: t("explore_page.select_lineage"),
          value: filterLabels.lineage ?? lineage,
          onRemove: onClearLineage,
        }
      : null,
    country
      ? {
          id: "country",
          prefix: t("explore_page.select_country"),
          value: getCountryName(country, lang) || country,
          onRemove: onClearCountry,
        }
      : null,
    distributions.length
      ? {
          id: "distributions",
          prefix: t("explore_page.select_distributions"),
          value: distributionValue,
          onRemove: onClearDistributions,
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; prefix: string; value: string; onRemove: () => void }>;

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <Tag key={tag.id} prefix={tag.prefix} value={tag.value} onRemove={tag.onRemove} />
      ))}
    </div>
  );
}

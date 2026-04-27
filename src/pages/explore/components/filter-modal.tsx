import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ComboboxAsync, type ComboboxOption } from "@/components/combobox-async";
import { selectDistributions, selectLineage, selectSpeciesCountry } from "@/api/species";
import { getCountryName } from "@/lib/country-names";
import type { Locale } from "@/lib/lang";

interface FilterModalProps {
  search: string;
  lineage: string;
  country: string;
  distributions: string[];
  filterLabels: { lineage?: string; distributions: Record<string, string> };
  onApply: (filters: {
    search: string;
    lineage: string;
    country: string;
    distributions: string[];
    lineageLabel?: string;
    distributionLabels: Record<string, string>;
  }) => void;
}

export function FilterModal({
  search,
  lineage,
  country,
  distributions,
  filterLabels,
  onApply,
}: FilterModalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;
  const [open, setOpen] = React.useState(false);

  const [draftSearch, setDraftSearch] = React.useState(search);
  const [draftLineage, setDraftLineage] = React.useState(lineage);
  const [draftCountry, setDraftCountry] = React.useState(country);
  const [draftDistributions, setDraftDistributions] = React.useState<string[]>(distributions);
  const [draftLineageLabel, setDraftLineageLabel] = React.useState<string | undefined>(
    filterLabels.lineage
  );
  const [draftDistributionLabels, setDraftDistributionLabels] = React.useState<
    Record<string, string>
  >(filterLabels.distributions);

  React.useEffect(() => {
    if (open) {
      setDraftSearch(search);
      setDraftLineage(lineage);
      setDraftCountry(country);
      setDraftDistributions(distributions);
      setDraftLineageLabel(filterLabels.lineage);
      setDraftDistributionLabels(filterLabels.distributions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const activeCount = [search, lineage, country, ...distributions].filter(Boolean).length;

  const fetchLineageOptions = React.useCallback(
    async (query: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectLineage(query, signal);
      return res.map((item) => ({ id: item.value, label: item.label }));
    },
    []
  );

  const fetchCountryOptions = React.useCallback(
    async (query: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectSpeciesCountry(query, signal);
      return res.map((item) => ({
        id: item.value,
        label: getCountryName(item.label, lang) || item.label,
      }));
    },
    [lang]
  );

  const fetchDistributionOptions = React.useCallback(
    async (_query: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectDistributions(signal);
      const isPt = lang === "pt";
      return res.map((item) => ({
        id: item.slug,
        label: `${item.slug} - ${isPt ? item.label_pt : item.label_en}`,
      }));
    },
    [lang]
  );

  const lineageInitialOptions = React.useMemo<ComboboxOption[]>(
    () =>
      draftLineage && draftLineageLabel ? [{ id: draftLineage, label: draftLineageLabel }] : [],
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const distributionInitialOptions = React.useMemo<ComboboxOption[]>(
    () => Object.entries(draftDistributionLabels).map(([id, label]) => ({ id, label })),
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleApply = () => {
    onApply({
      search: draftSearch,
      lineage: draftLineage,
      country: draftCountry,
      distributions: draftDistributions,
      lineageLabel: draftLineageLabel,
      distributionLabels: draftDistributionLabels,
    });
    setOpen(false);
  };

  const hasActiveFilters = !!(search || lineage || country || distributions.length);

  const handleClear = () => {
    setDraftSearch("");
    setDraftLineage("");
    setDraftCountry("");
    setDraftDistributions([]);
    setDraftLineageLabel(undefined);
    setDraftDistributionLabels({});
    if (hasActiveFilters) {
      onApply({
        search: "",
        lineage: "",
        country: "",
        distributions: [],
        lineageLabel: undefined,
        distributionLabels: {},
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative gap-2 h-11 w-full md:w-fit border-primary/60 bg-transparent text-primary hover:bg-primary/15 hover:text-primary"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("explore_page.filters")}
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("explore_page.filters")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Input
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder={t("explore_page.input_placeholder")}
          />
          <ComboboxAsync
            variant="dark"
            placeholder={t("explore_page.select_lineage")}
            fetchOptions={fetchLineageOptions}
            initialKnownOptions={lineageInitialOptions}
            value={draftLineage || null}
            onSelect={(id) => setDraftLineage(id ? String(id) : "")}
            onSelectOption={(opt) => setDraftLineageLabel(opt?.label)}
          />
          <ComboboxAsync
            variant="dark"
            placeholder={t("explore_page.select_country")}
            fetchOptions={fetchCountryOptions}
            value={draftCountry || null}
            onSelect={(id) => setDraftCountry(id ? String(id) : "")}
          />
          <ComboboxAsync
            variant="dark"
            multiple
            placeholder={t("explore_page.select_distributions")}
            fetchOptions={fetchDistributionOptions}
            initialKnownOptions={distributionInitialOptions}
            value={draftDistributions}
            onSelect={(ids) => setDraftDistributions(ids.map(String))}
            onSelectOption={(opts) => {
              const labels: Record<string, string> = {};
              for (const opt of opts) labels[String(opt.id)] = opt.label;
              setDraftDistributionLabels(labels);
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClear}>
            {t("explore_page.filter_clear")}
          </Button>
          <Button
            onClick={handleApply}
            className="bg-primary text-black font-semibold hover:bg-primary/90"
          >
            {t("explore_page.filter_apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import specieCardDefault from "@/assets/specie-card-default.webp";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { selectSpecies } from "@/api/species";
import type { ISpeciesSelect } from "@/api/species/types/ISpeciesSelect";

type SpeciesComboboxAsyncProps = {
  placeholder?: string;
  value?: number[];
  onSelect?: (_value: number[]) => void;
  variant?: "dark" | "light";
  excludeSpeciesId?: number;
};

export function SpeciesComboboxAsync(props: SpeciesComboboxAsyncProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState<ISpeciesSelect[]>([]);
  const [knownOptions, setKnownOptions] = React.useState<Record<number, ISpeciesSelect>>({});
  const [selectedIds, setSelectedIds] = React.useState<number[]>(props.value ?? []);

  const variant = props.variant ?? "dark";

  React.useEffect(() => {
    setSelectedIds(props.value ?? []);
  }, [props.value]);

  React.useEffect(() => {
    const ctrl = new AbortController();

    const fetcher = async (query: string) => {
      setLoading(true);
      try {
        const res = await selectSpecies({
          search: query,
          exclude_species_id: props.excludeSpeciesId,
          signal: ctrl.signal,
        });
        if (!Array.isArray(res)) return;

        setOptions(res);
        setKnownOptions((prev) => {
          const next = { ...prev };
          for (const item of res) {
            next[item.id] = item;
          }
          return next;
        });
      } finally {
        setLoading(false);
      }
    };

    if (!search.trim()) {
      fetcher("");
      return () => ctrl.abort();
    }

    const timer = setTimeout(() => fetcher(search), 800);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [search, props.excludeSpeciesId]);

  const buttonLabel = React.useMemo(() => {
    if (loading) return t("common.loading");
    if (!selectedIds.length) return props.placeholder ?? "Selecione";

    const labels = selectedIds.map((id) => knownOptions[id]?.label).filter(Boolean);
    if (!labels.length) return props.placeholder ?? "Selecione";
    if (labels.length <= 2) return labels.join(", ");
    return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
  }, [knownOptions, loading, props.placeholder, selectedIds, t]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={loading}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx(
            "w-full h-[40px] justify-between hover:bg-transparent text-base md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-normal",
            variant === "light" ? "border-slate-300 bg-white" : "border-white",
            variant === "light"
              ? !selectedIds.length
                ? "text-slate-400 hover:text-slate-400"
                : "text-slate-900 hover:text-slate-900"
              : !selectedIds.length
                ? "text-[#FFFFFF80] hover:text-[#FFFFFF80]"
                : "text-white hover:text-white"
          )}
        >
          {buttonLabel}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput value={search} onValueChange={setSearch} placeholder={t("common.search")} />
          <CommandList>
            <CommandEmpty>{t("common.no_results")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionIsSelected = selectedIds.includes(option.id);

                return (
                  <CommandItem
                    key={option.id}
                    value={`${option.id}-${option.label}`}
                    onSelect={() => {
                      const nextValues = optionIsSelected
                        ? selectedIds.filter((id) => id !== option.id)
                        : [...selectedIds, option.id];

                      setSelectedIds(nextValues);
                      props.onSelect?.(nextValues);
                    }}
                  >
                    <CheckIcon
                      className={cn("mr-2 h-4 w-4", optionIsSelected ? "opacity-100" : "opacity-0")}
                    />
                    <img
                      src={option.photo || specieCardDefault}
                      alt={option.label}
                      loading="lazy"
                      className="mr-2 h-6 w-6 rounded object-cover border border-slate-300/70"
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

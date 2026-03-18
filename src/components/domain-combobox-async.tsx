"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

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
import { selectSpeciesDomain, type SpeciesDomainSelectType } from "@/api/species";
import type { ISelectLocalized } from "@/api/types/ISelectLocalized";

type DomainComboboxBaseProps = {
  domain: SpeciesDomainSelectType;
  placeholder?: string;
  variant?: "dark" | "light";
};

type DomainComboboxSingleProps = DomainComboboxBaseProps & {
  multiple?: false;
  value?: string;
  onSelect?: (_value: string) => void;
};

type DomainComboboxMultipleProps = DomainComboboxBaseProps & {
  multiple: true;
  value?: Array<string | number>;
  onSelect?: (_value: Array<string | number>) => void;
};

type DomainComboboxAsyncProps = DomainComboboxSingleProps | DomainComboboxMultipleProps;

export function DomainComboboxAsync(props: DomainComboboxAsyncProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState<ISelectLocalized[]>([]);
  const [knownOptions, setKnownOptions] = React.useState<Record<string, ISelectLocalized>>({});

  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    props.multiple
      ? (props.value ?? []).map((item) => String(item))
      : props.value
        ? [props.value]
        : []
  );

  const isPt = i18n.language.toLowerCase().startsWith("pt");
  const variant = props.variant ?? "dark";

  const getLabel = React.useCallback(
    (option?: ISelectLocalized) => {
      if (!option) return "";
      return isPt ? option.label_pt : option.label_en;
    },
    [isPt]
  );

  React.useEffect(() => {
    if (props.multiple) {
      setSelectedValues((props.value ?? []).map((item) => String(item)));
      return;
    }
    setSelectedValues(props.value ? [props.value] : []);
  }, [props.multiple, props.value]);

  React.useEffect(() => {
    const ctrl = new AbortController();

    const fetcher = async (query: string) => {
      setLoading(true);
      try {
        const res = await selectSpeciesDomain(props.domain, query, ctrl.signal);
        if (Array.isArray(res)) {
          setOptions(res);
          setKnownOptions((prev) => {
            const next = { ...prev };
            for (const item of res) {
              next[String(item.value)] = item;
            }
            return next;
          });
        }
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
  }, [props.domain, search]);

  const buttonLabel = React.useMemo(() => {
    if (loading) return t("common.loading");
    if (!selectedValues.length) return props.placeholder ?? "Selecione";

    const labels = selectedValues
      .map((value) => getLabel(knownOptions[String(value)]))
      .filter(Boolean);

    if (!labels.length) return props.placeholder ?? "Selecione";
    if (labels.length <= 2) return labels.join(", ");
    return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
  }, [getLabel, knownOptions, loading, props.placeholder, selectedValues, t]);

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
              ? !selectedValues.length
                ? "text-slate-400 hover:text-slate-400"
                : "text-slate-900 hover:text-slate-900"
              : !selectedValues.length
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
                const optionValue = String(option.value);
                const optionIsSelected = selectedValues.includes(optionValue);

                return (
                  <CommandItem
                    key={optionValue}
                    value={optionValue}
                    onSelect={() => {
                      if (props.multiple) {
                        const nextValues = optionIsSelected
                          ? selectedValues.filter((item) => item !== optionValue)
                          : [...selectedValues, optionValue];
                        setSelectedValues(nextValues);
                        props.onSelect?.(
                          nextValues.map((value) => knownOptions[value]?.value ?? value)
                        );
                        return;
                      }

                      const nextValue = optionIsSelected ? "" : optionValue;
                      setSelectedValues(nextValue ? [nextValue] : []);
                      props.onSelect?.(nextValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn("mr-2 h-4 w-4", optionIsSelected ? "opacity-100" : "opacity-0")}
                    />
                    {getLabel(option)}
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

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

export type ComboboxOption = {
  id: string | number;
  label: string;
  photo?: string | null;
};

type ComboboxAsyncBaseProps = {
  fetchOptions: (_search: string, _signal: AbortController["signal"]) => Promise<ComboboxOption[]>;
  placeholder?: string;
  variant?: "dark" | "light";
  className?: string;
  popoverContainer?: HTMLElement | null;
  initialKnownOptions?: ComboboxOption[];
  renderOptionExtra?: (_option: ComboboxOption) => React.ReactNode;
};

type ComboboxAsyncSingleProps = ComboboxAsyncBaseProps & {
  multiple?: false;
  value: string | number | null;
  onSelect?: (_id: string | number | null) => void;
  onSelectOption?: (_option: ComboboxOption | null) => void;
};

type ComboboxAsyncMultipleProps = ComboboxAsyncBaseProps & {
  multiple: true;
  value: Array<string | number>;
  onSelect?: (_ids: Array<string | number>) => void;
  onSelectOption?: (_options: ComboboxOption[]) => void;
};

export type ComboboxAsyncProps = ComboboxAsyncSingleProps | ComboboxAsyncMultipleProps;

export function ComboboxAsync(props: ComboboxAsyncProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState<ComboboxOption[]>([]);

  const initialKnownOptionsRef = React.useRef(props.initialKnownOptions);
  const [knownOptions, setKnownOptions] = React.useState<Record<string, ComboboxOption>>(() => {
    const items = initialKnownOptionsRef.current ?? [];
    return Object.fromEntries(items.map((item) => [String(item.id), item]));
  });

  const [selectedIds, setSelectedIds] = React.useState<string[]>(() => {
    if (props.multiple) return (props.value ?? []).map((v) => String(v));
    return props.value != null ? [String(props.value)] : [];
  });

  const variant = props.variant ?? "dark";
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  React.useEffect(() => {
    if (props.multiple) {
      setSelectedIds((props.value ?? []).map((v) => String(v)));
    } else {
      setSelectedIds(props.value != null ? [String(props.value)] : []);
    }
  }, [props.multiple, props.value]);

  React.useEffect(() => {
    const ctrl = new AbortController();

    const fetcher = async (query: string) => {
      setLoading(true);
      try {
        const res = await props.fetchOptions(query, ctrl.signal);
        if (Array.isArray(res)) {
          setOptions(res);
          setKnownOptions((prev) => {
            const next = { ...prev };
            for (const item of res) {
              next[String(item.id)] = item;
            }
            return next;
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (!search.trim()) {
      void fetcher("");
      return () => ctrl.abort();
    }

    const timer = setTimeout(() => void fetcher(search), 800);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [props.fetchOptions, search]);

  const buttonLabel = React.useMemo(() => {
    if (loading) return t("common.loading");
    if (!selectedIds.length) return props.placeholder ?? "Selecione";

    const labels = selectedIds.map((id) => knownOptions[id]?.label).filter(Boolean);
    if (!labels.length) return props.placeholder ?? "Selecione";
    if (labels.length <= 2) return labels.join(", ");
    return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
  }, [knownOptions, loading, props.placeholder, selectedIds, t]);

  const handleSelect = (optionId: string) => {
    const option = knownOptions[optionId];
    const originalId: string | number = option
      ? option.id
      : Number.isFinite(Number(optionId))
        ? Number(optionId)
        : optionId;

    if (props.multiple) {
      const isSelected = selectedIds.includes(optionId);
      const nextStringIds = isSelected
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId];
      setSelectedIds(nextStringIds);
      const nextOriginalIds = nextStringIds.map((id) => {
        const o = knownOptions[id];
        return o ? o.id : Number.isFinite(Number(id)) ? Number(id) : id;
      });
      props.onSelect?.(nextOriginalIds);
      const nextOptions = nextStringIds
        .map((id) => knownOptions[id])
        .filter(Boolean) as ComboboxOption[];
      props.onSelectOption?.(nextOptions);
    } else {
      const isSelected = selectedIds[0] === optionId;
      setSelectedIds(isSelected ? [] : [optionId]);
      props.onSelect?.(isSelected ? null : originalId);
      props.onSelectOption?.(isSelected ? null : (option ?? null));
      setOpen(false);
    }
  };

  return (
    <div className={props.className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={loading}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={clsx(
              "w-full h-11 justify-between hover:bg-transparent text-base md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-normal",
              variant === "light" ? "border-slate-300 bg-white" : "border-input dark:bg-input/30",
              variant === "light"
                ? !selectedIds.length
                  ? "text-slate-400 hover:text-slate-400"
                  : "text-slate-900 hover:text-slate-900"
                : !selectedIds.length
                  ? "text-[#FFFFFF80] hover:text-[#FFFFFF80]"
                  : "text-white hover:text-white"
            )}
          >
            <span className="line-clamp-1 whitespace-normal text-left">{buttonLabel}</span>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
          container={props.popoverContainer}
        >
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={t("common.search")}
              autoFocus={!isMobile}
            />
            <CommandList className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <CommandEmpty>{t("common.no_results")}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const optionId = String(option.id);
                  const isSelected = selectedIds.includes(optionId);
                  return (
                    <CommandItem
                      key={optionId}
                      value={`${optionId}-${option.label}`}
                      onSelect={() => handleSelect(optionId)}
                    >
                      <CheckIcon
                        className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                      />
                      {props.renderOptionExtra?.(option)}
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

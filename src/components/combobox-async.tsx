"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import type { ISelect } from "@/api/types/ISelect";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { translateCountryName } from "@/utils/translateCountryName";

interface ComboboxAsyncProps {
  api: (_search?: string, _signal?: AbortController["signal"]) => Promise<ISelect[]>;
  placeholder?: string;
  onSelect?: (_value: string) => void;
  value?: string;
}

export function ComboboxAsync(props: ComboboxAsyncProps) {
  const [options, setOptions] = React.useState<ISelect[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(props.value ?? "");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const { t, i18n } = useTranslation();

  const language = i18n.language;

  React.useEffect(() => {
    const ctrl = new AbortController();

    if (!search.trim()) {
      setLoading(true);
      props
        .api("", ctrl.signal)
        .then((res) => {
          if (Array.isArray(res))
            setOptions(
              res.map(({ label, value }) => ({
                label: language == "pt" ? translateCountryName(label, "en", "pt") : label,
                value,
              }))
            );
        })
        .finally(() => setLoading(false));
      return () => ctrl.abort();
    }

    const timer = setTimeout(() => {
      setLoading(true);
      props
        .api(search, ctrl.signal)
        .then((res) => {
          if (Array.isArray(res))
            setOptions(
              res.map(({ label, value }) => ({
                label: language == "pt" ? translateCountryName(label, "en", "pt") : label,
                value,
              }))
            );
        })
        .finally(() => setLoading(false));
    }, 1000);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={loading}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx(
            "w-full h-[40px] justify-between border-white hover:bg-transparent text-base md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-normal",
            !value ? "text-[#FFFFFF80] hover:text-[#FFFFFF80]" : "text-white hover:text-white"
          )}
        >
          {loading
            ? t("loading")
            : value
              ? options.find((framework) => framework.value === value)?.label
              : (props.placeholder ?? "Selecione")}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput value={search} onValueChange={setSearch} placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("no_results")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const valueToState = currentValue === value ? "" : currentValue;
                    setValue(valueToState);
                    if (props.onSelect) {
                      props.onSelect(valueToState);
                    }
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

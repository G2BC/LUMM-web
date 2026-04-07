"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";

import { selectSpeciesDomain, type SpeciesDomainSelectType } from "@/api/species";
import type { ISelectLocalized } from "@/api/types/ISelectLocalized";
import {
  ComboboxAsync,
  type ComboboxAsyncProps,
  type ComboboxOption,
} from "@/components/combobox-async";
import { useInitialComboboxOptions } from "@/components/use-initial-combobox-options";

type DomainComboboxBaseProps = {
  domain: SpeciesDomainSelectType;
  placeholder?: string;
  variant?: "dark" | "light";
  initialKnownOptions?: ISelectLocalized[];
};

type DomainComboboxSingleProps = DomainComboboxBaseProps & {
  multiple?: false;
  value?: string | number | null;
  onSelect?: (_value: string | number | null) => void;
};

type DomainComboboxMultipleProps = DomainComboboxBaseProps & {
  multiple: true;
  value?: Array<string | number>;
  onSelect?: (_value: Array<string | number>) => void;
};

type DomainComboboxAsyncProps = DomainComboboxSingleProps | DomainComboboxMultipleProps;

export function DomainComboboxAsync(props: DomainComboboxAsyncProps) {
  const { i18n } = useTranslation();
  const isPt = i18n.language.toLowerCase().startsWith("pt");

  const fetchOptions = React.useCallback(
    async (search: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectSpeciesDomain(props.domain, search, signal);
      return res.map((item) => ({
        id: item.value,
        label: isPt ? item.label_pt : item.label_en,
      }));
    },
    [props.domain, isPt]
  );

  const initialKnownOptions = useInitialComboboxOptions(props.initialKnownOptions, (item) => ({
    id: item.value,
    label: isPt ? item.label_pt : item.label_en,
  }));

  const sharedProps = {
    fetchOptions,
    variant: props.variant,
    placeholder: props.placeholder,
    initialKnownOptions,
  } satisfies Partial<ComboboxAsyncProps>;

  if (props.multiple) {
    return (
      <ComboboxAsync
        {...sharedProps}
        multiple
        value={props.value ?? []}
        onSelect={props.onSelect}
      />
    );
  }

  return <ComboboxAsync {...sharedProps} value={props.value ?? null} onSelect={props.onSelect} />;
}

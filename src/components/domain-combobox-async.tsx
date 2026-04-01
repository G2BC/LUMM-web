"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";

import { selectSpeciesDomain, type SpeciesDomainSelectType } from "@/api/species";
import type { ISelectLocalized } from "@/api/types/ISelectLocalized";
import { ComboboxAsync, type ComboboxOption } from "@/components/combobox-async";

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

  const initialKnownOptions = React.useMemo<ComboboxOption[]>(
    () =>
      (props.initialKnownOptions ?? []).map((item) => ({
        id: item.value,
        label: isPt ? item.label_pt : item.label_en,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (props.multiple) {
    return (
      <ComboboxAsync
        fetchOptions={fetchOptions}
        multiple
        value={props.value ?? []}
        onSelect={props.onSelect}
        variant={props.variant}
        placeholder={props.placeholder}
        initialKnownOptions={initialKnownOptions}
      />
    );
  }

  return (
    <ComboboxAsync
      fetchOptions={fetchOptions}
      value={props.value ?? null}
      onSelect={props.onSelect}
      variant={props.variant}
      placeholder={props.placeholder}
      initialKnownOptions={initialKnownOptions}
    />
  );
}

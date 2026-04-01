"use client";

import * as React from "react";

import specieCardDefault from "@/assets/specie-card-default.webp";
import { selectSpecies } from "@/api/species";
import { ComboboxAsync, type ComboboxOption } from "@/components/combobox-async";

type SpeciesComboboxAsyncProps = {
  placeholder?: string;
  value?: number[];
  onSelect?: (_value: number[]) => void;
  variant?: "dark" | "light";
  excludeSpeciesId?: number;
  initialKnownOptions?: Array<{ id: number; label: string; photo?: string | null }>;
};

export function SpeciesComboboxAsync(props: SpeciesComboboxAsyncProps) {
  const fetchOptions = React.useCallback(
    async (search: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const res = await selectSpecies({
        search,
        exclude_species_id: props.excludeSpeciesId,
        signal,
      });
      return res.map((item) => ({ id: item.id, label: item.label, photo: item.photo ?? null }));
    },
    [props.excludeSpeciesId]
  );

  const initialKnownOptions = React.useMemo<ComboboxOption[]>(
    () => (props.initialKnownOptions ?? []).map((item) => ({ ...item })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSelect = (ids: Array<string | number>) => {
    const numericIds = ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
    props.onSelect?.(numericIds);
  };

  return (
    <ComboboxAsync
      fetchOptions={fetchOptions}
      multiple
      value={props.value ?? []}
      onSelect={handleSelect}
      variant={props.variant}
      placeholder={props.placeholder}
      initialKnownOptions={initialKnownOptions}
      renderOptionExtra={(option) => (
        <img
          src={option.photo || specieCardDefault}
          alt={option.label}
          loading="lazy"
          className="mr-2 h-6 w-6 rounded object-cover border border-slate-300/70"
        />
      )}
    />
  );
}

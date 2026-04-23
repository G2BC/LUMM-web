import * as React from "react";
import type { ComboboxOption } from "./combobox-async";

/**
 * Memoizes initial known options once at mount.
 * Intentionally ignores prop changes after mount — the ComboboxAsync
 * "known options" cache accumulates entries over time, so the preloaded
 * values only need to seed it once. Re-mapping on every render would
 * be redundant and could cause unnecessary re-renders.
 */
export function useInitialComboboxOptions<T>(
  items: T[] | undefined,
  mapper: (_item: T) => ComboboxOption
): ComboboxOption[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => (items ?? []).map(mapper), []);
}

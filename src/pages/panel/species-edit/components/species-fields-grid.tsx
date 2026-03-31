import { DomainComboboxAsync } from "@/components/domain-combobox-async";
import { SpeciesComboboxAsync } from "@/components/species-combobox-async";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TFunction } from "i18next";
import { Info } from "lucide-react";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { DETAIL_VALUE_TEXT_CLASS } from "../constants";
import type { SpeciesEditFieldConfig, SpeciesEditFieldName, SpeciesEditFormValues } from "../types";
import { getFieldDisplayValue, resolveOptionLabel } from "../utils";

type SpeciesFieldsGridProps = {
  form: UseFormReturn<SpeciesEditFormValues>;
  visibleFields: SpeciesEditFieldConfig[];
  isViewMode: boolean;
  locale: string;
  viewValueOverrides?: Partial<Record<SpeciesEditFieldName, string>>;
  excludeSpeciesId?: number;
  t: TFunction;
};

export function SpeciesFieldsGrid({
  form,
  visibleFields,
  isViewMode,
  locale,
  viewValueOverrides,
  excludeSpeciesId,
  t,
}: SpeciesFieldsGridProps) {
  const triStateFieldNames = new Set([
    "edible",
    "lum_mycelium",
    "lum_basidiome",
    "lum_stipe",
    "lum_pileus",
    "lum_lamellae",
    "lum_spores",
  ]);

  const getNormalizedSelectValue = (name: SpeciesEditFieldName, value: unknown) => {
    if (triStateFieldNames.has(name)) {
      if (value === true) return "true";
      if (value === false) return "false";
      if (value === null || value === undefined) return "unknown";

      const normalized = String(value ?? "")
        .trim()
        .toLowerCase();
      if (normalized === "true" || normalized === "false" || normalized === "unknown") {
        return normalized;
      }
      return "unknown";
    }

    if (name === "is_visible") {
      if (value === true) return "true";
      if (value === false) return "false";

      const normalized = String(value ?? "")
        .trim()
        .toLowerCase();
      return normalized === "true" ? "true" : "false";
    }

    return String(value ?? "").trim();
  };

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const label = new Intl.DateTimeFormat(locale, { month: "long" }).format(
          new Date(2020, index, 1)
        );
        return {
          value: String(month),
          label: label.charAt(0).toUpperCase() + label.slice(1),
        };
      }),
    [locale]
  );

  const getMonthLabel = (value: string) =>
    monthOptions.find((option) => option.value === value)?.label;
  const hasSeasonEndField = visibleFields.some((field) => field.name === "season_end_month");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {visibleFields.map((fieldConfig) => {
        if (fieldConfig.name === "season_end_month" && hasSeasonEndField) {
          return null;
        }

        if (fieldConfig.name === "season_start_month" && hasSeasonEndField) {
          const startFieldConfig = fieldConfig;
          const endFieldConfig = visibleFields.find(
            (field) => field.name === "season_end_month"
          ) as SpeciesEditFieldConfig | undefined;

          if (!endFieldConfig) return null;

          const seasonStartValue = String(form.watch("season_start_month") ?? "");
          const seasonEndValue = String(form.watch("season_end_month") ?? "");

          return (
            <div key="season-range" className="md:col-span-2">
              <p className="mb-2 text-sm font-medium tracking-normal text-slate-600">
                {t("panel_page.species_edit_field_seasonality")}
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
                <FormField
                  control={form.control}
                  name="season_start_month"
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
                        {t(startFieldConfig.labelKey)}
                      </FormLabel>
                      {isViewMode ? (
                        <p className={DETAIL_VALUE_TEXT_CLASS}>
                          {seasonStartValue
                            ? getMonthLabel(seasonStartValue) || seasonStartValue
                            : t("panel_page.species_edit_empty_value")}
                        </p>
                      ) : (
                        <Select value={String(field.value ?? "")} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-200 [&_svg]:text-slate-500">
                              <SelectValue placeholder={t(startFieldConfig.placeholderKey)} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monthOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {!isViewMode ? <FormMessage /> : null}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="season_end_month"
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
                        {t(endFieldConfig.labelKey)}
                      </FormLabel>
                      {isViewMode ? (
                        <p className={DETAIL_VALUE_TEXT_CLASS}>
                          {seasonEndValue
                            ? getMonthLabel(seasonEndValue) || seasonEndValue
                            : t("panel_page.species_edit_empty_value")}
                        </p>
                      ) : (
                        <Select value={String(field.value ?? "")} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-200 [&_svg]:text-slate-500">
                              <SelectValue placeholder={t(endFieldConfig.placeholderKey)} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monthOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {!isViewMode ? <FormMessage /> : null}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        }

        return (
          <div key={fieldConfig.name} className={fieldConfig.fullWidth ? "md:col-span-2" : ""}>
            <FormField
              control={form.control}
              name={fieldConfig.name}
              render={({ field }) => {
                const rawFieldValue = String(field.value ?? "");
                const normalizedFieldValue =
                  fieldConfig.inputType === "select"
                    ? getNormalizedSelectValue(fieldConfig.name, field.value)
                    : rawFieldValue;
                const overrideViewValue = viewValueOverrides?.[fieldConfig.name];
                const showMycoBankSyncTooltip =
                  !isViewMode && fieldConfig.name === "mycobank_index_fungorum_id";

                return (
                  <FormItem className="gap-1">
                    <div className="flex items-center gap-1.5">
                      <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
                        {t(fieldConfig.labelKey)}
                      </FormLabel>
                      {showMycoBankSyncTooltip ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center text-slate-500 transition-colors hover:text-slate-700"
                                aria-label={t("panel_page.species_edit_mycobank_sync_tooltip")}
                              >
                                <Info className="size-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              {t("panel_page.species_edit_mycobank_sync_tooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                    </div>
                    {isViewMode ? (
                      <p
                        className={
                          fieldConfig.inputType === "textarea"
                            ? `${DETAIL_VALUE_TEXT_CLASS} whitespace-pre-wrap`
                            : DETAIL_VALUE_TEXT_CLASS
                        }
                      >
                        {overrideViewValue !== undefined
                          ? overrideViewValue || t("panel_page.species_edit_empty_value")
                          : getFieldDisplayValue(fieldConfig, normalizedFieldValue, t)}
                      </p>
                    ) : fieldConfig.inputType === "species-multi-async" ? (
                      <FormControl>
                        <SpeciesComboboxAsync
                          variant="light"
                          excludeSpeciesId={excludeSpeciesId}
                          value={Array.isArray(field.value) ? field.value : []}
                          onSelect={field.onChange}
                          placeholder={t(fieldConfig.placeholderKey)}
                        />
                      </FormControl>
                    ) : fieldConfig.inputType === "domain-multi-async" && fieldConfig.domain ? (
                      <FormControl>
                        <DomainComboboxAsync
                          variant="light"
                          domain={fieldConfig.domain}
                          multiple
                          value={Array.isArray(field.value) ? field.value : []}
                          onSelect={(nextValues) => {
                            const normalizedIds = nextValues
                              .map((value) => Number(value))
                              .filter((value) => Number.isFinite(value));
                            field.onChange(normalizedIds);
                          }}
                          placeholder={t(fieldConfig.placeholderKey)}
                        />
                      </FormControl>
                    ) : fieldConfig.inputType === "select" ? (
                      <Select value={normalizedFieldValue} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-200 [&_svg]:text-slate-500">
                            <SelectValue placeholder={t(fieldConfig.placeholderKey)} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fieldConfig.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {resolveOptionLabel(option, t)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : fieldConfig.inputType === "textarea" ? (
                      <FormControl>
                        <Textarea
                          value={rawFieldValue}
                          onChange={field.onChange}
                          rows={fieldConfig.rows ?? 3}
                          placeholder={t(fieldConfig.placeholderKey)}
                          spellCheck={false}
                          className="field-sizing-fixed min-h-28 text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
                        />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <Input
                          type={fieldConfig.inputType}
                          value={rawFieldValue}
                          onChange={field.onChange}
                          placeholder={t(fieldConfig.placeholderKey)}
                          spellCheck={false}
                          inputMode={fieldConfig.inputType === "number" ? "decimal" : undefined}
                          className="text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
                        />
                      </FormControl>
                    )}
                    {!isViewMode ? <FormMessage /> : null}
                  </FormItem>
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

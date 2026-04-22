import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { TFunction } from "i18next";
import type { UseFormReturn } from "react-hook-form";
import { DETAIL_VALUE_TEXT_CLASS } from "../constants";
import type { SpeciesEditFormValues } from "../types";

type CultivationFieldsProps = {
  form: UseFormReturn<SpeciesEditFormValues>;
  isViewMode: boolean;
  t: TFunction;
};

export function CultivationFields({ form, isViewMode, t }: CultivationFieldsProps) {
  const cultivationPossible = form.watch("cultivation_possible");

  if (cultivationPossible !== "true") return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="cultivation_pt"
        render={({ field }) => (
          <FormItem className="gap-1">
            <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
              {t("panel_page.species_edit_field_cultivation_pt")}
            </FormLabel>
            {isViewMode ? (
              <p className={`${DETAIL_VALUE_TEXT_CLASS} whitespace-pre-wrap`}>
                {String(field.value ?? "") || t("panel_page.species_edit_empty_value")}
              </p>
            ) : (
              <FormControl>
                <Textarea
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  rows={3}
                  placeholder={t("panel_page.species_edit_cultivation_pt_placeholder")}
                  spellCheck={false}
                  className="field-sizing-fixed min-h-28 text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
                />
              </FormControl>
            )}
            {!isViewMode ? <FormMessage /> : null}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cultivation"
        render={({ field }) => (
          <FormItem className="gap-1">
            <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
              {t("panel_page.species_edit_field_cultivation")}
            </FormLabel>
            {isViewMode ? (
              <p className={`${DETAIL_VALUE_TEXT_CLASS} whitespace-pre-wrap`}>
                {String(field.value ?? "") || t("panel_page.species_edit_empty_value")}
              </p>
            ) : (
              <FormControl>
                <Textarea
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  rows={3}
                  placeholder={t("panel_page.species_edit_cultivation_placeholder")}
                  spellCheck={false}
                  className="field-sizing-fixed min-h-28 text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
                />
              </FormControl>
            )}
            {!isViewMode ? <FormMessage /> : null}
          </FormItem>
        )}
      />
    </div>
  );
}

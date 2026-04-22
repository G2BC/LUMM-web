import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TFunction } from "i18next";
import type { UseFormReturn } from "react-hook-form";
import { LUMINESCENT_FIELDS, TRISTATE_SELECT_OPTIONS } from "../constants";
import type { SpeciesEditFormValues } from "../types";
import { getLuminescentLevelClass } from "../utils";
import { FormSection } from "./form-section";

type LuminescenceEditSectionProps = {
  form: UseFormReturn<SpeciesEditFormValues>;
  t: TFunction;
};

export function LuminescenceEditSection({ form, t }: LuminescenceEditSectionProps) {
  return (
    <FormSection title={t("species_page.lumm.section_title")}>
      <div className="space-y-1">
        {LUMINESCENT_FIELDS.map((lumField, index) => (
          <FormField
            key={lumField.key}
            control={form.control}
            name={lumField.key}
            render={({ field }) => (
              <FormItem
                className={`gap-2 px-3 py-2 ${index < LUMINESCENT_FIELDS.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <FormLabel
                    className={`flex items-center text-sm leading-6 tracking-normal font-normal text-slate-900 ${getLuminescentLevelClass(lumField.level)}`}
                  >
                    {lumField.level > 0 ? (
                      <span className="mr-2 text-slate-400" aria-hidden>
                        ↳
                      </span>
                    ) : null}
                    {t(lumField.labelKey)}
                  </FormLabel>
                  <Select value={String(field.value ?? "unknown")} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full md:w-56 text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-200 [&_svg]:text-slate-500">
                        <SelectValue
                          placeholder={t("panel_page.species_edit_luminescence_placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRISTATE_SELECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </FormSection>
  );
}

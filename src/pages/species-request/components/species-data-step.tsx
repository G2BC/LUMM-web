import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LUMINESCENT_PART_OPTIONS } from "@/pages/species-request/constants";
import { Textarea } from "@/components/ui/textarea";
import type { SpeciesRequestFormValues } from "@/pages/species-request/types";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SpeciesDataStepProps = {
  form: UseFormReturn<SpeciesRequestFormValues>;
};

export function SpeciesDataStep({ form }: SpeciesDataStepProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <FormField
        control={form.control}
        name="luminescent_parts"
        render={({ field }) => {
          const selected = field.value ?? {};
          const togglePart = (id: (typeof LUMINESCENT_PART_OPTIONS)[number]["id"]) => {
            const next = { ...selected };
            if (next[id] && next[id] !== "none") {
              next[id] = "none";
              field.onChange(next);
              return;
            }
            next[id] = "add";
            field.onChange(next);
          };
          const setAction = (
            id: (typeof LUMINESCENT_PART_OPTIONS)[number]["id"],
            action: "none" | "add" | "remove"
          ) => {
            field.onChange({
              ...selected,
              [id]: action,
            });
          };

          return (
            <FormItem>
              <FormLabel>{t("species_request.luminescent_parts")}</FormLabel>
              <p className="text-xs text-white/70">{t("species_request.luminescent_parts_help")}</p>
              <FormControl>
                <div className="grid gap-2 pt-1 md:grid-cols-2">
                  {LUMINESCENT_PART_OPTIONS.map((option) => {
                    const action = selected[option.id];
                    const isSelected = action === "add" || action === "remove";
                    return (
                      <div
                        key={option.id}
                        className="rounded-md border border-white/15 bg-black/20 p-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm">{t(option.labelKey)}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => togglePart(option.id)}
                            className={
                              isSelected ? "bg-slate-200 text-black hover:bg-slate-300" : ""
                            }
                          >
                            {isSelected
                              ? t("species_request.lum_part_toggle_clear")
                              : t("species_request.lum_part_toggle_enable")}
                          </Button>
                        </div>

                        {isSelected ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setAction(option.id, "add")}
                              className={
                                action === "add"
                                  ? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                                  : "border-emerald-500/80 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                              }
                            >
                              {t("species_page.lumm.yes")}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setAction(option.id, "remove")}
                              className={
                                action === "remove"
                                  ? "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:text-white"
                                  : "border-red-500/80 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              }
                            >
                              {t("species_page.lumm.no")}
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="references_raw"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("species_request.references_raw")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                rows={4}
                placeholder={t("species_request.references_raw_placeholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="request_note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("species_request.request_note")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                rows={3}
                placeholder={t("species_request.request_note_placeholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}

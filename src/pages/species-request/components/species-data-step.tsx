import { Button } from "@/components/ui/button";
import { DomainComboboxAsync } from "@/components/domain-combobox-async";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LUMINESCENT_PART_OPTIONS } from "@/pages/species-request/constants";
import { Textarea } from "@/components/ui/textarea";
import type { SpeciesRequestFormValues } from "@/pages/species-request/types";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SpeciesDataStepProps = {
  form: UseFormReturn<SpeciesRequestFormValues>;
};

function StepSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-white/70">{title}</h3>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">{children}</div>
    </div>
  );
}

export function SpeciesDataStep({ form }: SpeciesDataStepProps) {
  const { t, i18n } = useTranslation();
  const cultivationPossible = form.watch("cultivation_possible");
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const label = new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(
      new Date(2020, index, 1)
    );
    return {
      value: String(month),
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });

  return (
    <section className="space-y-4">
      <StepSection title={t("species_request.section_characteristics")}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="growth_forms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.growth_forms")}</FormLabel>
                <FormControl>
                  <DomainComboboxAsync
                    domain="growth_form"
                    multiple
                    value={field.value ?? []}
                    onSelect={field.onChange}
                    placeholder={t("species_request.domain_multi_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nutrition_modes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.nutrition_modes")}</FormLabel>
                <FormControl>
                  <DomainComboboxAsync
                    domain="nutrition_mode"
                    multiple
                    value={field.value ?? []}
                    onSelect={field.onChange}
                    placeholder={t("species_request.domain_multi_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="substrates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.substrates")}</FormLabel>
                <FormControl>
                  <DomainComboboxAsync
                    domain="substrate"
                    multiple
                    value={field.value ?? []}
                    onSelect={field.onChange}
                    placeholder={t("species_request.domain_multi_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="habitats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.habitats")}</FormLabel>
                <FormControl>
                  <DomainComboboxAsync
                    domain="habitat"
                    multiple
                    value={field.value ?? []}
                    onSelect={field.onChange}
                    placeholder={t("species_request.domain_multi_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="size_cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.size_cm")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    placeholder={t("species_request.size_cm_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.colors")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder={t("species_request.colors_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </StepSection>

      <StepSection title={t("species_request.section_occurrence")}>
        <FormField
          control={form.control}
          name="finding_tips"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.finding_tips")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={3}
                  placeholder={t("species_request.finding_tips_placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nearby_trees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.nearby_trees")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={2}
                  placeholder={t("species_request.nearby_trees_placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>{t("species_request.seasonality")}</FormLabel>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="season_start_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("species_request.season_start_month")}</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("species_request.season_start_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="season_end_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("species_request.season_end_month")}</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("species_request.season_end_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="cultivation_possible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.cultivation_possible")}</FormLabel>
              <FormControl>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("species_request.cultivation_possible_placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("species_page.lumm.yes")}</SelectItem>
                    <SelectItem value="false">{t("species_page.lumm.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {cultivationPossible === "true" ? (
          <FormField
            control={form.control}
            name="cultivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species_request.cultivation")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    rows={3}
                    placeholder={t("species_request.cultivation_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </StepSection>

      <StepSection title={t("species_request.section_luminescence")}>
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
                <p className="text-xs text-white/70">
                  {t("species_request.luminescent_parts_help")}
                </p>
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
      </StepSection>

      <StepSection title={t("species_request.section_description")}>
        <FormField
          control={form.control}
          name="curiosities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.curiosities")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={3}
                  placeholder={t("species_request.curiosities_placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="general_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.general_description")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                  placeholder={t("species_request.general_description_placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </StepSection>

      <StepSection title={t("species_request.section_references")}>
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
      </StepSection>
    </section>
  );
}

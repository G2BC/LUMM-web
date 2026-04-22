import { createSpecies } from "@/api/species";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HoverPopover } from "@/components/hover-popover";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalizedError } from "@/api/get-localized-error";
import { ArrowLeft, Info, Loader2 } from "lucide-react";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import type { UseFormReturn } from "react-hook-form";
import { CultivationFields } from "../species-edit/components/cultivation-fields";
import { FormSection } from "../species-edit/components/form-section";
import { LuminescenceEditSection } from "../species-edit/components/luminescence-edit-section";
import { SpeciesFieldsGrid } from "../species-edit/components/species-fields-grid";
import { SPECIES_EDIT_FIELDS, SPECIES_EDIT_FORM_INITIAL_VALUES } from "../species-edit/constants";
import type { SpeciesEditFieldName, SpeciesEditFormValues } from "../species-edit/types";
import { createSpeciesCreateSchema } from "./schema";
import type { SpeciesCreateFormValues } from "./types";
import { buildCreateSpeciesPayload } from "./utils";

const SPECIES_CREATE_FORM_INITIAL_VALUES: SpeciesCreateFormValues = {
  ...SPECIES_EDIT_FORM_INITIAL_VALUES,
  scientific_name: "",
  inaturalist_taxon_id: "",
  unite_taxon_id: "",
};

function PanelSpeciesCreatePage() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const locale = lang ?? DEFAULT_LOCALE;
  const schema = useMemo(() => createSpeciesCreateSchema(t), [t]);
  const fieldConfigByName = useMemo(
    () => new Map(SPECIES_EDIT_FIELDS.map((field) => [field.name, field])),
    []
  );

  const pickEditableFields = useMemo(
    () => (names: SpeciesEditFieldName[]) =>
      names
        .map((name) => fieldConfigByName.get(name))
        .filter((field): field is (typeof SPECIES_EDIT_FIELDS)[number] => Boolean(field))
        .filter((field) => !field.detailOnly),
    [fieldConfigByName]
  );

  const identityFields = useMemo(
    () => pickEditableFields(["type_country", "lineage", "inaturalist_taxon_id", "unite_taxon_id"]),
    [pickEditableFields]
  );

  const trophicFields = useMemo(
    () => pickEditableFields(["growth_forms", "size_cm", "nutrition_modes"]),
    [pickEditableFields]
  );
  const substrateFields = useMemo(() => pickEditableFields(["substrates"]), [pickEditableFields]);
  const habitatFields = useMemo(() => pickEditableFields(["habitats"]), [pickEditableFields]);
  const distributionFields = useMemo(
    () =>
      pickEditableFields([
        "distributions",
        "similar_species_ids",
        "season_start_month",
        "season_end_month",
        "edible",
        "cultivation_possible",
        "finding_tips_pt",
        "finding_tips",
        "colors_pt",
        "colors",
        "nearby_trees_pt",
        "nearby_trees",
        "curiosities_pt",
        "curiosities",
        "general_description_pt",
        "general_description",
      ]),
    [pickEditableFields]
  );

  const form = useForm<SpeciesCreateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: SPECIES_CREATE_FORM_INITIAL_VALUES,
  });

  async function handleSubmit(values: SpeciesCreateFormValues) {
    const payload = buildCreateSpeciesPayload(values);

    try {
      const createdSpecies = await createSpecies(payload);
      const createdSpeciesId = Number(createdSpecies?.id);

      await Alert({
        icon: "success",
        title: t("panel_page.species_create_success_title"),
        text: t("panel_page.species_create_success_text"),
      });

      const destination = Number.isFinite(createdSpeciesId)
        ? `/${locale}/painel/especies/${createdSpeciesId}/detalhes${location.search}`
        : `/${locale}/painel/especies${location.search}`;
      navigate(destination, { replace: true });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    }
  }

  const backToSpeciesListPath = `/${locale}/painel/especies${location.search}`;

  const hasShownAlert = useRef(false);

  return (
    <section className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {t("panel_page.species_create_title")}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t("panel_page.species_create_subtitle")}</p>
        </div>
        <Button variant="outline" className="w-full md:w-auto" asChild>
          <Link to={backToSpeciesListPath}>
            <ArrowLeft className="h-4 w-4" />
            {t("panel_page.species_edit_back")}
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => void handleSubmit(values))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="is_visible"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
                  {t("panel_page.species_edit_field_is_visible")}
                </FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={field.value}
                    onValueChange={(value) => {
                      if (!value) return;
                      field.onChange(value);
                    }}
                    className="w-fit"
                  >
                    <ToggleGroupItem
                      value="true"
                      className="data-[state=on]:border-[#118A2A] data-[state=on]:bg-[#118A2A] data-[state=on]:text-white hover:data-[state=on]:bg-[#0E7323]"
                    >
                      {t("species_page.lumm.yes")}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="false"
                      className="data-[state=on]:border-rose-600 data-[state=on]:bg-rose-600 data-[state=on]:text-white hover:data-[state=on]:bg-rose-700"
                    >
                      {t("species_page.lumm.no")}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LuminescenceEditSection
            form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
            t={t}
          />

          <FormSection title={t("panel_page.species_section_taxonomy")}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="scientific_name"
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <div className="flex items-center gap-1.5">
                        <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
                          {t("panel_page.species_create_field_scientific_name")}
                        </FormLabel>
                        <HoverPopover
                          trigger={
                            <Info className="size-4 text-slate-500 transition-colors hover:text-slate-700" />
                          }
                          content={t("panel_page.species_create_scientific_name_sync_tooltip")}
                        />
                      </div>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("panel_page.species_create_scientific_name_placeholder")}
                          spellCheck={false}
                          className="text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mycobank_index_fungorum_id"
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <div className="flex items-center gap-1.5">
                        <FormLabel className="text-sm font-medium tracking-normal text-slate-600">
                          {t("panel_page.species_edit_field_mycobank_id")}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          onClick={() => {
                            if (hasShownAlert.current) return;
                            hasShownAlert.current = true;
                            Alert({
                              title: t("common.warning"),
                              icon: "warning",
                              text: t("panel_page.species_create_mycobank_sync_tooltip"),
                              confirmButtonText: t("common.continue"),
                            }).then(() => null);
                          }}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("panel_page.species_edit_mycobank_id_placeholder")}
                          spellCheck={false}
                          className="text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SpeciesFieldsGrid
                form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
                visibleFields={identityFields}
                isViewMode={false}
                locale={i18n.language}
                t={t}
              />
            </div>
          </FormSection>

          <FormSection title={t("panel_page.species_section_ecological_attributes")}>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_trophic")}
                </p>
                <SpeciesFieldsGrid
                  form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
                  visibleFields={trophicFields}
                  isViewMode={false}
                  locale={i18n.language}
                  t={t}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_substrate")}
                </p>
                <SpeciesFieldsGrid
                  form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
                  visibleFields={substrateFields}
                  isViewMode={false}
                  locale={i18n.language}
                  t={t}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_habitat")}
                </p>
                <SpeciesFieldsGrid
                  form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
                  visibleFields={habitatFields}
                  isViewMode={false}
                  locale={i18n.language}
                  t={t}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_distribution")}
                </p>
                <SpeciesFieldsGrid
                  form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
                  visibleFields={distributionFields}
                  isViewMode={false}
                  locale={i18n.language}
                  t={t}
                />
                <CultivationFields
                  form={form as unknown as UseFormReturn<SpeciesEditFormValues>}
                  isViewMode={false}
                  t={t}
                />
              </div>
            </div>
          </FormSection>

          <div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("panel_page.species_edit_submitting")}
                </>
              ) : (
                t("panel_page.species_create_submit")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export default PanelSpeciesCreatePage;

import { deleteSpecies, fetchSpecies, updateSpecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLocalizedError } from "@/api/get-localized-error";
import { ArrowLeft, Edit2, ExternalLink, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { LuminescenceEditSection } from "./components/luminescence-edit-section";
import { LuminescenceViewSection } from "./components/luminescence-view-section";
import { SpeciesFieldsGrid } from "./components/species-fields-grid";
import { SPECIES_EDIT_FIELDS, SPECIES_EDIT_FORM_INITIAL_VALUES } from "./constants";
import { createSpeciesEditSchema } from "./schema";
import type { SpeciesEditFormValues } from "./types";
import {
  buildDomainViewValueMap,
  buildLuminescentRows,
  buildSpeciesUpdatePayload,
  createSpeciesEditFormDefaults,
} from "./utils";

type SpeciesEditPageProps = {
  viewMode?: boolean;
};

function SpeciesEditPage({ viewMode = false }: SpeciesEditPageProps) {
  const { t, i18n } = useTranslation();
  const { lang, species } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeletingSpecies, setIsDeletingSpecies] = useState(false);

  const locale = lang ?? DEFAULT_LOCALE;
  const isViewMode = viewMode;
  const backToSpeciesListPath = `/${locale}/painel/especies${location.search}`;

  const schema = useMemo(() => createSpeciesEditSchema(t), [t]);

  const form = useForm<SpeciesEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: SPECIES_EDIT_FORM_INITIAL_VALUES,
  });

  const {
    data: speciesData,
    isLoading: isLoadingSpecies,
    isError: hasLoadError,
  } = useQuery({
    queryKey: speciesKeys.detail(species!),
    queryFn: ({ signal }) => fetchSpecies(species, signal),
    enabled: !!species,
  });

  useEffect(() => {
    if (!speciesData) return;
    form.reset(createSpeciesEditFormDefaults(speciesData));
  }, [form, speciesData]);

  async function handleSubmit(values: SpeciesEditFormValues) {
    if (!speciesData) return;

    const originalValues = createSpeciesEditFormDefaults(speciesData);
    const payload = buildSpeciesUpdatePayload(values, originalValues);

    if (Object.keys(payload).length === 0) {
      await Alert({
        icon: "warning",
        title: t("panel_page.species_edit_no_changes_title"),
        text: t("panel_page.species_edit_no_changes_text"),
      });
      return;
    }

    try {
      await updateSpecies(speciesData.id, payload);
      await queryClient.invalidateQueries({ queryKey: speciesKeys.detail(species!) });

      await Alert({
        icon: "success",
        title: t("panel_page.species_edit_update_success_title"),
        text: t("panel_page.species_edit_update_success_text"),
      });

      const detailsPath = `/${locale}/painel/especies/${speciesData.id}/detalhes${location.search}`;
      navigate(detailsPath, { replace: true });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    }
  }

  async function handleDeleteSpecies() {
    if (!speciesData?.id || isDeletingSpecies) return;

    const confirmed = await confirmAction({
      title: t("panel_page.species_delete_confirm_title"),
      text: t("panel_page.species_delete_confirm_text", { species: speciesData.scientific_name }),
      confirmButtonText: t("panel_page.species_delete_confirm_yes"),
      cancelButtonText: t("panel_page.species_delete_confirm_no"),
      requireCode: true,
      codeLabel: t("panel_page.species_delete_confirm_code_label"),
      codePlaceholder: t("panel_page.species_delete_confirm_code_placeholder"),
      codeInvalidMessage: t("panel_page.species_delete_confirm_code_invalid"),
    });

    if (!confirmed) return;

    setIsDeletingSpecies(true);
    try {
      await runWithSilencedApiErrors(() => deleteSpecies(speciesData.id));
      queryClient.removeQueries({ queryKey: speciesKeys.detail(speciesData.id) });
      await queryClient.invalidateQueries({ queryKey: speciesKeys.lists() });

      await Alert({
        icon: "success",
        title: t("panel_page.species_delete_success_title"),
        text: t("panel_page.species_delete_success_text"),
      });

      navigate(backToSpeciesListPath, { replace: true });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    } finally {
      setIsDeletingSpecies(false);
    }
  }

  if (isLoadingSpecies) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("panel_page.loading_species")}
      </div>
    );
  }

  if (!isLoadingSpecies && hasLoadError) {
    return (
      <div className="rounded-lg border border-dashed border-red-300 px-4 py-8 text-center">
        <p className="text-sm text-red-700">{t("panel_page.species_edit_load_error")}</p>
      </div>
    );
  }

  if (!speciesData) return null;

  const pageSubtitle = isViewMode
    ? t("panel_page.species_details_subtitle")
    : t("panel_page.species_edit_subtitle");
  const visibleFields = SPECIES_EDIT_FIELDS.filter(
    (field) => (isViewMode || !field.detailOnly) && (isViewMode || field.name !== "is_visible")
  );
  const luminescentRows = buildLuminescentRows(speciesData, t);
  const domainViewValueMap = buildDomainViewValueMap(
    speciesData,
    i18n.language.toLowerCase().startsWith("pt")
  );
  const publicSpeciesPath = `/${locale}/especie/${speciesData.id}`;
  const editSpeciesPath = `/${locale}/painel/especies/${speciesData.id}/editar${location.search}`;

  return (
    <section className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 italic">
            {speciesData.scientific_name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{pageSubtitle}</p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <Button variant="outline" className="w-full md:w-auto" asChild>
            <Link to={backToSpeciesListPath}>
              <ArrowLeft className="h-4 w-4" />
              {t("panel_page.species_edit_back")}
            </Link>
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto" disabled={isDeletingSpecies}>
                <MoreHorizontal className="h-4 w-4" />
                {t("panel_page.col_actions")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isViewMode ? (
                <DropdownMenuItem asChild>
                  <Link to={editSpeciesPath}>
                    <Edit2 className="h-4 w-4" />
                    {t("panel_page.action_manage")}
                  </Link>
                </DropdownMenuItem>
              ) : null}
              {isViewMode ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem asChild>
                <Link to={publicSpeciesPath} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  {t("panel_page.species_photos_open_public")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => void handleDeleteSpecies()}
                disabled={isDeletingSpecies}
              >
                <Trash2 className="h-4 w-4" />
                {t("panel_page.species_delete_action")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => void handleSubmit(values))}
          className="space-y-4"
        >
          {!isViewMode ? (
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
          ) : null}

          <SpeciesFieldsGrid
            form={form}
            visibleFields={visibleFields}
            isViewMode={isViewMode}
            locale={i18n.language}
            viewValueOverrides={isViewMode ? domainViewValueMap : undefined}
            excludeSpeciesId={speciesData.id}
            t={t}
          />

          {!isViewMode ? <LuminescenceEditSection form={form} t={t} /> : null}
          {isViewMode ? <LuminescenceViewSection rows={luminescentRows} t={t} /> : null}

          {!isViewMode ? (
            <div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("panel_page.species_edit_submitting")}
                  </>
                ) : (
                  t("panel_page.species_edit_submit_pending")
                )}
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
    </section>
  );
}

export default SpeciesEditPage;

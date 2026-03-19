import { fetchSpecies, updateSpecies } from "@/api/species";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
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
  buildLuminescentRows,
  buildSpeciesUpdatePayload,
  buildDomainViewValueMap,
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
  const [speciesData, setSpeciesData] = useState<ISpecie | null>(null);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const locale = lang ?? DEFAULT_LOCALE;
  const isViewMode = viewMode;

  const schema = useMemo(() => createSpeciesEditSchema(t), [t]);

  const form = useForm<SpeciesEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: SPECIES_EDIT_FORM_INITIAL_VALUES,
  });

  useEffect(() => {
    if (!species) return;

    setIsLoadingSpecies(true);
    setHasLoadError(false);

    void fetchSpecies(species)
      .then((data) => setSpeciesData(data))
      .catch(() => {
        setHasLoadError(true);
        setSpeciesData(null);
      })
      .finally(() => setIsLoadingSpecies(false));
  }, [species]);

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
      const refreshedSpeciesData = await fetchSpecies(String(speciesData.id));
      setSpeciesData(refreshedSpeciesData);
      form.reset(createSpeciesEditFormDefaults(refreshedSpeciesData));

      await Alert({
        icon: "success",
        title: t("panel_page.species_edit_update_success_title"),
        text: t("panel_page.species_edit_update_success_text"),
      });

      const detailsPath = `/${locale}/painel/especies/${speciesData.id}/detalhes${location.search}`;
      navigate(detailsPath, { replace: true });
    } catch (error) {
      const backendMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;

      await Alert({
        icon: "error",
        title: t("panel_page.species_edit_update_error_title"),
        text: backendMessage || t("panel_page.species_edit_update_error_text"),
      });
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
  const visibleFields = SPECIES_EDIT_FIELDS.filter((field) => isViewMode || !field.detailOnly);
  const luminescentRows = buildLuminescentRows(speciesData, t);
  const domainViewValueMap = buildDomainViewValueMap(
    speciesData,
    i18n.language.toLowerCase().startsWith("pt")
  );
  const backToSpeciesListPath = `/${locale}/painel/especies${location.search}`;

  return (
    <section className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 italic">
            {speciesData.scientific_name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{pageSubtitle}</p>
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

import { Form } from "@/components/ui/form";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router";
import { LuminescenceEditSection } from "./components/luminescence-edit-section";
import { LuminescenceViewSection } from "./components/luminescence-view-section";
import { SpeciesEditHeader } from "./components/species-edit-header";
import { SpeciesEditSubmit } from "./components/species-edit-submit";
import { SpeciesFieldsGrid } from "./components/species-fields-grid";
import { SpeciesVisibilityField } from "./components/species-visibility-field";
import { useSpeciesDelete } from "./hooks/use-species-delete";
import { useSpeciesEditForm } from "./hooks/use-species-edit-form";

type SpeciesEditPageProps = {
  viewMode?: boolean;
};

function SpeciesEditPage({ viewMode = false }: SpeciesEditPageProps) {
  const { t } = useTranslation();
  const { lang, species } = useParams();
  const location = useLocation();

  const locale = lang ?? DEFAULT_LOCALE;
  const backToSpeciesListPath = `/${locale}/painel/especies${location.search}`;

  const {
    form,
    speciesData,
    isLoadingSpecies,
    hasLoadError,
    isFormReady,
    visibleFields,
    luminescentRows,
    domainViewValueMap,
    domainPreloadedOptions,
    distributionPreloadedOptions,
    similarSpeciesPreloadedOptions,
    handleSubmit,
    i18nLanguage,
  } = useSpeciesEditForm({ species, isViewMode: viewMode, locale });

  const { isDeletingSpecies, handleDeleteSpecies } = useSpeciesDelete({
    speciesId: speciesData?.id,
    speciesName: speciesData?.scientific_name,
    backPath: backToSpeciesListPath,
  });

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

  if (!speciesData || !isFormReady) return null;

  const pageSubtitle = viewMode
    ? t("panel_page.species_details_subtitle")
    : t("panel_page.species_edit_subtitle");

  return (
    <section className="space-y-6 text-slate-900">
      <SpeciesEditHeader
        scientificName={speciesData.scientific_name}
        subtitle={pageSubtitle}
        backPath={backToSpeciesListPath}
        editPath={`/${locale}/painel/especies/${speciesData.id}/editar${location.search}`}
        publicPath={`/${locale}/especie/${speciesData.id}`}
        photosPath={`/${locale}/painel/especies/${speciesData.id}/fotos${location.search}`}
        referencesPath={`/${locale}/painel/especies/${speciesData.id}/referencias${location.search}`}
        isViewMode={viewMode}
        isDeletingSpecies={isDeletingSpecies}
        onDelete={handleDeleteSpecies}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => void handleSubmit(values))}
          className="space-y-4"
        >
          {!viewMode ? <SpeciesVisibilityField form={form} t={t} /> : null}

          <SpeciesFieldsGrid
            form={form}
            visibleFields={visibleFields}
            isViewMode={viewMode}
            locale={i18nLanguage}
            viewValueOverrides={viewMode ? domainViewValueMap : undefined}
            excludeSpeciesId={speciesData.id}
            domainPreloadedOptions={!viewMode ? domainPreloadedOptions : undefined}
            distributionPreloadedOptions={!viewMode ? distributionPreloadedOptions : undefined}
            similarSpeciesPreloadedOptions={!viewMode ? similarSpeciesPreloadedOptions : undefined}
            t={t}
          />

          {!viewMode ? <LuminescenceEditSection form={form} t={t} /> : null}
          {viewMode ? <LuminescenceViewSection rows={luminescentRows} t={t} /> : null}

          {!viewMode ? (
            <SpeciesEditSubmit isSubmitting={form.formState.isSubmitting} t={t} />
          ) : null}
        </form>
      </Form>
    </section>
  );
}

export default SpeciesEditPage;

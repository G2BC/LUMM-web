import { Form } from "@/components/ui/form";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router";
import { FormSection } from "./components/form-section";
import { LuminescenceEditSection } from "./components/luminescence-edit-section";
import { LuminescenceViewSection } from "./components/luminescence-view-section";
import { SpeciesEditHeader } from "./components/species-edit-header";
import { SpeciesEditSubmit } from "./components/species-edit-submit";
import { SpeciesFieldsGrid } from "./components/species-fields-grid";
import { SpeciesVisibilityField } from "./components/species-visibility-field";
import { useSpeciesDelete } from "./hooks/use-species-delete";
import { useSpeciesEditForm } from "./hooks/use-species-edit-form";

const TAXONOMY_FIELDS_ORDER = [
  "type_country",
  "lineage",
  "mycobank_index_fungorum_id",
  "ncbi_taxonomy_id",
  "inaturalist_taxon_id",
  "unite_taxon_id",
] as const;

const TAXONOMY_FIELD_NAMES = new Set<string>(TAXONOMY_FIELDS_ORDER);

const TROPHIC_FIELDS_ORDER = [
  "growth_forms",
  "size_cm",
  "colors_pt",
  "colors",
  "nutrition_modes",
] as const;
const SUBSTRATE_FIELDS_ORDER = ["substrates", "decay_types"] as const;
const HABITAT_FIELDS_ORDER = ["habitats"] as const;
const DISTRIBUTION_FIELDS_ORDER = [
  "distributions",
  "similar_species_ids",
  "season_start_month",
  "season_end_month",
  "edible",
  "cultivation_possible",
  "cultivation_pt",
  "cultivation",
  "finding_tips_pt",
  "finding_tips",
  "nearby_trees_pt",
  "nearby_trees",
  "curiosities_pt",
  "curiosities",
  "general_description_pt",
  "general_description",
] as const;

const ECOLOGICAL_FIELD_NAMES = new Set<string>([
  ...TROPHIC_FIELDS_ORDER,
  ...SUBSTRATE_FIELDS_ORDER,
  ...HABITAT_FIELDS_ORDER,
  ...DISTRIBUTION_FIELDS_ORDER,
]);

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

  const taxonomyFields = useMemo(
    () => TAXONOMY_FIELDS_ORDER.flatMap((name) => visibleFields.filter((f) => f.name === name)),
    [visibleFields]
  );
  const cultivationPossible = form.watch("cultivation_possible");

  const trophicFields = useMemo(
    () => TROPHIC_FIELDS_ORDER.flatMap((name) => visibleFields.filter((f) => f.name === name)),
    [visibleFields]
  );
  const substrateFields = useMemo(
    () => SUBSTRATE_FIELDS_ORDER.flatMap((name) => visibleFields.filter((f) => f.name === name)),
    [visibleFields]
  );
  const habitatFields = useMemo(
    () => HABITAT_FIELDS_ORDER.flatMap((name) => visibleFields.filter((f) => f.name === name)),
    [visibleFields]
  );
  const distributionFields = useMemo(
    () =>
      DISTRIBUTION_FIELDS_ORDER.flatMap((name) => {
        if (
          (name === "cultivation_pt" || name === "cultivation") &&
          cultivationPossible !== "true"
        ) {
          return [];
        }
        return visibleFields.filter((f) => f.name === name);
      }),
    [visibleFields, cultivationPossible]
  );

  const otherFields = useMemo(
    () =>
      visibleFields.filter(
        (f) => !TAXONOMY_FIELD_NAMES.has(f.name) && !ECOLOGICAL_FIELD_NAMES.has(f.name)
      ),
    [visibleFields]
  );

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

          {!viewMode ? <LuminescenceEditSection form={form} t={t} /> : null}
          {viewMode ? <LuminescenceViewSection rows={luminescentRows} t={t} /> : null}

          <FormSection title={t("panel_page.species_section_taxonomy")}>
            <SpeciesFieldsGrid
              form={form}
              visibleFields={taxonomyFields}
              isViewMode={viewMode}
              locale={i18nLanguage}
              viewValueOverrides={viewMode ? domainViewValueMap : undefined}
              excludeSpeciesId={speciesData.id}
              t={t}
            />
          </FormSection>

          <FormSection title={t("panel_page.species_section_ecological_attributes")}>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_trophic")}
                </p>
                <SpeciesFieldsGrid
                  form={form}
                  visibleFields={trophicFields}
                  isViewMode={viewMode}
                  locale={i18nLanguage}
                  viewValueOverrides={viewMode ? domainViewValueMap : undefined}
                  excludeSpeciesId={speciesData.id}
                  domainPreloadedOptions={!viewMode ? domainPreloadedOptions : undefined}
                  t={t}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_substrate")}
                </p>
                <SpeciesFieldsGrid
                  form={form}
                  visibleFields={substrateFields}
                  isViewMode={viewMode}
                  locale={i18nLanguage}
                  viewValueOverrides={viewMode ? domainViewValueMap : undefined}
                  excludeSpeciesId={speciesData.id}
                  domainPreloadedOptions={!viewMode ? domainPreloadedOptions : undefined}
                  t={t}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_habitat")}
                </p>
                <SpeciesFieldsGrid
                  form={form}
                  visibleFields={habitatFields}
                  isViewMode={viewMode}
                  locale={i18nLanguage}
                  viewValueOverrides={viewMode ? domainViewValueMap : undefined}
                  excludeSpeciesId={speciesData.id}
                  domainPreloadedOptions={!viewMode ? domainPreloadedOptions : undefined}
                  t={t}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  {t("species_page.sections.characteristics_distribution")}
                </p>
                <SpeciesFieldsGrid
                  form={form}
                  visibleFields={distributionFields}
                  isViewMode={viewMode}
                  locale={i18nLanguage}
                  viewValueOverrides={viewMode ? domainViewValueMap : undefined}
                  excludeSpeciesId={speciesData.id}
                  domainPreloadedOptions={!viewMode ? domainPreloadedOptions : undefined}
                  distributionPreloadedOptions={
                    !viewMode ? distributionPreloadedOptions : undefined
                  }
                  similarSpeciesPreloadedOptions={
                    !viewMode ? similarSpeciesPreloadedOptions : undefined
                  }
                  t={t}
                />
              </div>
            </div>
          </FormSection>

          {otherFields.length > 0 ? (
            <SpeciesFieldsGrid
              form={form}
              visibleFields={otherFields}
              isViewMode={viewMode}
              locale={i18nLanguage}
              viewValueOverrides={viewMode ? domainViewValueMap : undefined}
              excludeSpeciesId={speciesData.id}
              domainPreloadedOptions={!viewMode ? domainPreloadedOptions : undefined}
              t={t}
            />
          ) : null}

          {!viewMode ? (
            <SpeciesEditSubmit isSubmitting={form.formState.isSubmitting} t={t} />
          ) : null}
        </form>
      </Form>
    </section>
  );
}

export default SpeciesEditPage;

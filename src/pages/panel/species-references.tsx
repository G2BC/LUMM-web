import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { SpeciesReferencesAssociate } from "./components/species-references-associate";
import { SpeciesReferencesCreateForm } from "./components/species-references-form";
import { SpeciesReferencesList } from "./components/species-references-list";
import { useSpeciesReferencesPage } from "./useSpeciesReferencesPage";

export default function PanelSpeciesReferencesPage() {
  const { t } = useTranslation();
  const {
    speciesData,
    speciesSlug,
    isLoadingSpecies,
    hasLoadError,
    locale,
    location,
    selectedReferenceId,
    isAssociating,
    associateMessage,
    fetchReferenceOptions,
    setSelectedReferenceId,
    handleAssociateExisting,
    createFormValues,
    isCreating,
    createMessage,
    updateCreateField,
    handleCreateAndAssociate,
    handleCreateSuccess,
    editingReference,
    editingValues,
    editMessage,
    savingReferenceId,
    openEditDialog,
    closeEditDialog,
    updateEditField,
    handleSaveEdit,
    deletingReferenceId,
    handleDisassociate,
  } = useSpeciesReferencesPage();

  const references = speciesData?.references ?? [];
  const speciesTitle = speciesData?.scientific_name || `#${speciesSlug || ""}`;
  const backToSpeciesListPath = `/${locale}/painel/especies${location.search}`;

  return (
    <section className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("panel_page.species_references_title")}</h2>
          <p className="mt-1 text-slate-600">
            {t("panel_page.species_references_subtitle")} <em>{speciesTitle}</em>
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-end">
          <Button variant="outline" className="w-full md:w-auto" asChild>
            <Link to={backToSpeciesListPath}>
              <ArrowLeft className="h-4 w-4" />
              {t("panel_page.species_references_back")}
            </Link>
          </Button>
          {speciesData?.id ? (
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link
                to={`/${locale}/especie/${speciesData.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("panel_page.species_references_open_public")}
              </Link>
            </Button>
          ) : null}
          <SpeciesReferencesCreateForm
            values={createFormValues}
            message={createMessage}
            isSubmitting={isCreating}
            onChange={updateCreateField}
            onSubmit={() => handleCreateAndAssociate()}
            onSuccess={() => handleCreateSuccess()}
          />
        </div>
      </div>

      <SpeciesReferencesAssociate
        selectedReferenceId={selectedReferenceId}
        message={associateMessage}
        isAssociating={isAssociating}
        fetchOptions={fetchReferenceOptions}
        onSelect={setSelectedReferenceId}
        onAssociate={() => void handleAssociateExisting()}
      />

      <SpeciesReferencesList
        references={references}
        isLoadingSpecies={isLoadingSpecies}
        hasLoadError={hasLoadError}
        savingReferenceId={savingReferenceId}
        deletingReferenceId={deletingReferenceId}
        editingReference={editingReference}
        editingValues={editingValues}
        editMessage={editMessage}
        onEditReference={(ref) => openEditDialog(ref)}
        onDisassociate={(ref) => void handleDisassociate(ref)}
        onCloseEditDialog={closeEditDialog}
        onUpdateEditField={updateEditField}
        onSaveEdit={() => void handleSaveEdit()}
      />
    </section>
  );
}

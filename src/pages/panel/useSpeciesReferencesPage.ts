import {
  associateExistingReference,
  createAndAssociateReference,
  disassociateReference,
  fetchSpecies,
  searchReferences,
  updateReference,
} from "@/api/species";
import type { UpdateReferencePayload } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import type { IReference } from "@/api/types/IReference";
import type { ComboboxOption } from "@/components/combobox-async";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
import { getLocalizedError } from "@/api/get-localized-error";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";

export type CreateReferenceFormValues = {
  apa: string;
  doi: string;
  url: string;
};

export type EditReferenceFormValues = {
  apa: string;
  doi: string;
  url: string;
};

function createDefaultFormValues(): CreateReferenceFormValues {
  return { apa: "", doi: "", url: "" };
}

export function useSpeciesReferencesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, species } = useParams();
  const queryClient = useQueryClient();
  const locale = lang ?? DEFAULT_LOCALE;

  const {
    data: speciesData,
    isLoading: isLoadingSpecies,
    isError: hasLoadError,
  } = useQuery({
    queryKey: speciesKeys.detail(species!),
    queryFn: ({ signal }) => fetchSpecies(species, signal),
    enabled: !!species,
  });

  // --- Associate existing reference ---
  const [selectedReferenceId, setSelectedReferenceId] = useState<number | null>(null);
  const [isAssociating, setIsAssociating] = useState(false);
  const [associateMessage, setAssociateMessage] = useState<string | null>(null);

  // --- Create new and associate ---
  const [createFormValues, setCreateFormValues] =
    useState<CreateReferenceFormValues>(createDefaultFormValues());
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<string | null>(null);

  // --- Edit dialog ---
  const [editingReference, setEditingReference] = useState<IReference | null>(null);
  const [editingValues, setEditingValues] =
    useState<EditReferenceFormValues>(createDefaultFormValues());
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [savingReferenceId, setSavingReferenceId] = useState<number | null>(null);

  // --- Delete ---
  const [deletingReferenceId, setDeletingReferenceId] = useState<number | null>(null);

  async function reloadSpecies() {
    if (!species) return;
    await queryClient.invalidateQueries({ queryKey: speciesKeys.detail(species) });
  }

  // Fetch function for the reference combobox (stable reference via useCallback)
  const fetchReferenceOptions = useCallback(
    async (search: string, signal: AbortController["signal"]): Promise<ComboboxOption[]> => {
      const results = await searchReferences(search, signal);
      return results.map((ref) => ({
        id: ref.id,
        label: ref.apa || ref.doi || ref.url || `#${ref.id}`,
      }));
    },
    []
  );

  function validateUrl(url: string): boolean {
    if (!url.trim()) return true;
    try {
      new URL(url.trim());
      return true;
    } catch {
      return false;
    }
  }

  // --- Associate existing ---
  async function handleAssociateExisting() {
    if (!speciesData?.id) {
      navigate(`/${locale}/painel/especies`, { replace: true });
      return;
    }
    if (!selectedReferenceId) {
      setAssociateMessage(t("panel_page.species_references_validation_select"));
      return;
    }

    setIsAssociating(true);
    setAssociateMessage(null);
    try {
      await runWithSilencedApiErrors(() =>
        associateExistingReference(speciesData.id, selectedReferenceId)
      );
      setSelectedReferenceId(null);
      await reloadSpecies();
      await Alert({
        icon: "success",
        title: t("panel_page.species_references_associate_success_title"),
        text: t("panel_page.species_references_associate_success_text"),
      });
    } catch (error) {
      setAssociateMessage(
        getLocalizedError(error) || t("panel_page.species_references_associate_error_text")
      );
    } finally {
      setIsAssociating(false);
    }
  }

  // --- Create new and associate ---
  function updateCreateField(field: keyof CreateReferenceFormValues, value: string) {
    setCreateMessage(null);
    setCreateFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateAndAssociate(): Promise<boolean> {
    if (!speciesData?.id) {
      navigate(`/${locale}/painel/especies`, { replace: true });
      return false;
    }

    const apa = createFormValues.apa.trim();
    const doi = createFormValues.doi.trim();
    const url = createFormValues.url.trim();

    if (!apa) {
      setCreateMessage(t("panel_page.species_references_validation_apa"));
      return false;
    }

    if (url && !validateUrl(url)) {
      setCreateMessage(t("panel_page.species_references_validation_url"));
      return false;
    }

    setIsCreating(true);
    setCreateMessage(null);
    try {
      await runWithSilencedApiErrors(() =>
        createAndAssociateReference(speciesData.id, {
          apa,
          doi: doi || null,
          url: url || null,
        })
      );
      setCreateFormValues(createDefaultFormValues());
      await reloadSpecies();
      return true;
    } catch (error) {
      setCreateMessage(
        getLocalizedError(error) || t("panel_page.species_references_create_error_text")
      );
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleCreateSuccess() {
    await Alert({
      icon: "success",
      title: t("panel_page.species_references_create_success_title"),
      text: t("panel_page.species_references_create_success_text"),
    });
  }

  // --- Edit ---
  async function openEditDialog(reference: IReference) {
    const result = await Alert({
      icon: "warning",
      title: t("panel_page.species_references_edit_warn_title"),
      text: t("panel_page.species_references_edit_warn_text"),
      showCancelButton: true,
      confirmButtonText: t("panel_page.species_references_edit_warn_confirm"),
      cancelButtonText: t("panel_page.species_references_edit_warn_cancel"),
    });
    if (!result.isConfirmed) return;

    setEditingReference(reference);
    setEditingValues({
      apa: reference.apa ?? "",
      doi: reference.doi ?? "",
      url: reference.url ?? "",
    });
    setEditMessage(null);
  }

  function closeEditDialog() {
    setEditingReference(null);
    setEditingValues(createDefaultFormValues());
    setEditMessage(null);
  }

  function updateEditField(field: keyof EditReferenceFormValues, value: string) {
    setEditMessage(null);
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveEdit() {
    if (!editingReference?.id) return;

    const apa = editingValues.apa.trim();
    const doi = editingValues.doi.trim();
    const url = editingValues.url.trim();

    if (!apa) {
      setEditMessage(t("panel_page.species_references_validation_apa"));
      return;
    }

    if (url && !validateUrl(url)) {
      setEditMessage(t("panel_page.species_references_validation_url"));
      return;
    }

    const payload: UpdateReferencePayload = {};
    const nextApa = apa;
    const nextDoi = doi || null;
    const nextUrl = url || null;
    if (nextApa !== (editingReference.apa ?? null)) payload.apa = nextApa;
    if (nextDoi !== (editingReference.doi ?? null)) payload.doi = nextDoi;
    if (nextUrl !== (editingReference.url ?? null)) payload.url = nextUrl;

    if (Object.keys(payload).length === 0) {
      setEditMessage(t("panel_page.species_references_edit_no_changes"));
      return;
    }

    setSavingReferenceId(editingReference.id);
    try {
      await runWithSilencedApiErrors(() => updateReference(editingReference.id, payload));
      closeEditDialog();
      await reloadSpecies();
      await Alert({
        icon: "success",
        title: t("panel_page.species_references_edit_success_title"),
        text: t("panel_page.species_references_edit_success_text"),
      });
    } catch (error) {
      setEditMessage(
        getLocalizedError(error) || t("panel_page.species_references_edit_error_text")
      );
    } finally {
      setSavingReferenceId(null);
    }
  }

  // --- Disassociate ---
  async function handleDisassociate(reference: IReference) {
    if (!speciesData?.id) return;

    const confirmed = await confirmAction({
      title: t("panel_page.species_references_delete_confirm_title"),
      text: t("panel_page.species_references_delete_confirm_text"),
      confirmButtonText: t("panel_page.species_references_delete_confirm_yes"),
      cancelButtonText: t("panel_page.species_references_delete_confirm_no"),
      requireCode: true,
      codeLabel: t("panel_page.species_references_delete_confirm_code_label"),
      codePlaceholder: t("panel_page.species_references_delete_confirm_code_placeholder"),
      codeInvalidMessage: t("panel_page.species_references_delete_confirm_code_invalid"),
    });
    if (!confirmed) return;

    setDeletingReferenceId(reference.id);
    try {
      await runWithSilencedApiErrors(() => disassociateReference(speciesData.id, reference.id));
      await reloadSpecies();
      await Alert({
        icon: "success",
        title: t("panel_page.species_references_delete_success_title"),
        text: t("panel_page.species_references_delete_success_text"),
      });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    } finally {
      setDeletingReferenceId(null);
    }
  }

  return {
    speciesData,
    speciesSlug: species,
    isLoadingSpecies,
    hasLoadError,
    locale,
    location,
    // Associate existing
    selectedReferenceId,
    isAssociating,
    associateMessage,
    fetchReferenceOptions,
    setSelectedReferenceId,
    handleAssociateExisting,
    // Create new
    createFormValues,
    isCreating,
    createMessage,
    updateCreateField,
    handleCreateAndAssociate,
    handleCreateSuccess,
    // Edit
    editingReference,
    editingValues,
    editMessage,
    savingReferenceId,
    openEditDialog,
    closeEditDialog,
    updateEditField,
    handleSaveEdit,
    // Disassociate
    deletingReferenceId,
    handleDisassociate,
  };
}

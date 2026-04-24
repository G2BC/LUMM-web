import { fetchSpecies, updateSpecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { Alert } from "@/components/alert";
import { getLocalizedError } from "@/api/get-localized-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { SPECIES_EDIT_FIELDS, SPECIES_EDIT_FORM_INITIAL_VALUES } from "../constants";
import { createSpeciesEditSchema } from "../schema";
import type { SpeciesEditFormValues } from "../types";
import {
  buildDomainViewValueMap,
  buildLuminescentRows,
  buildSpeciesUpdatePayload,
  createSpeciesEditFormDefaults,
} from "../utils";

type UseSpeciesEditFormParams = {
  species: string | undefined;
  isViewMode: boolean;
  locale: string;
};

export function useSpeciesEditForm({ species, isViewMode, locale }: UseSpeciesEditFormParams) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isFormReady, setIsFormReady] = useState(false);
  const originalFormValuesRef = useRef<SpeciesEditFormValues | null>(null);

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
    const defaults = createSpeciesEditFormDefaults(speciesData);
    originalFormValuesRef.current = defaults;
    form.reset(defaults);
    setIsFormReady(true);
  }, [form, speciesData]);

  const domainPreloadedOptions = useMemo(() => {
    if (!speciesData) return undefined;
    return {
      growth_form: (speciesData.species_characteristics?.growth_forms ?? []).map((item) => ({
        value: item.id,
        label_pt: item.label_pt,
        label_en: item.label_en,
      })),
      nutrition_mode: (speciesData.species_characteristics?.nutrition_modes ?? []).map((item) => ({
        value: item.id,
        label_pt: item.label_pt,
        label_en: item.label_en,
      })),
      substrate: (speciesData.species_characteristics?.substrates ?? []).map((item) => ({
        value: item.id,
        label_pt: item.label_pt,
        label_en: item.label_en,
      })),
      decay_type: (speciesData.species_characteristics?.decay_types ?? []).map((item) => ({
        value: item.id,
        label_pt: item.label_pt,
        label_en: item.label_en,
      })),
      habitat: (speciesData.species_characteristics?.habitats ?? []).map((item) => ({
        value: item.id,
        label_pt: item.label_pt,
        label_en: item.label_en,
      })),
    };
  }, [speciesData]);

  const distributionPreloadedOptions = useMemo(() => {
    if (!speciesData) return [];
    const isPt = i18n.language.toLowerCase().startsWith("pt");
    return (speciesData.distributions ?? []).map((item) => ({
      id: item.id,
      label: isPt ? item.label_pt : item.label_en,
    }));
  }, [speciesData, i18n.language]);

  const similarSpeciesPreloadedOptions = useMemo(() => {
    if (!speciesData) return [];
    const fromChars = speciesData.species_characteristics?.similar_species ?? [];
    const fromTop = speciesData.similar_species ?? [];
    const items = fromChars.length > 0 ? fromChars : fromTop;
    return items
      .map((item) => ({ id: Number(item.id), label: item.label ?? item.name ?? "" }))
      .filter((item) => Number.isFinite(item.id) && item.label);
  }, [speciesData]);

  const visibleFields = useMemo(
    () =>
      SPECIES_EDIT_FIELDS.filter(
        (field) => (isViewMode || !field.detailOnly) && field.name !== "is_visible"
      ),
    [isViewMode]
  );

  const luminescentRows = useMemo(
    () => (speciesData ? buildLuminescentRows(speciesData, t) : []),
    [speciesData, t]
  );

  const domainViewValueMap = useMemo(
    () =>
      speciesData
        ? buildDomainViewValueMap(
            speciesData,
            i18n.language.toLowerCase().startsWith("pt"),
            i18n.language
          )
        : {},
    [speciesData, i18n.language]
  );

  async function handleSubmit(values: SpeciesEditFormValues) {
    if (!speciesData || !originalFormValuesRef.current) return;

    const payload = buildSpeciesUpdatePayload(values, originalFormValuesRef.current);

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

  return {
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
    i18nLanguage: i18n.language,
  };
}

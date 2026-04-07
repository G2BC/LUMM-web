import { deleteSpecies } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import { Alert } from "@/components/alert";
import { confirmAction } from "@/components/confirm-action";
import { getLocalizedError } from "@/api/get-localized-error";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

type UseSpeciesDeleteParams = {
  speciesId: number | undefined;
  speciesName: string | undefined;
  backPath: string;
};

export function useSpeciesDelete({ speciesId, speciesName, backPath }: UseSpeciesDeleteParams) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeletingSpecies, setIsDeletingSpecies] = useState(false);

  async function handleDeleteSpecies() {
    if (!speciesId || isDeletingSpecies) return;

    const confirmed = await confirmAction({
      title: t("panel_page.species_delete_confirm_title"),
      text: t("panel_page.species_delete_confirm_text", { species: speciesName }),
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
      await runWithSilencedApiErrors(() => deleteSpecies(speciesId));
      queryClient.removeQueries({ queryKey: speciesKeys.detail(speciesId) });
      await queryClient.invalidateQueries({ queryKey: speciesKeys.lists() });

      await Alert({
        icon: "success",
        title: t("panel_page.species_delete_success_title"),
        text: t("panel_page.species_delete_success_text"),
      });

      navigate(backPath, { replace: true });
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

  return { isDeletingSpecies, handleDeleteSpecies };
}

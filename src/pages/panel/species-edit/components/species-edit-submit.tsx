import { Button } from "@/components/ui/button";
import type { TFunction } from "i18next";
import { Loader2 } from "lucide-react";

type SpeciesEditSubmitProps = {
  isSubmitting: boolean;
  t: TFunction;
};

export function SpeciesEditSubmit({ isSubmitting, t }: SpeciesEditSubmitProps) {
  return (
    <div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("panel_page.species_edit_submitting")}
          </>
        ) : (
          t("panel_page.species_edit_submit_pending")
        )}
      </Button>
    </div>
  );
}

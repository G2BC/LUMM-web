import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateReferenceFormValues } from "@/pages/panel/useSpeciesReferencesPage";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type SpeciesReferencesCreateFormProps = {
  values: CreateReferenceFormValues;
  message: string | null;
  isSubmitting: boolean;
  onChange: (_field: keyof CreateReferenceFormValues, _value: string) => void;
  onSubmit: () => Promise<boolean>;
  onSuccess: () => Promise<void>;
};

export function SpeciesReferencesCreateForm({
  values,
  message,
  isSubmitting,
  onChange,
  onSubmit,
  onSuccess,
}: SpeciesReferencesCreateFormProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  async function handleSubmit() {
    const success = await onSubmit();
    if (success) {
      setOpen(false);
      await onSuccess();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="h-4 w-4" />
          {t("panel_page.species_references_create_cta_open")}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            {t("panel_page.species_references_create_title")}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t("panel_page.species_references_create_hint")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {message ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {message}
            </div>
          ) : null}

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">
              {t("panel_page.species_references_field_apa")}
              <span className="ml-1 text-red-500">*</span>
            </p>
            <Textarea
              rows={3}
              placeholder={t("panel_page.species_references_field_apa_placeholder")}
              value={values.apa}
              onChange={(e) => onChange("apa", e.target.value)}
              disabled={isSubmitting}
              className="text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-400">
              {t("panel_page.species_references_field_apa_hint")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">
                {t("panel_page.species_references_field_doi")}
              </p>
              <Input
                placeholder={t("panel_page.species_references_field_doi_placeholder")}
                value={values.doi}
                onChange={(e) => onChange("doi", e.target.value)}
                disabled={isSubmitting}
                className="text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">
                {t("panel_page.species_references_field_url")}
              </p>
              <Input
                type="url"
                placeholder={t("panel_page.species_references_field_url_placeholder")}
                value={values.url}
                onChange={(e) => onChange("url", e.target.value)}
                disabled={isSubmitting}
                className="text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("panel_page.species_references_edit_cancel")}
          </Button>
          <Button type="button" onClick={() => void handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("panel_page.species_references_saving")}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {t("panel_page.species_references_create_cta")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

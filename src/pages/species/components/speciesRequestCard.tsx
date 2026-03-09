import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SpeciesRequestCardProps {
  onClick: VoidFunction;
}

export function SpeciesRequestCard({ onClick }: SpeciesRequestCardProps) {
  const { t } = useTranslation();

  return (
    <section className="xl:hidden rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5">
      <p className="text-sm font-semibold text-white">{t("species_page.contribute_title")}</p>
      <p className="mt-1 text-sm text-white/75">{t("species_page.contribute_text")}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 h-9 w-fit rounded-md border-primary/60 bg-primary/10 px-3 text-sm font-semibold text-primary hover:bg-primary/20 hover:text-primary"
        onClick={onClick}
      >
        <PencilLine className="h-4 w-4" />
        {t("species_page.request_update_cta")}
      </Button>
    </section>
  );
}

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SpeciesRequestFormValues } from "@/pages/species-request/types";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type IdentityStepProps = {
  form: UseFormReturn<SpeciesRequestFormValues>;
};

export function IdentityStep({ form }: IdentityStepProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="requester_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.requester_name")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("species_request.requester_name_placeholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requester_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species_request.requester_email")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder={t("species_request.requester_email_placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="requester_institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("species_request.requester_institution")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("species_request.requester_institution_placeholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}

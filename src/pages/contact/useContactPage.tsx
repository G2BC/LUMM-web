import { useState } from "react";
import { z } from "zod";
import type { contactFormSchema } from "./schemas";
import { sendContact } from "@/api/contact";
import { Alert } from "@/components/alert";
import { useTranslation } from "react-i18next";

export function useContactPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const sendMail = (values: z.infer<typeof contactFormSchema>) => {
    setLoading(true);
    sendContact(values)
      .then((res) => {
        if (res.ok) {
          return Alert({
            title: t("contact_page.send_success_title"),
            icon: "success",
            text: t("contact_page.send_success_text"),
          });
        }

        if (res.error) {
          return Alert({
            title: t("errors.occurred"),
            icon: "error",
            text: res.error,
          });
        }
      })
      .catch(() => {
        // O interceptor global já exibe o erro para o usuário.
      })
      .finally(() => setLoading(false));
  };

  return {
    loading,
    sendMail,
  };
}

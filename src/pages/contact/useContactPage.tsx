import { useState } from "react";
import { z } from "zod";
import type { contactFormSchema } from "./schemas";
import { sendContact } from "@/api/contact";
import { Alert } from "@/components/alert";

export function useContactPage() {
  const [loading, setLoading] = useState(false);

  const sendMail = (values: z.infer<typeof contactFormSchema>) => {
    setLoading(true);
    sendContact(values)
      .then((res) => {
        if (res.ok) {
          return Alert({
            title: "Mensagem enviada!",
            icon: "success",
            text: "Obrigado por entrar em contato. Responderemos em breve.",
          });
        }

        if (res.error) {
          return Alert({
            title: "Não foi possível enviar",
            icon: "error",
            text: "Ocorreu um problema ao processar sua solicitação: " + res.error,
          });
        }
      })
      .catch(() =>
        Alert({
          title: "Erro inesperado",
          icon: "error",
          text: "Não conseguimos enviar sua mensagem agora. Tente novamente em alguns instantes.",
        })
      )
      .finally(() => setLoading(false));
  };

  return {
    loading,
    sendMail,
  };
}

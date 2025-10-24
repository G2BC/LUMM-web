import type { contactFormSchema } from "@/pages/contact/schemas";
import { z } from "zod";
import { API } from "..";
import type { AxiosResponse } from "axios";

type SendContactResponse = { ok?: boolean; error?: string };

export const sendContact = async (
  values: z.infer<typeof contactFormSchema>
): Promise<SendContactResponse> => {
  const resposta: AxiosResponse<SendContactResponse> = await API.post(`/contact`, {
    name: values.name,
    email: values.email,
    subject: values.subject,
    message: values.message,
    to:
      values.subject === "Assuntos técnicos" ? "ernesto.sjunior@hotmail.com" : "stevani@iq.usp.br",
  });

  return resposta.data;
};

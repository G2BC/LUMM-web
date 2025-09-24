import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string({ error: "Digite seu nome" }),
  email: z.string({ error: "Digite seu e-mail" }),
  subject: z.string({ error: "Selecione um assunto" }),
  message: z.string({ error: "Digite sua mensagem" }),
});

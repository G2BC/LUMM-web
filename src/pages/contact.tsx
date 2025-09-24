import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ContatoPage() {
  const { t } = useTranslation();

  const formSchema = z.object({
    name: z.string({ error: "Digite seu nome" }),
    email: z.string({ error: "Digite seu e-mail" }),
    subject: z.string({ error: "Selecione um assunto" }),
    message: z.string({ error: "Digite sua mensagem" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    return values;
  }

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 my-10 gap-16">
      <div className="text-white">
        <h1 className="text-5xl font-bold leading-[52px] mb-8">{t("contact_page.title")}</h1>
        <h2 className="text-[18px]">
          Preencha o formulário e contate-nos. Assim que possível retornaremos sua mensagem.
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mx-auto">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome e sobrenome" type="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Seu e-mail" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto</FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Qual o assunto do contato?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Sua mensagem para nós" id="message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-[140px]" type="submit">
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  );
}

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
import { contactFormSchema } from "./schemas";
import { useContactPage } from "./useContactPage";

export default function ContatoPage() {
  const { loading, sendMail } = useContactPage();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    sendMail(values);
  }

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 my-10 gap-16">
      <div className="text-white">
        <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] mb-8">
          {t("contact_page.title")}
        </h1>
        <h2 className="text-[18px]">
          {t("contact_page.contact_heading_line1")} <br /> {t("contact_page.contact_heading_line2")}
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mx-auto">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact_page.input_name_label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("contact_page.input_name_placeholder")}
                    type=""
                    {...field}
                  />
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
                <FormLabel>{t("contact_page.input_email_label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("contact_page.input_email_placeholder")}
                    type="email"
                    {...field}
                  />
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
                <FormLabel>{t("contact_page.input_subject_label")}</FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("contact_page.input_subject_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">{t("contact_page.subject_technical")}</SelectItem>
                    <SelectItem value="collaboration">
                      {t("contact_page.subject_collaboration")}
                    </SelectItem>
                    <SelectItem value="other">{t("contact_page.subject_other")}</SelectItem>
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
                <FormLabel>{t("contact_page.input_message_label")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[140px] resize-none"
                    placeholder={t("contact_page.input_message_placeholder")}
                    id="message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="w-[140px]" type="submit">
            {loading ? t("contact_page.button_sending") : t("contact_page.button_send")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

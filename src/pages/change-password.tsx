import heroDesktop from "@/assets/home/hero_desktop.webp";
import { changePassword, getCurrentUser } from "@/api/auth";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);

  const formSchema = useMemo(
    () =>
      z
        .object({
          currentPassword: z
            .string({ error: t("change_password_page.validation.current_password_required") })
            .min(1, t("change_password_page.validation.current_password_required")),
          newPassword: z
            .string({ error: t("change_password_page.validation.new_password_required") })
            .min(8, t("change_password_page.validation.new_password_min"))
            .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
              message: t("change_password_page.validation.new_password_rules"),
            }),
          confirmPassword: z
            .string({ error: t("change_password_page.validation.confirm_password_required") })
            .min(1, t("change_password_page.validation.confirm_password_required")),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t("change_password_page.validation.passwords_must_match"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const tokens = await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
      });

      setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        mustChangePassword: tokens.must_change_password ?? false,
      });

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      await Alert({
        icon: "success",
        title: t("change_password_page.success_title"),
        text: t("change_password_page.success_text"),
        confirmButtonText: "OK",
      });

      navigate(`/${locale}/painel`, { replace: true });
    } catch {
      // O interceptor global já exibe o erro para o usuário.
    }
  }

  return (
    <div className="grid min-h-full w-full lg:grid-cols-2">
      <div className="relative hidden h-full w-full overflow-hidden bg-black lg:block">
        <img
          src={heroDesktop}
          alt="Bioluminescent mushrooms"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D140E] via-transparent" />
      </div>

      <div className="flex items-center justify-center px-5 py-12 lg:px-12">
        <div className="w-full max-w-xl text-white">
          <div className="mb-6 space-y-2">
            <h1 className="text-3xl font-bold">{t("change_password_page.title")}</h1>
            <p className="text-white/70">{t("change_password_page.subtitle")}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("change_password_page.current_password_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder={t("change_password_page.current_password_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("change_password_page.new_password_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="new-password"
                        placeholder={t("change_password_page.new_password_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("change_password_page.confirm_password_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="new-password"
                        placeholder={t("change_password_page.confirm_password_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? t("common.loading")
                  : t("change_password_page.submit")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

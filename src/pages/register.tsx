import heroDesktop from "@/assets/home/hero_desktop.webp";
import { getCurrentUser, login, registerUser } from "@/api/auth";
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
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo } from "react";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const registerFormSchema = useMemo(
    () =>
      z
        .object({
          name: z
            .string({ error: t("register_page.validation.name_required") })
            .min(1, t("register_page.validation.name_required")),
          institution: z
            .string()
            .max(150, t("register_page.validation.institution_max"))
            .optional(),
          email: z
            .string({ error: t("register_page.validation.email_required") })
            .min(1, t("register_page.validation.email_required"))
            .email(t("register_page.validation.email_invalid")),
          password: z
            .string({ error: t("register_page.validation.password_required") })
            .min(8, t("register_page.validation.password_min"))
            .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
              message: t("register_page.validation.password_rules"),
            }),
          confirmPassword: z
            .string({ error: t("register_page.validation.confirm_password_required") })
            .min(1, t("register_page.validation.confirm_password_required")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("register_page.validation.passwords_must_match"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      institution: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (accessToken && user) {
      navigate(`/${locale}/painel`, { replace: true });
    }
  }, [accessToken, user, navigate, locale]);

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      await registerUser({
        name: values.name,
        institution: values.institution?.trim() || undefined,
        email: values.email,
        password: values.password,
      });

      const tokens = await login({
        email: values.email,
        password: values.password,
      });

      setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      const user = await getCurrentUser();
      setUser(user);

      await Alert({
        icon: "success",
        title: t("register_page.success_title"),
        text: t("register_page.success_text"),
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
            <h1 className="text-3xl font-bold">{t("register_page.title")}</h1>
            <p className="text-white/70">{t("register_page.subtitle")}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register_page.name_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="name"
                        placeholder={t("register_page.name_placeholder")}
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
                    <FormLabel>{t("register_page.email_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder={t("register_page.email_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register_page.institution_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="organization"
                        placeholder={t("register_page.institution_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("register_page.password_label")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          autoComplete="new-password"
                          placeholder={t("register_page.password_placeholder")}
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
                      <FormLabel>{t("register_page.confirm_password_label")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          autoComplete="new-password"
                          placeholder={t("register_page.confirm_password_placeholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("common.loading") : t("register_page.submit")}
              </Button>

              <p className="text-center text-sm text-white/70">
                {t("register_page.login_prompt")}{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                  onClick={() => navigate(`/${locale}/login`)}
                >
                  {t("register_page.login_cta")}
                </button>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

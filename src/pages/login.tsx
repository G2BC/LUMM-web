import heroDesktop from "@/assets/home/hero_desktop.webp";
import { getCurrentUser, login } from "@/api/auth";
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
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const loginFormSchema = useMemo(
    () =>
      z.object({
        email: z
          .string({ error: t("login_page.validation.email_required") })
          .min(1, t("login_page.validation.email_required"))
          .email(t("login_page.validation.email_invalid")),
        password: z
          .string({ error: t("login_page.validation.password_required") })
          .min(8, t("login_page.validation.password_min")),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (accessToken && user) {
      navigate(`/${locale}/painel`, { replace: true });
    }
  }, [accessToken, user, navigate, locale]);

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      const tokens = await login(values);
      setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      const user = await getCurrentUser();
      setUser(user);

      const from = (location.state as { from?: string } | undefined)?.from;
      const redirectTo = from ?? `/${locale}/painel`;

      await Alert({
        icon: "success",
        title: t("login_page.success_title"),
        text: t("login_page.success_text"),
        confirmButtonText: "OK",
      });

      navigate(redirectTo, { replace: true });
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
            <h1 className="text-3xl font-bold">{t("login_page.title")}</h1>
            <p className="text-white/70">{t("login_page.subtitle")}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login_page.email_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder={t("login_page.email_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login_page.password_label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder={t("login_page.password_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("common.loading") : t("login_page.submit")}
              </Button>

              <p className="text-center text-sm text-white/70">
                {t("login_page.register_prompt")}{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                  onClick={() => navigate(`/${locale}/cadastro`)}
                >
                  {t("login_page.register_cta")}
                </button>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

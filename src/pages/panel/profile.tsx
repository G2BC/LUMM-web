import { useState, useMemo } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ShieldCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API } from "@/api";
import { Alert } from "@/components/alert";
import { changePassword, getCurrentUser } from "@/api/auth";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import type { AxiosError } from "axios";

interface EditFieldModalProps {
  label: string;
  value: string;
  field: "name" | "email" | "institution";
  onSave: (_field: string, _value: string) => Promise<void>;
  isLoading: boolean;
  type?: string;
  t: TFunction;
}

export default function PanelProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (field: string, value: string) => {
    setLoading(true);
    try {
      const response = await API.patch(`/users/me`, {
        [field]: value,
      });

      const data = await response.data;

      Alert({ icon: "success", title: t("panel_profile.success_save") });
      useAuthStore.setState({ user: data });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("panel_profile.title")}</h1>
        <p className="text-muted-foreground">{t("panel_profile.description")}</p>
      </div>

      <Card className="bg-card border-none shadow-sm">
        <CardHeader className="border-b border-border/50 px-4 py-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("panel_profile.personal_info")}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/50 p-0">
          <EditFieldModal
            label={t("panel_profile.field_name")}
            value={user.name}
            field="name"
            onSave={handleUpdate}
            isLoading={loading}
            t={t}
          />

          <EditFieldModal
            label={t("panel_profile.field_email")}
            value={user.email}
            field="email"
            type="email"
            onSave={handleUpdate}
            isLoading={loading}
            t={t}
          />

          <EditFieldModal
            label={t("panel_profile.field_institution")}
            value={user.institution || ""}
            field="institution"
            onSave={handleUpdate}
            isLoading={loading}
            t={t}
          />
        </CardContent>
      </Card>

      <Card className="bg-card border-none shadow-sm">
        <CardHeader className="border-b border-border/50 px-4 py-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t("panel_profile.password_and_authentication")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("panel_profile.change_password")}</p>
              <p className="text-xs text-muted-foreground">{t("panel_profile.password_hint")}</p>
            </div>
            <ChangePasswordModal t={t} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChangePasswordModal({ t }: { t: TFunction }) {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    try {
      const tokens = await runWithSilencedApiErrors(() =>
        changePassword({
          current_password: values.currentPassword,
          new_password: values.newPassword,
        })
      );

      setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        mustChangePassword: tokens.must_change_password ?? false,
      });

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      setOpen(false);
      form.reset();

      await Alert({
        icon: "success",
        title: t("change_password_page.success_title"),
        text: t("change_password_page.success_text"),
        confirmButtonText: "OK",
      });
    } catch (err) {
      const axiosErr = err as AxiosError<{
        message_pt?: string;
        message_en?: string;
        detail?: string;
      }>;
      const data = axiosErr.response?.data;
      const msg =
        data?.message_pt ?? data?.message_en ?? data?.detail ?? "Ocorreu um erro inesperado.";
      setApiError(typeof msg === "string" ? msg : "Ocorreu um erro inesperado.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
          setApiError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          {t("panel_profile.button_change_password")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("panel_profile.change_password")}</DialogTitle>
          <DialogDescription>{t("panel_profile.password_hint")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
            onChange={() => setApiError(null)}
          >
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

            {apiError && (
              <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
                {apiError}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("panel_profile.cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("panel_profile.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditFieldModal({
  label,
  value,
  field,
  onSave,
  isLoading,
  type = "text",
  t,
}: EditFieldModalProps) {
  const [newValue, setNewValue] = useState(value);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors cursor-default">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            {t("panel_profile.edit_field")}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("panel_profile.edit_field")}</DialogTitle>
          <DialogDescription>
            {t("panel_profile.edit_description", { field: label.toLowerCase() })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              type={type}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="text-muted-foreground font-medium"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("panel_profile.cancel")}
          </Button>
          <Button
            onClick={async () => {
              await onSave(field, newValue);
              setOpen(false);
            }}
            disabled={isLoading || newValue === value}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("panel_profile.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

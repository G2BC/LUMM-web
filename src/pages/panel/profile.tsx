import { useState } from "react";
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
import { API } from "@/api";
import { Alert } from "@/components/alert";

interface EditFieldModalProps {
  label: string;
  value: string;
  field: "name" | "email" | "institution";
  onSave: (field: string, value: string) => Promise<void>;
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
            <Button variant="default" size="sm">
              {t("panel_profile.button_change_password")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
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

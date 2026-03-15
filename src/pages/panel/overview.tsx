import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";

export default function PanelOverviewPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="py-2">
      <h2 className="text-2xl font-semibold text-slate-900">
        {t("panel_page.welcome", { name: user?.name ?? "" })}
      </h2>
    </div>
  );
}

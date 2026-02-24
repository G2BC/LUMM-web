import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type FullScreenLoaderProps = {
  variant?: "dark" | "light";
};

export function FullScreenLoader({ variant = "dark" }: FullScreenLoaderProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center z-50",
        variant === "dark" ? "bg-[#0A100B]" : "bg-white"
      )}
    >
      <Loader2
        className={cn(
          "w-8 h-8 animate-spin mb-4",
          variant === "dark" ? "text-[#00C000]" : "text-[#118A2A]"
        )}
      />
      <p className={cn("font-semibold", variant === "dark" ? "text-[#00C000]" : "text-slate-700")}>
        {t("common.loading")}
      </p>
    </div>
  );
}

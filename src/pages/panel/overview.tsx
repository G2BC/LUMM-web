import { useAuthStore } from "@/stores/useAuthStore";

export default function PanelOverviewPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="py-2">
      <h2 className="text-2xl font-semibold text-slate-900">Seja bem-vindo, {user?.name}</h2>
    </div>
  );
}

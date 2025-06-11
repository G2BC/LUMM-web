import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-[#040604] flex flex-col items-center justify-center z-50">
      <Loader2 className="w-8 h-8 text-[#00C000] animate-spin mb-4" />
      <p className="text-[#00C000] font-semibold">Carregando...</p>
    </div>
  );
}

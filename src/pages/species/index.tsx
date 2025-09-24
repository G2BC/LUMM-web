import Slide from "@/pages/species/components/slide";
import { ChevronLeft, Loader2 } from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function SpeciesPage() {
  const { dados, loading } = useSpeciesPage();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center container mx-auto px-4 my-10">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-[#00C000] font-semibold">Carregando...</p>
      </div>
    );
  }

  const photos = dados?.photos
    ?.map((photo) => photo.medium_url ?? photo.original_url)
    ?.filter(Boolean);

  return (
    <div className="container mx-auto px-4 my-10 text-white">
      <Button
        variant="link"
        className="mb-6 text-base font-bold !px-0"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </Button>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="text-white max-xl:order-1">
          <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] mb-8 italic">
            {dados?.scientific_name}
          </h1>
          <h2>Linhagem bioluminescente: {dados?.lineage}</h2>
        </div>

        {!!photos?.length && <Slide slides={photos as string[]} />}
      </div>
    </div>
  );
}

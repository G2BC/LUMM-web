import Slide from "@/pages/species/components/slide";
import { Loader2 } from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";

export default function SpeciesPage() {
  const { dados, loading } = useSpeciesPage();

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
    <div className="container mx-auto px-4 my-10 text-white grid grid-cols-1 xl:grid-cols-2 gap-10">
      <div className="text-white max-xl:order-1">
        <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] mb-8">
          {dados?.scientific_name}
        </h1>
        <h2>Linhagem: {dados?.lineage}</h2>
        <h3>Família: {dados?.family}</h3>
      </div>

      {!!photos?.length && <Slide slides={photos as string[]} />}
    </div>
  );
}

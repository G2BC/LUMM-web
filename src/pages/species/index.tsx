import Slide from "@/components/slide";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { Loader2 } from "lucide-react";

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
    ?.map((photo) => photo?.medium_url ?? photo?.original_url)
    ?.filter(Boolean) as [];

  return (
    <div className="container mx-auto px-4 my-10 text-white grid grid-cols-1 xl:grid-cols-2 gap-10">
      {!!photos?.length && <Slide slides={photos} />}

      <div className="text-white">
        <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px]  xl:leading-[54px]">
          {dados?.scientific_name}
        </h1>
        <h2>Linhagem: {dados?.lineage}</h2>
      </div>
    </div>
  );
}

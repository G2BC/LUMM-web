import Slide from "@/components/slide";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";

export default function SpeciesPage() {
  const { dados } = useSpeciesPage();

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

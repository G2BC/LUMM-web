import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ISpecie } from "@/api/species/types/ISpecie";
import photoDefault from "@/assets/specie-card-default.webp";

export function SpecieCard(props: ISpecie) {
  const photoFeatured = props.photos?.find((p) => p.featured === true);
  const photoLumm = props.photos?.find((p) => p.lumm === true);
  const firstPhoto = props.photos?.[0];

  const photo =
    photoFeatured?.medium_url ??
    photoFeatured?.original_url ??
    photoLumm?.medium_url ??
    photoLumm?.original_url ??
    firstPhoto?.medium_url ??
    firstPhoto?.original_url ??
    photoDefault;

  return (
    <Card
      className="p-0 overflow-hidden w-[280px] h-[350px] cursor-pointer transition-transform transform hover:scale-[1.01]"
      onClick={() => alert(`Cliquei em: ${props.id}`)}
    >
      <CardContent className="p-0 h-full flex flex-col">
        <CardHeader className="p-0 w-full max-h-[250px] overflow-hidden">
          <img className="w-full h-[250px] object-cover object-center" src={photo} />
        </CardHeader>
        <CardFooter className="p-4 flex-1 flex flex-col gap-1 items-start">
          <CardTitle className="font-bold leading-[22px] italic">{props.scientific_name}</CardTitle>
          <CardDescription className="font-light text-sm">{props.lineage}</CardDescription>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

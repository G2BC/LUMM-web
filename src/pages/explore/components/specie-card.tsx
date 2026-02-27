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
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { getPhotoUrl } from "@/pages/species/utils";

export function SpecieCard(props: ISpecie) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const photoFeatured = props.photos?.find((p) => p.featured === true);
  const photoLumm = props.photos?.find((p) => p.lumm === true);
  const firstPhoto = props.photos?.[0];

  const selectedPhoto = photoFeatured ?? photoLumm ?? firstPhoto;
  const photo = selectedPhoto ? getPhotoUrl(selectedPhoto) || photoDefault : photoDefault;

  const handleClick = () => {
    navigate(`/${lang ?? DEFAULT_LOCALE}/especie/${props.id}`);
  };

  return (
    <Card
      className="p-0 border-0 overflow-hidden w-[280px] h-[350px] cursor-pointer shadow-md"
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full flex flex-col">
        <CardHeader className="p-0 w-full max-h-[250px] overflow-hidden">
          <img
            className="w-full h-[250px] object-cover object-center"
            src={photo}
            alt={props.scientific_name}
          />
        </CardHeader>
        <CardFooter className="p-4 flex-1 flex flex-col gap-1 items-start">
          <CardTitle className="font-bold leading-[22px] italic">{props.scientific_name}</CardTitle>
          <CardDescription className="font-light text-sm">
            {t("common.lineage")}: {props.lineage}
          </CardDescription>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

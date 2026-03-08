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
import { ConservationStatusIcon } from "@/components/conservation-status-icon";

export function SpecieCard(props: ISpecie) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const photoFeatured = props.photos?.find((p) => p.featured === true);
  const photoLumm = props.photos?.find((p) => p.lumm === true);
  const firstPhoto = props.photos?.[0];

  const selectedPhoto = photoFeatured ?? photoLumm ?? firstPhoto;
  const photo = selectedPhoto ? getPhotoUrl(selectedPhoto) || photoDefault : photoDefault;
  const conservationStatusCode = props.species_characteristics?.conservation_status;
  const conservationStatusDescription = t(
    `species_page.fields.conservation_status_values.${(conservationStatusCode || "NE")
      .trim()
      .toUpperCase()}.description`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.description"),
    }
  );

  const handleClick = () => {
    navigate(`/${lang ?? DEFAULT_LOCALE}/especie/${props.id}`);
  };

  return (
    <Card
      className="p-0 border-0 overflow-hidden w-[280px] h-[390px] cursor-pointer shadow-md"
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full flex flex-col">
        <CardHeader className="p-0 w-full h-[290px] overflow-hidden bg-[#020504]">
          <img
            className="w-full h-[290px] object-cover object-top"
            src={photo}
            alt={props.scientific_name}
          />
        </CardHeader>
        <CardFooter className="p-4 flex-1">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="font-bold leading-[22px] italic">
                {props.scientific_name}
              </CardTitle>
              <CardDescription className="font-light text-sm">
                {t("common.lineage")}: {props.lineage}
              </CardDescription>
            </div>
            <ConservationStatusIcon
              code={conservationStatusCode}
              description={conservationStatusDescription}
              className="inline-flex shrink-0"
              imageClassName="h-9 w-9 shrink-0"
            />
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

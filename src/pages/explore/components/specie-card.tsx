import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import type { ISpecie } from "@/api/species/types/ISpecie";
import photoDefault from "@/assets/specie-card-default.webp";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { getPhotoUrl } from "@/pages/species/utils";
import { getCountryName } from "@/lib/country-names";
import { ConservationStatusIcon } from "@/components/conservation-status-icon";
import { CountryTypeIcon } from "@/components/country-type-icon";

export function SpecieCard(props: ISpecie) {
  const { t } = useTranslation();
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
  const conservationStatusLabel = t(
    `species_page.fields.conservation_status_values.${(conservationStatusCode || "NE")
      .trim()
      .toUpperCase()}.name`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.name"),
    }
  );

  return (
    <Link to={`/${lang ?? DEFAULT_LOCALE}/especie/${props.id}`} className="group">
      <Card className="p-0 border-0 overflow-hidden w-[280px] h-[390px] shadow-md">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="w-full flex-1 overflow-hidden bg-[#020504]">
            <img
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              src={photo}
              alt={props.scientific_name}
            />
          </div>
          <CardFooter className="p-4 h-[110px] min-h-[110px]">
            <div className="flex w-full items-stretch flex-col justify-between">
              <div className="min-w-0">
                <CardTitle className="font-bold leading-[22px] italic line-clamp-1">
                  {props.scientific_name}
                </CardTitle>
                <CardDescription className="font-light text-sm">{props.lineage}</CardDescription>
              </div>
              <span className="flex items-center gap-2 self-end">
                <CountryTypeIcon
                  country={props.type_country}
                  description={t("common.type_country_description", {
                    country: getCountryName(props.type_country, lang ?? DEFAULT_LOCALE),
                  })}
                  className="inline-flex shrink-0"
                  imageClassName={
                    /United States/i.test(props.type_country ?? "")
                      ? "h-9 w-9 shrink-0"
                      : "h-10 w-10 shrink-0"
                  }
                />
                <ConservationStatusIcon
                  code={conservationStatusCode}
                  label={conservationStatusLabel}
                  description={conservationStatusDescription}
                  className="inline-flex shrink-0"
                  imageClassName="h-8 w-8 shrink-0"
                />
              </span>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
}

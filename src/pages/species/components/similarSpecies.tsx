import type { ISpecie } from "@/api/species/types/ISpecie";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface SimilarSpeciesProps {
  similarSpecies: ISpecie["similar_species"];
  locale: string;
}

export const SimilarSpecies = ({ similarSpecies, locale }: SimilarSpeciesProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!similarSpecies?.length) {
    return t("species_page.fields.no_information");
  }

  return (
    <span className="flex flex-wrap gap-x-2 gap-y-1">
      {similarSpecies.map((item, index) => (
        <span key={`${item.id}-${item.name}`}>
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => navigate(`/${locale}/especie/${item.id}`)}
          >
            {item.name}
          </button>
          {index < similarSpecies.length - 1 ? ", " : ""}
        </span>
      ))}
    </span>
  );
};

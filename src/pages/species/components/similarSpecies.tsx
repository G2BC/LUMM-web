import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface SimilarSpeciesProps {
  similarSpecies: Array<{ id: number | string; name?: string; label?: string }> | undefined;
  locale: string;
}

export const SimilarSpecies = ({ similarSpecies, locale }: SimilarSpeciesProps) => {
  const { t } = useTranslation();
  const normalizedSimilarSpecies = (similarSpecies ?? []).filter((item) => {
    const label = item.name || item.label;
    return Boolean(item.id && label);
  });

  if (!normalizedSimilarSpecies.length) {
    return t("species_page.fields.no_information");
  }

  return (
    <span className="flex flex-wrap gap-x-2 gap-y-1">
      {normalizedSimilarSpecies.map((item, index) => {
        const label = item.name || item.label || "";
        return (
          <span key={`${item.id}-${label}`}>
            <Link
              to={`/${locale}/especie/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {label}
            </Link>
            {index < normalizedSimilarSpecies.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </span>
  );
};

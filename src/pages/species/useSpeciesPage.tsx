import { fetchSpecies, fetchSpeciesNcbi } from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { normalizeSpeciesNcbiRecords } from "@/pages/species/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function useSpeciesPage() {
  const { species, lang } = useParams<{ species: string; lang: string }>();
  const navigate = useNavigate();

  const speciesQuery = useQuery({
    queryKey: speciesKeys.detail(species!),
    queryFn: ({ signal }) => fetchSpecies(species, signal),
    enabled: !!species,
  });

  const ncbiQuery = useQuery({
    queryKey: speciesKeys.ncbi(species!),
    queryFn: ({ signal }) => fetchSpeciesNcbi(species, signal),
    enabled: !!species,
    select: normalizeSpeciesNcbiRecords,
  });

  useEffect(() => {
    if (speciesQuery.isError) {
      navigate(`/${lang ?? DEFAULT_LOCALE}/explorar`);
    }
  }, [speciesQuery.isError, navigate, lang]);

  return {
    dados: speciesQuery.data ?? null,
    loading: speciesQuery.isLoading,
    ncbiRecords: ncbiQuery.data ?? [],
    ncbiLoading: ncbiQuery.isLoading,
  };
}

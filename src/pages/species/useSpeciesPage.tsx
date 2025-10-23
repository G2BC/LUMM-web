import { fetchSpecies } from "@/api/species";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { Alert } from "@/components/alert";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function useSpeciesPage() {
  const params = useParams<{ species: string }>();
  const [dados, setDados] = useState<ISpecie | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang } = useParams();

  const getSpecies = async () => {
    try {
      setLoading(true);
      const res = await fetchSpecies(params.species);

      if (!res)
        return Alert({
          title: "Erro",
          icon: "error",
          text: "Tente novamente em alguns instantes.",
        });

      setDados(res);
    } catch {
      return Alert({
        title: "Erro",
        icon: "error",
        text: "Tente novamente em alguns instantes.",
        didClose: () => navigate(`/${lang ?? DEFAULT_LOCALE}/explorar`),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.species) {
      getSpecies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.species]);

  return { dados, loading };
}

import { fetchSpecies } from "@/api/species";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { Alert } from "@/components/alert";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function useSpeciesPage() {
  const params = useParams<{ species: string }>();
  const [dados, setDados] = useState<ISpecie | null>(null);
  const navigate = useNavigate();

  const getSpecies = async () => {
    try {
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
        didClose: () => navigate("/explorar"),
      });
    }
  };

  useEffect(() => {
    if (params.species) {
      getSpecies();
    }
  }, [params.species]);

  return { dados };
}

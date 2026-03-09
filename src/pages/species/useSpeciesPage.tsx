import { fetchSpecies, fetchSpeciesNcbi } from "@/api/species";
import type { ISpecie } from "@/api/species/types/ISpecie";
import { Alert } from "@/components/alert";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { normalizeSpeciesNcbiRecords, type SpeciesNcbiRecord } from "@/pages/species/utils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function useSpeciesPage() {
  const params = useParams<{ species: string }>();
  const [dados, setDados] = useState<ISpecie | null>(null);
  const [ncbiRecords, setNcbiRecords] = useState<SpeciesNcbiRecord[]>([]);
  const [ncbiLoading, setNcbiLoading] = useState(false);
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

  const getNcbiRecords = async (signal?: AbortController["signal"]) => {
    if (!params.species) return;

    try {
      setNcbiRecords([]);
      setNcbiLoading(true);
      const response = await fetchSpeciesNcbi(params.species, signal);
      setNcbiRecords(normalizeSpeciesNcbiRecords(response));
    } catch {
      setNcbiRecords([]);
    } finally {
      setNcbiLoading(false);
    }
  };

  useEffect(() => {
    if (params.species) {
      const controller = new AbortController();
      const loadSpeciesPage = async () => {
        await getSpecies();
        await getNcbiRecords(controller.signal);
      };
      void loadSpeciesPage();
      return () => controller.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.species]);

  return { dados, loading, ncbiRecords, ncbiLoading };
}

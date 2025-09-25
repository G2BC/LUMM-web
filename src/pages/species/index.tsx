import Slide from "@/pages/species/components/slide";
import { ChevronLeft, Loader2 } from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

function parseClassification(classification?: string) {
  if (!classification) return [];

  const parts = classification.split(",").map((p) => p.trim());
  const mains = parts.filter((_, i) => i % 2 === 0);
  const last = parts[parts.length - 1];
  if (mains[mains.length - 1] !== last) mains.push(last);

  return [...new Set(mains)];
}

const taxonomyStruct = ["Reino", "Filo", "Classe", "Ordem", "Família", "Gênero"];

export default function SpeciesPage() {
  const { dados, loading } = useSpeciesPage();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center container mx-auto px-4 my-10">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-[#00C000] font-semibold">Carregando...</p>
      </div>
    );
  }

  const photos = dados?.photos
    ?.map((photo) => photo.medium_url ?? photo.original_url)
    ?.filter(Boolean);

  return (
    <div className="container mx-auto px-4 my-10 text-white">
      <Button
        variant="link"
        className="mb-6 text-base font-bold !px-0"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </Button>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="text-white max-xl:order-1">
          <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] italic">
            {dados?.scientific_name}
          </h1>

          <div className="mt-10 xl:max-w-[90%]">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger className="data-[state=active]:bg-primary" value="about">
                  Sobre
                </TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-primary" value="taxonomy">
                  Taxonomia
                </TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-primary" value="links">
                  Links
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardContent className="space-y-4">
                    <p>
                      ➔ {t("species_page.bioluminescent_lineage")}: {dados?.lineage}
                    </p>
                    <p>➔ Autores: {dados?.taxonomy?.authors}</p>
                    <p>➔ Ano da publicação: {dados?.taxonomy?.years_of_effective_publication}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="taxonomy">
                <Card>
                  <CardContent className="space-y-4">
                    {parseClassification(dados?.taxonomy?.classification)?.map((item, index) => {
                      const label = taxonomyStruct[index];

                      return (
                        <p>
                          ➔ {label}: {item}
                        </p>
                      );
                    })}
                    <p>
                      ➔ Espécie: {(dados?.scientific_name?.trim().split(/\s+/).pop() || "").trim()}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="links">
                <Card>
                  <CardContent className="space-y-4" />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {!!photos?.length && <Slide slides={photos as string[]} />}
      </div>
    </div>
  );
}

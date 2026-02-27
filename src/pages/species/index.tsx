import Slide from "@/pages/species/components/slide";
import { ChevronLeft, Link, Loader2, PencilLine } from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import defaultPhoto from "@/assets/specie-card-default.webp";
import { formatLuminescence, parseClassification, sortPhotos, taxonomyLabels } from "./utils";
import { DEFAULT_LOCALE } from "@/lib/lang";

export default function SpeciesPage() {
  const { dados, loading } = useSpeciesPage();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center container mx-auto px-4 my-10">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-[#00C000] font-semibold">{t("common.loading")}</p>
      </div>
    );
  }

  const photos = sortPhotos(dados?.photos ?? []);

  if (photos && Array.isArray(photos) && !photos.length) {
    photos?.push({ photo: defaultPhoto, attribution: "" });
  }

  return (
    <div className="container mx-auto px-4 my-10 text-white">
      {window.history.length > 2 && (
        <Button
          variant="link"
          className="mb-6 text-base font-bold !px-0"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          {t("common.back")}
        </Button>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="text-white max-xl:order-1">
          <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] italic">
            {dados?.scientific_name}
          </h1>

          <div className="mt-10 xl:max-w-[90%]">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger className="data-[state=active]:bg-primary" value="about">
                  {t("common.about")}
                </TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-primary" value="taxonomy">
                  {t("common.taxonomy")}
                </TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-primary" value="links">
                  {t("common.external_links")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-2 underline">{t("species_page.lumm.section_title")}:</p>
                      <div className="space-y-4">
                        <p>
                          ➔ {t("species_page.lumm.mycelium")}:{" "}
                          {t(formatLuminescence(dados?.lum_mycelium))}
                        </p>
                        <p>
                          ➔ {t("species_page.lumm.basidiome")}:{" "}
                          {t(formatLuminescence(dados?.lum_basidiome))}
                        </p>
                        <div className="space-y-4 pl-4">
                          <p>
                            ➔ {t("species_page.lumm.stipe")}:{" "}
                            {t(formatLuminescence(dados?.lum_stipe))}
                          </p>

                          <p>
                            ➔ {t("species_page.lumm.pileus")}:{" "}
                            {t(formatLuminescence(dados?.lum_pileus))}
                          </p>

                          {typeof dados?.lum_lamellae === "boolean" && (
                            <p className="pl-4">
                              ➔ {t("species_page.lumm.lamellae")}:{" "}
                              {t(formatLuminescence(dados?.lum_lamellae))}
                            </p>
                          )}

                          {typeof dados?.lum_spores === "boolean" && (
                            <p className="pl-4">
                              ➔ {t("species_page.lumm.spores")}:{" "}
                              {t(formatLuminescence(dados?.lum_spores))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="taxonomy">
                <Card>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="mb-2 underline">{t("species_page.classification")}:</p>
                      <div className="space-y-4 pl-4">
                        {parseClassification(dados?.taxonomy?.classification)?.map(
                          (item, index) => {
                            const label = taxonomyLabels[index];

                            if (!label || !item) return null;

                            return (
                              <p>
                                ➔ {t(label)}: {item}
                              </p>
                            );
                          }
                        )}
                        <p>
                          ➔ {t("species_page.taxonomy.species")}:{" "}
                          {(dados?.scientific_name?.trim().split(/\s+/).pop() || "").trim()}
                        </p>
                      </div>
                    </div>

                    {!!dados?.lineage && (
                      <div>
                        <p className="mb-2 underline">
                          {t("species_page.bioluminescent_lineage")}:
                        </p>
                        <p className="pl-4">➔ {dados?.lineage}</p>
                      </div>
                    )}

                    {!!dados?.taxonomy?.authors && (
                      <div>
                        <p className="mb-2 underline">{t("species_page.taxonomy.authors")}:</p>
                        <p className="pl-4">➔ {dados?.taxonomy?.authors}</p>
                      </div>
                    )}

                    {!!dados?.taxonomy?.years_of_effective_publication && (
                      <div>
                        <p className="mb-2 underline">
                          {t("species_page.taxonomy.year_of_publication")}:
                        </p>
                        <p className="pl-4">➔ {dados?.taxonomy?.years_of_effective_publication}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="links">
                <Card>
                  <CardContent className="space-y-4">
                    {dados?.mycobank_index_fungorum_id ? (
                      <a
                        className="hover:underline flex items-center gap-2"
                        href={`https://www.mycobank.org/MB/${dados.mycobank_index_fungorum_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Link className="w-4 h-4" /> Mycobank
                      </a>
                    ) : dados?.mycobank_type ? (
                      <>
                        <a
                          className="hover:underline flex items-center gap-2"
                          href={`https://www.mycobank.org/details/${dados.mycobank_type}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Link className="w-4 h-4" /> Mycobank
                        </a>
                      </>
                    ) : (
                      <p className="flex items-center gap-2 pointer-events-none text-muted-foreground">
                        <Link className="w-4 h-4" /> Mycobank (
                        {t("common.unavailable")?.toLowerCase()})
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <section className="mt-6 rounded-lg border border-white/15 bg-black/25 p-4 xl:max-w-[90%]">
            <p className="text-sm font-semibold text-white">{t("species_page.contribute_title")}</p>
            <p className="mt-1 text-sm text-white/70">{t("species_page.contribute_text")}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 h-9 w-fit rounded-md border-primary/60 bg-primary/10 px-3 text-sm font-semibold text-primary hover:bg-primary/20 hover:text-primary"
              onClick={() =>
                navigate(`/${lang ?? DEFAULT_LOCALE}/especie/${dados?.id}/solicitar-atualizacao`)
              }
            >
              <PencilLine className="h-4 w-4" />
              {t("species_page.request_update_cta")}
            </Button>
          </section>
        </div>

        {!!photos?.length && <Slide slides={photos} />}
      </div>
    </div>
  );
}

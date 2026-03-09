import Slide from "@/pages/species/components/slide";
import { ChevronLeft, Dna, FileText, Info, Loader2, PencilLine } from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import defaultPhoto from "@/assets/specie-card-default.webp";
import {
  extractSpeciesBibliographyLinks,
  formatLocalizedMonth,
  getLocalizedCharacteristicValue,
  getLocalizedOptionLabels,
  normalizeConservationStatusCode,
  sortPhotos,
  withNoInformationFallback,
} from "./utils";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { BibliographyCard } from "./components/bibliographyCard";
import { ConservationStatusIcon } from "@/components/conservation-status-icon";
import { CuriositiesCard } from "./components/curiositiesCard";
import { CultivationCard } from "./components/cultivationCard";
import { ExternalLinksCard } from "./components/externalLinksCard";
import { SpeciesRequestCard } from "./components/speciesRequestCard";
import { TaxonomyCard } from "./components/taxonomyCard";
import { LumCard } from "./components/lumCard";
import { FindingTipsCard } from "./components/findingTipsCard";

export default function SpeciesPage() {
  const { dados, loading, ncbiRecords, ncbiLoading } = useSpeciesPage();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const characteristics = dados?.species_characteristics;
  const isPtLanguage = i18n.language.toLowerCase().startsWith("pt");

  const visibleNcbiRecords = ncbiRecords.filter((record) =>
    typeof record.linksCount === "number" ? record.linksCount > 0 : record.linksLabel !== "0"
  );
  const bibliographyLinks = extractSpeciesBibliographyLinks(dados);

  const noInformationLabel = t("species_page.fields.no_information");
  const nutritionModesValue = getLocalizedOptionLabels(
    characteristics?.nutrition_modes,
    isPtLanguage
  );
  const growthFormsValue = getLocalizedOptionLabels(characteristics?.growth_forms, isPtLanguage);
  const substratesValue = getLocalizedOptionLabels(characteristics?.substrates, isPtLanguage);
  const habitatsValue = getLocalizedOptionLabels(characteristics?.habitats, isPtLanguage);
  const conservationStatusCode = normalizeConservationStatusCode(
    characteristics?.conservation_status
  );
  const conservationStatusLabel = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.name`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.name"),
    }
  );
  const conservationStatusDescription = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.description`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.description"),
    }
  );

  const characteristicRows: Array<{
    label: string;
    value: string | number;
    longText?: boolean;
    tooltip?: string;
  }> = [
    {
      label: t("species_page.fields.size_cm"),
      value: withNoInformationFallback(characteristics?.size_cm, noInformationLabel),
    },
    {
      label: t("species_page.fields.colors"),
      value: withNoInformationFallback(
        getLocalizedCharacteristicValue(characteristics, "colors", isPtLanguage),
        noInformationLabel
      ),
      longText: true,
    },
    {
      label: t("species_page.fields.edible"),
      value:
        characteristics?.edible === true
          ? t("species_page.lumm.yes")
          : characteristics?.edible === false
            ? t("species_page.lumm.no")
            : t("species_page.fields.no_information"),
    },
    {
      label: t("species_page.fields.growth_forms"),
      value: withNoInformationFallback(growthFormsValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.nutrition_modes"),
      value: withNoInformationFallback(nutritionModesValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.substrates"),
      value: withNoInformationFallback(substratesValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.habitats"),
      value: withNoInformationFallback(habitatsValue, noInformationLabel),
    },
    {
      label: t("species_page.fields.conservation_status"),
      value: conservationStatusLabel,
      tooltip: conservationStatusDescription,
    },
    {
      label: t("species_page.fields.general_description"),
      value:
        getLocalizedCharacteristicValue(characteristics, "general_description", isPtLanguage) ||
        t("species_page.fields.no_information"),
      longText: true,
    },
  ];

  const sectionCardClass = "rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-[1px]";
  const sectionCardContentClass = "space-y-3 px-4 py-2";
  const sectionTitleWrapClass = "mb-2 flex items-center gap-2.5";
  const sectionIconWrapClass = "text-primary/90";
  const sectionTitleClass = "text-[1.2rem] font-semibold tracking-tight text-white/95";
  const rowLabelClass = "text-[0.98rem] text-white/72";
  const rowValueClass = "text-[0.98rem] font-medium text-white/90";

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
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-8">
        <div className="text-white max-xl:order-1">
          <header className="xl:max-w-[95%]">
            <div className="flex items-center gap-5 xl:gap-6">
              <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] italic tracking-tight">
                {dados?.scientific_name}
              </h1>
              <ConservationStatusIcon
                code={conservationStatusCode}
                description={conservationStatusDescription}
              />
            </div>
          </header>

          <div className="mt-6 space-y-4 xl:max-w-[95%]">
            <LumCard
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              characteristics={dados?.species_characteristics}
            />

            <TaxonomyCard
              show={Boolean(
                dados?.taxonomy?.classification ||
                  dados?.taxonomy?.authors ||
                  dados?.taxonomy?.years_of_effective_publication
              )}
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              rowLabelClass={rowLabelClass}
              rowValueClass={rowValueClass}
              species={dados}
            />

            <Card className={sectionCardClass}>
              <CardContent className={sectionCardContentClass}>
                <div className={sectionTitleWrapClass}>
                  <span className={sectionIconWrapClass}>
                    <Dna className="h-4 w-4" />
                  </span>
                  <p className={sectionTitleClass}>{t("species_page.molecular_info.title")}</p>
                </div>
                {ncbiLoading ? (
                  <div className="rounded-xl border border-white/10 px-3 py-4 text-sm text-white/65">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      {t("common.loading")}
                    </div>
                  </div>
                ) : visibleNcbiRecords.length ? (
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <table className="w-full table-fixed border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.03]">
                          <th className="w-1/2 px-3 py-2 text-left text-sm font-semibold text-white/80">
                            {t("species_page.molecular_info.database_name")}
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-white/80">
                            {t("species_page.molecular_info.links")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleNcbiRecords.map((record) => (
                          <tr
                            key={`${record.databaseName}-${record.linksLabel}`}
                            className="border-b border-white/10 last:border-b-0"
                          >
                            <td className="px-3 py-2 text-[0.98rem] text-white/88">
                              {record.databaseName}
                            </td>
                            <td className="px-3 py-2 text-[0.98rem] font-medium text-white/92">
                              {record.url ? (
                                <a
                                  className="text-primary underline underline-offset-2 hover:opacity-85"
                                  href={record.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {record.linksLabel}
                                </a>
                              ) : (
                                record.linksLabel
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[0.98rem] text-white/72">
                    {t("species_page.molecular_info.no_records")}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className={sectionCardClass}>
              <CardContent className={sectionCardContentClass}>
                <div className={sectionTitleWrapClass}>
                  <span className={sectionIconWrapClass}>
                    <FileText className="h-4 w-4" />
                  </span>
                  <p className={sectionTitleClass}>{t("species_page.sections.characteristics")}</p>
                </div>
                {characteristicRows.length ? (
                  <div className="space-y-2">
                    {characteristicRows.map((row) =>
                      (() => {
                        const useLongTextLayout =
                          row.longText || (typeof row.value === "string" && row.value.length > 70);
                        return (
                          <div
                            key={row.label}
                            className={`border-b border-white/10 pb-2 last:border-b-0 ${
                              useLongTextLayout
                                ? "space-y-1"
                                : "flex items-center justify-between gap-4"
                            }`}
                          >
                            <p className={rowLabelClass}>{row.label}</p>
                            <div
                              className={`flex items-center gap-1.5 ${
                                useLongTextLayout ? "justify-start" : "max-w-[55%] justify-end"
                              }`}
                            >
                              <p
                                className={`${rowValueClass} ${
                                  useLongTextLayout
                                    ? "text-left leading-relaxed text-white/88"
                                    : "break-words text-right"
                                }`}
                              >
                                {row.value}
                              </p>
                              {row.tooltip ? (
                                <span title={row.tooltip} className="inline-flex">
                                  <Info className="h-3.5 w-3.5 text-white/50" />
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-white/55">{t("common.unavailable")}</p>
                )}
              </CardContent>
            </Card>

            <FindingTipsCard
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              rowLabelClass={rowLabelClass}
              findingTipsValue={
                getLocalizedCharacteristicValue(characteristics, "finding_tips", isPtLanguage) ||
                t("species_page.fields.no_information")
              }
              isPtLanguage={isPtLanguage}
              noInformationLabel={noInformationLabel}
              seasonStart={formatLocalizedMonth(i18n.language, characteristics?.season_start_month)}
              seasonEnd={formatLocalizedMonth(i18n.language, characteristics?.season_end_month)}
              species={dados}
              locale={locale}
            />

            <CultivationCard
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              cultivation={
                getLocalizedCharacteristicValue(characteristics, "cultivation", isPtLanguage) ||
                t("species_page.fields.no_information")
              }
            />

            <CuriositiesCard
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              curiosities={
                getLocalizedCharacteristicValue(characteristics, "curiosities", isPtLanguage) ||
                t("species_page.fields.no_information")
              }
            />

            <BibliographyCard
              links={bibliographyLinks}
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
            />

            <ExternalLinksCard
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              species={dados}
            />

            <SpeciesRequestCard
              onClick={() => navigate(`/${locale}/especie/${dados?.id}/solicitar-atualizacao`)}
            />
          </div>
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          {!!photos?.length && <Slide slides={photos} />}
          <section className="mt-6 hidden rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5 xl:block">
            <p className="text-sm font-semibold text-white">{t("species_page.contribute_title")}</p>
            <p className="mt-1 text-sm text-white/75">{t("species_page.contribute_text")}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-9 w-fit rounded-md border-primary/60 bg-primary/10 px-3 text-sm font-semibold text-primary hover:bg-primary/20 hover:text-primary"
              onClick={() => navigate(`/${locale}/especie/${dados?.id}/solicitar-atualizacao`)}
            >
              <PencilLine className="h-4 w-4" />
              {t("species_page.request_update_cta")}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

import Slide from "@/pages/species/components/slide";
import { ChevronLeft, Loader2, PencilLine } from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import defaultPhoto from "@/assets/specie-card-default.webp";
import {
  extractSpeciesBibliographyLinks,
  formatLocalizedMonth,
  getLocalizedCharacteristicValue,
  normalizeConservationStatusCode,
  sortPhotos,
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
import { MolecularCard } from "./components/molecularCard";
import { CharacteristicsCard } from "./components/characteristicsCard";
import { CountryTypeIcon } from "@/components/country-type-icon";
import { getCountryName } from "@/lib/country-names";

export default function SpeciesPage() {
  const { dados, loading, ncbiRecords, ncbiLoading } = useSpeciesPage();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center container mx-auto px-4 my-10">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-[#00C000] font-semibold">{t("common.loading")}</p>
      </div>
    );
  }

  const locale = lang ?? DEFAULT_LOCALE;
  const characteristics = dados?.species_characteristics;
  const isPtLanguage = i18n.language.toLowerCase().startsWith("pt");
  const noInformationLabel = t("species_page.fields.no_information");
  const conservationStatusCode = normalizeConservationStatusCode(
    characteristics?.conservation_status
  );
  const conservationStatusDescription = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.description`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.description"),
    }
  );
  const conservationStatusLabel = t(
    `species_page.fields.conservation_status_values.${conservationStatusCode}.name`,
    {
      defaultValue: t("species_page.fields.conservation_status_values.NE.name"),
    }
  );
  const sectionCardClass = "rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-[1px]";
  const sectionCardContentClass = "space-y-3 px-4 py-2";
  const sectionTitleWrapClass = "mb-2 flex items-center gap-2.5";
  const sectionIconWrapClass = "text-primary/90";
  const sectionTitleClass = "text-[1.2rem] font-semibold tracking-tight text-white/95";
  const rowLabelClass = "text-[0.98rem] text-white/72";
  const rowValueClass = "text-[0.98rem] font-medium text-white/90";

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
        <div className="min-w-0 text-white max-xl:order-1">
          <header className="xl:max-w-[95%]">
            <div className="flex items-center gap-5 xl:gap-6">
              <h1 className="text-[34px] xl:text-[48px] font-bold leading-[38px] xl:leading-[52px] italic tracking-tight">
                {dados?.scientific_name}
              </h1>
              <span className="flex items-center gap-3 shrink-0">
                <CountryTypeIcon
                  country={dados?.type_country ?? ""}
                  description={t("common.type_country_description", {
                    country: getCountryName(dados?.type_country, lang ?? DEFAULT_LOCALE),
                  })}
                  imageClassName="w-12 h-12 xl:h-16 xl:w-16 shrink-0"
                />
                <ConservationStatusIcon
                  code={conservationStatusCode}
                  label={conservationStatusLabel}
                  description={conservationStatusDescription}
                />
              </span>
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

            <MolecularCard
              isLoading={ncbiLoading}
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              ncbiRecords={ncbiRecords}
            />

            <CharacteristicsCard
              sectionCardClass={sectionCardClass}
              sectionCardContentClass={sectionCardContentClass}
              sectionTitleWrapClass={sectionTitleWrapClass}
              sectionIconWrapClass={sectionIconWrapClass}
              sectionTitleClass={sectionTitleClass}
              rowLabelClass={rowLabelClass}
              rowValueClass={rowValueClass}
              conservationStatusCode={conservationStatusCode}
              characteristics={characteristics}
              isPtLanguage={isPtLanguage}
              noInformationLabel={noInformationLabel}
              conservationStatusDescription={conservationStatusDescription}
            />

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
              links={extractSpeciesBibliographyLinks(dados)}
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

        <div className="min-w-0 xl:sticky xl:top-20 xl:self-start">
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

import Slide from "@/pages/species/components/slide";
import {
  BookOpenText,
  ChevronLeft,
  ExternalLink,
  FileText,
  FlaskConical,
  Info,
  Lightbulb,
  Link2,
  Loader2,
  PencilLine,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import "@/assets/css/slide.css";
import { useSpeciesPage } from "./useSpeciesPage";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import defaultPhoto from "@/assets/specie-card-default.webp";
import {
  formatLocalizedMonth,
  getLocalizedCharacteristicValue,
  getLocalizedOptionLabels,
  normalizeConservationStatusCode,
  parseClassification,
  sortPhotos,
  taxonomyLabels,
  withNoInformationFallback,
} from "./utils";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { SimilarSpecies } from "./components/similarSpecies";
import { useIucnIcon } from "./hooks/useIucnIcon";

export default function SpeciesPage() {
  const { dados, loading } = useSpeciesPage();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const locale = lang ?? DEFAULT_LOCALE;
  const characteristics = dados?.species_characteristics;
  const isPtLanguage = i18n.language.toLowerCase().startsWith("pt");
  const hasTaxonomyData = Boolean(
    dados?.taxonomy?.classification ||
      dados?.taxonomy?.authors ||
      dados?.taxonomy?.years_of_effective_publication
  );

  const lumStatusChipClass = (status: "yes" | "no" | "unknown") => {
    if (status === "yes") return "border-emerald-400/45 bg-emerald-500/15 text-emerald-200";
    if (status === "no") return "border-rose-400/45 bg-rose-500/15 text-rose-200";
    return "border-white/20 bg-white/5 text-white/70";
  };

  const lumHierarchyRows: Array<{
    label: string;
    value: boolean | null | undefined;
    level: 0 | 1 | 2;
  }> = [
    { label: t("species_page.lumm.mycelium"), value: characteristics?.lum_mycelium, level: 0 },
    { label: t("species_page.lumm.basidiome"), value: characteristics?.lum_basidiome, level: 0 },
    { label: t("species_page.lumm.stipe"), value: characteristics?.lum_stipe, level: 1 },
    { label: t("species_page.lumm.pileus"), value: characteristics?.lum_pileus, level: 1 },
    { label: t("species_page.lumm.lamellae"), value: characteristics?.lum_lamellae, level: 2 },
    { label: t("species_page.lumm.spores"), value: characteristics?.lum_spores, level: 2 },
  ];

  const seasonStart = formatLocalizedMonth(i18n.language, characteristics?.season_start_month);
  const seasonEnd = formatLocalizedMonth(i18n.language, characteristics?.season_end_month);
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
  const conservationStatusIcon = useIucnIcon(conservationStatusCode);
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
  const nearbyTreesValue = withNoInformationFallback(
    getLocalizedCharacteristicValue(characteristics, "nearby_trees", isPtLanguage),
    noInformationLabel
  );
  const seasonValue =
    seasonStart && seasonEnd
      ? `${seasonStart} à ${seasonEnd}`
      : t("species_page.fields.no_information");

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
  ];

  const detailedCharacteristicCards: Array<{
    key: "cultivation" | "finding_tips" | "curiosities" | "general_description";
    label: string;
    value: string | number;
    icon: "flask" | "search" | "lightbulb" | "file_text";
    details?: Array<{ label: string; value: string | number }>;
  }> = [
    {
      key: "cultivation",
      label: t("species_page.fields.cultivation"),
      value:
        getLocalizedCharacteristicValue(characteristics, "cultivation", isPtLanguage) ||
        t("species_page.fields.no_information"),
      icon: "flask",
    },
    {
      key: "finding_tips",
      label: t("species_page.fields.finding_tips"),
      value:
        getLocalizedCharacteristicValue(characteristics, "finding_tips", isPtLanguage) ||
        t("species_page.fields.no_information"),
      icon: "search",
      details: [
        { label: t("species_page.fields.nearby_trees"), value: nearbyTreesValue },
        { label: t("species_page.fields.season"), value: seasonValue },
      ],
    },
    {
      key: "curiosities",
      label: t("species_page.fields.curiosities"),
      value:
        getLocalizedCharacteristicValue(characteristics, "curiosities", isPtLanguage) ||
        t("species_page.fields.no_information"),
      icon: "lightbulb",
    },
    {
      key: "general_description",
      label: t("species_page.fields.general_description"),
      value:
        getLocalizedCharacteristicValue(characteristics, "general_description", isPtLanguage) ||
        t("species_page.fields.no_information"),
      icon: "file_text",
    },
  ];

  const taxonomyRows = parseClassification(dados?.taxonomy?.classification)
    .map((item, index) => {
      const label = taxonomyLabels[index];
      if (!label || !item) return null;
      return { label: t(label), value: item, level: index };
    })
    .filter((item): item is { label: string; value: string; level: number } => Boolean(item))
    .concat({
      label: t("species_page.taxonomy.species"),
      value: (dados?.scientific_name?.trim().split(/\s+/).pop() || "").trim(),
      level: taxonomyLabels.length,
    })
    .concat({
      label: t("species_page.taxonomy.authors"),
      value: dados?.taxonomy?.authors || "",
      level: 0,
    })
    .concat({
      label: t("species_page.taxonomy.year_of_publication"),
      value: dados?.taxonomy?.years_of_effective_publication || "",
      level: 0,
    });

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
              {conservationStatusIcon ? (
                <span title={conservationStatusDescription} className="inline-flex">
                  <img
                    src={conservationStatusIcon}
                    alt={conservationStatusCode}
                    title={conservationStatusCode}
                    className="h-12 w-12 xl:h-16 xl:w-16 shrink-0"
                  />
                </span>
              ) : null}
            </div>
          </header>

          <div className="mt-6 space-y-4 xl:max-w-[95%]">
            <Card className={sectionCardClass}>
              <CardContent className={sectionCardContentClass}>
                <div className={sectionTitleWrapClass}>
                  <span className={sectionIconWrapClass}>
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <p className={sectionTitleClass}>{t("species_page.lumm.section_title")}</p>
                </div>
                <div className="space-y-1">
                  {lumHierarchyRows.map((row) => {
                    const status =
                      row.value === true
                        ? "yes"
                        : row.value === false
                          ? "no"
                          : ("unknown" as const);
                    return (
                      <div
                        key={`${row.level}-${row.label}`}
                        className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0"
                      >
                        <div
                          className="flex items-center gap-2"
                          style={{ marginLeft: `${row.level * 18}px` }}
                        >
                          {row.level > 0 ? <span className="text-white/45">↳</span> : null}
                          <p
                            className={
                              row.level === 0
                                ? "text-base font-semibold text-white/95"
                                : "text-white/85"
                            }
                          >
                            {row.label}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${lumStatusChipClass(
                            status
                          )}`}
                        >
                          {status === "yes"
                            ? t("species_page.lumm.yes")
                            : status === "no"
                              ? t("species_page.lumm.no")
                              : t("species_page.fields.no_information")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className={sectionCardClass}>
              <CardContent className={sectionCardContentClass}>
                <div className={sectionTitleWrapClass}>
                  <span className={sectionIconWrapClass}>
                    <Info className="h-4 w-4" />
                  </span>
                  <p className={sectionTitleClass}>{t("species_page.sections.characteristics")}</p>
                </div>
                {characteristicRows.length ? (
                  <div className="space-y-2">
                    {characteristicRows.map((row) =>
                      (() => {
                        const useLongTextLayout =
                          typeof row.value === "string" && row.value.length > 70;
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

            {detailedCharacteristicCards.map((item) => (
              <Card key={item.key} className={sectionCardClass}>
                <CardContent className={sectionCardContentClass}>
                  <div className={sectionTitleWrapClass}>
                    <span className={sectionIconWrapClass}>
                      {item.icon === "flask" ? (
                        <FlaskConical className="h-4 w-4" />
                      ) : item.icon === "search" ? (
                        <Search className="h-4 w-4" />
                      ) : item.icon === "lightbulb" ? (
                        <Lightbulb className="h-4 w-4" />
                      ) : item.icon === "file_text" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </span>
                    <p className={sectionTitleClass}>{item.label}</p>
                  </div>
                  <p className="text-[0.98rem] leading-relaxed text-white/88 whitespace-pre-line">
                    {item.value}
                  </p>
                  {item.details?.length ? (
                    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                      {item.details.map((detail) => {
                        const useStackedLayout =
                          typeof detail.value === "string" && detail.value.length > 48;
                        return (
                          <div
                            key={detail.label}
                            className={
                              useStackedLayout
                                ? "space-y-1"
                                : "flex items-start justify-between gap-4"
                            }
                          >
                            <p className={rowLabelClass}>{detail.label}</p>
                            <p
                              className={`text-[0.98rem] font-medium text-white/90 break-words ${
                                useStackedLayout ? "text-left" : "max-w-[60%] text-right"
                              }`}
                            >
                              {detail.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}

            {hasTaxonomyData && (
              <Card className={sectionCardClass}>
                <CardContent className={sectionCardContentClass}>
                  <div className={sectionTitleWrapClass}>
                    <span className={sectionIconWrapClass}>
                      <BookOpenText className="h-4 w-4" />
                    </span>
                    <p className={sectionTitleClass}>{t("common.taxonomy")}</p>
                  </div>
                  <div className="space-y-2">
                    {taxonomyRows
                      .filter((row) => Boolean(String(row.value || "").trim()))
                      .map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between border-b border-white/10 pb-2 last:border-b-0"
                        >
                          <div
                            className="flex items-center gap-2"
                            style={{ marginLeft: `${row.level * 12}px` }}
                          >
                            {row.level > 0 ? <span className="text-white/45">↳</span> : null}
                            <p className={rowLabelClass}>{row.label}</p>
                          </div>
                          <p className={rowValueClass}>{row.value}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={sectionCardClass}>
              <CardContent className={sectionCardContentClass}>
                <div className={sectionTitleWrapClass}>
                  <span className={sectionIconWrapClass}>
                    <Users className="h-4 w-4" />
                  </span>
                  <p className={sectionTitleClass}>{t("species_page.fields.similar_species")}</p>
                </div>
                <div className="text-[0.98rem] leading-relaxed text-white/88">
                  <SimilarSpecies similarSpecies={dados?.similar_species ?? []} locale={locale} />
                </div>
              </CardContent>
            </Card>

            <Card className={sectionCardClass}>
              <CardContent className={sectionCardContentClass}>
                <div className={sectionTitleWrapClass}>
                  <span className={sectionIconWrapClass}>
                    <Link2 className="h-4 w-4" />
                  </span>
                  <p className={sectionTitleClass}>{t("common.external_links")}</p>
                </div>
                {dados?.mycobank_index_fungorum_id ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    href={`https://www.mycobank.org/MB/${dados.mycobank_index_fungorum_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" /> Mycobank
                  </a>
                ) : dados?.mycobank_type ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    href={`https://www.mycobank.org/details/${dados.mycobank_type}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" /> Mycobank
                  </a>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4" /> Mycobank ({t("common.unavailable")?.toLowerCase()}
                    )
                  </p>
                )}
              </CardContent>
            </Card>

            <section className="xl:hidden rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5">
              <p className="text-sm font-semibold text-white">
                {t("species_page.contribute_title")}
              </p>
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

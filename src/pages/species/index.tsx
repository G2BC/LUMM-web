import Slide from "@/pages/species/components/slide";
import {
  BookOpenText,
  ChevronLeft,
  ExternalLink,
  FileText,
  Info,
  Leaf,
  Lightbulb,
  Link2,
  Loader2,
  PencilLine,
  Search,
  Sprout,
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
import { IUCN_Red_List_icons } from "@/assets/IUCN_Red_List_icons";
import {
  getLocalizedCharacteristicValue,
  parseClassification,
  sortPhotos,
  taxonomyLabels,
} from "./utils";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { SimilarSpecies } from "./components/similarSpecies";

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

  const formatMonth = (month?: number | null) => {
    if (typeof month !== "number" || month < 1 || month > 12) return null;
    const monthLabel = new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(
      new Date(2020, month - 1, 1)
    );
    return monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  };

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

  const seasonStart = formatMonth(characteristics?.season_start_month);
  const seasonEnd = formatMonth(characteristics?.season_end_month);
  const noInformationLabel = t("species_page.fields.no_information");
  const withFallback = (value: string | number | null | undefined) => {
    if (typeof value === "string") return value.trim() ? value : noInformationLabel;
    return value ?? noInformationLabel;
  };
  const nutritionModesValue = characteristics?.nutrition_modes?.length
    ? characteristics.nutrition_modes
        .map((mode) => (isPtLanguage ? mode.label_pt : mode.label_en))
        .filter(Boolean)
        .join(", ")
    : null;
  const growthFormsValue = characteristics?.growth_forms?.length
    ? characteristics.growth_forms
        .map((item) => (isPtLanguage ? item.label_pt : item.label_en))
        .filter(Boolean)
        .join(", ")
    : null;
  const substratesValue = characteristics?.substrates?.length
    ? characteristics.substrates
        .map((item) => (isPtLanguage ? item.label_pt : item.label_en))
        .filter(Boolean)
        .join(", ")
    : null;
  const habitatsValue = characteristics?.habitats?.length
    ? characteristics.habitats
        .map((habitat) => (isPtLanguage ? habitat.label_pt : habitat.label_en))
        .filter(Boolean)
        .join(", ")
    : null;
  const conservationStatusIcon =
    IUCN_Red_List_icons[
      (characteristics?.conservation_status || "")
        .trim()
        .toUpperCase() as keyof typeof IUCN_Red_List_icons
    ];

  const characteristicRows: Array<{
    label: string;
    value: string | number;
    longText?: boolean;
  }> = [
    { label: t("species_page.fields.size_cm"), value: withFallback(characteristics?.size_cm) },
    {
      label: t("species_page.fields.colors"),
      value: withFallback(getLocalizedCharacteristicValue(characteristics, "colors", isPtLanguage)),
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
      value: withFallback(growthFormsValue),
    },
    {
      label: t("species_page.fields.nutrition_modes"),
      value: withFallback(nutritionModesValue),
    },
    {
      label: t("species_page.fields.substrates"),
      value: withFallback(substratesValue),
    },
    {
      label: t("species_page.fields.habitats"),
      value: withFallback(habitatsValue),
    },
    {
      label: t("species_page.fields.nearby_trees"),
      value: withFallback(
        getLocalizedCharacteristicValue(characteristics, "nearby_trees", isPtLanguage)
      ),
      longText: true,
    },
    {
      label: t("species_page.fields.season"),
      value:
        seasonStart && seasonEnd
          ? `${seasonStart} à ${seasonEnd}`
          : t("species_page.fields.no_information"),
    },
    {
      label: t("species_page.fields.conservation_status"),
      value: withFallback(characteristics?.conservation_status),
    },
  ];

  const detailedCharacteristicCards: Array<{
    key: "cultivation" | "finding_tips" | "curiosities" | "general_description";
    label: string;
    value: string;
    icon: "sprout" | "search" | "lightbulb" | "file_text";
  }> = [
    {
      key: "cultivation",
      label: t("species_page.fields.cultivation"),
      value:
        getLocalizedCharacteristicValue(characteristics, "cultivation", isPtLanguage) ||
        t("species_page.fields.no_information"),
      icon: "sprout",
    },
    {
      key: "finding_tips",
      label: t("species_page.fields.finding_tips"),
      value:
        getLocalizedCharacteristicValue(characteristics, "finding_tips", isPtLanguage) ||
        t("species_page.fields.no_information"),
      icon: "search",
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
      return { label: t(label), value: item };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item))
    .concat({
      label: t("species_page.taxonomy.species"),
      value: (dados?.scientific_name?.trim().split(/\s+/).pop() || "").trim(),
    })
    .concat({
      label: t("species_page.taxonomy.authors"),
      value: dados?.taxonomy?.authors || "",
    })
    .concat({
      label: t("species_page.taxonomy.year_of_publication"),
      value: dados?.taxonomy?.years_of_effective_publication || "",
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
            <div className="flex items-center gap-3 xl:gap-4">
              <h1 className="text-[34px] xl:text-[50px] font-bold leading-[38px] xl:leading-[54px] italic tracking-tight">
                {dados?.scientific_name}
              </h1>
              {conservationStatusIcon ? (
                <img
                  src={conservationStatusIcon}
                  alt={characteristics?.conservation_status || "IUCN"}
                  title={characteristics?.conservation_status || "IUCN"}
                  className="h-9 w-9 xl:h-11 xl:w-11 shrink-0"
                />
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
                    <Leaf className="h-4 w-4" />
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
                            <p
                              className={`${rowValueClass} ${
                                useLongTextLayout
                                  ? "text-left leading-relaxed text-white/88"
                                  : "max-w-[55%] break-words text-right"
                              }`}
                            >
                              {row.value}
                            </p>
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
                      {item.icon === "sprout" ? (
                        <Sprout className="h-4 w-4" />
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
                          <p className={rowLabelClass}>{row.label}</p>
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

import {
  createSpeciesChangeRequest,
  fetchSpecies,
  generateSpeciesPhotoUploadUrl,
} from "@/api/species";
import { speciesKeys } from "@/api/query-keys";
import type { SpeciesPhotoRequestPayload } from "@/api/species/types/IChangeRequest";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DEFAULT_LOCALE } from "@/lib/lang";
import { useAuthStore } from "@/stores/useAuthStore";
import { IdentityStep } from "@/pages/species-request/components/identity-step";
import { PhotosStep } from "@/pages/species-request/components/photos-step";
import { ReviewStep } from "@/pages/species-request/components/review-step";
import { SpeciesDataStep } from "@/pages/species-request/components/species-data-step";
import { StepProgress } from "@/pages/species-request/components/step-progress";
import { LUMINESCENT_PART_OPTIONS, SPECIES_REQUEST_STEPS } from "@/pages/species-request/constants";
import { usePhotoUploadState } from "@/pages/species-request/hooks/use-photo-upload-state";
import type { SpeciesRequestFormValues } from "@/pages/species-request/types";
import { getFileKey, normalizeUploadUrlProtocol } from "@/pages/species-request/utils";
import { optimizeImageForUpload } from "@/pages/species-request/image-upload-optimizer";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { getLocalizedError } from "@/api/get-localized-error";

export default function SpeciesRequestPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang, species } = useParams();
  const authUser = useAuthStore((state) => state.user);

  const locale = lang ?? DEFAULT_LOCALE;
  const [currentStep, setCurrentStep] = useState(() => (authUser ? 1 : 0));

  const {
    data: speciesData,
    isLoading: loadingSpecies,
    isError: hasSpeciesError,
  } = useQuery({
    queryKey: speciesKeys.detail(species!),
    queryFn: ({ signal }) => fetchSpecies(species, signal),
    enabled: !!species,
  });
  const hasAppliedAuthenticatedDefaultsRef = useRef(false);

  const schema = useMemo(
    () =>
      z
        .object({
          requester_name: z.string().trim().min(2, t("species_request.validation.requester_name")),
          requester_email: z.string().email(t("species_request.validation.requester_email")),
          requester_institution: z.string().trim().optional(),
          request_note: z.string().trim().optional(),
          references_raw: z.string().trim().optional(),
          colors: z.string().trim().optional(),
          cultivation: z.string().trim().optional(),
          finding_tips: z.string().trim().optional(),
          nearby_trees: z.string().trim().optional(),
          curiosities: z.string().trim().optional(),
          general_description: z.string().trim().optional(),
          size_cm: z
            .string()
            .trim()
            .optional()
            .refine(
              (value) => !value || (Number.isFinite(Number(value)) && Number(value) > 0),
              t("species_request.validation.size_cm")
            ),
          season_start_month: z.string().trim().optional(),
          season_end_month: z.string().trim().optional(),
          growth_forms: z.array(z.number()).catch([]),
          nutrition_modes: z.array(z.number()).catch([]),
          substrates: z.array(z.number()).catch([]),
          habitats: z.array(z.number()).catch([]),
          luminescent_parts: z.record(
            z.enum(["mycelium", "basidiome", "stipe", "pileus", "lamellae", "spores"]),
            z.enum(["none", "add", "remove"])
          ),
        })
        .superRefine((value, context) => {
          const start = value.season_start_month?.trim();
          const end = value.season_end_month?.trim();

          if ((start && !end) || (!start && end)) {
            context.addIssue({
              code: "custom",
              path: ["season_start_month"],
              message: t("species_request.validation.season_range"),
            });
            context.addIssue({
              code: "custom",
              path: ["season_end_month"],
              message: t("species_request.validation.season_range"),
            });
          }
        }),
    [t]
  );

  const form = useForm<SpeciesRequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      requester_name: "",
      requester_email: "",
      requester_institution: "",
      request_note: "",
      references_raw: "",
      colors: "",
      cultivation: "",
      finding_tips: "",
      nearby_trees: "",
      curiosities: "",
      general_description: "",
      size_cm: "",
      season_start_month: "",
      season_end_month: "",
      growth_forms: [],
      nutrition_modes: [],
      substrates: [],
      habitats: [],
      luminescent_parts: {
        mycelium: "none",
        basidiome: "none",
        stipe: "none",
        pileus: "none",
        lamellae: "none",
        spores: "none",
      },
    },
  });

  const {
    selectedFiles,
    previewByKey,
    photoLegalByKey,
    photoErrorsByKey,
    bulkPhotoLegal,
    onPickFiles,
    onDropFiles,
    removeSelectedFile,
    updatePhotoLegal,
    updateBulkPhotoLegal,
    applyBulkPhotoLegalToAll,
    validatePhotoLegal,
  } = usePhotoUploadState(t);

  const values = form.watch();
  const totalSteps = SPECIES_REQUEST_STEPS.length;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepKey = SPECIES_REQUEST_STEPS[currentStep];

  useEffect(() => {
    if (!hasSpeciesError) return;
    void Alert({
      icon: "error",
      title: t("errors.occurred"),
      text: t("species_request.load_error_text"),
    }).then(() => navigate(`/${locale}/explorar`, { replace: true }));
  }, [hasSpeciesError, locale, navigate, t]);

  useEffect(() => {
    if (!authUser || hasAppliedAuthenticatedDefaultsRef.current) return;

    const requesterName = form.getValues("requester_name");
    const requesterEmail = form.getValues("requester_email");
    const requesterInstitution = form.getValues("requester_institution");

    if (!requesterName.trim() && authUser.name.trim()) {
      form.setValue("requester_name", authUser.name, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }

    if (!requesterEmail.trim() && authUser.email.trim()) {
      form.setValue("requester_email", authUser.email, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }

    const userInstitution = authUser.institution?.trim();
    if (!requesterInstitution?.trim() && userInstitution) {
      form.setValue("requester_institution", userInstitution, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }

    hasAppliedAuthenticatedDefaultsRef.current = true;
    setCurrentStep((prev) => (prev === 0 ? 1 : prev));
  }, [authUser, form]);

  async function handleNextStep() {
    if (currentStepKey === "identity") {
      const valid = await form.trigger(["requester_name", "requester_email"]);
      if (!valid) return;
    }

    if (currentStepKey === "photos") {
      const valid = validatePhotoLegal();
      if (!valid) {
        await Alert({
          icon: "warning",
          title: t("species_request.validation.photo_metadata_title"),
          text: t("species_request.validation.photo_metadata_text"),
        });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }

  function handlePrevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function onSubmit(formValues: SpeciesRequestFormValues) {
    if (!speciesData?.id) return;

    const normalizeIds = (value: Array<string | number>) =>
      Array.from(
        new Set(
          value
            .map((item) => (typeof item === "number" ? item : Number(String(item).trim())))
            .filter((item) => Number.isFinite(item))
        )
      );

    const growthFormIds = normalizeIds(formValues.growth_forms);
    const nutritionModeIds = normalizeIds(formValues.nutrition_modes);
    const substrateIds = normalizeIds(formValues.substrates);
    const habitatIds = normalizeIds(formValues.habitats);
    const seasonStartMonth = formValues.season_start_month
      ? Number(formValues.season_start_month)
      : undefined;
    const seasonEndMonth = formValues.season_end_month
      ? Number(formValues.season_end_month)
      : undefined;
    const structuredProposedData = Object.fromEntries(
      Object.entries({
        references_raw: formValues.references_raw,
        colors: formValues.colors,
        cultivation: formValues.cultivation,
        finding_tips: formValues.finding_tips,
        nearby_trees: formValues.nearby_trees,
        curiosities: formValues.curiosities,
        general_description: formValues.general_description,
        size_cm: formValues.size_cm ? Number(formValues.size_cm) : undefined,
        season_start_month: seasonStartMonth,
        season_end_month: seasonEndMonth,
        growth_form_ids: growthFormIds,
        nutrition_mode_ids: nutritionModeIds,
        substrate_ids: substrateIds,
        habitat_ids: habitatIds,
      }).filter(([, value]) => {
        if (typeof value === "string") return Boolean(value.trim());
        if (typeof value === "number") return Number.isFinite(value);
        if (Array.isArray(value)) return value.length > 0;
        return false;
      })
    );
    const selectedLuminescentParts = formValues.luminescent_parts;
    const luminescentPartsProposedData = Object.fromEntries(
      LUMINESCENT_PART_OPTIONS.filter((option) => {
        const action = selectedLuminescentParts[option.id];
        return action === "add" || action === "remove";
      }).map(
        (option) => [option.proposedField, selectedLuminescentParts[option.id] === "add"] as const
      )
    );
    const proposedData = {
      ...structuredProposedData,
      ...luminescentPartsProposedData,
    };

    if (!selectedFiles.length && Object.keys(proposedData).length === 0) {
      await Alert({
        icon: "warning",
        title: t("species_request.validation.missing_changes_title"),
        text: t("species_request.validation.missing_changes_text"),
      });
      return;
    }

    if (!validatePhotoLegal()) {
      await Alert({
        icon: "warning",
        title: t("species_request.validation.photo_metadata_title"),
        text: t("species_request.validation.photo_metadata_text"),
      });
      return;
    }

    try {
      const uploads: SpeciesPhotoRequestPayload[] = [];
      const declarationAcceptedAt = new Date().toISOString();

      for (const file of selectedFiles) {
        const fileKey = getFileKey(file);
        const legal = photoLegalByKey[fileKey];

        const fileToUpload = await optimizeImageForUpload(file);

        const signed = await generateSpeciesPhotoUploadUrl({
          filename: fileToUpload.name,
          mime_type: fileToUpload.type || file.type || "application/octet-stream",
          size_bytes: fileToUpload.size,
          species_id: speciesData.id,
        });

        const formData = new FormData();
        for (const [key, value] of Object.entries(signed.fields)) {
          formData.append(key, value);
        }
        formData.append("file", fileToUpload);

        const uploadResponse = await fetch(normalizeUploadUrlProtocol(signed.upload_url), {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("upload_failed");
        }

        uploads.push({
          bucket_name: signed.bucket_name,
          object_key: signed.object_key,
          license_code: legal?.license_code?.trim(),
          attribution: legal?.attribution?.trim(),
          rights_holder: legal?.rights_holder?.trim(),
          source_url: legal?.source_url?.trim() || undefined,
          lumm: Boolean(legal?.lumm),
          declaration_accepted_at: legal?.declaration_confirmed ? declarationAcceptedAt : undefined,
        });
      }

      await createSpeciesChangeRequest({
        species_id: speciesData.id,
        requester_name: formValues.requester_name,
        requester_email: formValues.requester_email,
        requester_institution: formValues.requester_institution || undefined,
        request_note: formValues.request_note || undefined,
        source_lang: i18n.language.toLowerCase().startsWith("pt") ? "pt" : "en",
        proposed_data: proposedData,
        photos: uploads,
      });

      await Alert({
        icon: "success",
        title: t("species_request.success_title"),
        text: t("species_request.success_text"),
        confirmButtonText: "OK",
      });

      navigate(`/${locale}/especie/${speciesData.id}`, { replace: true });
    } catch (error) {
      await Alert({
        icon: "error",
        title: t("errors.occurred"),
        text: getLocalizedError(error),
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold">{t("species_request.title")}</h1>
        <p className="text-white/70">
          {speciesData?.scientific_name ? (
            <Trans
              i18nKey="species_request.subtitle_with_species"
              values={{ species: speciesData.scientific_name }}
              components={{
                italic: <em className="italic" />,
              }}
            />
          ) : (
            t("species_request.subtitle")
          )}
        </p>
      </div>

      {loadingSpecies ? (
        <div className="flex items-center gap-2 text-white/70">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("common.loading")}
        </div>
      ) : (
        <Form {...form}>
          <form
            className="space-y-6 rounded-xl border border-white/15 bg-black/20 p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <StepProgress currentStep={currentStep} />

            {currentStepKey === "identity" ? <IdentityStep form={form} /> : null}
            {currentStepKey === "species" ? <SpeciesDataStep form={form} /> : null}
            {currentStepKey === "photos" ? (
              <PhotosStep
                selectedFiles={selectedFiles}
                previewByKey={previewByKey}
                photoLegalByKey={photoLegalByKey}
                photoErrorsByKey={photoErrorsByKey}
                bulkPhotoLegal={bulkPhotoLegal}
                onPickFiles={onPickFiles}
                onDropFiles={onDropFiles}
                removeSelectedFile={removeSelectedFile}
                updatePhotoLegal={updatePhotoLegal}
                updateBulkPhotoLegal={updateBulkPhotoLegal}
                applyBulkPhotoLegalToAll={applyBulkPhotoLegalToAll}
              />
            ) : null}
            {currentStepKey === "review" ? (
              <ReviewStep values={values} selectedFileCount={selectedFiles.length} />
            ) : null}

            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
              {currentStep > 0 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft className="h-4 w-4" />
                  {t("species_request.prev_step")}
                </Button>
              ) : null}

              {!isLastStep ? (
                <Button type="button" onClick={() => void handleNextStep()}>
                  {t("species_request.next_step")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={form.formState.isSubmitting}
                  onClick={() => void form.handleSubmit(onSubmit)()}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {t("species_request.submit")}
                    </>
                  )}
                </Button>
              )}

              {currentStep === 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/${locale}/especie/${speciesData?.id ?? species}`)}
                >
                  {t("common.back")}
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

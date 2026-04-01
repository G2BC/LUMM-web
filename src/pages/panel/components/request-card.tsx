import type {
  SpeciesChangeRequest,
  SpeciesReviewDecision,
} from "@/api/species/types/IChangeRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronDown, Clock3, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DecisionToggle } from "./decision-toggle";
import { StatusBadge } from "./status-badge";
import { groupProposedDataEntries } from "../useSpeciesRequestsPage";

type RequestCardProps = {
  item: SpeciesChangeRequest;
  isExpanded: boolean;
  isBusy: boolean;
  reviewNote: string;
  fieldDecisions: Record<string, SpeciesReviewDecision>;
  photoDecisions: Record<string, SpeciesReviewDecision>;
  onToggleExpand: () => void;
  onChangeReviewNote: (_value: string) => void;
  onChangeFieldDecision: (_fields: string[], _decision: SpeciesReviewDecision) => void;
  onChangePhotoDecision: (_photoId: string, _decision: SpeciesReviewDecision) => void;
  onGranularReview: () => void;
  onRejectAll: () => void;
  onPreviewPhoto: (_src: string, _alt: string) => void;
};

function resolvePhotoPreview(photo: SpeciesChangeRequest["photos"][number]): string | null {
  const preview = (photo.preview_url || "").trim();
  if (preview && /^https?:\/\//i.test(preview)) return preview;
  const source = (photo.source_url || "").trim();
  if (source && /^https?:\/\//i.test(source)) return source;
  const key = (photo.object_key || "").trim();
  if (key && /^https?:\/\//i.test(key)) return key;
  return null;
}

export function RequestCard({
  item,
  isExpanded,
  isBusy,
  reviewNote,
  fieldDecisions,
  photoDecisions,
  onToggleExpand,
  onChangeReviewNote,
  onChangeFieldDecision,
  onChangePhotoDecision,
  onGranularReview,
  onRejectAll,
  onPreviewPhoto,
}: RequestCardProps) {
  const { t, i18n } = useTranslation();

  const uiLocale = i18n.language?.toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
  const isPtLanguage = i18n.language?.toLowerCase().startsWith("pt");

  const formatDateTime = (date: string) => new Date(date).toLocaleString(uiLocale);

  const getFieldLabel = (field: string) => {
    const knownFieldLabelByKey: Record<string, string> = {
      references_raw: t("panel_requests.field_references_raw"),
      scientific_name: t("panel_requests.field_scientific_name"),
      lum_mycelium: t("panel_requests.field_lum_mycelium"),
      lum_basidiome: t("panel_requests.field_lum_basidiome"),
      lum_stipe: t("panel_requests.field_lum_stipe"),
      lum_pileus: t("panel_requests.field_lum_pileus"),
      lum_lamellae: t("panel_requests.field_lum_lamellae"),
      lum_spores: t("panel_requests.field_lum_spores"),
    };
    return (
      knownFieldLabelByKey[field] ??
      t(`panel_requests.field_${field}` as never, { defaultValue: field })
    );
  };

  const getTranslatableGroupLabel = (field: string) =>
    getFieldLabel(field).replace(/\s*\((EN|PT)\)\s*$/i, "");

  const renderValue = (value: unknown): string => {
    const getLocalizedLabel = (item: unknown) => {
      if (!item || typeof item !== "object") return null;
      if (!("label_pt" in item) || !("label_en" in item)) return null;
      const labelPt = (item as { label_pt?: unknown }).label_pt;
      const labelEn = (item as { label_en?: unknown }).label_en;
      const selectedLabel = isPtLanguage ? labelPt : labelEn;
      return typeof selectedLabel === "string" && selectedLabel.trim() ? selectedLabel : null;
    };

    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) {
      const labels = value
        .map((item) => getLocalizedLabel(item) ?? String(item))
        .filter((item) => item.trim().length > 0);
      return labels.length ? labels.join(", ") : "—";
    }
    if (typeof value === "boolean")
      return value ? t("panel_requests.value_true") : t("panel_requests.value_false");
    if (typeof value === "object") return getLocalizedLabel(value) ?? JSON.stringify(value);
    return String(value);
  };

  const getPhotoLicenseLabel = (licenseCode?: string | null) => {
    const normalizedCode = (licenseCode || "").trim();
    if (!normalizedCode) return t("panel_requests.photo_license_missing");
    if (normalizedCode === "ALL-RIGHTS-RESERVED") return t("species_request.photo_license_arr");
    return normalizedCode;
  };

  const hasStructuredChanges = Object.keys(item.proposed_data || {}).length > 0;
  const groupedProposedEntries = groupProposedDataEntries(item.proposed_data || {});

  const approvedFieldsCount = groupedProposedEntries.filter(
    (entry) => (fieldDecisions[entry.fields[0]] ?? "approve") === "approve"
  ).length;
  const rejectedFieldsCount = groupedProposedEntries.length - approvedFieldsCount;
  const approvedPhotosCount = item.photos.filter(
    (photo) => (photoDecisions[photo.id] ?? "approve") === "approve"
  ).length;
  const rejectedPhotosCount = item.photos.length - approvedPhotosCount;
  const approvedItemsCount = approvedPhotosCount + approvedFieldsCount;
  const rejectedItemsCount = rejectedPhotosCount + rejectedFieldsCount;
  const summaryOutcomeLabel =
    approvedItemsCount > 0 && rejectedItemsCount > 0
      ? t("panel_requests.status_partial_approved")
      : approvedItemsCount > 0
        ? t("panel_requests.status_approved")
        : t("panel_requests.status_rejected");

  return (
    <Card className="min-w-0">
      <CardHeader className="p-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex w-full flex-col items-start gap-2 text-left sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <p className="text-base font-semibold">
              {t("panel_requests.request_id", { id: item.id })}
            </p>
            <p className="text-xs text-slate-600">
              {t("panel_requests.species_id")}: {item.species_id} •{" "}
              {formatDateTime(item.created_at)}
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <StatusBadge status={item.status} />
            <span className="text-xs text-slate-600 sm:whitespace-nowrap">
              {t("panel_requests.photos_count", { count: item.photos.length })}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </button>
      </CardHeader>

      {isExpanded ? (
        <CardContent className="min-w-0 space-y-3 px-4 pb-4 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <p>
              <span className="font-semibold">{t("panel_requests.requester")}:</span>{" "}
              {item.requester_name || t("common.unavailable")}
            </p>
            <p>
              <span className="font-semibold">{t("panel_requests.email")}:</span>{" "}
              {item.requester_email || t("common.unavailable")}
            </p>
          </div>

          {item.request_note ? (
            <p className="rounded bg-slate-50 p-3 text-slate-700">{item.request_note}</p>
          ) : null}

          <div className="rounded border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("panel_requests.proposed_data")}
              </p>
            </div>

            {hasStructuredChanges ? (
              <div className="space-y-2 text-sm">
                {groupedProposedEntries.map((entry) => (
                  <div
                    key={entry.key}
                    className="border-b border-slate-200 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-700">
                          {entry.fields.length > 1
                            ? getTranslatableGroupLabel(entry.fields[0])
                            : getFieldLabel(entry.fields[0])}
                        </p>
                        {entry.fields.map((field) => (
                          <p key={field} className="text-slate-600">
                            <span className="font-medium">
                              {entry.fields.length > 1
                                ? `${field.endsWith("_pt") ? "PT" : "EN"}:`
                                : `${getFieldLabel(field)}:`}
                            </span>{" "}
                            {renderValue(item.current_data?.[field])} {"→"}{" "}
                            {renderValue(item.proposed_data?.[field])}
                          </p>
                        ))}
                      </div>
                      {item.status === "pending" ? (
                        <DecisionToggle
                          value={fieldDecisions[entry.fields[0]] ?? "approve"}
                          onChange={(decision) => onChangeFieldDecision(entry.fields, decision)}
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t("panel_requests.no_structured_changes")}</p>
            )}
          </div>

          <div>
            <p className="mb-1 font-semibold">
              {t("panel_requests.photos_count", { count: item.photos.length })}
            </p>
            {item.photos.length
              ? (() => {
                  const previewablePhotos = item.photos
                    .map((photo) => ({ photo, previewUrl: resolvePhotoPreview(photo) }))
                    .filter((entry) => Boolean(entry.previewUrl));

                  if (!previewablePhotos.length) {
                    return (
                      <p className="text-xs text-slate-500">
                        {t("panel_requests.photo_preview_unavailable", {
                          defaultValue: "Pré-visualização indisponível para estas fotos.",
                        })}
                      </p>
                    );
                  }

                  return (
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {previewablePhotos.map(({ photo, previewUrl }) => {
                        const alt = photo.original_filename || photo.object_key;
                        return (
                          <li
                            key={photo.id}
                            className="min-w-0 rounded-md border border-slate-200 bg-white p-2"
                          >
                            <button
                              type="button"
                              onClick={() => onPreviewPhoto(previewUrl!, alt)}
                              className="mb-2 block w-full overflow-hidden rounded"
                            >
                              <img
                                src={previewUrl!}
                                alt={alt}
                                className="h-28 w-full object-cover transition-transform hover:scale-[1.02]"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                            <p className="block min-w-0 truncate text-xs text-slate-700">
                              {photo.original_filename || photo.object_key}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-600">
                              <span className="font-semibold">
                                {t("panel_requests.photo_license")}:
                              </span>{" "}
                              {getPhotoLicenseLabel(photo.license_code)}
                            </p>
                            <p className="text-[11px] text-slate-600">
                              <span className="font-semibold">
                                {t("panel_requests.photo_attribution")}:
                              </span>{" "}
                              {photo.attribution?.trim() || "—"}
                            </p>
                            <p className="text-[11px] text-slate-600">
                              <span className="font-semibold">
                                {t("panel_requests.photo_rights_holder")}:
                              </span>{" "}
                              {photo.rights_holder?.trim() || "—"}
                            </p>
                            <p className="block min-w-0 truncate text-[11px] text-slate-500">
                              <span className="font-semibold">
                                {t("panel_requests.photo_source")}:
                              </span>{" "}
                              {photo.source_url?.trim() || "—"}
                            </p>
                            {item.status === "pending" ? (
                              <div className="mt-2">
                                <DecisionToggle
                                  value={photoDecisions[photo.id] ?? "approve"}
                                  onChange={(decision) => onChangePhotoDecision(photo.id, decision)}
                                />
                              </div>
                            ) : (
                              <div className="mt-2">
                                <StatusBadge status={photo.status} />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()
              : null}
          </div>

          {item.status === "pending" ? (
            <>
              <div className="rounded border border-sky-200 bg-sky-50 p-3 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">
                  {t("panel_requests.decision_summary_title")}
                </p>
                <p>
                  {t("panel_requests.decision_summary_structured")}:{" "}
                  {hasStructuredChanges
                    ? t("panel_requests.decision_summary_fields", {
                        approved: approvedFieldsCount,
                        rejected: rejectedFieldsCount,
                        total: groupedProposedEntries.length,
                      })
                    : t("panel_requests.decision_summary_not_applicable")}
                </p>
                <p>
                  {t("panel_requests.decision_summary_photos", {
                    approved: approvedPhotosCount,
                    rejected: rejectedPhotosCount,
                    total: item.photos.length,
                  })}
                </p>
                <p>
                  {t("panel_requests.decision_summary_result")}:{" "}
                  <span className="font-semibold">{summaryOutcomeLabel}</span>
                </p>
              </div>
              <Textarea
                rows={2}
                placeholder={t("panel_requests.review_note_placeholder")}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200"
                value={reviewNote}
                onChange={(event) => onChangeReviewNote(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={isBusy}
                  onClick={onGranularReview}
                  className="bg-[#118A2A] text-white hover:bg-[#0E7323]"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {t("panel_requests.approve_with_selection")}
                </Button>
                <Button
                  disabled={isBusy}
                  variant="destructive"
                  className="text-white"
                  onClick={onRejectAll}
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {t("panel_requests.reject_request")}
                </Button>
              </div>
            </>
          ) : (
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Clock3 className="h-3 w-3" />
              {item.reviewed_at
                ? t("panel_requests.reviewed_at", {
                    date: formatDateTime(item.reviewed_at),
                  })
                : t("panel_requests.already_reviewed")}
            </p>
          )}
        </CardContent>
      ) : null}
    </Card>
  );
}

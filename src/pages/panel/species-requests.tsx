import { listSpeciesChangeRequests, reviewSpeciesChangeRequest } from "@/api/species";
import type {
  SpeciesChangeRequest,
  SpeciesChangeRequestReviewPayload,
  SpeciesRequestStatus,
  SpeciesReviewDecision,
} from "@/api/species/types/IChangeRequest";
import { confirmAction } from "@/components/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronDown, Clock3, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function StatusBadge({ status }: { status: SpeciesRequestStatus }) {
  const { t } = useTranslation();
  const label =
    status === "approved"
      ? t("panel_requests.status_approved")
      : status === "rejected"
        ? t("panel_requests.status_rejected")
        : status === "partial_approved"
          ? t("panel_requests.status_partial_approved")
          : t("panel_requests.status_pending");

  if (status === "approved") return <Badge className="bg-emerald-600">{label}</Badge>;
  if (status === "rejected") return <Badge variant="destructive">{label}</Badge>;
  if (status === "partial_approved") return <Badge className="bg-sky-600">{label}</Badge>;
  return <Badge className="bg-amber-500 text-black">{label}</Badge>;
}

function DecisionToggle({
  value,
  onChange,
}: {
  value: SpeciesReviewDecision;
  onChange: (_: SpeciesReviewDecision) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex gap-1 rounded-md border border-slate-300 bg-white p-1">
      <Button
        type="button"
        size="sm"
        variant={value === "approve" ? "default" : "ghost"}
        className={
          value === "approve"
            ? "h-7 bg-emerald-600 px-2 text-xs text-white hover:bg-emerald-700"
            : "h-7 px-2 text-xs text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        }
        onClick={() => onChange("approve")}
      >
        <Check className="mr-1 h-3 w-3" />
        {t("panel_requests.approve")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === "reject" ? "destructive" : "ghost"}
        className={
          value === "reject"
            ? "h-7 px-2 text-xs"
            : "h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
        }
        onClick={() => onChange("reject")}
      >
        <X className="mr-1 h-3 w-3" />
        {t("panel_requests.reject")}
      </Button>
    </div>
  );
}

export default function PanelSpeciesRequestsPage() {
  const { t, i18n } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<"all" | SpeciesRequestStatus>("pending");
  const [items, setItems] = useState<SpeciesChangeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [structuredDecisions, setStructuredDecisions] = useState<
    Record<string, SpeciesReviewDecision>
  >({});
  const [photoDecisions, setPhotoDecisions] = useState<
    Record<string, Record<string, SpeciesReviewDecision>>
  >({});

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const [response, pendingSummary] = await Promise.all([
          listSpeciesChangeRequests({
            status: statusFilter === "all" ? undefined : statusFilter,
            page: 1,
            per_page: 30,
          }),
          statusFilter === "pending"
            ? Promise.resolve(null)
            : listSpeciesChangeRequests({
                status: "pending",
                page: 1,
                per_page: 1,
              }),
        ]);

        setItems(response.items);
        setPendingCount(statusFilter === "pending" ? response.total : (pendingSummary?.total ?? 0));
        setExpandedId((prev) =>
          prev && response.items.some((item) => item.id === prev)
            ? prev
            : (response.items[0]?.id ?? null)
        );

        setStructuredDecisions((prev) => {
          const next: Record<string, SpeciesReviewDecision> = {};
          response.items.forEach((item) => {
            if (item.status !== "pending") return;
            if (Object.keys(item.proposed_data || {}).length > 0) {
              next[item.id] = prev[item.id] ?? "approve";
            }
          });
          return next;
        });

        setPhotoDecisions((prev) => {
          const next: Record<string, Record<string, SpeciesReviewDecision>> = {};
          response.items.forEach((item) => {
            if (item.status !== "pending") return;
            const prevForRequest = prev[item.id] ?? {};
            next[item.id] = {};
            item.photos.forEach((photo) => {
              next[item.id][photo.id] = prevForRequest[photo.id] ?? "approve";
            });
          });
          return next;
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [statusFilter]);

  const uiLocale = i18n.language?.toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
  const formatDateTime = (date: string) => new Date(date).toLocaleString(uiLocale);
  const resolvePhotoPreview = (photo: SpeciesChangeRequest["photos"][number]) => {
    const preview = (photo.preview_url || "").trim();
    if (preview && /^https?:\/\//i.test(preview)) return preview;

    const source = (photo.source_url || "").trim();
    if (source && /^https?:\/\//i.test(source)) return source;

    const key = (photo.object_key || "").trim();
    if (key && /^https?:\/\//i.test(key)) return key;

    return null;
  };

  const getFieldLabel = (field: string) => {
    const knownFieldLabelByKey: Record<string, string> = {
      type_country: t("panel_requests.field_type_country"),
      lineage: t("panel_requests.field_lineage"),
      family: t("panel_requests.field_family"),
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

  const renderValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean")
      return value ? t("panel_requests.value_true") : t("panel_requests.value_false");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getStructuredDecision = (requestId: string) => structuredDecisions[requestId] ?? "approve";
  const getPhotoDecision = (requestId: string, photoId: string) =>
    photoDecisions[requestId]?.[photoId] ?? "approve";
  const getDecisionLabel = (decision: SpeciesReviewDecision) =>
    decision === "approve" ? t("panel_requests.approve") : t("panel_requests.reject");
  const getPhotoLicenseLabel = (licenseCode?: string | null) => {
    const normalizedCode = (licenseCode || "").trim();
    if (!normalizedCode) return t("panel_requests.photo_license_missing");
    if (normalizedCode === "ALL-RIGHTS-RESERVED") return t("species_request.photo_license_arr");
    return normalizedCode;
  };

  function updateLocalAfterReview(updated: SpeciesChangeRequest) {
    setItems((prev) => {
      const next = prev
        .map((current) => (current.id === updated.id ? updated : current))
        .filter((current) => statusFilter === "all" || current.status === statusFilter);

      setExpandedId((prevExpanded) =>
        prevExpanded && next.some((current) => current.id === prevExpanded)
          ? prevExpanded
          : (next[0]?.id ?? null)
      );

      return next;
    });

    setReviewNotes((prev) => {
      if (!prev[updated.id]) return prev;
      const next = { ...prev };
      delete next[updated.id];
      return next;
    });

    setStructuredDecisions((prev) => {
      if (!(updated.id in prev)) return prev;
      const next = { ...prev };
      delete next[updated.id];
      return next;
    });

    setPhotoDecisions((prev) => {
      if (!(updated.id in prev)) return prev;
      const next = { ...prev };
      delete next[updated.id];
      return next;
    });
  }

  async function handleReview(item: SpeciesChangeRequest, decision: SpeciesReviewDecision) {
    const confirmed = await confirmAction({
      title: t("panel_requests.confirm_title"),
      text:
        decision === "approve"
          ? t("panel_requests.confirm_approve")
          : t("panel_requests.confirm_reject"),
      confirmButtonText: t("panel_requests.confirm_yes"),
      cancelButtonText: t("panel_requests.confirm_no"),
    });

    if (!confirmed) return;

    setReviewingId(item.id);
    try {
      const updated = await reviewSpeciesChangeRequest(item.id, {
        decision,
        review_note: reviewNotes[item.id] || undefined,
      });
      updateLocalAfterReview(updated);
    } finally {
      setReviewingId(null);
    }
  }

  async function handleGranularReview(item: SpeciesChangeRequest) {
    const hasStructuredChanges = Object.keys(item.proposed_data || {}).length > 0;

    const payload: SpeciesChangeRequestReviewPayload = {
      review_note: reviewNotes[item.id] || undefined,
      photos: item.photos.map((photo) => ({
        photo_request_id: Number(photo.id),
        decision: getPhotoDecision(item.id, photo.id),
      })),
    };

    if (hasStructuredChanges) {
      payload.proposed_data_decision = getStructuredDecision(item.id);
    }

    const confirmed = await confirmAction({
      title: t("panel_requests.confirm_title"),
      text: t("panel_requests.confirm_apply_selection"),
      confirmButtonText: t("panel_requests.confirm_yes"),
      cancelButtonText: t("panel_requests.confirm_no"),
    });

    if (!confirmed) return;

    setReviewingId(item.id);
    try {
      const updated = await reviewSpeciesChangeRequest(item.id, payload);
      updateLocalAfterReview(updated);
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <section className="min-w-0 text-slate-900">
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("panel_requests.title")}</h2>
          <p className="mt-1 text-slate-600">{t("panel_requests.subtitle")}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <span className="font-semibold">{pendingCount}</span> {t("panel_requests.pending_count")}
        </div>
      </div>

      <div className="mb-4 max-w-xs">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as "all" | SpeciesRequestStatus)}
        >
          <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 data-[placeholder]:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-slate-200">
            <SelectValue placeholder={t("panel_requests.filter_placeholder")} />
          </SelectTrigger>
          <SelectContent className="bg-white text-slate-900">
            <SelectItem value="all" className="text-slate-900">
              {t("panel_requests.filter_all")}
            </SelectItem>
            <SelectItem value="pending" className="text-slate-900">
              {t("panel_requests.filter_pending")}
            </SelectItem>
            <SelectItem value="approved" className="text-slate-900">
              {t("panel_requests.filter_approved")}
            </SelectItem>
            <SelectItem value="partial_approved" className="text-slate-900">
              {t("panel_requests.filter_partial_approved")}
            </SelectItem>
            <SelectItem value="rejected" className="text-slate-900">
              {t("panel_requests.filter_rejected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("panel_requests.loading")}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-600">
          {t("panel_requests.empty")}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const isBusy = reviewingId === item.id;
            const isExpanded = expandedId === item.id;
            const hasStructuredChanges = Object.keys(item.proposed_data || {}).length > 0;
            const structuredDecision = hasStructuredChanges ? getStructuredDecision(item.id) : null;
            const approvedPhotosCount = item.photos.filter(
              (photo) => getPhotoDecision(item.id, photo.id) === "approve"
            ).length;
            const rejectedPhotosCount = item.photos.length - approvedPhotosCount;
            const approvedItemsCount =
              approvedPhotosCount + (structuredDecision === "approve" ? 1 : 0);
            const rejectedItemsCount =
              rejectedPhotosCount + (structuredDecision === "reject" ? 1 : 0);
            const summaryOutcomeLabel =
              approvedItemsCount > 0 && rejectedItemsCount > 0
                ? t("panel_requests.status_partial_approved")
                : approvedItemsCount > 0
                  ? t("panel_requests.status_approved")
                  : t("panel_requests.status_rejected");

            return (
              <Card key={item.id} className="min-w-0">
                <CardHeader className="p-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
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
                        {item.status === "pending" && hasStructuredChanges ? (
                          <DecisionToggle
                            value={getStructuredDecision(item.id)}
                            onChange={(decision) =>
                              setStructuredDecisions((prev) => ({
                                ...prev,
                                [item.id]: decision,
                              }))
                            }
                          />
                        ) : null}
                      </div>

                      {hasStructuredChanges ? (
                        <div className="space-y-2 text-sm">
                          {Object.entries(item.proposed_data).map(([field, afterValue]) => (
                            <div
                              key={field}
                              className="border-b border-slate-200 pb-2 last:border-0 last:pb-0"
                            >
                              <p className="font-medium text-slate-700">{getFieldLabel(field)}</p>
                              <p className="text-slate-600">
                                {renderValue(item.current_data?.[field])} {"→"}{" "}
                                {renderValue(afterValue)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          {t("panel_requests.no_structured_changes")}
                        </p>
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
                                  const photoDecision = getPhotoDecision(item.id, photo.id);

                                  return (
                                    <li
                                      key={photo.id}
                                      className="min-w-0 rounded-md border border-slate-200 bg-white p-2"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setPreviewPhoto({ src: previewUrl!, alt })}
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
                                            value={photoDecision}
                                            onChange={(decision) =>
                                              setPhotoDecisions((prev) => ({
                                                ...prev,
                                                [item.id]: {
                                                  ...(prev[item.id] || {}),
                                                  [photo.id]: decision,
                                                },
                                              }))
                                            }
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
                            {structuredDecision
                              ? getDecisionLabel(structuredDecision)
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
                          value={reviewNotes[item.id] ?? ""}
                          onChange={(event) =>
                            setReviewNotes((prev) => ({
                              ...prev,
                              [item.id]: event.target.value,
                            }))
                          }
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            disabled={isBusy}
                            onClick={() => void handleGranularReview(item)}
                            className="bg-sky-600 text-white hover:bg-sky-700"
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            {t("panel_requests.apply_selection")}
                          </Button>
                          <Button
                            disabled={isBusy}
                            onClick={() => void handleReview(item, "approve")}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            {t("panel_requests.approve_request")}
                          </Button>
                          <Button
                            disabled={isBusy}
                            variant="destructive"
                            className="text-white"
                            onClick={() => void handleReview(item, "reject")}
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
          })}
        </div>
      )}

      <Dialog
        open={Boolean(previewPhoto)}
        onOpenChange={(open) => {
          if (!open) setPreviewPhoto(null);
        }}
      >
        <DialogContent className="max-w-5xl border-slate-200 bg-white p-2 sm:max-w-4xl">
          <DialogTitle className="sr-only">{previewPhoto?.alt || "Preview"}</DialogTitle>
          {previewPhoto ? (
            <img
              src={previewPhoto.src}
              alt={previewPhoto.alt}
              className="max-h-[80vh] w-full rounded bg-white object-contain"
              referrerPolicy="no-referrer"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

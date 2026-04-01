import { listSpeciesChangeRequests, reviewSpeciesChangeRequest } from "@/api/species";
import { changeRequestKeys } from "@/api/query-keys";
import type {
  SpeciesChangeRequest,
  SpeciesChangeRequestReviewPayload,
  SpeciesRequestStatus,
  SpeciesReviewDecision,
} from "@/api/species/types/IChangeRequest";
import { confirmAction } from "@/components/confirm-action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const TRANSLATABLE_FIELD_PAIRS: Record<string, string> = {
  colors: "colors_pt",
  cultivation: "cultivation_pt",
  finding_tips: "finding_tips_pt",
  nearby_trees: "nearby_trees_pt",
  curiosities: "curiosities_pt",
  general_description: "general_description_pt",
};

const TRANSLATABLE_REVERSE_FIELD_PAIRS = Object.fromEntries(
  Object.entries(TRANSLATABLE_FIELD_PAIRS).map(([baseField, translatedField]) => [
    translatedField,
    baseField,
  ])
) as Record<string, string>;

export type GroupedProposedEntry = {
  key: string;
  fields: string[];
};

export function groupProposedDataEntries(
  proposedData: Record<string, unknown>
): GroupedProposedEntry[] {
  const grouped: GroupedProposedEntry[] = [];
  const seen = new Set<string>();

  Object.keys(proposedData || {}).forEach((field) => {
    if (seen.has(field)) return;

    const pairedField = TRANSLATABLE_FIELD_PAIRS[field] || TRANSLATABLE_REVERSE_FIELD_PAIRS[field];
    if (pairedField && Object.prototype.hasOwnProperty.call(proposedData, pairedField)) {
      const baseField = TRANSLATABLE_REVERSE_FIELD_PAIRS[field] ? pairedField : field;
      const translatedField = TRANSLATABLE_FIELD_PAIRS[baseField];
      grouped.push({ key: baseField, fields: [baseField, translatedField] });
      seen.add(baseField);
      seen.add(translatedField);
      return;
    }

    grouped.push({ key: field, fields: [field] });
    seen.add(field);
  });

  return grouped;
}

export function useSpeciesRequestsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<"all" | SpeciesRequestStatus>("pending");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [proposedDataFieldDecisions, setProposedDataFieldDecisions] = useState<
    Record<string, Record<string, SpeciesReviewDecision>>
  >({});
  const [photoDecisions, setPhotoDecisions] = useState<
    Record<string, Record<string, SpeciesReviewDecision>>
  >({});

  const { data: requestsData, isLoading: loading } = useQuery({
    queryKey: changeRequestKeys.list({ status: statusFilter }),
    queryFn: () =>
      Promise.all([
        listSpeciesChangeRequests({
          status: statusFilter === "all" ? undefined : statusFilter,
          page: 1,
          per_page: 30,
        }),
        statusFilter === "pending"
          ? Promise.resolve(null)
          : listSpeciesChangeRequests({ status: "pending", page: 1, per_page: 1 }),
      ]),
  });

  const items: SpeciesChangeRequest[] = requestsData?.[0]?.items ?? [];
  const pendingCount =
    statusFilter === "pending" ? (requestsData?.[0]?.total ?? 0) : (requestsData?.[1]?.total ?? 0);

  useEffect(() => {
    if (!requestsData) return;
    const [response] = requestsData;

    setExpandedId((prev) =>
      prev && response.items.some((item) => item.id === prev)
        ? prev
        : (response.items[0]?.id ?? null)
    );

    setProposedDataFieldDecisions((prev) => {
      const next: Record<string, Record<string, SpeciesReviewDecision>> = {};
      response.items.forEach((item) => {
        if (item.status !== "pending") return;
        const prevForRequest = prev[item.id] ?? {};
        const proposedFields = Object.keys(item.proposed_data || {});
        next[item.id] = {};
        proposedFields.forEach((field) => {
          next[item.id][field] = prevForRequest[field] ?? "approve";
        });
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
  }, [requestsData]);

  const getFieldDecision = (requestId: string, field: string): SpeciesReviewDecision =>
    proposedDataFieldDecisions[requestId]?.[field] ?? "approve";

  const getPhotoDecision = (requestId: string, photoId: string): SpeciesReviewDecision =>
    photoDecisions[requestId]?.[photoId] ?? "approve";

  const setFieldDecision = (
    requestId: string,
    fields: string[],
    decision: SpeciesReviewDecision
  ) => {
    setProposedDataFieldDecisions((prev) => ({
      ...prev,
      [requestId]: {
        ...(prev[requestId] || {}),
        ...Object.fromEntries(fields.map((field) => [field, decision])),
      },
    }));
  };

  const setPhotoDecisionFor = (
    requestId: string,
    photoId: string,
    decision: SpeciesReviewDecision
  ) => {
    setPhotoDecisions((prev) => ({
      ...prev,
      [requestId]: { ...(prev[requestId] || {}), [photoId]: decision },
    }));
  };

  function cleanReviewStateForItem(id: string) {
    setReviewNotes((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setProposedDataFieldDecisions((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPhotoDecisions((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
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
      await reviewSpeciesChangeRequest(item.id, {
        decision,
        review_note: reviewNotes[item.id] || undefined,
      });
      cleanReviewStateForItem(item.id);
      await queryClient.invalidateQueries({ queryKey: changeRequestKeys.lists() });
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
      const grouped = groupProposedDataEntries(item.proposed_data || {});
      payload.proposed_data_fields = grouped.flatMap((entry) =>
        entry.fields.map((field) => ({
          field,
          decision: getFieldDecision(item.id, entry.fields[0]),
        }))
      );
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
      await reviewSpeciesChangeRequest(item.id, payload);
      cleanReviewStateForItem(item.id);
      await queryClient.invalidateQueries({ queryKey: changeRequestKeys.lists() });
    } finally {
      setReviewingId(null);
    }
  }

  return {
    loading,
    items,
    pendingCount,
    statusFilter,
    setStatusFilter,
    reviewingId,
    reviewNotes,
    setReviewNotes,
    expandedId,
    setExpandedId,
    previewPhoto,
    setPreviewPhoto,
    getFieldDecision,
    getPhotoDecision,
    setFieldDecision,
    setPhotoDecisionFor,
    handleReview,
    handleGranularReview,
  };
}

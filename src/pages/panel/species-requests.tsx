import type { SpeciesRequestStatus } from "@/api/species/types/IChangeRequest";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequestCard } from "./components/request-card";
import { useSpeciesRequestsPage } from "./useSpeciesRequestsPage";

export default function PanelSpeciesRequestsPage() {
  const { t } = useTranslation();
  const {
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
  } = useSpeciesRequestsPage();

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
          {items.map((item) => (
            <RequestCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              isBusy={reviewingId === item.id}
              reviewNote={reviewNotes[item.id] ?? ""}
              fieldDecisions={Object.fromEntries(
                Object.keys(item.proposed_data || {}).map((field) => [
                  field,
                  getFieldDecision(item.id, field),
                ])
              )}
              photoDecisions={Object.fromEntries(
                item.photos.map((photo) => [photo.id, getPhotoDecision(item.id, photo.id)])
              )}
              onToggleExpand={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
              onChangeReviewNote={(value) =>
                setReviewNotes((prev) => ({ ...prev, [item.id]: value }))
              }
              onChangeFieldDecision={(fields, decision) =>
                setFieldDecision(item.id, fields, decision)
              }
              onChangePhotoDecision={(photoId, decision) =>
                setPhotoDecisionFor(item.id, photoId, decision)
              }
              onGranularReview={() => void handleGranularReview(item)}
              onRejectAll={() => void handleReview(item, "reject")}
              onPreviewPhoto={(src, alt) => setPreviewPhoto({ src, alt })}
            />
          ))}
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

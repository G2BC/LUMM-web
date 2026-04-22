import type { TFunction } from "i18next";
import { DETAIL_VALUE_TEXT_CLASS } from "../constants";
import type { LuminescentRow } from "../types";
import { getLuminescenceStatusPillClass, getLuminescentLevelClass } from "../utils";
import { FormSection } from "./form-section";

type LuminescenceViewSectionProps = {
  rows: LuminescentRow[];
  t: TFunction;
};

export function LuminescenceViewSection({ rows, t }: LuminescenceViewSectionProps) {
  return (
    <FormSection title={t("species_page.lumm.section_title")}>
      <div className="space-y-1">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-center justify-between gap-3 px-3 py-3 ${index < rows.length - 1 ? "border-b border-slate-200" : ""}`}
          >
            <span
              className={`flex items-center ${DETAIL_VALUE_TEXT_CLASS} ${getLuminescentLevelClass(row.level)}`}
            >
              {row.level > 0 ? (
                <span className="mr-2 text-slate-400" aria-hidden>
                  ↳
                </span>
              ) : null}
              {t(row.labelKey)}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getLuminescenceStatusPillClass(row.statusValue)}`}
            >
              {row.valueLabel}
            </span>
          </div>
        ))}
      </div>
    </FormSection>
  );
}

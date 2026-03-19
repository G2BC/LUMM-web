import type { TFunction } from "i18next";
import { DETAIL_VALUE_TEXT_CLASS } from "../constants";
import type { LuminescentRow } from "../types";
import { getLuminescenceStatusPillClass, getLuminescentLevelClass } from "../utils";

type LuminescenceViewSectionProps = {
  rows: LuminescentRow[];
  t: TFunction;
};

export function LuminescenceViewSection({ rows, t }: LuminescenceViewSectionProps) {
  return (
    <section className="space-y-2 border-t border-slate-200 pt-3">
      <h3 className="text-sm font-medium text-slate-600">{t("species_page.lumm.section_title")}</h3>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/35">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-center justify-between gap-3 px-4 py-3.5 ${index < rows.length - 1 ? "border-b border-slate-200" : ""}`}
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
    </section>
  );
}

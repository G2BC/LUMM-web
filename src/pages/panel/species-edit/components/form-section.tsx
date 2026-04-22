import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">{children}</div>
    </section>
  );
}

type UsersTotals = {
  total: number;
  active: number;
  inactive: number;
};

type UsersStatsProps = {
  totals: UsersTotals;
  totalUsersLabel: string;
  totalActiveLabel: string;
  totalInactiveLabel: string;
};

export function UsersStats({
  totals,
  totalUsersLabel,
  totalActiveLabel,
  totalInactiveLabel,
}: UsersStatsProps) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {totalUsersLabel}
        </p>
        <p className="text-xl font-semibold text-slate-900">{totals.total}</p>
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
          {totalActiveLabel}
        </p>
        <p className="text-xl font-semibold text-emerald-800">{totals.active}</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
          {totalInactiveLabel}
        </p>
        <p className="text-xl font-semibold text-zinc-800">{totals.inactive}</p>
      </div>
    </div>
  );
}

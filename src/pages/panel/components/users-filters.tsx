import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StatusFilter = "all" | "active" | "inactive";

type UsersFiltersProps = {
  search: string;
  statusFilter: StatusFilter;
  searchPlaceholder: string;
  filterAllLabel: string;
  filterActiveLabel: string;
  filterInactiveLabel: string;
  onSearchChange: (_value: string) => void;
  onStatusChange: (_value: StatusFilter) => void;
};

export function UsersFilters({
  search,
  statusFilter,
  searchPlaceholder,
  filterAllLabel,
  filterActiveLabel,
  filterInactiveLabel,
  onSearchChange,
  onStatusChange,
}: UsersFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="text-slate-900 caret-slate-900 placeholder:text-slate-400 md:max-w-xs"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("all")}
        >
          {filterAllLabel}
        </Button>
        <Button
          variant={statusFilter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("active")}
        >
          {filterActiveLabel}
        </Button>
        <Button
          variant={statusFilter === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("inactive")}
        >
          {filterInactiveLabel}
        </Button>
      </div>
    </div>
  );
}

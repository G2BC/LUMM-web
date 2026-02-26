import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type UsersPaginationProps = {
  page: number;
  pages: number;
  perPage: number;
  total: number;
  previousLabel: string;
  nextLabel: string;
  summaryLabel: (_params: { start: number; end: number; total: number }) => string;
  onPageChange: (_page: number) => void;
};

function getVisiblePages(page: number, pages: number) {
  const firstPage = Math.max(1, page - 2);
  const lastPage = Math.min(pages, page + 2);
  const items: number[] = [];

  for (let current = firstPage; current <= lastPage; current += 1) {
    items.push(current);
  }

  return items;
}

export function UsersPagination({
  page,
  pages,
  perPage,
  total,
  previousLabel,
  nextLabel,
  summaryLabel,
  onPageChange,
}: UsersPaginationProps) {
  if (pages <= 1) return null;

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);
  const visiblePages = getVisiblePages(page, pages);

  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-slate-600">{summaryLabel({ start, end, total })}</p>

      <Pagination className="mx-0 w-auto justify-start md:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-label={previousLabel}
              onClick={(event) => {
                event.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {visiblePages.map((value) => (
            <PaginationItem key={value}>
              <PaginationLink
                href="#"
                isActive={value === page}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(value);
                }}
                className="cursor-pointer"
              >
                {value}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-label={nextLabel}
              onClick={(event) => {
                event.preventDefault();
                if (page < pages) onPageChange(page + 1);
              }}
              className={page >= pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

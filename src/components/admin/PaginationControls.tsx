import type { Pagination } from "../../services/admin/admin.service";

interface Props {
  pagination?: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function PaginationControls({ pagination, onPageChange, onLimitChange }: Props) {
  if (!pagination) return null;

  const { page, totalPages, limit, total } = pagination;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
      <p className="text-sm text-slate-600">Page {page} of {Math.max(totalPages, 1)} • Total {total}</p>
      <div className="flex items-center gap-2">
        <select
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
        <button
          className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >Prev</button>
        <button
          className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >Next</button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  getApprovedBusinessRequirements,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";

const PAGE_SIZE = 10;

const formatSales = (value: string) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number)
    : value;
};

const formatDate = (value: string | null) => value
  ? new Date(value).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
  : "—";

export function ResourcesPage() {
  const [requirements, setRequirements] = useState<ApprovedBusinessRequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const payload = await getApprovedBusinessRequirements({ page, limit: PAGE_SIZE });
        if (!active) return;
        setRequirements(payload.requirements ?? []);
        setTotalPages(payload.pagination?.totalPages ?? 0);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : "Could not load approved requirements right now.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [page]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 px-6 py-16 text-center text-white lg:px-10">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-blue-600/30 blur-3xl" />
        <h1 className="relative text-4xl font-bold lg:text-6xl">Approved Business Requirements</h1>
        <p className="relative mx-auto mt-4 max-w-2xl text-lg text-blue-100">Explore approved campaign opportunities from businesses looking to grow.</p>
      </section>

      {isLoading ? <p role="status" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading approved requirements...</p> : null}
      {error ? <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {!isLoading && !error && requirements.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">No approved business requirements are available yet.</p> : null}

      {!isLoading && !error && requirements.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {requirements.map((item) => (
            <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">{item.companyName}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Approved {formatDate(item.approvedAt)}</span>
              </div>
              {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-blue-700 hover:text-blue-800">{item.url}<FiExternalLink aria-hidden="true" /></a> : null}
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current monthly sales</dt><dd className="mt-1 text-slate-800">{formatSales(item.currentMonthlySales)}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Goal monthly sales</dt><dd className="mt-1 text-slate-800">{formatSales(item.goalMonthlySales)}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Influencer scope</dt><dd className="mt-1 text-slate-800">{item.desiredInfluencerScope}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Campaign objective</dt><dd className="mt-1 text-slate-800">{item.campaignObjective}</dd></div>
              </dl>
              <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="text-sm font-semibold text-slate-900">Detailed requirements</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.detailedRequirements}</p></div>
            </article>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && totalPages > 1 ? (
        <nav aria-label="Requirements pagination" className="flex items-center justify-center gap-3">
          <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Previous</button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Next</button>
        </nav>
      ) : null}
    </div>
  );
}

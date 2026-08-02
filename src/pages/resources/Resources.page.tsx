import { useEffect, useState } from "react";
import { FiExternalLink, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  getApprovedBusinessRequirements,
  trackRequirementClickApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";

const PAGE_SIZE = 10;

export function ResourcesPage() {
  const [requirements, setRequirements] = useState<ApprovedBusinessRequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("role");
  const isUser = isAuthenticated && role === "user";
  const isAdvisor = isAuthenticated && role === "advisor";

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

  const onOpenResourceLink = async (id: string, fallbackUrl?: string) => {
    try {
      setTrackingId(id);
      const res = await trackRequirementClickApi(id);
      const targetUrl = res.url || fallbackUrl;
      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: unknown) {
      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    } finally {
      setTrackingId("");
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 px-6 py-16 text-center text-white lg:px-10">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-blue-600/30 blur-3xl" />
        <h1 className="relative text-4xl font-bold lg:text-6xl">Approved Business Requirements</h1>
        <p className="relative mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          Explore campaign requirements posted by verified advisors.
        </p>
      </section>

      {isLoading ? <p role="status" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading approved requirements...</p> : null}
      {error ? <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {!isLoading && !error && requirements.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">No approved business requirements are available yet.</p> : null}

      {!isLoading && !error && requirements.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {requirements.map((item) => (
            <article key={item._id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{item.companyName}</h2>
                <p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-slate-700">Objective:</span> {item.campaignObjective}</p>
                <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-700">Scope:</span> {item.desiredInfluencerScope}</p>
                {item.detailedRequirements ? (
                  <p className="mt-3 text-sm text-slate-600 line-clamp-3"><span className="font-semibold text-slate-700">Details:</span> {item.detailedRequirements}</p>
                ) : null}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                {isUser && item.url ? (
                  <button
                    type="button"
                    disabled={trackingId === item._id}
                    onClick={() => void onOpenResourceLink(item._id, item.url)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-60"
                  >
                    {trackingId === item._id ? "Opening..." : "View Resource Link"}
                    <FiExternalLink aria-hidden="true" />
                  </button>
                ) : isAdvisor ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    <FiLock className="h-3.5 w-3.5" />
                    Resource links are reserved for user accounts
                  </span>
                ) : (
                  <Link
                    to="/auth?role=user"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    <FiLock className="h-3.5 w-3.5 text-slate-400" />
                    Log in as User to access link
                  </Link>
                )}
              </div>
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

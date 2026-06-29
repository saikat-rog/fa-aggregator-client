import { FaCompass } from "react-icons/fa6";
import { AdvisorCard } from "../advisor/AdvisorCard";
import type { AdvisorCardData } from "../advisor/AdvisorCard";
import type { AdvisorPagination } from "../../pages/home/Home.types";

type HomeResultsSectionProps = {
  isLoading: boolean;
  error: string;
  advisors: AdvisorCardData[];
  pagination: AdvisorPagination;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function HomeResultsSection({
  isLoading,
  error,
  advisors,
  pagination,
  onPreviousPage,
  onNextPage,
}: HomeResultsSectionProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Available Financial Advisors</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-flex items-center gap-3 text-sm font-medium text-blue-700">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
            <span>Loading advisors...</span>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
            {advisors.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>

          {advisors.length === 0 ? (
            <div className="mt-8 rounded-3xl p-10 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FaCompass className="h-7 w-7" />
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-800">No exact match yet</p>
              <p className="mt-2 text-base text-slate-600">
                Try widening your filters a bit. Your ideal advisor may be one step away.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.totalPages} • {pagination.total} total advisors
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={onPreviousPage}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={onNextPage}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

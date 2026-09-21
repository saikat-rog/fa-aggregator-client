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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-[#201A2B]">
          Available Creators
        </h2>
        {pagination.total > 0 && (
          <span className="font-mono-code text-xs text-[#7A7286]">
            {pagination.total} registered
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 bg-white border border-[#E7E1D6] rounded-[20px]">
          <div className="inline-flex items-center gap-3 text-sm font-semibold text-[#6C4BFF]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
            <span>Loading creators...</span>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
            {advisors.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>

          {advisors.length === 0 ? (
            <div className="bg-white border border-[#E7E1D6] rounded-[20px] p-10 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F1ECFF] text-[#6C4BFF] mb-3">
                <FaCompass className="h-6 w-6" />
              </div>
              <p className="font-heading font-bold text-lg text-[#201A2B]">No exact match yet</p>
              <p className="mt-1 text-xs text-[#7A7286] max-w-sm mx-auto">
                Try widening your location or category filters to discover more creators nearby.
              </p>
            </div>
          ) : null}

          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#E7E1D6] bg-white p-3.5">
              <p className="font-mono-code text-xs text-[#7A7286]">
                Page {pagination.page} of {pagination.totalPages} • {pagination.total} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={onPreviousPage}
                  className="rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-1.5 font-heading text-xs font-semibold text-[#201A2B] transition hover:bg-[#F0ECE4] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={onNextPage}
                  className="rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-1.5 font-heading text-xs font-semibold text-[#201A2B] transition hover:bg-[#F0ECE4] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}

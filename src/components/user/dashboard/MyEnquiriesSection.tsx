import { FaChevronRight } from "react-icons/fa6";
import type { EnquiryPagination, UserEnquiry } from "../../../services/advisor.service";

type MyEnquiriesSectionProps = {
  enquiriesLoading: boolean;
  enquiriesError: string;
  enquiries: UserEnquiry[];
  expandedEnquiryIds: Set<string>;
  enquiryPagination: EnquiryPagination;
  onToggleExpanded: (id: string) => void;
  onOpenAdvisor: (username?: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  formatDate: (value: string | null) => string;
};

export function MyEnquiriesSection({
  enquiriesLoading,
  enquiriesError,
  enquiries,
  expandedEnquiryIds,
  enquiryPagination,
  onToggleExpanded,
  onOpenAdvisor,
  onPreviousPage,
  onNextPage,
  formatDate,
}: MyEnquiriesSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">My Enquiries</h2>
        <p className="text-sm text-slate-500">
          Page {enquiryPagination.page} of {enquiryPagination.totalPages}
        </p>
      </div>

      {enquiriesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-flex items-center gap-3 text-sm font-medium text-blue-700">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
            <span>Loading enquiries...</span>
          </div>
        </div>
      ) : enquiriesError ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {enquiriesError}
        </p>
      ) : enquiries.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">No enquiries yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {enquiries.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => onToggleExpanded(item._id)}
                  className="flex w-full items-center justify-between gap-3 p-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                        {item.category}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          item.status === "responded"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-1 truncate text-base font-semibold text-slate-900">{item.subject}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Advisor: <span className="font-medium text-slate-700">{item.advisor?.name || "Unknown"}</span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-slate-500 transition ${
                      expandedEnquiryIds.has(item._id) ? "rotate-90" : ""
                    }`}
                  >
                    <FaChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    expandedEnquiryIds.has(item._id)
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-3 pb-3 pt-2">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Enquiry Details
                          </p>
                          <div className="mt-1.5 grid gap-1 text-xs text-slate-700">
                            <p><span className="font-semibold">Category:</span> {item.category}</p>
                            <p><span className="font-semibold">Status:</span> {item.status}</p>
                            <p><span className="font-semibold">Date</span> {formatDate(item.createdAt)}</p>
                            {item.respondedAt ? (
                              <p className="text-emerald-700">
                                <span className="font-semibold">Responded:</span> {formatDate(item.respondedAt)}
                              </p>
                            ) : null}
                          </div>
                          <p className="mt-2 rounded-md bg-white px-2 py-1.5 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
                            {item.message}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Advisor Details
                          </p>
                          <div className="mt-1.5 grid gap-1 text-xs text-slate-700">
                            <p><span className="font-semibold">Name:</span> {item.advisor?.name || "Unknown"}</p>
                            <p><span className="font-semibold">Username:</span> @{item.advisor?.advisorProfile?.username || "unknown"}</p>
                            <p><span className="font-semibold">Email:</span> {item.advisor?.advisorProfile?.emailForContact || "N/A"}</p>
                            <p className="truncate"><span className="font-semibold">Website:</span> {item.advisor?.advisorProfile?.personalWebsite || "N/A"}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenAdvisor(item.advisor?.advisorProfile?.username)}
                            disabled={!item.advisor?.advisorProfile?.username}
                            className="mt-2 inline-flex items-center rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                          >
                            Show Advisor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-600">
              Page {enquiryPagination.page} of {enquiryPagination.totalPages} • {enquiryPagination.total} total enquiries
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={enquiryPagination.page <= 1}
                onClick={onPreviousPage}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={enquiryPagination.page >= enquiryPagination.totalPages}
                onClick={onNextPage}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

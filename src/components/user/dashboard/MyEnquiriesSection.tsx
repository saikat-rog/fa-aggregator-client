import { FaChevronRight } from "react-icons/fa6";
import { FiMessageCircle } from "react-icons/fi";
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
    <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 md:p-8 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-heading text-[#201A2B]">My Direct Enquiries</h2>
          <p className="text-xs text-[#7A7286] mt-0.5">
            Track conversations and enquiries you sent directly to creators.
          </p>
        </div>
        <p className="text-xs font-mono-code text-[#7A7286]">
          Page {enquiryPagination.page} of {enquiryPagination.totalPages}
        </p>
      </div>

      {enquiriesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-[#6C4BFF]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
            <span>Loading enquiries...</span>
          </div>
        </div>
      ) : enquiriesError ? (
        <p className="rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] p-4 text-xs font-medium text-[#B91C1C]">
          {enquiriesError}
        </p>
      ) : enquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6C4BFF] border border-[#E7E1D6] shadow-xs">
            <FiMessageCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold font-heading text-[#201A2B]">No enquiries yet</p>
          <p className="mt-1 text-xs text-[#7A7286]">
            Once you contact a creator, your conversation history will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {enquiries.map((item) => (
              <article key={item._id} className="rounded-2xl border border-[#E7E1D6] bg-white overflow-hidden transition shadow-xs">
                <button
                  type="button"
                  onClick={() => onToggleExpanded(item._id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-[#FAF8F5]/60 transition"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-code inline-flex rounded-full bg-[#F1ECFF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5A3FE0]">
                        {item.category}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                          item.status === "responded"
                            ? "bg-[#E4F5EC] text-[#137A50]"
                            : "bg-[#FFF8E6] text-[#B8860B]"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="inline-flex rounded-full bg-[#FAF8F5] border border-[#E7E1D6] px-2.5 py-0.5 text-[11px] font-medium text-[#7A7286]">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-1.5 truncate text-base font-bold font-heading text-[#201A2B]">{item.subject}</h3>
                    <p className="mt-0.5 text-xs text-[#7A7286]">
                      Creator: <span className="font-bold text-[#201A2B]">{item.advisor?.name || "Unknown"}</span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[#7A7286] transition ${
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
                    <div className="border-t border-[#E7E1D6] bg-[#FAF8F5] p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-[#E7E1D6] bg-white p-3.5">
                          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
                            Enquiry Details
                          </p>
                          <div className="mt-2 grid gap-1 text-xs text-[#201A2B]">
                            <p><span className="font-semibold text-[#7A7286]">Category:</span> {item.category}</p>
                            <p><span className="font-semibold text-[#7A7286]">Status:</span> {item.status}</p>
                            <p><span className="font-semibold text-[#7A7286]">Date:</span> {formatDate(item.createdAt)}</p>
                            {item.respondedAt ? (
                              <p className="text-[#137A50] font-semibold">
                                <span>Responded:</span> {formatDate(item.respondedAt)}
                              </p>
                            ) : null}
                          </div>
                          <p className="mt-3 rounded-lg border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-xs leading-relaxed text-[#201A2B] whitespace-pre-wrap font-medium">
                            {item.message}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#E7E1D6] bg-white p-3.5 flex flex-col justify-between">
                          <div>
                            <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
                              Creator Details
                            </p>
                            <div className="mt-2 grid gap-1 text-xs text-[#201A2B]">
                              <p><span className="font-semibold text-[#7A7286]">Name:</span> {item.advisor?.name || "Unknown"}</p>
                              <p><span className="font-semibold text-[#7A7286]">Username:</span> <span className="font-mono-code font-bold text-[#6C4BFF]">@{item.advisor?.advisorProfile?.username || "unknown"}</span></p>
                              <p><span className="font-semibold text-[#7A7286]">Email:</span> {item.advisor?.advisorProfile?.emailForContact || "N/A"}</p>
                              <p className="truncate"><span className="font-semibold text-[#7A7286]">Website:</span> {item.advisor?.advisorProfile?.personalWebsite || "N/A"}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenAdvisor(item.advisor?.advisorProfile?.username)}
                            disabled={!item.advisor?.advisorProfile?.username}
                            className="mt-3 btn-coral inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition disabled:opacity-50"
                          >
                            View Creator Profile →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E1D6] pt-4">
            <p className="text-xs text-[#7A7286]">
              Page {enquiryPagination.page} of {enquiryPagination.totalPages} • {enquiryPagination.total} total enquiries
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={enquiryPagination.page <= 1}
                onClick={onPreviousPage}
                className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={enquiryPagination.page >= enquiryPagination.totalPages}
                onClick={onNextPage}
                className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition disabled:opacity-50 cursor-pointer"
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

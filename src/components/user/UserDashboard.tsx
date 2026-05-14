import {
  FaBookmark,
  FaChevronRight,
  FaInbox,
  FaReadme,
  FaRotateRight,
} from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSavedAdvisors } from "../../context/SavedAdvisorsContext";
import {
  getUserMyEnquiries,
  type EnquiryPagination,
  type UserEnquiry,
} from "../../services/advisor.service";
import { AdvisorCard, type AdvisorCardData } from "../advisor/AdvisorCard";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    savedAdvisors,
    isSavedListLoading,
    savedListError,
    refreshSavedAdvisors,
  } = useSavedAdvisors();
  const [enquiries, setEnquiries] = useState<UserEnquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [enquiriesError, setEnquiriesError] = useState("");
  const [expandedEnquiryIds, setExpandedEnquiryIds] = useState<Set<string>>(
    new Set(),
  );
  const [enquiryPage, setEnquiryPage] = useState(
    Math.max(1, Number(searchParams.get("myEnquiriesPage") || "1") || 1),
  );
  const [enquiryLimit] = useState(
    Math.min(100, Math.max(1, Number(searchParams.get("myEnquiriesLimit") || "10") || 10)),
  );
  const [enquiryPagination, setEnquiryPagination] = useState<EnquiryPagination>({
    page: enquiryPage,
    limit: enquiryLimit,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("myEnquiriesPage", String(enquiryPage));
      next.set("myEnquiriesLimit", String(enquiryLimit));
      return next;
    });
  }, [enquiryPage, enquiryLimit, setSearchParams]);

  useEffect(() => {
    const loadMyEnquiries = async () => {
      try {
        setEnquiriesLoading(true);
        setEnquiriesError("");
        const payload = await getUserMyEnquiries({
          page: enquiryPage,
          limit: enquiryLimit,
        });
        const data = payload?.data ?? payload;
        const list = (data?.enquiries ?? []) as UserEnquiry[];
        const pagination = data?.pagination;
        setEnquiries(list);
        setEnquiryPagination({
          page: typeof pagination?.page === "number" ? pagination.page : enquiryPage,
          limit: typeof pagination?.limit === "number" ? pagination.limit : enquiryLimit,
          total: typeof pagination?.total === "number" ? pagination.total : list.length,
          totalPages:
            typeof pagination?.totalPages === "number" ? pagination.totalPages : 1,
        });
      } catch (error: unknown) {
        const status =
          typeof error === "object" &&
          error !== null &&
          "response" in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;
        const msg =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { msg?: string } } }).response?.data
            ?.msg === "string"
            ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
            : "Failed to load your enquiries.";

        if (status === 401 || status === 403) {
          navigate("/auth");
          return;
        }

        setEnquiriesError(msg ?? "Failed to load your enquiries.");
      } finally {
        setEnquiriesLoading(false);
      }
    };

    void loadMyEnquiries();
  }, [enquiryPage, enquiryLimit, navigate]);

  const formatDate = useMemo(
    () => (value: string | null) =>
      value
        ? new Date(value).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          })
        : "—",
    [],
  );

  const toggleExpanded = (enquiryId: string) => {
    setExpandedEnquiryIds((prev) => {
      const next = new Set(prev);
      if (next.has(enquiryId)) {
        next.delete(enquiryId);
      } else {
        next.add(enquiryId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4">
        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <FaInbox className="text-blue-600" />
            Total Enquiries
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {enquiriesLoading ? "..." : enquiryPagination.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">All enquiries submitted by you</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <FaBookmark className="text-blue-600" />
            Total Saved Advisors
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {isSavedListLoading ? "..." : savedAdvisors.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Your saved advisors list size</p>
        </article>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-800">
            <FaBookmark className="text-blue-700" />
            Saved Advisors
          </h2>
          <button
            type="button"
            onClick={() => void refreshSavedAdvisors()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FaRotateRight className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {isSavedListLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="inline-flex items-center gap-3 text-sm font-medium text-blue-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
              <span>Loading advisors...</span>
            </div>
          </div>
        ) : savedListError ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {savedListError}
          </p>
        ) : savedAdvisors.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-base font-semibold text-slate-700">No saved advisors yet</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {savedAdvisors.map((advisor) => {
              const cardData: AdvisorCardData = {
                id: advisor.id,
                name: advisor.name?.trim() || "Verified Advisor",
                username: advisor.username || "unknown",
                industries: advisor.industries ?? [],
                country: advisor.country || "Unknown country",
                state: advisor.state || "Unknown state",
                marketFocus: advisor.marketFocus ?? ["All Markets"],
                specialties:
                  advisor.expertiseIndeces?.length
                    ? advisor.expertiseIndeces
                    : advisor.marketFocus?.length
                      ? advisor.marketFocus
                      : ["General Planning"],
                about: advisor.about || "No advisor bio available yet.",
                personalWebsite: advisor.personalWebsite,
                emailForContact: advisor.emailForContact,
                socialLinks: advisor.socialLinks,
              };

              return <AdvisorCard key={advisor.id} advisor={cardData} />;
            })}
          </div>
        )}
      </section>

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
                    onClick={() => toggleExpanded(item._id)}
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
                      <h3 className="mt-1 truncate text-base font-semibold text-slate-900">
                        {item.subject}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Advisor:{" "}
                        <span className="font-medium text-slate-700">
                          {item.advisor?.name || "Unknown"}
                        </span>
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
                              <p>
                                <span className="font-semibold">Category:</span>{" "}
                                {item.category}
                              </p>
                              <p>
                                <span className="font-semibold">Status:</span>{" "}
                                {item.status}
                              </p>
                              <p>
                                <span className="font-semibold">Created:</span>{" "}
                                {formatDate(item.createdAt)}
                              </p>
                              {item.respondedAt ? (
                                <p className="text-emerald-700">
                                  <span className="font-semibold">Responded:</span>{" "}
                                  {formatDate(item.respondedAt)}
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
                              <p>
                                <span className="font-semibold">Name:</span>{" "}
                                {item.advisor?.name || "Unknown"}
                              </p>
                              <p>
                                <span className="font-semibold">Username:</span>{" "}
                                @{item.advisor?.advisorProfile?.username || "unknown"}
                              </p>
                              <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {item.advisor?.advisorProfile?.emailForContact || "N/A"}
                              </p>
                              <p className="truncate">
                                <span className="font-semibold">Website:</span>{" "}
                                {item.advisor?.advisorProfile?.personalWebsite || "N/A"}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const username = item.advisor?.advisorProfile?.username;
                                if (!username) return;
                                navigate(`/${username}`);
                              }}
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
                Page {enquiryPagination.page} of {enquiryPagination.totalPages} •{" "}
                {enquiryPagination.total} total enquiries
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={enquiryPagination.page <= 1}
                  onClick={() => setEnquiryPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={enquiryPagination.page >= enquiryPagination.totalPages}
                  onClick={() =>
                    setEnquiryPage((prev) =>
                      Math.min(enquiryPagination.totalPages, prev + 1),
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <section>
        <div className="w-full rounded-2xl p-5 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full text-blue-700">
            <FaReadme className="h-10 w-10" />
          </span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            Daily Growth
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            Grow yourself by daily reading
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Explore insights and stay sharp with fresh blog content.
          </p>
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Read Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;

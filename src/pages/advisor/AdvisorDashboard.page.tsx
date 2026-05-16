import { useEffect, useMemo, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import ApplicationForm from "../../components/advisor/ApplicationForm";
import {
  advisorProfileAnalyticsApi,
  getMyEnquiries,
  markEnquiryResponded,
  type Enquiry,
  type EnquiryPagination,
} from "../../services/advisor.service";

const platformWarnings = [
  {
    id: "claims",
    label: "Do not promise guaranteed returns in profile or DMs.",
    severity: "high",
  },
  {
    id: "disclosure",
    label: "All paid partnerships and referral commissions must be disclosed.",
    severity: "medium",
  },
  {
    id: "social",
    label:
      "External social links must belong to verified advisor accounts only.",
    severity: "medium",
  },
  {
    id: "response",
    label:
      "Repeated unresponsiveness to user leads can lower profile visibility.",
    severity: "low",
  },
];

const AdvisorDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applicationStatus, setApplicationStatus] = useState<number | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [profileClicks, setProfileClicks] = useState<number>(-1);
  const [socialClicks, setSocialClicks] = useState<number>(-1);
  const [emailClicks, setEmailClicks] = useState<number>(-1);
  const [websiteClicks, setWebsiteClicks] = useState<number>(-1);
  const [profileShareClicks, setProfileShareClicks] = useState<number>(-1);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [enquiriesError, setEnquiriesError] = useState<string | null>(null);
  const [rowUpdatingId, setRowUpdatingId] = useState<string | null>(null);
  const [rowActionError, setRowActionError] = useState<string | null>(null);
  const [enquiryReloadTick, setEnquiryReloadTick] = useState(0);

  const [enquiryPage, setEnquiryPage] = useState(
    Math.max(1, Number(searchParams.get("enquiryPage") || "1") || 1),
  );
  const [enquiryLimit, setEnquiryLimit] = useState(() => {
    const raw = Number(searchParams.get("enquiryLimit") || "10") || 10;
    return Math.min(100, Math.max(1, raw));
  });
  const [enquiryPagination, setEnquiryPagination] = useState<EnquiryPagination>({
    page: enquiryPage,
    limit: enquiryLimit,
    total: 0,
    totalPages: 1,
  });

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

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const payload = await advisorProfileAnalyticsApi();
        const data = payload?.data ?? payload;

        if (data?.applicationStatus === null) {
          setApplicationStatus(null);
        } else {
          setApplicationStatus(
            typeof data?.applicationStatus === "number"
              ? data.applicationStatus
              : null,
          );
        }
        setRejectionReason(
          typeof data?.rejectionReason === "string" ? data.rejectionReason : "",
        );
        setProfileClicks(
          typeof data?.profileClicks === "number" ? data.profileClicks : -1,
        );
        setSocialClicks(
          typeof data?.socialClicks === "number" ? data.socialClicks : -1,
        );
        setEmailClicks(
          typeof data?.emailClicks === "number" ? data.emailClicks : -1,
        );
        setWebsiteClicks(
          typeof data?.websiteClicks === "number" ? data.websiteClicks : -1,
        );
        setProfileShareClicks(
          typeof data?.profileShareClicks === "number"
            ? data.profileShareClicks
            : -1,
        );
      } catch {
        setApplicationStatus(null);
        setRejectionReason("");
        setProfileClicks(-1);
        setSocialClicks(-1);
        setEmailClicks(-1);
        setWebsiteClicks(-1);
        setProfileShareClicks(-1);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("enquiryPage", String(enquiryPage));
      next.set("enquiryLimit", String(enquiryLimit));
      return next;
    });
  }, [enquiryPage, enquiryLimit, setSearchParams]);

  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        setEnquiriesLoading(true);
        setEnquiriesError(null);
        const payload = await getMyEnquiries({
          page: enquiryPage,
          limit: enquiryLimit,
        });
        const data = payload?.data ?? payload;
        const list = Array.isArray(data?.enquiries) ? data.enquiries : [];
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
        const msg =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { msg?: string } } }).response?.data
            ?.msg === "string"
            ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
            : "Failed to load enquiries.";
        setEnquiriesError(msg ?? "Failed to load enquiries.");
      } finally {
        setEnquiriesLoading(false);
      }
    };

    loadEnquiries();
  }, [enquiryPage, enquiryLimit, enquiryReloadTick]);

  useEffect(() => {
    if (!rowActionError) return;
    const timer = window.setTimeout(() => setRowActionError(null), 2800);
    return () => window.clearTimeout(timer);
  }, [rowActionError]);

  const handleApplicationSubmitted = () => {
    setApplicationStatus(-1);
    setRejectionReason("");
  };

  const renderMetricValue = (value: number) =>
    applicationStatus !== 1 ? (
      <span title="Locked" aria-label="Locked">
        🔒
      </span>
    ) : value === -1 ? (
      <span title="Locked" aria-label="Locked">
        🔒
      </span>
    ) : (
      value
    );

  const handleMarkResponded = async (enquiryId: string) => {
    try {
      setRowUpdatingId(enquiryId);
      setRowActionError(null);
      const payload = await markEnquiryResponded(enquiryId);
      const updated = payload?.data?.enquiry as Enquiry | undefined;

      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === enquiryId
            ? {
                ...item,
                status: "responded",
                respondedAt: updated?.respondedAt ?? item.respondedAt ?? new Date().toISOString(),
                updatedAt: updated?.updatedAt ?? item.updatedAt,
              }
            : item,
        ),
      );
    } catch (error: unknown) {
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Failed to update enquiry status.";
      setRowActionError(msg ?? "Failed to update enquiry status.");
    } finally {
      setRowUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-linear-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-100">
        <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          Advisor Workspace
        </p>
        <h1 className="mt-3 text-3xl font-bold">Financial Advisor Dashboard</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Grow your visibility, manage listing status, and track how prospects
          engage with your profile.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Profile Clicks
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(profileClicks)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Profile opens tracked</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Social Clicks
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(socialClicks)}
          </p>
          <p className="mt-1 text-xs text-slate-500">All social CTA clicks</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Email Clicks
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(emailClicks)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Email CTA clicks</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Website Clicks
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(websiteClicks)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Website CTA clicks</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Profile Shares
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(profileShareClicks)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Share button clicks</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {applicationStatus === 1 ? (
          <article className="flex min-h-65 items-center rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-green-50 to-emerald-100 p-8 shadow-sm">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-4xl text-white shadow-lg shadow-emerald-200">
                <FaCircleCheck className="text-5xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-emerald-800">
                  You are a listed advisor with us.
                </h2>
                <p className="mt-2 text-base text-emerald-900">
                  Your profile is approved and visible to users. Keep your
                  details updated to maximize lead quality.
                </p>
              </div>
            </div>
          </article>
        ) : (
          <div className="space-y-3">
            {applicationStatus === -1 ? (
              <article className="flex h-full min-h-65 items-center justify-center rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 via-yellow-50 to-amber-100 p-6 shadow-sm">
                <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-3xl text-white shadow-md shadow-amber-200">
                    ⏳
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-800">
                      Your listing application is pending.
                    </h2>
                    <p className="mt-2 text-sm text-amber-900">
                      Please wait for admin approval. We will notify you once
                      review is complete.
                    </p>
                  </div>
                </div>
              </article>
            ) : null}
            {applicationStatus === 0 ? (
              <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-semibold text-rose-700">
                  Your previous listing application was rejected.
                </p>
                <p className="mt-1 text-sm text-rose-800">
                  Please update your profile details and submit a fresh
                  application.
                </p>
                {rejectionReason ? (
                  <p className="mt-2 rounded-lg border border-rose-200 bg-white p-2 text-sm text-rose-700">
                    Rejection reason: {rejectionReason}
                  </p>
                ) : null}
              </article>
            ) : applicationStatus === null ? (
              <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  Welcome! Start your listing application.
                </p>
                <p className="mt-1 text-sm text-blue-800">
                  You are a fresh advisor on the platform. Fill in your details
                  to get reviewed.
                </p>
              </article>
            ) : null}
            {applicationStatus === null || applicationStatus === 0 ? (
              <ApplicationForm onSubmitted={handleApplicationSubmitted} />
            ) : null}
          </div>
        )}

        <article className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900">
            Platform Warning & Compliance Notes
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            Please follow these rules to keep your advisor listing active and
            visible on FinBlue.
          </p>
          <div className="mt-4 space-y-2">
            {platformWarnings.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
              >
                <p className="text-sm text-slate-700">{item.label}</p>
                <span
                  className={`inline-flex min-w-30 justify-center rounded-full px-2 py-2 text-sm font-semibold ${
                    item.severity === "high"
                      ? "bg-rose-100 text-rose-700"
                      : item.severity === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.severity === "high"
                    ? "High Priority"
                    : item.severity === "medium"
                      ? "Important"
                      : "Advisory"}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">My Enquiries</h2>
            <p className="mt-1 text-sm text-slate-600">
              Track incoming enquiries and mark them as responded.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <span>Per page</span>
            <select
              value={enquiryLimit}
              onChange={(event) => {
                const nextLimit = Number(event.target.value);
                setEnquiryLimit(nextLimit);
                setEnquiryPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>

        {enquiriesLoading ? (
          <div className="mt-6 flex items-center justify-center py-10">
            <div className="inline-flex items-center gap-3 text-sm font-medium text-blue-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
              Loading enquiries...
            </div>
          </div>
        ) : enquiriesError ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-medium text-rose-700">{enquiriesError}</p>
            <button
              type="button"
              onClick={() => setEnquiryReloadTick((prev) => prev + 1)}
              className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-base font-semibold text-slate-700">No enquiries yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Once users contact you, they will show up here.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Message</th>
                  <th className="px-3 py-3">Submitted By</th>
                  <th className="px-3 py-3">Created</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Responded At</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="align-top">
                    <td className="px-3 py-3 text-sm text-slate-700">{enquiry.category}</td>
                    <td className="px-3 py-3 text-sm font-medium text-slate-800">
                      {enquiry.subject}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">
                      <p className="max-w-xs whitespace-pre-wrap">{enquiry.message}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">
                      <p className="font-medium text-slate-800">
                        {enquiry.submittedBy?.name || "Unknown"}
                      </p>
                      <p>{enquiry.submittedBy?.email || "N/A"}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          enquiry.status === "responded"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">
                      {formatDate(enquiry.respondedAt)}
                    </td>
                    <td className="px-3 py-3">
                      {enquiry.status === "pending" ? (
                        <button
                          type="button"
                          disabled={rowUpdatingId === enquiry._id}
                          onClick={() => handleMarkResponded(enquiry._id)}
                          className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                          {rowUpdatingId === enquiry._id
                            ? "Updating..."
                            : "Mark Responded"}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700">
                          Responded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600">
                Page {enquiryPagination.page} of {enquiryPagination.totalPages} •{" "}
                {enquiryPagination.total} total enquiries
              </p>
              <div className="inline-flex items-center gap-2">
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
          </div>
        )}
      </section>

      {rowActionError ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-lg">
          {rowActionError}
        </div>
      ) : null}
    </div>
  );
};

export default AdvisorDashboardPage;

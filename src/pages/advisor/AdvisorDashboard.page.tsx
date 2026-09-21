import { useEffect, useMemo, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useLocation, useSearchParams } from "react-router-dom";
import ApplicationForm from "../../components/advisor/ApplicationForm";
// import { LoginMethodsCard } from "../../components/auth/LoginMethodsCard";
import {
  advisorProfileAnalyticsApi,
  getMyEnquiries,
  markEnquiryResponded,
  type Enquiry,
  type EnquiryPagination,
} from "../../services/advisor.service";
import { getMyRequirementClicks, type RequirementClickItem } from "../../services/businessRequirements.service";
import { getMySubmittedCampaignApplicationsApi, type CampaignApplicationItem } from "../../services/campaignApplications.service";
import { FiExternalLink, FiMousePointer } from "react-icons/fi";


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
      "External social links must belong to verified creator accounts only.",
    severity: "medium",
  },
  {
    id: "response",
    label:
      "Repeated unresponsiveness to business leads can lower profile visibility.",
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
  const [resourceClicks, setResourceClicks] = useState<number>(-1);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [resourceClickRows, setResourceClickRows] = useState<RequirementClickItem[]>([]);
  const [resourceClicksLoading, setResourceClicksLoading] = useState(true);
  const [resourceClicksError, setResourceClicksError] = useState<string | null>(null);
  const [clicksPage, setClicksPage] = useState(1);
  const [clicksLimit, setClicksLimit] = useState(10);
  const [clicksPagination, setClicksPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [mySubmittedApps, setMySubmittedApps] = useState<CampaignApplicationItem[]>([]);
  const [mySubmittedAppsLoading, setMySubmittedAppsLoading] = useState(true);
  const [totalSubmittedAppsCount, setTotalSubmittedAppsCount] = useState(0);

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
        setResourceClicks(
          typeof data?.resourceClicks === "number"
            ? data.resourceClicks
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
        setResourceClicks(-1);
      } finally {

        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  useEffect(() => {
    const loadSubmittedApps = async () => {
      try {
        setMySubmittedAppsLoading(true);
        const res = await getMySubmittedCampaignApplicationsApi({ limit: 100 });
        setMySubmittedApps(res.applications || []);
        setTotalSubmittedAppsCount(res.totalApplied || res.applications?.length || 0);
      } catch {
        // ignore
      } finally {
        setMySubmittedAppsLoading(false);
      }
    };
    void loadSubmittedApps();
  }, []);

  useEffect(() => {
    const loadClicks = async () => {
      try {
        setResourceClicksLoading(true);
        setResourceClicksError(null);
        const payload = await getMyRequirementClicks({ page: clicksPage, limit: clicksLimit });
        setResourceClickRows(payload.clicks ?? []);
        setClicksPagination(payload.pagination ?? { page: clicksPage, limit: clicksLimit, total: 0, totalPages: 1 });
      } catch (err: unknown) {
        setResourceClicksError(err instanceof Error ? err.message : "Failed to load resource clicks.");
      } finally {
        setResourceClicksLoading(false);
      }
    };
    void loadClicks();
  }, [clicksPage, clicksLimit]);

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#store-application") {
      const timer = setTimeout(() => {
        const el = document.getElementById("store-application");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);



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
      {/* Header Banner */}
      <section className="rounded-[24px] bg-[#201A2B] p-6 md:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6C4BFF]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-16 h-48 w-48 rounded-full bg-[#FF5A36]/15 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono-code text-xs font-bold uppercase tracking-wider text-[#FF8E75]">
            Creator Workspace
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold font-heading text-white">Creator Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80 leading-relaxed">
            Grow your visibility, manage listing status, and track how brands and prospects
            engage with your profile.
          </p>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
            Profile Clicks
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#201A2B]">
            {analyticsLoading ? "..." : renderMetricValue(profileClicks)}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Opens tracked</p>
        </article>

        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
            Link Clicks
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#201A2B]">
            {analyticsLoading ? "..." : renderMetricValue(resourceClicks)}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Requirement clicks</p>
        </article>

        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
            Social Clicks
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#201A2B]">
            {analyticsLoading ? "..." : renderMetricValue(socialClicks)}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Social CTA clicks</p>
        </article>

        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
            Email Clicks
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#201A2B]">
            {analyticsLoading ? "..." : renderMetricValue(emailClicks)}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Email CTA clicks</p>
        </article>

        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
            Website Clicks
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#201A2B]">
            {analyticsLoading ? "..." : renderMetricValue(websiteClicks)}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Website clicks</p>
        </article>

        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
            Profile Shares
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#201A2B]">
            {analyticsLoading ? "..." : renderMetricValue(profileShareClicks)}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Share clicks</p>
        </article>

        <article className="rounded-[18px] border border-[#E7E1D6] bg-white p-4 shadow-xs col-span-2 sm:col-span-1">
          <p className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#5A3FE0]">
            Applied
          </p>
          <p className="mt-2 font-heading text-2xl md:text-3xl font-extrabold text-[#6C4BFF]">
            {mySubmittedAppsLoading ? "..." : totalSubmittedAppsCount}
          </p>
          <p className="mt-1 text-[11px] text-[#7A7286]">Campaign pitches</p>
        </article>
      </section>

      {/* Listing Status & Compliance Row */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {applicationStatus === 1 ? (
          <article className="flex min-h-[220px] items-center rounded-[22px] border border-[#E7E1D6] bg-[#E4F5EC] p-6 md:p-8 shadow-xs">
            <div className="flex flex-col items-center text-center gap-3 w-full">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1F9D6B] text-3xl text-white shadow-sm">
                <FaCircleCheck className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading text-[#137A50]">
                  You are a listed creator with us
                </h2>
                <p className="mt-2 text-sm text-[#137A50]/90 max-w-md mx-auto">
                  Your profile is approved and visible to brands. Keep your
                  details updated to maximize campaign collaborations.
                </p>
              </div>
            </div>
          </article>
        ) : (
          <div className="space-y-3">
            {applicationStatus === -1 ? (
              <article className="flex h-full min-h-[220px] items-center justify-center rounded-[22px] border border-[#E7E1D6] bg-[#FFF8E6] p-6 shadow-xs">
                <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D97706] text-2xl text-white shadow-sm">
                    ⏳
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-heading text-[#B8860B]">
                      Your listing application is pending
                    </h2>
                    <p className="mt-1.5 text-xs text-[#B8860B]/90">
                      Please wait for admin approval. We will notify you once review is complete.
                    </p>
                  </div>
                </div>
              </article>
            ) : null}
            {applicationStatus === 0 ? (
              <article className="rounded-[22px] border border-[#FEE2E2] bg-[#FEF2F2] p-5">
                <p className="text-sm font-bold font-heading text-[#B91C1C]">
                  Your previous listing application was rejected.
                </p>
                <p className="mt-1 text-xs text-[#B91C1C]/90">
                  Please update your profile details and submit a fresh application.
                </p>
                {rejectionReason ? (
                  <p className="mt-2 rounded-xl border border-[#FEE2E2] bg-white p-3 text-xs text-[#B91C1C]">
                    Rejection reason: {rejectionReason}
                  </p>
                ) : null}
              </article>
            ) : applicationStatus === null ? (
              <article className="rounded-[22px] border border-[#E7E1D6] bg-[#F1ECFF] p-5">
                <p className="text-sm font-bold font-heading text-[#5A3FE0]">
                  Welcome! Start your creator listing application.
                </p>
                <p className="mt-1 text-xs text-[#5A3FE0]/90">
                  You are a fresh creator on the platform. Fill in your details below to get reviewed.
                </p>
              </article>
            ) : null}
            {applicationStatus === null || applicationStatus === 0 ? (
              <ApplicationForm onSubmitted={handleApplicationSubmitted} />
            ) : null}
          </div>
        )}

        {/* Platform Compliance Notes */}
        <article className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold font-heading text-[#201A2B]">
            Platform Guidelines & Compliance
          </h2>
          <p className="mt-1 text-xs text-[#7A7286]">
            Follow these rules to keep your creator listing active and visible on Folksmint.
          </p>
          <div className="mt-4 space-y-2.5">
            {platformWarnings.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-xs"
              >
                <p className="text-[#201A2B] font-medium">{item.label}</p>
                <span
                  className={`inline-flex shrink-0 font-mono-code justify-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    item.severity === "high"
                      ? "bg-[#FEE2E2] text-[#B91C1C]"
                      : item.severity === "medium"
                        ? "bg-[#FFF8E6] text-[#B8860B]"
                        : "bg-[#F1ECFF] text-[#5A3FE0]"
                  }`}
                >
                  {item.severity === "high"
                    ? "High"
                    : item.severity === "medium"
                      ? "Important"
                      : "Advisory"}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Enquiries Section */}
      {applicationStatus === 1 ? (
        <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#201A2B]">Received Enquiries</h2>
              <p className="mt-0.5 text-xs text-[#7A7286]">
                Track incoming enquiries and mark them as responded.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#7A7286]">
              <span>Per page</span>
              <select
                value={enquiryLimit}
                onChange={(event) => {
                  const nextLimit = Number(event.target.value);
                  setEnquiryLimit(nextLimit);
                  setEnquiryPage(1);
                }}
                className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#201A2B] outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>

          {enquiriesLoading ? (
            <div className="mt-6 flex items-center justify-center py-8">
              <div className="inline-flex items-center gap-3 text-xs font-bold text-[#6C4BFF]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
                Loading enquiries...
              </div>
            </div>
          ) : enquiriesError ? (
            <div className="mt-5 rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] p-4">
              <p className="text-xs font-medium text-[#B91C1C]">{enquiriesError}</p>
              <button
                type="button"
                onClick={() => setEnquiryReloadTick((prev) => prev + 1)}
                className="mt-3 rounded-xl bg-[#DC2626] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#B91C1C] transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-8 text-center">
              <p className="text-sm font-bold font-heading text-[#201A2B]">No enquiries yet</p>
              <p className="mt-1 text-xs text-[#7A7286]">
                Once businesses contact you, they will show up here.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E7E1D6] text-xs">
                <thead className="bg-[#FAF8F5]">
                  <tr className="text-left font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
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
                <tbody className="divide-y divide-[#E7E1D6] bg-white">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="align-top hover:bg-[#FAF8F5]/60 transition">
                      <td className="px-3 py-3 font-semibold text-[#201A2B]">
                        <span className="font-mono-code text-[11px] font-bold text-[#5A3FE0] bg-[#F1ECFF] px-2 py-0.5 rounded-full">
                          {enquiry.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-bold font-heading text-[#201A2B]">
                        {enquiry.subject}
                      </td>
                      <td className="px-3 py-3 text-[#201A2B]">
                        <p className="max-w-xs whitespace-pre-wrap">{enquiry.message}</p>
                      </td>
                      <td className="px-3 py-3 text-[#7A7286]">
                        <p className="font-bold text-[#201A2B]">
                          {enquiry.submittedBy?.name || "Unknown"}
                        </p>
                        <p>{enquiry.submittedBy?.email || "N/A"}</p>
                      </td>
                      <td className="px-3 py-3 text-[#7A7286] whitespace-nowrap">
                        {formatDate(enquiry.createdAt)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            enquiry.status === "responded"
                              ? "bg-[#E4F5EC] text-[#137A50]"
                              : "bg-[#FFF8E6] text-[#B8860B]"
                          }`}
                        >
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[#7A7286] whitespace-nowrap">
                        {formatDate(enquiry.respondedAt)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {enquiry.status === "pending" ? (
                          <button
                            type="button"
                            disabled={rowUpdatingId === enquiry._id}
                            onClick={() => handleMarkResponded(enquiry._id)}
                            className="btn-coral inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                          >
                            {rowUpdatingId === enquiry._id
                              ? "Updating..."
                              : "Mark Responded"}
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[#137A50]">
                            ✓ Responded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E1D6] pt-4">
                <p className="text-xs text-[#7A7286]">
                  Page {enquiryPagination.page} of {enquiryPagination.totalPages} •{" "}
                  {enquiryPagination.total} total enquiries
                </p>
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    disabled={enquiryPagination.page <= 1}
                    onClick={() => setEnquiryPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition disabled:opacity-50 cursor-pointer"
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
                    className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* My Campaign Applications History Section */}
      <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-heading text-[#201A2B]">My Submitted Campaign Applications</h2>
            <p className="mt-0.5 text-xs text-[#7A7286]">
              Track all campaign proposals you submitted to brands and check their review status.
            </p>
          </div>
        </div>

        {mySubmittedAppsLoading ? (
          <div className="py-8 text-center text-xs text-[#7A7286]">Loading your campaign applications...</div>
        ) : mySubmittedApps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-8 text-center">
            <p className="text-sm font-bold font-heading text-[#201A2B]">No campaign applications submitted yet</p>
            <p className="mt-1 text-xs text-[#7A7286]">
              Explore active campaigns and submit your proposal to connect with brands.
            </p>
            <a
              href="/campaign"
              className="mt-3 inline-block btn-coral rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              Explore Campaigns
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E7E1D6] text-xs">
              <thead className="bg-[#FAF8F5] font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
                <tr>
                  <th className="px-3 py-3 text-left">Campaign / Brand</th>
                  <th className="px-3 py-3 text-left">Proposal Message</th>
                  <th className="px-3 py-3 text-left">Contact Info Submitted</th>
                  <th className="px-3 py-3 text-left">Applied Date</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D6] bg-white">
                {mySubmittedApps.map((app) => {
                  const campaign = typeof app.campaign === "object" ? app.campaign : null;
                  const handle = campaign?.storeUsername || "";
                  return (
                    <tr key={app._id} className="align-top hover:bg-[#FAF8F5]/60 transition">
                      <td className="px-3 py-3 font-semibold text-[#201A2B]">
                        <div className="text-sm font-bold font-heading text-[#201A2B]">{campaign?.companyName || "Campaign"}</div>
                        {handle ? (
                          <a
                            href={`/campaign/${handle}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono-code text-xs font-bold text-[#6C4BFF] hover:underline block mt-0.5"
                          >
                            @{handle}
                          </a>
                        ) : null}
                        {campaign?.category ? (
                          <span className="inline-block mt-1 text-[11px] font-medium text-[#7A7286]">
                            🏷️ {campaign.category}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 max-w-xs whitespace-pre-wrap font-medium text-[#201A2B] leading-relaxed">
                        {app.message}
                      </td>
                      <td className="px-3 py-3 text-[#7A7286] space-y-0.5">
                        <div>{app.applicantEmail}</div>
                        {app.applicantPhone ? (
                          <div className="font-semibold text-[#201A2B]">📞 {app.applicantPhone}</div>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-[#7A7286] whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            app.status === "approved" || app.status === "responded"
                              ? "bg-[#E4F5EC] text-[#137A50]"
                              : app.status === "rejected"
                              ? "bg-[#FEE2E2] text-[#B91C1C]"
                              : "bg-[#FFF8E6] text-[#B8860B]"
                          }`}
                        >
                          {app.status === "responded" ? "approved" : app.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        {handle ? (
                          <a
                            href={`/campaign/${handle}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:text-[#6C4BFF] transition"
                          >
                            View Page
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Requirement Clicks Section */}
      <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold font-heading text-[#201A2B]">
              <FiMousePointer className="text-[#6C4BFF]" />
              My Requirement Link Clicks
            </h2>
            <p className="mt-0.5 text-xs text-[#7A7286]">
              Track which businesses clicked links on your posted business requirements.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#7A7286]">
            <span>Per page</span>
            <select
              value={clicksLimit}
              onChange={(e) => {
                setClicksLimit(Number(e.target.value));
                setClicksPage(1);
              }}
              className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#201A2B] outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>

        {resourceClicksLoading ? (
          <div className="mt-6 flex items-center justify-center py-8">
            <div className="inline-flex items-center gap-3 text-xs font-bold text-[#6C4BFF]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
              Loading click history...
            </div>
          </div>
        ) : resourceClicksError ? (
          <div className="mt-5 rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] p-4">
            <p className="text-xs font-medium text-[#B91C1C]">{resourceClicksError}</p>
          </div>
        ) : resourceClickRows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-8 text-center">
            <p className="text-sm font-bold font-heading text-[#201A2B]">No resource clicks recorded yet</p>
            <p className="mt-1 text-xs text-[#7A7286]">
              When businesses click links on your approved requirements, their details will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E7E1D6] text-xs">
              <thead className="bg-[#FAF8F5] font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#7A7286]">
                <tr className="text-left">
                  <th className="px-3 py-3">Business (Who Clicked)</th>
                  <th className="px-3 py-3">Business Email</th>
                  <th className="px-3 py-3">Requirement Company</th>
                  <th className="px-3 py-3">Resource Link</th>
                  <th className="px-3 py-3">Clicked At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D6] bg-white">
                {resourceClickRows.map((click) => (
                  <tr key={click._id} className="align-top hover:bg-[#FAF8F5]/60 transition">
                    <td className="px-3 py-3 font-bold font-heading text-[#201A2B]">
                      {click.userName || "—"}
                    </td>
                    <td className="px-3 py-3 text-[#7A7286]">
                      {click.userEmail || "—"}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#201A2B]">
                      {click.companyName || "—"}
                    </td>
                    <td className="px-3 py-3 text-[#7A7286]">
                      {click.url ? (
                        <a
                          href={click.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#6C4BFF] hover:underline"
                        >
                          <FiExternalLink className="h-3.5 w-3.5" />
                          {click.url.length > 35 ? `${click.url.slice(0, 32)}...` : click.url}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3 text-[#7A7286] whitespace-nowrap">
                      {formatDate(click.clickedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E1D6] pt-4">
              <p className="text-xs text-[#7A7286]">
                Page {clicksPagination.page} of {clicksPagination.totalPages} •{" "}
                {clicksPagination.total} total clicks
              </p>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  disabled={clicksPagination.page <= 1}
                  onClick={() => setClicksPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={clicksPagination.page >= clicksPagination.totalPages}
                  onClick={() => setClicksPage((prev) => Math.min(clicksPagination.totalPages, prev + 1))}
                  className="rounded-xl border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* <LoginMethodsCard /> */}

      {rowActionError ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3 text-xs font-bold text-[#B91C1C] shadow-lg">
          {rowActionError}
        </div>
      ) : null}
    </div>
  );
};

export default AdvisorDashboardPage;

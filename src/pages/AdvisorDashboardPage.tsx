import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import ApplicationForm from "../components/advisor/ApplicationForm";
import { advisorProfileAnalyticsApi } from "../services/advisor.service";

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
  const [applicationStatus, setApplicationStatus] = useState<number | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [profileViews, setProfileViews] = useState<number>(-1);
  const [leadRequests, setLeadRequests] = useState<number>(-1);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

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
        setProfileViews(
          typeof data?.profileViews === "number" ? data.profileViews : -1,
        );
        setLeadRequests(
          typeof data?.leadRequests === "number" ? data.leadRequests : -1,
        );
      } catch {
        setApplicationStatus(null);
        setRejectionReason("");
        setProfileViews(-1);
        setLeadRequests(-1);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const totalViews = profileViews;
  const totalLeads = leadRequests;
  const totalSocialClicks = -1;

  const completionRate = 78;

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

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Profile Views
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(totalViews)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Your total profile views</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Lead Requests
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(totalLeads)}
          </p>
          <p className="mt-1 text-xs text-slate-5000">Your total lead requests</p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Social Link Clicks
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analyticsLoading ? "..." : renderMetricValue(totalSocialClicks)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Across all linked channels
          </p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Profile Completion
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {completionRate}%
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${completionRate}%` }}
            />
          </div>
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
    </div>
  );
};

export default AdvisorDashboardPage;

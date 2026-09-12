import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getMyReceivedCampaignApplicationsApi,
  updateCampaignApplicationStatusApi,
  type CampaignApplicationItem,
} from "../../services/campaignApplications.service";
import {
  getMyRequirementApi,
  type BusinessRequirementItem,
} from "../../services/businessRequirements.service";

export function CampaignApplicationsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<BusinessRequirementItem | null>(null);
  const [applications, setApplications] = useState<CampaignApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCampaignAndApplications = async (showLoading = true) => {
    if (!campaignId) return;
    try {
      if (showLoading) setIsLoading(true);

      const [reqRes, appsRes] = await Promise.allSettled([
        getMyRequirementApi(),
        getMyReceivedCampaignApplicationsApi({ campaignId, limit: 100 }),
      ]);

      let matchedCampaign: BusinessRequirementItem | null = null;
      if (reqRes.status === "fulfilled" && reqRes.value) {
        const val = reqRes.value;
        const list: BusinessRequirementItem[] = val.requirements && val.requirements.length > 0
          ? val.requirements
          : val.requirement
          ? [val.requirement]
          : [];
        matchedCampaign = list.find((c) => String(c._id) === String(campaignId)) || null;
      }

      let appList: CampaignApplicationItem[] = [];
      if (appsRes.status === "fulfilled" && appsRes.value) {
        const val = appsRes.value;
        appList = val.applications || (val as any)?.data?.applications || [];
      }

      if (!matchedCampaign && appList.length > 0 && typeof appList[0].campaign === "object") {
        const c = appList[0].campaign;
        matchedCampaign = {
          _id: c._id,
          companyName: c.companyName,
          storeUsername: c.storeUsername,
          category: c.category,
          campaignGoal: c.campaignGoal,
          rewardType: c.rewardType,
          budget: c.budget,
          url: c.url || "",
          businessEmail: c.businessEmail || "",
          detailedRequirements: c.detailedRequirements || "",
          status: (c as any).status || "approved",
          createdAt: "",
          updatedAt: "",
        } as BusinessRequirementItem;
      }

      setCampaign(matchedCampaign);
      setApplications(appList);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    void loadCampaignAndApplications();
  }, [campaignId, token]);

  const handleUpdateStatus = async (appId: string, nextStatus: "approved" | "rejected" | "pending") => {
    try {
      setUpdatingAppId(appId);
      await updateCampaignApplicationStatusApi(appId, nextStatus);
      await loadCampaignAndApplications(false);
    } catch {
      alert("Failed to update application status. Please try again.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((app) => {
      if (statusFilter === "approved") {
        return app.status === "approved" || app.status === "responded";
      }
      return app.status === statusFilter;
    });
  }, [applications, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved" || a.status === "responded").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium">Loading campaign applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <FiArrowLeft className="h-4 w-4 text-slate-500" />
            Back
          </button>
          <div className="text-xs text-slate-500 font-medium">
            <Link to="/u/dashboard" className="hover:text-blue-700 transition">Dashboard</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-900 font-bold">Advisor Applications</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isRefreshing}
          onClick={() => {
            setIsRefreshing(true);
            void loadCampaignAndApplications(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-600" : "text-slate-500"}`} />
          {isRefreshing ? "Refreshing..." : "Refresh List"}
        </button>
      </div>

      {/* Campaign Summary Card */}
      {campaign ? (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 text-white shadow-md">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {campaign.companyName}
                  </h1>
                  {campaign.storeUsername ? (
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-300">
                      @{campaign.storeUsername}
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      campaign.status === "approved"
                        ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                        : "border border-amber-500/30 bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {campaign.status === "approved" ? "Live / Approved" : "Pending Admin Review"}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Manage received advisor proposals for this campaign requirement.
                </p>
              </div>

              {campaign.storeUsername && campaign.status === "approved" ? (
                <a
                  href={`/campaign/${campaign.storeUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-xs"
                >
                  <FiExternalLink className="h-4 w-4" />
                  View Live Campaign Page
                </a>
              ) : null}
            </div>

            {/* Campaign Meta Highlights */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 text-xs text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Category</p>
                <p className="font-semibold text-white mt-0.5">🏷️ {campaign.category || "General"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Campaign Goal</p>
                <p className="font-semibold text-white mt-0.5">🎯 {campaign.campaignGoal || "Brand Awareness"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Reward Type</p>
                <p className="font-semibold text-white mt-0.5">🎁 {campaign.rewardType || "Both"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Budget</p>
                <p className="font-semibold text-white mt-0.5">💰 {campaign.budget || "Flexible"}</p>
              </div>
            </div>

            {/* What Creators Should Do Snippet */}
            {campaign.detailedRequirements ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200 backdrop-blur-xs">
                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1">
                  What Creators Should Do / Campaign Brief
                </p>
                <p className="leading-relaxed whitespace-pre-wrap text-slate-100">
                  {campaign.detailedRequirements}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Main Applications Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Received Advisor Applications</span>
              <span className="rounded-full bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5">
                {applications.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review proposals from creators and advisors. Contact them or approve their pitch to start collaborating.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                statusFilter === "pending"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "text-slate-600 hover:text-amber-700"
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("approved")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                statusFilter === "approved"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              Approved ({counts.approved})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("rejected")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                statusFilter === "rejected"
                  ? "bg-rose-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-rose-700"
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FiUser className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              {applications.length === 0
                ? "No applications received yet"
                : `No ${statusFilter} applications`}
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {applications.length === 0
                ? "When creators apply to your campaign, their detailed pitches and contact info will appear here."
                : "Try switching filter tabs above to see all proposals."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const isUpdating = updatingAppId === app._id;
              const isApproved = app.status === "approved" || app.status === "responded";
              const isRejected = app.status === "rejected";
              const isPending = app.status === "pending";

              return (
                <div
                  key={app._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  {/* Top Bar: Applicant Info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {app.applicant?.advisorProfile?.instagramProfilePictureUrl ? (
                        <img
                          src={app.applicant.advisorProfile.instagramProfilePictureUrl}
                          alt={app.applicantName}
                          className="h-12 w-12 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold text-base border border-blue-100">
                          {app.applicantName?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {app.applicantName}
                          </h4>
                          {app.applicant?.advisorProfile?.username ? (
                            <Link
                              to={`/${app.applicant.advisorProfile.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 hover:bg-blue-100 transition inline-flex items-center gap-1"
                            >
                              @{app.applicant.advisorProfile.username}
                              <FiExternalLink className="h-3 w-3" />
                            </Link>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <FiMail className="h-3.5 w-3.5 text-slate-400" />
                            <a href={`mailto:${app.applicantEmail}`} className="hover:text-blue-700 underline decoration-slate-300">
                              {app.applicantEmail}
                            </a>
                          </span>

                          {app.applicantPhone ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                              <FiPhone className="h-3.5 w-3.5 text-emerald-600" />
                              <a href={`tel:${app.applicantPhone}`} className="hover:text-emerald-700">
                                {app.applicantPhone}
                              </a>
                            </span>
                          ) : null}

                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <FiCalendar className="h-3.5 w-3.5" />
                            {new Date(app.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                          isApproved
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : isRejected
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isApproved ? "Approved" : app.status}
                      </span>

                      {isPending ? (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => void handleUpdateStatus(app._id, "approved")}
                            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
                          >
                            <FiCheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => void handleUpdateStatus(app._id, "rejected")}
                            className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
                          >
                            <FiXCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Proposal Message Section */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Proposal / Application Message
                    </p>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {app.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignApplicationsPage;

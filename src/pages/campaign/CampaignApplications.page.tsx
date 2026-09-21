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
        getMyRequirementApi({ type: "campaign" }),
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
        <div className="flex items-center gap-3 text-[#7A7286]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
          <p className="text-xs font-bold text-[#6C4BFF]">Loading campaign applications...</p>
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
            className="inline-flex items-center gap-2 rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2 text-xs font-bold font-heading text-[#201A2B] shadow-xs hover:bg-[#FAF8F5] transition cursor-pointer"
          >
            <FiArrowLeft className="h-4 w-4 text-[#7A7286]" />
            Back
          </button>
          <div className="text-xs text-[#7A7286] font-medium">
            <Link to="/u/dashboard" className="hover:text-[#6C4BFF] transition font-bold">Dashboard</Link>
            <span className="mx-1.5 text-[#E7E1D6]">/</span>
            <span className="text-[#201A2B] font-bold">Creator Applications</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isRefreshing}
          onClick={() => {
            setIsRefreshing(true);
            void loadCampaignAndApplications(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2 text-xs font-bold font-heading text-[#201A2B] shadow-xs hover:bg-[#FAF8F5] transition cursor-pointer disabled:opacity-50"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#6C4BFF]" : "text-[#7A7286]"}`} />
          {isRefreshing ? "Refreshing..." : "Refresh List"}
        </button>
      </div>

      {/* Campaign Summary Card */}
      {campaign ? (
        <div className="relative overflow-hidden rounded-[24px] bg-[#201A2B] p-6 md:p-8 text-white shadow-sm">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#6C4BFF]/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 -bottom-16 h-56 w-56 rounded-full bg-[#FF5A36]/15 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white">
                    {campaign.companyName}
                  </h1>
                  {campaign.storeUsername ? (
                    <span className="font-mono-code rounded-full bg-[#F1ECFF] px-2.5 py-0.5 text-xs font-bold text-[#6C4BFF]">
                      @{campaign.storeUsername}
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      campaign.status === "approved"
                        ? "bg-[#E4F5EC] text-[#137A50]"
                        : "bg-[#FFF8E6] text-[#B8860B]"
                    }`}
                  >
                    {campaign.status === "approved" ? "Live / Approved" : "Pending Admin Review"}
                  </span>
                </div>
                <p className="text-xs text-white/80">
                  Manage received creator proposals for this campaign requirement.
                </p>
              </div>

              {campaign.storeUsername && campaign.status === "approved" ? (
                <a
                  href={`/campaign/${campaign.storeUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-coral inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition"
                >
                  <FiExternalLink className="h-4 w-4" />
                  View Live Campaign Page
                </a>
              ) : null}
            </div>

            {/* Campaign Meta Highlights */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 text-xs text-white/90">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-mono-code font-bold text-white/60 uppercase tracking-wider text-[10px]">Category</p>
                <p className="font-heading font-bold text-white mt-0.5">🏷️ {campaign.category || "General"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-mono-code font-bold text-white/60 uppercase tracking-wider text-[10px]">Campaign Goal</p>
                <p className="font-heading font-bold text-white mt-0.5">🎯 {campaign.campaignGoal || "Brand Awareness"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-mono-code font-bold text-white/60 uppercase tracking-wider text-[10px]">Reward Type</p>
                <p className="font-heading font-bold text-white mt-0.5">🎁 {campaign.rewardType || "Both"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-mono-code font-bold text-white/60 uppercase tracking-wider text-[10px]">Budget</p>
                <p className="font-heading font-bold text-white mt-0.5">💰 {campaign.budget || "Flexible"}</p>
              </div>
            </div>

            {/* What Creators Should Do Snippet */}
            {campaign.detailedRequirements ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/90 backdrop-blur-xs">
                <p className="font-mono-code font-bold uppercase tracking-wider text-white/60 text-[10px] mb-1">
                  What Creators Should Do / Campaign Brief
                </p>
                <p className="leading-relaxed whitespace-pre-wrap text-white">
                  {campaign.detailedRequirements}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Main Applications Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E1D6] pb-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-[#201A2B] flex items-center gap-2">
              <span>Received Creator Applications</span>
              <span className="font-mono-code rounded-full bg-[#F1ECFF] text-[#5A3FE0] text-xs font-bold px-2.5 py-0.5">
                {applications.length}
              </span>
            </h2>
            <p className="text-xs text-[#7A7286] mt-0.5">
              Review proposals from creators. Contact them or approve their pitch to start collaborating.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D6] p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition cursor-pointer ${
                statusFilter === "all"
                  ? "bg-[#201A2B] text-white shadow-xs"
                  : "text-[#7A7286] hover:text-[#201A2B]"
              }`}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition cursor-pointer ${
                statusFilter === "pending"
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "text-[#7A7286] hover:text-[#B8860B]"
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("approved")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition cursor-pointer ${
                statusFilter === "approved"
                  ? "bg-[#1F9D6B] text-white shadow-xs"
                  : "text-[#7A7286] hover:text-[#137A50]"
              }`}
            >
              Approved ({counts.approved})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("rejected")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition cursor-pointer ${
                statusFilter === "rejected"
                  ? "bg-[#DC2626] text-white shadow-xs"
                  : "text-[#7A7286] hover:text-[#B91C1C]"
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#7A7286] border border-[#E7E1D6]">
              <FiUser className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold font-heading text-[#201A2B]">
              {applications.length === 0
                ? "No applications received yet"
                : `No ${statusFilter} applications`}
            </h3>
            <p className="mt-1 text-xs text-[#7A7286] max-w-sm mx-auto">
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
                  className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 shadow-xs hover:border-[#6C4BFF]/40 transition-all space-y-4"
                >
                  {/* Top Bar: Applicant Info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E1D6] pb-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {app.applicant?.advisorProfile?.instagramProfilePictureUrl ? (
                        <img
                          src={app.applicant.advisorProfile.instagramProfilePictureUrl}
                          alt={app.applicantName}
                          className="h-12 w-12 rounded-full object-cover border border-[#E7E1D6]"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1ECFF] text-[#5A3FE0] font-heading font-extrabold text-base border border-[#E7E1D6]">
                          {app.applicantName?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-heading text-[#201A2B]">
                            {app.applicantName}
                          </h4>
                          {app.applicant?.advisorProfile?.username ? (
                            <Link
                              to={`/${app.applicant.advisorProfile.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono-code text-xs font-bold text-[#6C4BFF] bg-[#F1ECFF] px-2.5 py-0.5 rounded-full hover:bg-[#EAE2FF] transition inline-flex items-center gap-1"
                            >
                              @{app.applicant.advisorProfile.username}
                              <FiExternalLink className="h-3 w-3" />
                            </Link>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7A7286] mt-1">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <FiMail className="h-3.5 w-3.5 text-[#7A7286]" />
                            <a href={`mailto:${app.applicantEmail}`} className="hover:text-[#6C4BFF] underline decoration-[#E7E1D6]">
                              {app.applicantEmail}
                            </a>
                          </span>

                          {app.applicantPhone ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-[#201A2B]">
                              <FiPhone className="h-3.5 w-3.5 text-[#137A50]" />
                              <a href={`tel:${app.applicantPhone}`} className="hover:text-[#137A50]">
                                {app.applicantPhone}
                              </a>
                            </span>
                          ) : null}

                          <span className="inline-flex items-center gap-1 text-[#7A7286]">
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
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          isApproved
                            ? "bg-[#E4F5EC] text-[#137A50]"
                            : isRejected
                            ? "bg-[#FEE2E2] text-[#B91C1C]"
                            : "bg-[#FFF8E6] text-[#B8860B]"
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
                            className="rounded-xl bg-[#1F9D6B] px-3.5 py-1.5 text-xs font-bold font-heading text-white shadow-xs hover:bg-[#137A50] transition disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
                          >
                            <FiCheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => void handleUpdateStatus(app._id, "rejected")}
                            className="rounded-xl bg-[#DC2626] px-3.5 py-1.5 text-xs font-bold font-heading text-white shadow-xs hover:bg-[#B91C1C] transition disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
                          >
                            <FiXCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Proposal Message Section */}
                  <div className="rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] p-4 space-y-1.5">
                    <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">
                      Proposal / Application Message
                    </p>
                    <p className="text-sm font-medium text-[#201A2B] leading-relaxed whitespace-pre-wrap">
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

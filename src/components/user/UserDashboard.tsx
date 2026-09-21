import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSavedAdvisors } from "../../context/SavedAdvisorsContext";
// import { LoginMethodsCard } from "../auth/LoginMethodsCard";
import {
  getUserMyEnquiries,
  type EnquiryPagination,
  type UserEnquiry,
} from "../../services/advisor.service";
import {
  getMyRequirementApi,
  type BusinessRequirementItem,
} from "../../services/businessRequirements.service";
import {
  getMyReceivedCampaignApplicationsApi,
    type CampaignApplicationItem,
} from "../../services/campaignApplications.service";
import { DailyGrowthSection } from "./dashboard/DailyGrowthSection";
import { MyEnquiriesSection } from "./dashboard/MyEnquiriesSection";
import { SavedAdvisorsSection } from "./dashboard/SavedAdvisorsSection";
import { UserStatsCards } from "./dashboard/UserStatsCards";
import {
  FiCompass,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiEye,
  FiPlusCircle,
} from "react-icons/fi";

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

  const [myCampaigns, setMyCampaigns] = useState<BusinessRequirementItem[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [expandedCampId, setExpandedCampId] = useState<string | null>(null);
  const [receivedApps, setReceivedApps] = useState<CampaignApplicationItem[]>([]);
  
  const loadMyCampaignsAndApps = async () => {
    try {
      setCampaignsLoading(true);
      const [reqRes, appRes] = await Promise.allSettled([
        getMyRequirementApi({ type: "campaign" }),
        getMyReceivedCampaignApplicationsApi({ limit: 100 }),
      ]);

      if (reqRes.status === "fulfilled" && reqRes.value) {
        const res = reqRes.value;
        if (res.requirements && res.requirements.length > 0) {
          setMyCampaigns(res.requirements);
        } else if (res.requirement) {
          setMyCampaigns([res.requirement]);
        } else {
          setMyCampaigns([]);
        }
      }

      if (appRes.status === "fulfilled" && appRes.value) {
        const res = appRes.value;
        const apps = res?.applications || (res as any)?.data?.applications || [];
        setReceivedApps(apps);
      }
    } catch {
      // ignore
    } finally {
      setCampaignsLoading(false);
    }
  };

  useEffect(() => {
    void loadMyCampaignsAndApps();
  }, []);

  
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

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#post-campaign") {
      const timer = setTimeout(() => {
        const el = document.getElementById("post-campaign");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

    const totalUniqueAdvisorsApplied = useMemo(() => {
    const uniqueKeys = new Set<string>();
    for (const app of receivedApps) {
      const campaignId =
        typeof app.campaign === "object" && app.campaign?._id
          ? String(app.campaign._id)
          : typeof app.campaign === "string" && app.campaign
          ? app.campaign
          : "unknown_campaign";

      const applicantId =
        typeof app.applicant === "object" && app.applicant?._id
          ? String(app.applicant._id)
          : typeof app.applicant === "string" && app.applicant
          ? app.applicant
          : null;

      const applicantKey =
        applicantId ||
        app.applicantEmail?.trim().toLowerCase() ||
        app.applicantName?.trim().toLowerCase();

      if (applicantKey) {
        // Unique per campaign: applying to multiple campaigns counts for each, but multiple applications to the same campaign count only once
        uniqueKeys.add(`${campaignId}___${applicantKey}`);
      }
    }
    return uniqueKeys.size;
  }, [receivedApps]);

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
  const showFirstStepPanel =
    !isSavedListLoading &&
    !enquiriesLoading &&
    !savedListError &&
    !enquiriesError &&
    savedAdvisors.length === 0 &&
    enquiries.length === 0;

  return (
    <div className="space-y-6">
      <UserStatsCards
        enquiriesLoading={enquiriesLoading}
        totalEnquiries={enquiryPagination.total}
        savedLoading={isSavedListLoading}
        totalSavedAdvisors={savedAdvisors.length}
        campaignsLoading={campaignsLoading}
        totalCampaigns={myCampaigns.length}
        totalAdvisorsApplied={totalUniqueAdvisorsApplied}
      />

      {showFirstStepPanel ? (
        <section className="rounded-[22px] bg-gradient-to-r from-[#FF5A36] to-[#6C4BFF] p-6 text-white shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <FiCompass className="h-3.5 w-3.5" />
            Start Here
          </p>
          <h2 className="mt-3 text-2xl font-bold font-heading">Let’s build your creator shortlist</h2>
          <p className="mt-1 text-sm text-white/90">
            Explore verified creators, save your favorites, and send your first enquiry to get matched faster.
          </p>
          <button
            type="button"
            onClick={() => navigate("/creators")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#6C4BFF] shadow-xs hover:bg-[#F1ECFF] transition"
          >
            <FiSearch className="h-4 w-4" />
            Browse Creators
          </button>
        </section>
      ) : null}

      <SavedAdvisorsSection
        isLoading={isSavedListLoading}
        error={savedListError}
        savedAdvisors={savedAdvisors}
        onRefresh={() => void refreshSavedAdvisors()}
      />

      <MyEnquiriesSection
        enquiriesLoading={enquiriesLoading}
        enquiriesError={enquiriesError}
        enquiries={enquiries}
        expandedEnquiryIds={expandedEnquiryIds}
        enquiryPagination={enquiryPagination}
        onToggleExpanded={toggleExpanded}
        onOpenAdvisor={(username) => {
          if (!username) return;
          navigate(`/${username}`);
        }}
        onPreviousPage={() => setEnquiryPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() =>
          setEnquiryPage((prev) => Math.min(enquiryPagination.totalPages, prev + 1))
        }
        formatDate={formatDate}
      />

      {/* Your Posted Campaigns Section */}
      <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold font-heading text-[#201A2B]">Your Posted Campaigns</h3>
            <p className="text-xs text-[#7A7286] mt-0.5">
              Click any campaign below to view its full details and live page link.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/campaign/apply")}
            className="btn-coral inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
          >
            <FiPlusCircle className="h-4 w-4" />
            Post New Campaign
          </button>
        </div>

        {campaignsLoading ? (
          <p className="text-xs text-[#7A7286] py-2">Loading your posted campaigns...</p>
        ) : myCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-6 text-center space-y-2">
            <p className="text-xs font-semibold text-[#7A7286]">You have not posted any campaigns yet.</p>
            <button
              type="button"
              onClick={() => navigate("/campaign/apply")}
              className="btn-coral inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-xs cursor-pointer"
            >
              <FiPlusCircle className="h-3.5 w-3.5" />
              Post a Campaign Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myCampaigns.map((camp) => {
              const isExpanded = expandedCampId === camp._id;
              const campApps = receivedApps.filter((a) => {
                const cId = typeof a.campaign === "object" && a.campaign ? String(a.campaign._id) : String(a.campaign);
                return cId === String(camp._id);
              });

              return (
                <div
                  key={camp._id}
                  className="rounded-2xl border border-[#E7E1D6] bg-white overflow-hidden transition-all shadow-xs"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-heading text-lg font-bold text-[#201A2B]">
                          {camp.companyName}
                        </h4>
                        {camp.storeUsername ? (
                          <span className="font-mono-code text-xs font-bold text-[#6C4BFF] bg-[#F1ECFF] px-2.5 py-0.5 rounded-full">
                            @{camp.storeUsername}
                          </span>
                        ) : null}
                        <span
                          className={`badge-pill text-[11px] font-bold uppercase ${
                            camp.status === "approved"
                              ? "bg-[#E4F5EC] text-[#137A50]"
                              : "bg-[#FFF8E6] text-[#B8860B]"
                          }`}
                        >
                          {camp.status === "approved" ? "Live / Approved" : "Pending Review"}
                        </span>
                        <span className="badge-pill bg-[#F1ECFF] text-[#5A3FE0] text-[11px]">
                          📩 {campApps.length} Application{campApps.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A7286] pt-1">
                        {camp.category ? <span className="font-semibold text-[#201A2B]">🏷️ {camp.category}</span> : null}
                        {camp.category && camp.campaignGoal ? <span>•</span> : null}
                        {camp.campaignGoal ? <span>🎯 Goal: <strong>{camp.campaignGoal}</strong></span> : null}
                        {camp.rewardType ? (
                          <>
                            <span>•</span>
                            <span>🎁 Reward: <strong>{camp.rewardType}</strong></span>
                          </>
                        ) : null}
                        {camp.budget ? (
                          <>
                            <span>•</span>
                            <span>💰 <strong>{camp.budget}</strong></span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-[#E7E1D6]">
                      <Link
                        to={`/u/campaigns/${camp._id}/applications`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#F1ECFF] text-[#5A3FE0] px-3 py-1.5 font-heading text-xs font-bold transition hover:bg-[#EAE2FF]"
                      >
                        📩 Applications ({campApps.length})
                      </Link>
                      {camp.storeUsername ? (
                        <a
                          href={`/campaign/${camp.storeUsername}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-1.5 font-heading text-xs font-bold text-[#201A2B] hover:text-[#6C4BFF] transition"
                        >
                          <FiExternalLink className="h-3.5 w-3.5" />
                          Live Page
                        </a>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setExpandedCampId(isExpanded ? null : camp._id)}
                        className="btn-ghost inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                        {isExpanded ? "Hide" : "Details"}
                        {isExpanded ? (
                          <FiChevronUp className="h-4 w-4 ml-0.5" />
                        ) : (
                          <FiChevronDown className="h-4 w-4 ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed View */}
                  {isExpanded ? (
                    <div className="border-t border-[#E7E1D6] bg-[#FAF8F5] p-5 space-y-4 text-xs text-[#201A2B]">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-[#E7E1D6] bg-white p-3">
                          <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">Company / Brand</p>
                          <p className="font-heading font-bold text-sm text-[#201A2B] mt-0.5">{camp.companyName}</p>
                        </div>

                        <div className="rounded-xl border border-[#E7E1D6] bg-white p-3">
                          <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">Campaign Handle</p>
                          <p className="font-mono-code font-bold text-sm text-[#6C4BFF] mt-0.5">@{camp.storeUsername || "—"}</p>
                        </div>

                        {camp.category ? (
                          <div className="rounded-xl border border-[#E7E1D6] bg-white p-3">
                            <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">Category</p>
                            <p className="font-semibold text-[#201A2B] mt-0.5">🏷️ {camp.category}</p>
                          </div>
                        ) : null}

                        {camp.campaignGoal ? (
                          <div className="rounded-xl border border-[#E7E1D6] bg-white p-3">
                            <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">Campaign Goal</p>
                            <p className="font-semibold text-[#201A2B] mt-0.5">🎯 {camp.campaignGoal}</p>
                          </div>
                        ) : null}

                        {camp.rewardType ? (
                          <div className="rounded-xl border border-[#E7E1D6] bg-white p-3">
                            <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">Reward Type</p>
                            <p className="font-semibold text-[#201A2B] mt-0.5">🎁 {camp.rewardType}</p>
                          </div>
                        ) : null}

                        {camp.budget ? (
                          <div className="rounded-xl border border-[#E7E1D6] bg-white p-3">
                            <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider">Budget</p>
                            <p className="font-semibold text-[#201A2B] mt-0.5">💰 {camp.budget}</p>
                          </div>
                        ) : null}
                      </div>

                      {/* What Creators Should Do / Detailed Requirements */}
                      <div className="rounded-xl border border-[#E7E1D6] bg-white p-4">
                        <p className="font-mono-code text-[11px] font-bold text-[#7A7286] uppercase tracking-wider mb-1">
                          What Creators Should Do
                        </p>
                        <p className="text-xs font-medium text-[#201A2B] leading-relaxed whitespace-pre-wrap">
                          {camp.detailedRequirements || "No detailed instructions provided."}
                        </p>
                      </div>

                      {/* Contact & URL Row */}
                      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[#E7E1D6] text-xs">
                        <div>
                          <p className="font-mono-code font-bold text-[#7A7286] uppercase tracking-wider text-[11px]">Contact / Business Email</p>
                          <p className="font-semibold text-[#201A2B] mt-0.5">{camp.businessEmail || "—"}</p>
                        </div>
                        <div>
                          <p className="font-mono-code font-bold text-[#7A7286] uppercase tracking-wider text-[11px]">Website / Target Link</p>
                          <p className="font-semibold text-[#6C4BFF] truncate mt-0.5">{camp.url || "—"}</p>
                        </div>
                      </div>

                      {/* Dedicated Applications Section Link */}
                      <div className="pt-4 border-t border-[#E7E1D6]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-[#E7E1D6] bg-[#FAF8F5] p-4">
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold font-heading text-[#201A2B] uppercase tracking-wider flex items-center gap-1.5">
                              <span>📩 Received Creator Applications</span>
                              <span className="rounded-full bg-[#6C4BFF] text-white font-mono-code text-[10px] font-bold px-2 py-0.5">
                                {campApps.length}
                              </span>
                            </h5>
                            <p className="text-xs text-[#7A7286]">
                              {campApps.length === 0
                                ? "No creator proposals received yet for this campaign."
                                : `Review and manage ${campApps.length} received creator pitch proposal${campApps.length === 1 ? "" : "s"}.`}
                            </p>
                          </div>
                          <Link
                            to={`/u/campaigns/${camp._id}/applications`}
                            className="btn-coral inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs shrink-0"
                          >
                            View Applications ({campApps.length}) →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <DailyGrowthSection onReadNow={() => navigate("/blog")} />

      {/* <LoginMethodsCard /> */}
    </div>
  );
};

export default UserDashboard;

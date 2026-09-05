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
  updateCampaignApplicationStatusApi,
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
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const loadMyCampaignsAndApps = async () => {
    try {
      setCampaignsLoading(true);
      const [reqRes, appRes] = await Promise.allSettled([
        getMyRequirementApi(),
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

  const handleUpdateAppStatus = async (appId: string, status: "approved" | "rejected" | "pending") => {
    try {
      setUpdatingAppId(appId);
      await updateCampaignApplicationStatusApi(appId, status);
      await loadMyCampaignsAndApps();
    } catch {
      // ignore
    } finally {
      setUpdatingAppId(null);
    }
  };

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
      />

      {showFirstStepPanel ? (
        <section className="rounded-3xl border border-blue-200 bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-md">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <FiCompass className="h-3.5 w-3.5" />
            Start Here
          </p>
          <h2 className="mt-3 text-2xl font-bold">Let’s build your advisor shortlist</h2>
          <p className="mt-1 text-sm text-blue-100">
            Explore verified advisors, save your favorites, and send your first enquiry to get matched faster.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            <FiSearch className="h-4 w-4" />
            Discover Advisors
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
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Your Posted Campaigns</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any campaign below to view its full details and live page link.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/campaign/apply")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
          >
            <FiPlusCircle className="h-4 w-4" />
            Post New Campaign
          </button>
        </div>

        {campaignsLoading ? (
          <p className="text-xs text-slate-500 py-2">Loading your posted campaigns...</p>
        ) : myCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center space-y-2">
            <p className="text-xs font-semibold text-slate-600">You have not posted any campaigns yet.</p>
            <button
              type="button"
              onClick={() => navigate("/campaign/apply")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-700 transition cursor-pointer"
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
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition-all shadow-2xs"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-bold text-slate-900">
                          {camp.companyName}
                        </h4>
                        {camp.storeUsername ? (
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            @{camp.storeUsername}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                            camp.status === "approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {camp.status === "approved" ? "Live / Approved" : "Pending Review"}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          📩 {campApps.length} Application{campApps.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                        {camp.category ? <span className="font-semibold text-slate-800">🏷️ {camp.category}</span> : null}
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

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                      {camp.storeUsername ? (
                        <a
                          href={`/campaign/${camp.storeUsername}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          <FiExternalLink className="h-3.5 w-3.5" />
                          Live Page
                        </a>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setExpandedCampId(isExpanded ? null : camp._id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                        {isExpanded ? "Hide Details" : "View Full Details"}
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
                    <div className="border-t border-slate-200/80 bg-white p-5 space-y-4 text-sm text-slate-800">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company / Brand</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{camp.companyName}</p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Handle</p>
                          <p className="text-sm font-bold text-blue-700 mt-0.5">@{camp.storeUsername || "—"}</p>
                        </div>

                        {camp.category ? (
                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">🏷️ {camp.category}</p>
                          </div>
                        ) : null}

                        {camp.campaignGoal ? (
                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Goal</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">🎯 {camp.campaignGoal}</p>
                          </div>
                        ) : null}

                        {camp.rewardType ? (
                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reward Type</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">🎁 {camp.rewardType}</p>
                          </div>
                        ) : null}

                        {camp.budget ? (
                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">💰 {camp.budget}</p>
                          </div>
                        ) : null}
                      </div>

                      {/* What Creators Should Do / Detailed Requirements */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          What Creators Should Do
                        </p>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {camp.detailedRequirements || "No detailed instructions provided."}
                        </p>
                      </div>

                      {/* Contact & URL Row */}
                      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wider">Contact / Business Email</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{camp.businessEmail || "—"}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wider">Website / Target Link</p>
                          <p className="text-sm font-semibold text-blue-700 truncate mt-0.5">{camp.url || "—"}</p>
                        </div>
                      </div>

                      {/* Received Applications Table */}
                      <div className="pt-4 border-t border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Received Advisor Applications ({campApps.length})
                          </h5>
                        </div>

                        {campApps.length === 0 ? (
                          <p className="text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                            No advisor proposals received for this campaign yet.
                          </p>
                        ) : (
                          <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="w-full text-left text-xs text-slate-700">
                              <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                <tr>
                                  <th className="px-3 py-2.5">Applicant & Phone</th>
                                  <th className="px-3 py-2.5">Proposal Message</th>
                                  <th className="px-3 py-2.5">Date</th>
                                  <th className="px-3 py-2.5">Status</th>
                                  <th className="px-3 py-2.5 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {campApps.map((app) => (
                                  <tr key={app._id} className="align-top">
                                    <td className="px-3 py-3 font-semibold text-slate-900">
                                      <div>{app.applicantName}</div>
                                      <div className="text-[11px] font-medium text-slate-500">{app.applicantEmail}</div>
                                      {app.applicant?.advisorProfile?.username ? (
                                        <Link
                                          to={`/${app.applicant.advisorProfile.username}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[11px] font-bold text-blue-700 hover:underline"
                                        >
                                          @{app.applicant.advisorProfile.username}
                                        </Link>
                                      ) : null}
                                    </td>
                                    <td className="px-3 py-3 max-w-xs whitespace-pre-wrap leading-relaxed font-medium text-slate-800">
                                      {app.message}
                                    </td>
                                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                                      {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                          app.status === "responded"
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                            : "bg-amber-100 text-amber-800 border border-amber-200"
                                        }`}
                                      >
                                        {app.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                       <div className="flex items-center justify-end gap-1.5">
                                         {app.status !== "approved" && app.status !== "responded" ? (
                                           <button
                                             type="button"
                                             disabled={updatingAppId === app._id}
                                             onClick={() => void handleUpdateAppStatus(app._id, "approved")}
                                             className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-700 transition disabled:opacity-60 cursor-pointer"
                                           >
                                             Approve
                                           </button>
                                         ) : null}
                                         {app.status !== "rejected" ? (
                                           <button
                                             type="button"
                                             disabled={updatingAppId === app._id}
                                             onClick={() => void handleUpdateAppStatus(app._id, "rejected")}
                                             className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-60 cursor-pointer"
                                           >
                                             Reject
                                           </button>
                                         ) : null}
                                       </div>
                                     </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
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

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRegHandPointer,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  FiArrowLeft,
  FiAtSign,
  FiCheckCircle,
  FiChevronRight,
  FiCompass,
  FiGlobe,
  FiList,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiTag,
  FiTrash2,
  FiUser,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import {
  getAdminAdvisorDetails,
  getAdminAdvisorEnquiries,
  getAdminAdvisors,
  removeAdminAdvisorProfile,
  type AdminAdvisorCard,
} from "../../../services/admin/admin.service";
import {
  advisorFormOptionsApi,
  type AdvisorFormOptionsResponseData,
} from "../../../services/advisor.service";
import { PaginationControls } from "../PaginationControls";
import {
  formatCompactCount,
  getInitials,
  getNum,
  getSocialProfileUrl,
  inputClassName,
  panelClassName,
  statusEmptyClassName,
  statusErrorClassName,
  statusInfoClassName,
} from "../adminPage.shared";
import { getDisplayCategory } from "../../advisor/advisorDisplay.utils";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
}

export function AdvisorsPanel({ params, setParam }: Props) {
  const page = getNum(params.get("advisorsPage"), 1);
  const limit = getNum(params.get("advisorsLimit"), 10);
  const username = params.get("advisorsUsername") ?? "";
  const email = params.get("advisorsEmail") ?? "";
  const country = params.get("advisorsCountry") ?? "";
  const state = params.get("advisorsState") ?? "";
  const verificationStatus = params.get("advisorsVerificationStatus") ?? "";
  const industries = params.get("advisorsIndustries") ?? "";

  const debouncedUsername = useDebouncedValue(username, 300);
  const debouncedEmail = useDebouncedValue(email, 300);

  const [data, setData] = useState<{
    advisors: AdminAdvisorCard[];
    pagination: any;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});
  const [enquiries, setEnquiries] = useState<Record<string, unknown>[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesTotal, setEnquiriesTotal] = useState(0);
  const [actionInfo, setActionInfo] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [isRemovingProfile, setIsRemovingProfile] = useState(false);
  const [expandedEnquiryIds, setExpandedEnquiryIds] = useState<Set<string>>(
    new Set(),
  );
  const [options, setOptions] = useState<AdvisorFormOptionsResponseData | null>(
    null,
  );

  const detailsUser = details as {
    name?: string;
    username?: string;
    email?: string;
    country?: string;
    state?: string;
    role?: string;
    roles?: string[];
    verificationStatus?: string;
    advisorProfile?: Record<string, unknown>;
    socialLinks?: Record<string, unknown>;
  } | null;
  const profile = (detailsUser?.advisorProfile ?? {}) as Record<
    string,
    unknown
  >;
  const socialLinks = (profile.socialLinks ??
    detailsUser?.socialLinks ??
    {}) as Record<string, unknown>;
  const analytics = (profile.analytics ?? {}) as Record<string, unknown>;
  const socialClicks = (analytics.socialClicks ?? {}) as Record<
    string,
    unknown
  >;
  const socialClicksByPlatform = (socialClicks.byPlatform ?? {}) as Record<
    string,
    unknown
  >;

  const verificationState = String(
    profile.verificationStatus ?? detailsUser?.verificationStatus ?? "",
  ).toLowerCase();
  const isVerified =
    verificationState === "approved" || verificationState === "verified";
  const hasAdvisorRole =
    Array.isArray(detailsUser?.roles)
      ? detailsUser.roles.includes("advisor")
      : detailsUser?.role === "advisor" || Object.keys(profile).length > 0;

  const advisorItems = [
    { label: "Contact Email", value: String(profile.emailForContact ?? "-") },
    { label: "Website", value: String(profile.personalWebsite ?? "-") },
    {
      label: "Industries",
      value: Array.isArray(profile.industries)
        ? profile.industries.join(", ") || "-"
        : "-",
    },
    {
      label: "Market Focus",
      value: Array.isArray(profile.marketFocus)
        ? profile.marketFocus.join(", ") || "-"
        : "-",
    },
    {
      label: "Expertise Indeces",
      value: Array.isArray(profile.expertiseIndeces)
        ? profile.expertiseIndeces.join(", ") || "-"
        : "-",
    },
    {
      label: "Category",
      value: getDisplayCategory(
        typeof profile.category === "string"
          ? profile.category
          : (detailsUser as Record<string, unknown> | null)?.category as string | null | undefined,
      ),
    },
  ];

  const socialItems = [
    {
      key: "instagram",
      label: "Instagram",
      icon: FaInstagram,
      value: socialLinks.instagram as string | undefined,
      count: profile.instagramFollowers as number | undefined,
      countLabel: "followers",
      clicks: socialClicksByPlatform.instagram as number | undefined,
      className: "border-pink-200 bg-pink-50 text-pink-700",
      badgeClassName: "bg-pink-700 text-white",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: FaYoutube,
      value: socialLinks.youtube as string | undefined,
      count: profile.youtubeSubscribers as number | undefined,
      countLabel: "subscribers",
      clicks: socialClicksByPlatform.youtube as number | undefined,
      className: "border-rose-200 bg-rose-50 text-rose-700",
      badgeClassName: "bg-rose-700 text-white",
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: FaTelegram,
      value: socialLinks.telegram as string | undefined,
      count: profile.telegramFollowers as number | undefined,
      countLabel: "subscribers",
      clicks: socialClicksByPlatform.telegram as number | undefined,
      className: "border-sky-200 bg-sky-50 text-sky-700",
      badgeClassName: "bg-sky-600 text-white",
    },
    {
      key: "tiktok",
      label: "TikTok",
      icon: FaTiktok,
      value: socialLinks.tiktok as string | undefined,
      count: profile.tiktokFollowers as number | undefined,
      countLabel: "followers",
      clicks: socialClicksByPlatform.tiktok as number | undefined,
      className: "border-slate-300 bg-slate-100 text-slate-800",
      badgeClassName: "bg-slate-700 text-white",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: FaLinkedin,
      value: socialLinks.linkedin as string | undefined,
      count: profile.linkedinFollowers as number | undefined,
      countLabel: "followers",
      clicks: socialClicksByPlatform.linkedin as number | undefined,
      className: "border-sky-200 bg-sky-50 text-sky-700",
      badgeClassName: "bg-sky-700 text-white",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: FaFacebook,
      value: socialLinks.facebook as string | undefined,
      count: profile.facebookFollowers as number | undefined,
      countLabel: "followers",
      clicks: socialClicksByPlatform.facebook as number | undefined,
      className: "border-indigo-200 bg-indigo-50 text-indigo-700",
      badgeClassName: "bg-indigo-700 text-white",
    },
    {
      key: "twitter",
      label: "Twitter",
      icon: FaXTwitter,
      value: socialLinks.twitter as string | undefined,
      count: profile.twitterFollowers as number | undefined,
      countLabel: "followers",
      clicks: socialClicksByPlatform.twitter as number | undefined,
      className: "border-black bg-black text-white",
      badgeClassName: "bg-white text-black",
    },
  ];

  const metricItems = [
    { label: "Profile Clicks", value: String(analytics.profileClicks ?? "-") },
    { label: "Social Clicks Total", value: String(socialClicks.total ?? "-") },
  ];

  const countryOptions = useMemo(() => {
    if (!options) return [] as string[];
    if (options.countries?.length)
      return [...options.countries].sort((a, b) => a.localeCompare(b));
    return Object.keys(options.locations ?? {}).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [options]);

  const stateOptions = useMemo(() => {
    if (!options || !country) return [] as string[];
    return options.locations?.[country]?.states ?? [];
  }, [options, country]);

  const industryOptions = useMemo(
    () => [...(options?.industries ?? [])].sort((a, b) => a.localeCompare(b)),
    [options],
  );

  useEffect(() => {
    advisorFormOptionsApi()
      .then(setOptions)
      .catch(() => null);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminAdvisors(
      {
        page,
        limit,
        username: debouncedUsername || undefined,
        emailForContact: debouncedEmail || undefined,
        country: country || undefined,
        state: state || undefined,
        verificationStatus: verificationStatus || undefined,
        industries: industries ? [industries] : undefined,
      },
      ctrl.signal,
    )
      .then(setData)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError")
          setError("Failed to fetch advisors.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [
    page,
    limit,
    debouncedUsername,
    debouncedEmail,
    country,
    state,
    verificationStatus,
    industries,
  ]);

  useEffect(() => {
    if (!selectedId) return;
    const ctrl = new AbortController();
    setDetailsLoading(true);
    getAdminAdvisorDetails(selectedId, ctrl.signal)
      .then(setDetails)
      .finally(() => setDetailsLoading(false));
    return () => ctrl.abort();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setEnquiries([]);
      setEnquiriesTotal(0);
      setExpandedEnquiryIds(new Set());
      return;
    }
    const ctrl = new AbortController();
    setEnquiriesLoading(true);
    getAdminAdvisorEnquiries(selectedId, { page: 1, limit: 50 }, ctrl.signal)
      .then((res) => {
        const nextEnquiries = res?.enquiries ?? [];
        setEnquiries(nextEnquiries);
        setEnquiriesTotal(res?.pagination?.total ?? nextEnquiries.length);
      })
      .catch(() => {
        setEnquiries([]);
        setEnquiriesTotal(0);
      })
      .finally(() => setEnquiriesLoading(false));
    return () => ctrl.abort();
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedId) {
        setSelectedId("");
        setDetails(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const toggleEnquiry = (id: string) => {
    setExpandedEnquiryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (value?: string | null) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })
      : "—";

  const getBackendErrorMessage = (err: unknown): string => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: { data?: { msg?: string } } }).response?.data
        ?.msg === "string"
    ) {
      return (
        (err as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg || "Failed to remove advisor profile."
      );
    }

    return "Failed to remove advisor profile.";
  };

  const confirmRemoveAdvisorProfile = async () => {
    if (!removeTarget) return;
    setIsRemovingProfile(true);
    setRemoveError(null);
    setActionInfo(null);

    try {
      const response = await removeAdminAdvisorProfile(removeTarget.id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              advisors: prev.advisors.filter(
                (advisor) => advisor.id !== removeTarget.id,
              ),
              pagination: {
                ...prev.pagination,
                total: Math.max(0, (prev.pagination?.total ?? 1) - 1),
              },
            }
          : prev,
      );
      if (selectedId === removeTarget.id) {
        setSelectedId("");
        setDetails(null);
        setEnquiries([]);
        setEnquiriesTotal(0);
        setExpandedEnquiryIds(new Set());
      }
      setActionInfo(response?.msg || "Advisor profile removed.");
      setRemoveTarget(null);
    } catch (err) {
      setRemoveError(getBackendErrorMessage(err));
    } finally {
      setIsRemovingProfile(false);
    }
  };

  return (
    <section className={panelClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
            <FiUser className="text-blue-700" /> Advisors
          </h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {data?.pagination?.total ?? 0} total
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <label className="relative">
          <FiAtSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <input
            className={`${inputClassName} w-full pl-9`}
            placeholder="Username (search)"
            value={username}
            onChange={(e) => setParam("advisorsUsername", e.target.value)}
          />
        </label>
        <label className="relative">
          <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <input
            className={`${inputClassName} w-full pl-9`}
            placeholder="Email for contact (search)"
            value={email}
            onChange={(e) => setParam("advisorsEmail", e.target.value)}
          />
        </label>
        <label className="relative">
          <FiCheckCircle className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <select
            className={`${inputClassName} w-full pl-9`}
            value={verificationStatus}
            onChange={(e) =>
              setParam("advisorsVerificationStatus", e.target.value)
            }
          >
            <option value="">All verification status</option>
            <option value="not_applied">Not Applied</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="relative">
          <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <select
            className={`${inputClassName} w-full pl-9`}
            value={country}
            onChange={(e) => {
              setParam("advisorsCountry", e.target.value || undefined);
              setParam("advisorsState", undefined);
            }}
          >
            <option value="">All countries</option>
            {countryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="relative">
          <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <select
            className={`${inputClassName} w-full pl-9`}
            value={state}
            onChange={(e) =>
              setParam("advisorsState", e.target.value || undefined)
            }
            disabled={!country}
          >
            <option value="">All states</option>
            {stateOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="relative">
          <FiTag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <select
            className={`${inputClassName} w-full pl-9`}
            value={industries}
            onChange={(e) =>
              setParam("advisorsIndustries", e.target.value || undefined)
            }
          >
            <option value="">All industries</option>
            {industryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className={statusInfoClassName}>Loading advisors...</p>
      ) : null}
      {actionInfo ? <p className={statusInfoClassName}>{actionInfo}</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && (data?.advisors?.length ?? 0) === 0 ? (
        <p className={statusEmptyClassName}>
          No advisors found for this filter set.
        </p>
      ) : null}

      <div className="mt-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <FiList /> Advisor Directory Table
            </p>
            <span className="text-xs font-medium text-slate-500">
              Click any row to view full page advisor details
            </span>
          </div>
          <div className="max-h-160 overflow-auto">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 text-[11px] font-semibold uppercase tracking-wider text-blue-700 backdrop-blur-xs">
                <tr>
                  <th className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <FiUser /> Advisor
                    </span>
                  </th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data?.advisors?.map((advisor) => {
                  const isSelected = selectedId === advisor.id;
                  return (
                    <tr
                      key={advisor.id}
                      onClick={() => setSelectedId(advisor.id)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? "bg-blue-50/90 font-medium text-slate-900"
                          : "text-slate-700 hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {advisor.profilePictureUrl && !brokenImages[advisor.id] ? (
                            <img
                              src={advisor.profilePictureUrl}
                              alt={advisor.username || advisor.name || "advisor"}
                              className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                              onError={() =>
                                setBrokenImages((prev) => ({
                                  ...prev,
                                  [advisor.id]: true,
                                }))
                              }
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700">
                              {getInitials(advisor.name)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {advisor.name || "Unnamed advisor"}
                            </p>
                            <p className="truncate text-xs text-blue-700">
                              @{advisor.username || "no-username"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-600 sm:text-sm">
                        {getDisplayCategory(advisor.category)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(advisor.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 cursor-pointer"
                        >
                          View Full Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaginationControls
        pagination={data?.pagination}
        onPageChange={(v) => setParam("advisorsPage", String(v))}
        onLimitChange={(v) => {
          setParam("advisorsLimit", String(v));
          setParam("advisorsPage", "1");
        }}
      />

      {/* Full Screen Advisor Details Popup Modal */}
      {selectedId && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 lg:p-8 backdrop-blur-md overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedId("");
                  setDetails(null);
                }
              }}
            >
              <div className="relative w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
                {/* Header Sticky Navigation Bar */}
                <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/95 px-6 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId("");
                        setDetails(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 cursor-pointer"
                    >
                      <FiArrowLeft className="h-4 w-4 text-blue-700" /> Back to Advisors
                    </button>
                    <h4 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                      <FiShield className="text-blue-700" />
                      {detailsUser?.name || String(profile.username ?? "") || "Advisor Profile"}
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                          isVerified ? "bg-green-700 text-white" : "bg-amber-100 text-amber-700"
                        }`}
                        title={isVerified ? "Verified" : "Unverified"}
                      >
                        {isVerified ? (
                          <FiCheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <FiXCircle className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {details && hasAdvisorRole ? (
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveError(null);
                          setRemoveTarget({
                            id: selectedId,
                            name: detailsUser?.name || String(profile.username ?? ""),
                          });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 cursor-pointer"
                      >
                        <FiTrash2 />
                        Remove Advisor Profile
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId("");
                        setDetails(null);
                      }}
                      className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
                      title="Close popup"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Popup Body Content */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  {removeError && !removeTarget ? (
                    <p className={statusErrorClassName}>{removeError}</p>
                  ) : null}

                  {detailsLoading ? (
                    <div className="py-12 text-center text-sm font-semibold text-slate-600">
                      Loading advisor details...
                    </div>
                  ) : null}

                  {details && !detailsLoading ? (
                    <>
                      {/* Identity Header Card */}
                      <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-blue-50/70 via-slate-50 to-indigo-50/50 p-5 shadow-xs">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {profile.profilePictureUrl || (detailsUser as any)?.profilePictureUrl ? (
                            <img
                              src={String(profile.profilePictureUrl || (detailsUser as any)?.profilePictureUrl)}
                              alt={detailsUser?.name || "Advisor"}
                              className="h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-md"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white bg-blue-700 text-2xl font-bold text-white shadow-md">
                              {getInitials(detailsUser?.name)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-bold text-slate-900">
                                {detailsUser?.name || "Unnamed Advisor"}
                              </h3>
                              {profile.username || detailsUser?.username ? (
                                <span className="rounded-full bg-blue-700 px-3 py-0.5 text-xs font-semibold text-white">
                                  @{String(profile.username ?? detailsUser?.username)}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              {detailsUser?.email || String(profile.emailForContact ?? "-")}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Location: {[profile.country, profile.state, detailsUser?.country, detailsUser?.state].filter(Boolean).slice(0, 2).join(", ") || "-"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs font-semibold">
                            <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800">
                              Category: {getDisplayCategory(typeof profile.category === "string" ? profile.category : (detailsUser as any)?.category)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Grid layout for info cards */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Advisor Profile Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                          <p className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700">
                            <FiCompass className="h-4 w-4" /> Advisor Profile Information
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {advisorItems.map((item) => (
                              <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                                <p className="text-xs font-semibold text-blue-700">{item.label}</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                  {item.value || "-"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Analytics Snapshot */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                          <div>
                            <p className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700">
                              <FiSearch className="h-4 w-4" /> Analytics Snapshot
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {metricItems.map((item) => (
                                <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                                  <p className="text-xs font-semibold text-blue-700">{item.label}</p>
                                  <p className="mt-1 text-xl font-bold text-slate-900">{item.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Social Links Section */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <p className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700">
                          <FiGlobe className="h-4 w-4" /> Social Media Links & Engagement
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {socialItems.map((item) => (
                            <div
                              key={item.key}
                              className={`rounded-2xl border p-3.5 ${item.className}`}
                            >
                              <p className="inline-flex items-center gap-2 text-sm font-bold">
                                <item.icon /> {item.label}
                              </p>
                              {item.value ? (
                                <div className="mt-2 flex flex-col gap-2">
                                  <a
                                    href={getSocialProfileUrl(item.key, item.value)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate text-sm font-semibold underline-offset-2 hover:underline"
                                    title={`Open ${item.label} profile`}
                                  >
                                    {item.value}
                                  </a>
                                  <div className="flex flex-wrap items-center gap-2">
                                    {formatCompactCount(item.count) ? (
                                      <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${item.badgeClassName}`}
                                      >
                                        {formatCompactCount(item.count)} {item.countLabel}
                                      </span>
                                    ) : null}
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-2.5 py-0.5 text-xs font-bold text-white">
                                      <FaRegHandPointer className="h-2.5 w-2.5" />
                                      {item.clicks ?? 0} clicks
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-3">
                                  <span
                                    className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700"
                                  >
                                    Not connected
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-semibold text-slate-700">
                          <span>Total Social Clicks Recorded:</span>
                          <span className="rounded-full bg-blue-700 px-3 py-1 text-sm font-bold text-white">
                            {String(socialClicks.total ?? 0)}
                          </span>
                        </div>
                      </div>

                      {/* Enquiries Section */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700">
                            <FiMessageCircle className="h-4 w-4" /> Received Enquiries
                          </p>
                          <span className="rounded-full bg-blue-700 px-3 py-0.5 text-xs font-bold text-white">
                            {enquiriesTotal} total
                          </span>
                        </div>
                        {enquiriesLoading ? (
                          <p className="text-sm text-slate-600">Loading enquiries...</p>
                        ) : null}
                        {!enquiriesLoading && enquiries.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No enquiries recorded for this advisor.
                          </p>
                        ) : null}
                        {!enquiriesLoading && enquiries.length > 0 ? (
                          <div className="space-y-2">
                            {enquiries.map((item) => {
                              const enquiry = item as {
                                _id?: string;
                                subject?: string;
                                message?: string;
                                category?: string;
                                status?: string;
                                createdAt?: string;
                                submittedBy?:
                                  | { name?: string; email?: string }
                                  | string;
                              };
                              const id =
                                enquiry._id ||
                                `${enquiry.subject || "enquiry"}-${enquiry.createdAt || ""}`;
                              const isOpen = expandedEnquiryIds.has(id);
                              return (
                                <div
                                  key={id}
                                  className="rounded-xl border border-slate-200 bg-slate-50/50"
                                >
                                  <button
                                    type="button"
                                    onClick={() => toggleEnquiry(id)}
                                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-100/80 rounded-xl cursor-pointer"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-slate-900">
                                        <span className="text-blue-700">Subject:</span>{" "}
                                        {enquiry.subject || "Untitled enquiry"}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {formatDate(enquiry.createdAt)}
                                      </p>
                                    </div>
                                    <FiChevronRight
                                      className={`h-5 w-5 shrink-0 text-slate-400 transition ${
                                        isOpen ? "rotate-90 text-blue-700" : ""
                                      }`}
                                    />
                                  </button>
                                  {isOpen ? (
                                    <div className="border-t border-slate-200 px-4 py-3 bg-white rounded-b-xl">
                                      <p className="whitespace-pre-wrap text-sm text-slate-800">
                                        <span className="font-semibold text-blue-700">
                                          Message:
                                        </span>{" "}
                                        {enquiry.message || "No message"}
                                      </p>
                                      <div className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                                        <p><span className="font-semibold">Category:</span> {enquiry.category || "-"}</p>
                                        <p><span className="font-semibold">Status:</span> {enquiry.status || "-"}</p>
                                        <p>
                                          <span className="font-semibold">Submitted By:</span>{" "}
                                          {typeof enquiry.submittedBy === "string"
                                            ? enquiry.submittedBy
                                            : `${enquiry.submittedBy?.name || "-"}${
                                                enquiry.submittedBy?.email
                                                  ? ` (${enquiry.submittedBy.email})`
                                                  : ""
                                              }`}
                                        </p>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {removeTarget && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-10000 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-5 shadow-2xl">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                    <FiTrash2 />
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">
                      Remove Advisor Profile
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      This will remove the advisor profile and advisor access for
                      this user. The user account will not be deleted.
                    </p>
                    {removeTarget.name ? (
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        User: {removeTarget.name}
                      </p>
                    ) : null}
                  </div>
                </div>

                {removeError ? (
                  <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {removeError}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    disabled={isRemovingProfile}
                    onClick={() => {
                      setRemoveTarget(null);
                      setRemoveError(null);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isRemovingProfile}
                    onClick={confirmRemoveAdvisorProfile}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-700 bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    <FiTrash2 />
                    {isRemovingProfile ? "Removing..." : "Remove Advisor Profile"}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRegHandPointer,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
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
import { getDisplayCategory, getDisplayPpp } from "../../advisor/advisorDisplay.utils";

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

  const identityItems = [
    { label: "Name", value: detailsUser?.name || "-" },
    {
      label: "Username",
      value:
        profile.username || detailsUser?.username
          ? `@${String(profile.username ?? detailsUser?.username)}`
          : "-",
    },
    {
      label: "Email",
      value: detailsUser?.email || String(profile.emailForContact ?? "-"),
    },
    {
      label: "Location",
      value:
        [
          profile.country,
          profile.state,
          detailsUser?.country,
          detailsUser?.state,
        ]
          .filter(Boolean)
          .slice(0, 2)
          .join(", ") || "-",
    },
  ];
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
      label: "PPP",
      value: getDisplayPpp(
        typeof profile.ppp === "number"
          ? profile.ppp
          : (detailsUser as Record<string, unknown> | null)?.ppp as number | null | undefined,
      ),
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

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <FiList /> Advisor List
          </p>
          <div className="max-h-135 space-y-2 overflow-auto pr-1">
            {data?.advisors?.map((advisor) => (
              <button
                key={advisor.id}
                onClick={() => setSelectedId(advisor.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === advisor.id ? "border-blue-500 bg-linear-to-r from-blue-50 to-cyan-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
              >
                {advisor.profilePictureUrl && !brokenImages[advisor.id] ? (
                  <img
                    src={advisor.profilePictureUrl}
                    alt={advisor.username || advisor.name || "advisor"}
                    className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                    onError={() =>
                      setBrokenImages((prev) => ({
                        ...prev,
                        [advisor.id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700">
                    {getInitials(advisor.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {advisor.name || "Unnamed advisor"}
                  </p>
                  <p className="truncate text-xs text-blue-700">
                    @{advisor.username || "no-username"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    PPP: {getDisplayPpp(advisor.ppp)} | Category: {getDisplayCategory(advisor.category)}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {advisor.id}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <div className="mb-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                <FiShield className="text-blue-700" /> Advisor Details
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${isVerified ? "bg-green-700 text-white" : "bg-amber-100 text-amber-700"}`}
                  title={isVerified ? "Verified" : "Unverified"}
                >
                  {isVerified ? (
                    <FiCheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <FiXCircle className="h-3.5 w-3.5" />
                  )}
                </span>
              </h4>
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <FiTrash2 />
                  Remove Advisor Profile
                </button>
              ) : null}
            </div>
          </div>
          {removeError && !removeTarget ? (
            <p className={statusErrorClassName}>{removeError}</p>
          ) : null}
          {!selectedId ? (
            <p className="text-sm text-blue-700">
              Select an advisor from the list to view details.
            </p>
          ) : null}
          {detailsLoading ? (
            <p className="text-sm text-slate-600">Loading details...</p>
          ) : null}
          {details && !detailsLoading ? (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {identityItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-blue-700">
                      {item.label}
                    </p>
                    <p
                      className={`mt-1 ${item.label === "Username" ? "inline-flex w-fit rounded-full bg-blue-700 px-2.5 py-0.5 text-sm font-semibold text-white" : "text-sm font-medium text-slate-800"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <FiCompass /> Advisor Profile
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {advisorItems.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-blue-700">{item.label}</p>
                      <p className="text-sm text-slate-800">
                        {item.value || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <FiGlobe /> Social Links
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {socialItems.map((item) => (
                    <div
                      key={item.key}
                      className={`rounded-xl border p-2.5 ${item.className}`}
                    >
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold">
                        <item.icon /> {item.label}
                      </p>
                      {item.value ? (
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <a
                            href={getSocialProfileUrl(item.key, item.value)}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-sm font-medium underline-offset-2 hover:underline"
                            title={`Open ${item.label} profile`}
                          >
                            {item.value}
                          </a>
                          {formatCompactCount(item.count) ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeClassName}`}
                            >
                              {formatCompactCount(item.count)} {item.countLabel}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                            <FaRegHandPointer className="h-2.5 w-2.5" />
                            {item.clicks ?? 0} clicks
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <span
                            aria-label={`${item.label} unavailable`}
                            title={`${item.label} unavailable`}
                            className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700"
                          >
                            Not connected
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-slate-200/70 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    Total Social Clicks:{" "}
                    <span className="text-slate-900">
                      {String(socialClicks.total ?? 0)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <FiSearch /> Analytics Snapshot
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {metricItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-slate-50 p-2"
                    >
                      <p className="text-xs text-blue-700">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="mb-2">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    <FiMessageCircle /> Enquiries
                    <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {enquiriesTotal}
                    </span>
                  </p>
                </div>
                {enquiriesLoading ? (
                  <p className="text-xs text-slate-600">Loading enquiries...</p>
                ) : null}
                {!enquiriesLoading && enquiries.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No enquiries for this advisor.
                  </p>
                ) : null}
                {!enquiriesLoading && enquiries.length > 0 ? (
                  <div className="space-y-1.5">
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
                          className="rounded-lg border border-slate-200 bg-white"
                        >
                          <button
                            type="button"
                            onClick={() => toggleEnquiry(id)}
                            className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                <span className="text-blue-700">Subject:</span>{" "}
                                {enquiry.subject || "Untitled enquiry"}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {formatDate(enquiry.createdAt)}
                              </p>
                            </div>
                            <FiChevronRight
                              className={`h-4 w-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-90" : ""}`}
                            />
                          </button>
                          {isOpen ? (
                            <div className="border-t border-slate-100 px-2.5 py-2">
                              <p className="whitespace-pre-wrap text-xs text-slate-700">
                                <span className="font-semibold text-blue-700">
                                  Message:
                                </span>{" "}
                                {enquiry.message || "No message"}
                              </p>
                              <div className="mt-1 text-[11px] text-slate-500">
                                <p>Category: {enquiry.category || "-"}</p>
                                <p>Status: {enquiry.status || "-"}</p>
                                <p>
                                  Submitted By:{" "}
                                  {typeof enquiry.submittedBy === "string"
                                    ? enquiry.submittedBy
                                    : `${enquiry.submittedBy?.name || "-"}${enquiry.submittedBy?.email ? ` (${enquiry.submittedBy.email})` : ""}`}
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
            </div>
          ) : null}
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

      {removeTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
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
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRemovingProfile}
                onClick={confirmRemoveAdvisorProfile}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-700 bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiTrash2 />
                {isRemovingProfile ? "Removing..." : "Remove Advisor Profile"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiCompass,
  FiAlertCircle,
  FiHome,
  FiExternalLink,
  FiUser,
  FiMail,
  FiFileText,
  FiZap,
  FiMessageSquare,
  FiX,
  FiCheckCircle,
  FiLock,
  FiChevronDown,
} from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa6";
import { submitCampaignApplicationApi } from "../../services/campaignApplications.service";
import {
  getApprovedBusinessRequirementByIdPublic,
  trackRequirementClickApi,

  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";

const isValidPhone = (phone: string): boolean => {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  if (!/^[+\d\s().-]+$/.test(trimmed)) return false;
  const digitsOnly = trimmed.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

function getLoggedInUserEmail(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem("userEmail");
  if (stored) return stored;
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && typeof payload.email === "string") {
      localStorage.setItem("userEmail", payload.email);
      return payload.email;
    }
  } catch {
    // ignore
  }
  return "";
}

export function ResourceDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const { id, storeUsername } = useParams<{ id?: string; storeUsername?: string }>();
  const identifier = storeUsername || id;
  const [requirement, setRequirement] = useState<ApprovedBusinessRequirementItem | null>(null);
  const isStorePage = location.pathname.startsWith("/store");
  const expectedType: "store" | "campaign" = isStorePage ? "store" : "campaign";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSubmitError, setAppSubmitError] = useState("");
  const [showAdvisorAuthModal, setShowAdvisorAuthModal] = useState(false);

  const handleApplyByMessageClick = () => {
    if (isAuthenticated) {
      setMsgSent(false);
      const accEmail = getLoggedInUserEmail() || localStorage.getItem("email") || "";
      const accName = localStorage.getItem("userName") || localStorage.getItem("name") || "";
      const accPhone = localStorage.getItem("userPhone") || localStorage.getItem("phone") || "";
      if (accEmail) setMsgEmail(accEmail);
      if (accName) setMsgName(accName);
      if (accPhone) setMsgPhone(accPhone);
      setShowMessageModal(true);
    } else {
      setShowAdvisorAuthModal(true);
    }
  };



  useEffect(() => {
    if (!identifier) return;
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const item = await getApprovedBusinessRequirementByIdPublic(identifier, expectedType);
        if (!active) return;
        setRequirement(item);
        if (item?.storeUsername && storeUsername !== item.storeUsername) {
          navigate(`/${expectedType}/${item.storeUsername}`, { replace: true });
        }
      } catch (err: unknown) {
        if (active) {
          const apiMsg =
            typeof err === "object" && err !== null && "response" in err
              ? (err as { response?: { data?: { msg?: string } } }).response?.data?.msg
              : "";
          const notFoundFallback = isStorePage
            ? "This store was not found or is no longer active."
            : "This campaign was not found or is no longer active.";

          setError(apiMsg || (err instanceof Error && !err.message.includes("status code") ? err.message : notFoundFallback));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [identifier, isStorePage]);

  const onOpenResourceLink = async () => {
    const targetId = requirement?._id || identifier;
    if (!targetId || !requirement) return;
    try {
      setTracking(true);
      const res = await trackRequirementClickApi(targetId, expectedType);
      const targetUrl = res.url || requirement.url;
      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      if (requirement.url) {
        window.open(requirement.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setTracking(false);
    }
  };

  const handleSendMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !requirement?._id) return;

    if (!msgPhone.trim()) {
      setAppSubmitError("Phone number is required to submit application.");
      return;
    }

    if (!isValidPhone(msgPhone)) {
      setAppSubmitError("Please enter a valid phone number with 7–15 digits (e.g. +91 9876543210).");
      return;
    }

    try {
      setIsSubmittingApp(true);
      setAppSubmitError("");
      await submitCampaignApplicationApi(requirement._id, msgText.trim(), msgPhone.trim());
      localStorage.setItem("userPhone", msgPhone.trim());
      localStorage.setItem("phone", msgPhone.trim());
      setMsgSent(true);
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Failed to submit application proposal.";
      setAppSubmitError(msg);
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = requirement ? `${baseUrl}/${expectedType}/${requirement.storeUsername || requirement._id}` : (typeof window !== "undefined" ? window.location.href : "");

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F8] py-6 px-4 flex flex-col items-center justify-between font-sans text-slate-800">
      <div className="w-full max-w-md space-y-6 mx-auto">
        {/* Top Header Bar: Back Button on left, Profile/Avatar on right */}
        <div className="flex items-center justify-between px-1">
          <Link
            to={isStorePage ? "/store" : "/campaign"}
            className="flex items-center justify-center h-11 w-11 rounded-full bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:shadow-sm transition border border-slate-200/70 cursor-pointer"
            title={isStorePage ? "Back to All Stores" : "Back to All Campaigns"}
          >
            <FiArrowLeft className="h-5 w-5 stroke-[2.2]" />
          </Link>
          {isStorePage && requirement?.postedByAdvisorUsername ? (
            <Link
              to={`/${requirement.postedByAdvisorUsername}`}
              className="flex items-center justify-center h-11 w-11 rounded-full bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:shadow-sm transition border border-slate-200/70 cursor-pointer"
              title="Advisor Profile"
            >
              <FiUser className="h-5 w-5 stroke-[2.2]" />
            </Link>
          ) : (
            <div className="h-11 w-11" />
          )}
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-xs">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
            <p className="mt-4 text-sm font-semibold text-slate-700">
              {isStorePage ? "Loading store details..." : "Loading campaign details..."}
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 text-center shadow-xl shadow-slate-200/50">
            {/* Decorative background glow */}
            <div
              className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full blur-3xl opacity-30 ${
                isStorePage ? "bg-amber-400" : "bg-blue-400"
              }`}
            />

            {/* Icon Graphic */}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-3xl ${
                  isStorePage
                    ? "bg-amber-50 border border-amber-200/70 text-amber-600"
                    : "bg-blue-50 border border-blue-200/70 text-blue-600"
                } shadow-inner`}
              >
                {isStorePage ? (
                  <FiShoppingBag className="h-10 w-10 stroke-[1.75]" />
                ) : (
                  <FiCompass className="h-10 w-10 stroke-[1.75]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-md border-2 border-white">
                <FiAlertCircle className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{isStorePage ? "Store Not Found" : "Campaign Not Found"}</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isStorePage ? "Store Unavailable" : "Campaign Unavailable"}
            </h2>

            {/* Subtext */}
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              {identifier ? (
                <>
                  The {isStorePage ? "store" : "campaign"}{" "}
                  <span className="font-semibold text-slate-800 font-mono">
                    @{identifier}
                  </span>{" "}
                  does not exist or is no longer active.
                </>
              ) : (
                error ||
                (isStorePage
                  ? "This store requirement was not found."
                  : "This campaign requirement was not found.")
              )}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isStorePage ? "/store" : "/campaign"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 hover:bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md transition active:scale-95"
              >
                {isStorePage ? (
                  <FiShoppingBag className="h-4 w-4" />
                ) : (
                  <FiCompass className="h-4 w-4" />
                )}
                <span>{isStorePage ? "Explore All Stores" : "Explore All Campaigns"}</span>
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition"
              >
                <FiHome className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && requirement ? (
          <main className="space-y-6">
            {/* Profile Avatar, Title & Subtitle Section */}
            <div className="text-center space-y-3 pt-1">
              {/* Circular Avatar / Logo with Gold Ring */}
              <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1.5 bg-[#FFCC00] shadow-md flex items-center justify-center">
                {isStorePage && requirement.instagramProfilePictureUrl ? (
                  <img
                    src={getProxiedImageUrl(requirement.instagramProfilePictureUrl)}
                    alt={requirement.companyName}
                    className="h-full w-full rounded-full object-cover border-2 border-white bg-white"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-3xl font-black text-white border-2 border-white uppercase tracking-wider">
                    {(requirement.companyName || "C").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Main Title & Subtitle */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight">
                  {requirement.companyName}
                </h1>
                <p className="text-sm font-medium text-slate-600">
                  {requirement.storeUsername
                    ? `@${requirement.storeUsername}`
                    : isStorePage
                      ? "Store Listing"
                      : "Campaign Requirement"}
                </p>

                {/* Badges: Budget, Reward, Category, Goal (Only for Campaigns) */}
                {!isStorePage && requirement.type !== "store" ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
                    {requirement.budget ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                        💰 Budget: {requirement.budget}
                      </span>
                    ) : null}
                    {requirement.rewardType ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                        🎁 Reward: {requirement.rewardType}
                      </span>
                    ) : null}
                    {requirement.category ? (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
                        🏷️ {requirement.category}
                      </span>
                    ) : null}
                    {requirement.campaignGoal ? (
                      <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
                        🎯 Goal: {requirement.campaignGoal}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Social Icons Row (Only for Stores with socialLinks) */}
              {isStorePage &&
              requirement.socialLinks &&
              (requirement.socialLinks.youtube?.trim() ||
                requirement.socialLinks.telegram?.trim() ||
                requirement.socialLinks.instagram?.trim()) ? (
                <div className="flex items-center justify-center gap-3.5 pt-2">
                  {requirement.socialLinks.youtube?.trim() ? (
                    <a
                      href={`https://youtube.com/${
                        requirement.socialLinks.youtube.trim().startsWith("@")
                          ? requirement.socialLinks.youtube.trim()
                          : `@${requirement.socialLinks.youtube.trim()}`
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-2xl text-[#FF0000] shadow-xs transition hover:scale-105 hover:shadow-md cursor-pointer"
                      title="YouTube Channel"
                    >
                      <FaYoutube />
                    </a>
                  ) : null}

                  {requirement.socialLinks.telegram?.trim() ? (
                    <a
                      href={`https://t.me/${requirement.socialLinks.telegram
                        .trim()
                        .replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-2xl text-[#229ED9] shadow-xs transition hover:scale-105 hover:shadow-md cursor-pointer"
                      title="Telegram Channel"
                    >
                      <FaTelegram />
                    </a>
                  ) : null}

                  {requirement.socialLinks.instagram?.trim() ? (
                    <a
                      href={`https://instagram.com/${requirement.socialLinks.instagram
                        .trim()
                        .replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-2xl text-[#E4405F] shadow-xs transition hover:scale-105 hover:shadow-md cursor-pointer"
                      title="Instagram Profile"
                    >
                      <FaInstagram />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Action Pills Stack */}
            <div className="space-y-3.5 pt-1">
              {/* Pill 1: Official Link / Target URL */}
              {isAuthenticated ? (
                (requirement.url || (requirement as any).personalWebsite || (requirement as any).website) ? (
                  <button
                    type="button"
                    disabled={tracking}
                    onClick={() => void onOpenResourceLink()}
                    className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-xs">
                      <FiExternalLink className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                      {tracking
                        ? "Opening Link..."
                        : isStorePage
                          ? "Access Official Store Link"
                          : "Website/Target URL"}
                    </span>
                    <FiExternalLink className="h-5 w-5 text-slate-600 group-hover:text-blue-700 transition" />
                  </button>
                ) : null
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdvisorAuthModal(true)}
                  className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-xs">
                    <FiLock className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                    {isStorePage ? "Log in to Access Official Link" : "Website/Target URL"}
                  </span>
                  <FiLock className="h-5 w-5 text-slate-500 group-hover:text-blue-700 transition" />
                </button>
              )}

              {/* Store Social Media Pills (Only for Store pages) */}
              {isStorePage && requirement.socialLinks?.instagram?.trim() ? (
                <a
                  href={`https://instagram.com/${requirement.socialLinks.instagram
                    .trim()
                    .replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white shadow-xs">
                    <FaInstagram className="h-5 w-5 text-white" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                    View Instagram Profile
                  </span>
                  <FaInstagram className="h-5 w-5 text-[#E4405F] group-hover:scale-110 transition" />
                </a>
              ) : null}

              {isStorePage && requirement.socialLinks?.telegram?.trim() ? (
                <a
                  href={`https://t.me/${requirement.socialLinks.telegram
                    .trim()
                    .replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#0088CC] text-white shadow-xs">
                    <FaTelegram className="h-5 w-5 text-white" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                    Join Telegram Group
                  </span>
                  <FaTelegram className="h-5 w-5 text-[#0088CC] group-hover:scale-110 transition" />
                </a>
              ) : null}

              {isStorePage && requirement.socialLinks?.youtube?.trim() ? (
                <a
                  href={`https://youtube.com/${
                    requirement.socialLinks.youtube.trim().startsWith("@")
                      ? requirement.socialLinks.youtube.trim()
                      : `@${requirement.socialLinks.youtube.trim()}`
                  }`}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-xs">
                    <FaYoutube className="h-5 w-5 text-white" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                    View YouTube Channel
                  </span>
                  <FaYoutube className="h-5 w-5 text-[#FF0000] group-hover:scale-110 transition" />
                </a>
              ) : null}

              {/* Detailed Requirements / What should creators do? (Accordion) */}
              {requirement.detailedRequirements ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen((prev) => !prev)}
                    className="w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#1E293B] text-white shadow-xs">
                      <FiFileText className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                      {isStorePage ? "Detailed Requirements" : "What should creators do?"}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center text-slate-600 transition">
                      <FiChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          isDetailsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isDetailsOpen ? (
                    <div className="p-5 border-t border-slate-100 bg-white text-left animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <FiFileText className="h-4 w-4 text-blue-600" />
                        <span>
                          {isStorePage ? "Store Overview & Details" : "What should creators do?"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {requirement.detailedRequirements}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Advisor Attribution Pill (Only for Store pages) */}
              {isStorePage && (requirement.postedByAdvisorUsername || requirement.postedByAdvisorName) ? (
                <Link
                  to={
                    requirement.postedByAdvisorUsername
                      ? `/${requirement.postedByAdvisorUsername}`
                      : "#"
                  }
                  className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white font-extrabold text-base shadow-xs">
                    {(requirement.postedByAdvisorName || requirement.postedByAdvisorUsername || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                    Posted by @{requirement.postedByAdvisorUsername || requirement.postedByAdvisorName}
                  </span>
                  <FiUser className="h-5 w-5 text-slate-600 group-hover:text-amber-600 transition" />
                </Link>
              ) : null}

              {/* Contact Business Email (if email exists) */}
              {requirement.businessEmail ? (
                <a
                  href={`mailto:${requirement.businessEmail}`}
                  className="group w-full rounded-full bg-[#ECEEF2] hover:bg-[#E2E6EC] border border-slate-200/80 p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99]"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                    <FiMail className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-sm sm:text-base px-3 truncate">
                    Contact Email ({requirement.businessEmail})
                  </span>
                  <FiMail className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition" />
                </a>
              ) : null}

              {/* Bottom Pill: JOIN (For Campaigns) */}
              {!isStorePage ? (
                <button
                  type="button"
                  onClick={handleApplyByMessageClick}
                  className="group w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white p-2 sm:p-2.5 pr-5 sm:pr-6 flex items-center justify-between shadow-md transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                    <FiMessageSquare className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-white text-sm sm:text-base px-3 truncate">
                    JOIN
                  </span>
                  <FiMessageSquare className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                </button>
              ) : null}
            </div>

            {/* Social Share & Copy Link Section */}
            <div className="pt-3 pb-2 flex flex-col items-center justify-center space-y-3">
              <SocialShareButtons
                url={shareUrl}
                title={
                  isStorePage
                    ? `Check out store listing for ${requirement.companyName}`
                    : `Check out campaign requirement for ${requirement.companyName}`
                }
              />
            </div>
          </main>
        ) : null}
      </div>

      {/* Message Modal for Direct Application without Login */}
      {showMessageModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setShowMessageModal(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Apply to {requirement?.companyName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAuthenticated
                  ? "Send your application message directly to the campaign manager."
                  : "No login required. Send your application message directly to the campaign manager."}
              </p>
            </div>

            {msgSent ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 text-center space-y-2">
                <FiCheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-base">Application Submitted Successfully!</p>
                <p className="text-xs text-emerald-700">
                  Your proposal has been delivered directly to the campaign manager's dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="mt-3 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                {appSubmitError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                    {appSubmitError}
                  </div>
                ) : null}
                {isAuthenticated ? (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 flex flex-col gap-1 text-xs space-y-1">
                    <span className="font-bold text-blue-950">Applying as {msgName || localStorage.getItem("userName") || getLoggedInUserEmail() || "Applicant"}</span>
                    <div className="text-blue-800 font-medium">Email: {msgEmail || getLoggedInUserEmail() || "Account Email"}</div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={msgName}
                        onChange={(e) => setMsgName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={msgEmail}
                        onChange={(e) => setMsgEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-600"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={msgPhone}
                    onChange={(e) => {
                      setMsgPhone(e.target.value);
                      if (appSubmitError) setAppSubmitError("");
                    }}
                    placeholder="e.g. +91 9876543210"
                    className={`w-full rounded-xl border ${
                      msgPhone.trim() && !isValidPhone(msgPhone)
                        ? "border-rose-400 bg-rose-50/20"
                        : "border-slate-200"
                    } p-3 text-sm outline-none focus:border-blue-600`}
                  />
                  {msgPhone.trim() && !isValidPhone(msgPhone) ? (
                    <p className="mt-1 text-xs text-rose-600 font-medium">
                      Please enter a valid phone number (7–15 digits, e.g. +91 9876543210).
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Message / Proposal *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this campaign..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingApp}
                  className="w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition disabled:opacity-60 cursor-pointer"
                >
                  {isSubmittingApp ? "Submitting Proposal..." : "Submit Application Proposal"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* Auth Prompt Dialog Modal */}
      {showAdvisorAuthModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 text-center">
            <button
              type="button"
              onClick={() => setShowAdvisorAuthModal(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <FiLock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Login Required
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                Please log in to submit your application proposal to this campaign.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setShowAdvisorAuthModal(false)}
                className="w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer Badge */}
      <footer className="pt-8 pb-2 text-center text-xs font-semibold text-slate-600">
        <div className="inline-flex items-center gap-2">
          <span>{isStorePage ? "Start your store with" : "Start your campaign with"}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-xs">
            <FiZap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
            Folksmint
          </span>
        </div>
      </footer>
    </div>
  );
}

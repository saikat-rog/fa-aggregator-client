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
  FiDollarSign,
  FiGift,
  FiTag,
  FiTarget,
  FiGlobe,
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
    <div className="min-h-screen pb-16 text-[#201A2B]">
      <div className="w-full max-w-xl space-y-5 mx-auto px-4 pt-4 sm:pt-6">
        {/* Top Header Bar: Back Button & Advisor Profile Link */}
        <div className="flex items-center justify-between">
          <Link
            to={isStorePage ? "/store" : "/campaign"}
            className="inline-flex items-center gap-2 text-xs font-bold font-heading text-[#7A7286] hover:text-[#FF5A36] transition"
            title={isStorePage ? "Back to All Stores" : "Back to All Campaigns"}
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>{isStorePage ? "Back to All Stores" : "Back to All Campaigns"}</span>
          </Link>
          {isStorePage && requirement?.postedByAdvisorUsername ? (
            <Link
              to={`/${requirement.postedByAdvisorUsername}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E7E1D6] px-3 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:border-[#6C4BFF] hover:text-[#6C4BFF] shadow-2xs transition"
              title="Advisor Profile"
            >
              <FiUser className="h-3.5 w-3.5" />
              <span>@{requirement.postedByAdvisorUsername}</span>
            </Link>
          ) : (
            <div className="h-8" />
          )}
        </div>

        {isLoading ? (
          <div className="rounded-[28px] border border-[#E7E1D6] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#F1ECFF] border-t-[#6C4BFF]" />
            <p className="mt-4 text-xs font-bold font-heading uppercase tracking-wider text-[#7A7286]">
              {isStorePage ? "Loading store details..." : "Loading campaign details..."}
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="relative overflow-hidden rounded-[28px] border border-[#E7E1D6] bg-white p-8 sm:p-10 text-center shadow-sm">
            {/* Decorative background glow */}
            <div
              className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full blur-3xl opacity-20 ${
                isStorePage ? "bg-[#FF5A36]" : "bg-[#6C4BFF]"
              }`}
            />

            {/* Icon Graphic */}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-3xl ${
                  isStorePage
                    ? "bg-[#FFF0ED] border border-[#FFD0C6] text-[#FF5A36]"
                    : "bg-[#F1ECFF] border border-[#D9CEFF] text-[#6C4BFF]"
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
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E1D6] px-3 py-1 text-xs font-bold font-heading text-[#7A7286] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{isStorePage ? "Store Not Found" : "Campaign Not Found"}</span>
            </div>

            {/* Heading */}
            <h2 className="font-heading text-2xl font-extrabold text-[#201A2B] tracking-tight">
              {isStorePage ? "Store Unavailable" : "Campaign Unavailable"}
            </h2>

            {/* Subtext */}
            <p className="mt-2 text-sm text-[#7A7286] leading-relaxed max-w-xs mx-auto">
              {identifier ? (
                <>
                  The {isStorePage ? "store" : "campaign"}{" "}
                  <span className="font-semibold text-[#201A2B] font-mono-code">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full btn-coral px-6 py-3 text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E1D6] bg-white hover:bg-[#FAF8F5] px-6 py-3 text-xs font-bold font-heading text-[#201A2B] transition"
              >
                <FiHome className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && requirement ? (
          <main className="rounded-[28px] border border-[#E7E1D6] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            {/* Profile Avatar, Title & Subtitle Section */}
            <div className="text-center space-y-3 pt-1">
              {/* Circular Avatar / Logo with Brand Gradient Ring */}
              <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 bg-linear-to-tr from-[#FF5A36] via-[#FFB800] to-[#6C4BFF] shadow-sm flex items-center justify-center">
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
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#201A2B] text-2xl sm:text-3xl font-heading font-extrabold text-white border-2 border-white uppercase tracking-wider">
                    {(requirement.companyName || "C").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Main Title, Subtitle & Top Round Badges */}
              <div className="space-y-1.5">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#201A2B] tracking-tight">
                  {requirement.companyName}
                </h1>
                <p className="font-mono-code text-xs sm:text-sm font-semibold text-[#7A7286]">
                  {requirement.storeUsername
                    ? `@${requirement.storeUsername}`
                    : isStorePage
                      ? "Store Listing"
                      : "Campaign Requirement"}
                </p>

                {/* Small Round Badges at the top (Kept intact) */}
                {!isStorePage && requirement.type !== "store" ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {requirement.budget ? (
                      <span className="badge-pill bg-[#E8F8F0] border border-[#B3E6D0] text-[#1F9D6B] font-mono-code text-[11px] font-bold">
                        💰 Budget: {requirement.budget}
                      </span>
                    ) : null}
                    {requirement.rewardType ? (
                      <span className="badge-pill bg-[#F1ECFF] border border-[#D9CEFF] text-[#6C4BFF] font-heading text-[11px] font-bold">
                        🎁 Reward: {requirement.rewardType}
                      </span>
                    ) : null}
                    {requirement.category ? (
                      <span className="badge-pill bg-[#FFF0ED] border border-[#FFD0C6] text-[#FF5A36] font-heading text-[11px] font-bold">
                        🏷️ {requirement.category}
                      </span>
                    ) : null}
                    {requirement.campaignGoal ? (
                      <span className="badge-pill bg-[#F8F5FE] border border-[#E4D7FC] text-[#8B5CF6] font-heading text-[11px] font-bold">
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
                <div className="flex items-center justify-center gap-3 pt-2">
                  {requirement.socialLinks.youtube?.trim() ? (
                    <a
                      href={`https://youtube.com/${
                        requirement.socialLinks.youtube.trim().startsWith("@")
                          ? requirement.socialLinks.youtube.trim()
                          : `@${requirement.socialLinks.youtube.trim()}`
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E1D6] bg-white text-xl text-[#FF0000] shadow-2xs transition hover:scale-105 hover:border-[#FF0000] cursor-pointer"
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
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E1D6] bg-white text-xl text-[#229ED9] shadow-2xs transition hover:scale-105 hover:border-[#229ED9] cursor-pointer"
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
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E1D6] bg-white text-xl text-[#E4405F] shadow-2xs transition hover:scale-105 hover:border-[#E4405F] cursor-pointer"
                      title="Instagram Profile"
                    >
                      <FaInstagram />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Action Pills Stack */}
            <div className="space-y-3 pt-1">
              {isStorePage ? (
                /* STORE PAGE STACK */
                <>
                  {/* Store Official Link */}
                  {isAuthenticated ? (
                    (requirement.url || (requirement as any).personalWebsite || (requirement as any).website) ? (
                      <button
                        type="button"
                        disabled={tracking}
                        onClick={() => void onOpenResourceLink()}
                        className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#201A2B] text-white shadow-xs">
                          <FiExternalLink className="h-5 w-5 stroke-[2.2]" />
                        </div>
                        <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                          {tracking ? "Opening Link..." : "Access Official Store Link"}
                        </span>
                        <FiExternalLink className="h-5 w-5 text-[#7A7286] group-hover:text-[#6C4BFF] transition" />
                      </button>
                    ) : null
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAdvisorAuthModal(true)}
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#201A2B] text-white shadow-xs">
                        <FiLock className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        Log in to Access Official Link
                      </span>
                      <FiLock className="h-5 w-5 text-[#7A7286] group-hover:text-[#6C4BFF] transition" />
                    </button>
                  )}

                  {/* Store Social Media Pills */}
                  {requirement.socialLinks?.instagram?.trim() ? (
                    <a
                      href={`https://instagram.com/${requirement.socialLinks.instagram
                        .trim()
                        .replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white shadow-xs">
                        <FaInstagram className="h-5 w-5 text-white" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        View Instagram Profile
                      </span>
                      <FaInstagram className="h-5 w-5 text-[#E4405F] group-hover:scale-110 transition" />
                    </a>
                  ) : null}

                  {requirement.socialLinks?.telegram?.trim() ? (
                    <a
                      href={`https://t.me/${requirement.socialLinks.telegram
                        .trim()
                        .replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0088CC] text-white shadow-xs">
                        <FaTelegram className="h-5 w-5 text-white" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        Join Telegram Group
                      </span>
                      <FaTelegram className="h-5 w-5 text-[#0088CC] group-hover:scale-110 transition" />
                    </a>
                  ) : null}

                  {requirement.socialLinks?.youtube?.trim() ? (
                    <a
                      href={`https://youtube.com/${
                        requirement.socialLinks.youtube.trim().startsWith("@")
                          ? requirement.socialLinks.youtube.trim()
                          : `@${requirement.socialLinks.youtube.trim()}`
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-xs">
                        <FaYoutube className="h-5 w-5 text-white" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        View YouTube Channel
                      </span>
                      <FaYoutube className="h-5 w-5 text-[#FF0000] group-hover:scale-110 transition" />
                    </a>
                  ) : null}

                  {/* Detailed Requirements (Store) */}
                  {requirement.detailedRequirements ? (
                    <div className="overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setIsDetailsOpen((prev) => !prev)}
                        className="w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] p-2 sm:p-2.5 pr-5 flex items-center justify-between transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6C4BFF] text-white shadow-xs">
                          <FiFileText className="h-5 w-5 stroke-[2.2]" />
                        </div>
                        <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                          Store Overview & Details
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center text-[#7A7286] transition">
                          <FiChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${
                              isDetailsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isDetailsOpen ? (
                        <div className="p-5 border-t border-[#E7E1D6] bg-white text-left animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="flex items-center gap-2 text-xs font-bold font-heading text-[#7A7286] uppercase tracking-wider mb-2">
                            <FiFileText className="h-4 w-4 text-[#6C4BFF]" />
                            <span>Store Overview & Details</span>
                          </div>
                          <p className="text-sm font-medium text-[#201A2B] leading-relaxed whitespace-pre-wrap">
                            {requirement.detailedRequirements}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Advisor Attribution Pill */}
                  {(requirement.postedByAdvisorUsername || requirement.postedByAdvisorName) ? (
                    <Link
                      to={
                        requirement.postedByAdvisorUsername
                          ? `/${requirement.postedByAdvisorUsername}`
                          : "#"
                      }
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF5A36] text-white font-heading font-extrabold text-base shadow-xs">
                        {(requirement.postedByAdvisorName || requirement.postedByAdvisorUsername || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        Posted by @{requirement.postedByAdvisorUsername || requirement.postedByAdvisorName}
                      </span>
                      <FiUser className="h-5 w-5 text-[#7A7286] group-hover:text-[#FF5A36] transition" />
                    </Link>
                  ) : null}

                  {/* Contact Business Email */}
                  {requirement.businessEmail ? (
                    <a
                      href={`mailto:${requirement.businessEmail}`}
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F9D6B] text-white shadow-xs">
                        <FiMail className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        Contact Email ({requirement.businessEmail})
                      </span>
                      <FiMail className="h-5 w-5 text-[#1F9D6B] group-hover:scale-110 transition" />
                    </a>
                  ) : null}
                </>
              ) : (
                /* CAMPAIGN PAGE STACK (Exact Sequence Requested) */
                <>
                  {/* 1. Show Budget block */}
                  {requirement.budget ? (
                    <div className="w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F9D6B] text-white shadow-xs">
                        <FiDollarSign className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 text-center px-3 truncate">
                        <span className="font-heading text-xs font-bold text-[#7A7286] uppercase tracking-wider block sm:inline sm:mr-2">
                          Budget:
                        </span>
                        <span className="font-heading font-extrabold text-[#201A2B] text-sm sm:text-base">
                          {requirement.budget}
                        </span>
                      </div>
                      <div className="h-5 w-5 shrink-0 opacity-0" />
                    </div>
                  ) : null}

                  {/* 2. Show Reward type block */}
                  {requirement.rewardType ? (
                    <div className="w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6C4BFF] text-white shadow-xs">
                        <FiGift className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 text-center px-3 truncate">
                        <span className="font-heading text-xs font-bold text-[#7A7286] uppercase tracking-wider block sm:inline sm:mr-2">
                          Reward:
                        </span>
                        <span className="font-heading font-extrabold text-[#201A2B] text-sm sm:text-base">
                          {requirement.rewardType}
                        </span>
                      </div>
                      <div className="h-5 w-5 shrink-0 opacity-0" />
                    </div>
                  ) : null}

                  {/* 3. Show Category block */}
                  {requirement.category ? (
                    <div className="w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF5A36] text-white shadow-xs">
                        <FiTag className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 text-center px-3 truncate">
                        <span className="font-heading text-xs font-bold text-[#7A7286] uppercase tracking-wider block sm:inline sm:mr-2">
                          Category:
                        </span>
                        <span className="font-heading font-extrabold text-[#201A2B] text-sm sm:text-base">
                          {requirement.category}
                        </span>
                      </div>
                      <div className="h-5 w-5 shrink-0 opacity-0" />
                    </div>
                  ) : null}

                  {/* 4. Show Campaign Goal block */}
                  {requirement.campaignGoal ? (
                    <div className="w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6] text-white shadow-xs">
                        <FiTarget className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 text-center px-3 truncate">
                        <span className="font-heading text-xs font-bold text-[#7A7286] uppercase tracking-wider block sm:inline sm:mr-2">
                          Campaign Goal:
                        </span>
                        <span className="font-heading font-extrabold text-[#201A2B] text-sm sm:text-base">
                          {requirement.campaignGoal}
                        </span>
                      </div>
                      <div className="h-5 w-5 shrink-0 opacity-0" />
                    </div>
                  ) : null}

                  {/* 5. Show Website */}
                  {isAuthenticated ? (
                    (requirement.url || (requirement as any).personalWebsite || (requirement as any).website) ? (
                      <button
                        type="button"
                        disabled={tracking}
                        onClick={() => void onOpenResourceLink()}
                        className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#201A2B] text-white shadow-xs">
                          <FiGlobe className="h-5 w-5 stroke-[2.2]" />
                        </div>
                        <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                          {tracking ? "Opening Website..." : "Website"}
                        </span>
                        <FiExternalLink className="h-5 w-5 text-[#7A7286] group-hover:text-[#6C4BFF] transition" />
                      </button>
                    ) : null
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAdvisorAuthModal(true)}
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#201A2B] text-white shadow-xs">
                        <FiLock className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        Log in to View Website
                      </span>
                      <FiLock className="h-5 w-5 text-[#7A7286] group-hover:text-[#6C4BFF] transition" />
                    </button>
                  )}

                  {/* 6. Show What creators do (Detailed Requirements Accordion) */}
                  {requirement.detailedRequirements ? (
                    <div className="overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setIsDetailsOpen((prev) => !prev)}
                        className="w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] p-2 sm:p-2.5 pr-5 flex items-center justify-between transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6C4BFF] text-white shadow-xs">
                          <FiFileText className="h-5 w-5 stroke-[2.2]" />
                        </div>
                        <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                          What should creators do?
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center text-[#7A7286] transition">
                          <FiChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${
                              isDetailsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isDetailsOpen ? (
                        <div className="p-5 border-t border-[#E7E1D6] bg-white text-left animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="flex items-center gap-2 text-xs font-bold font-heading text-[#7A7286] uppercase tracking-wider mb-2">
                            <FiFileText className="h-4 w-4 text-[#6C4BFF]" />
                            <span>What should creators do?</span>
                          </div>
                          <p className="text-sm font-medium text-[#201A2B] leading-relaxed whitespace-pre-wrap">
                            {requirement.detailedRequirements}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* 7. Show Contact or Business Email */}
                  {requirement.businessEmail ? (
                    <a
                      href={`mailto:${requirement.businessEmail}`}
                      className="group w-full rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E7E1D6] p-2 sm:p-2.5 pr-5 flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.99]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F9D6B] text-white shadow-xs">
                        <FiMail className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <span className="flex-1 text-center font-heading font-bold text-[#201A2B] text-sm sm:text-base px-3 truncate">
                        Contact Email ({requirement.businessEmail})
                      </span>
                      <FiMail className="h-5 w-5 text-[#1F9D6B] group-hover:scale-110 transition" />
                    </a>
                  ) : null}

                  {/* 8. Show Join campaign button */}
                  <button
                    type="button"
                    onClick={handleApplyByMessageClick}
                    className="group w-full rounded-full btn-coral p-2.5 sm:p-3 pr-6 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                      <FiMessageSquare className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <span className="flex-1 text-center font-heading font-extrabold text-white text-sm sm:text-base tracking-wider uppercase px-3 truncate">
                      JOIN CAMPAIGN
                    </span>
                    <FiMessageSquare className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                  </button>
                </>
              )}
            </div>

            {/* Social Share & Copy Link Section */}
            <div className="pt-2 pb-1 flex flex-col items-center justify-center space-y-3">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#201A2B]/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-[28px] border border-[#E7E1D6] bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setShowMessageModal(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5] text-[#7A7286] hover:bg-[#E7E1D6] hover:text-[#201A2B] transition cursor-pointer"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-heading text-xl font-extrabold text-[#201A2B]">
                Apply to {requirement?.companyName}
              </h3>
              <p className="text-xs text-[#7A7286] mt-1">
                {isAuthenticated
                  ? "Send your application proposal directly to the campaign manager."
                  : "No login required. Send your application proposal directly to the campaign manager."}
              </p>
            </div>

            {msgSent ? (
              <div className="rounded-[20px] border border-[#B3E6D0] bg-[#E8F8F0] p-6 text-center space-y-2">
                <FiCheckCircle className="h-10 w-10 text-[#1F9D6B] mx-auto" />
                <p className="font-heading font-extrabold text-base text-[#1F9D6B]">
                  Application Submitted Successfully!
                </p>
                <p className="text-xs text-[#1F9D6B]/90 leading-relaxed">
                  Your proposal has been delivered directly to the campaign manager's dashboard and email.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="mt-3 rounded-full bg-[#1F9D6B] px-6 py-2.5 text-xs font-heading font-bold text-white shadow-xs cursor-pointer hover:opacity-90"
                >
                  Done
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
                  <div className="rounded-2xl border border-[#D9CEFF] bg-[#F1ECFF] p-3.5 flex flex-col gap-1 text-xs">
                    <span className="font-heading font-bold text-[#6C4BFF]">
                      Applying as {msgName || localStorage.getItem("userName") || getLoggedInUserEmail() || "Applicant"}
                    </span>
                    <div className="text-[#201A2B] font-medium font-mono-code">
                      Email: {msgEmail || getLoggedInUserEmail() || "Account Email"}
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-heading font-bold text-[#201A2B] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={msgName}
                        onChange={(e) => setMsgName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-sm text-[#201A2B] outline-none focus:border-[#6C4BFF] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-heading font-bold text-[#201A2B] mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={msgEmail}
                        onChange={(e) => setMsgEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-sm text-[#201A2B] outline-none focus:border-[#6C4BFF] focus:bg-white"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-heading font-bold text-[#201A2B] mb-1">
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
                        : "border-[#E7E1D6] bg-[#FAF8F5]"
                    } p-3 text-sm text-[#201A2B] outline-none focus:border-[#6C4BFF] focus:bg-white`}
                  />
                  {msgPhone.trim() && !isValidPhone(msgPhone) ? (
                    <p className="mt-1 text-xs text-rose-600 font-medium">
                      Please enter a valid phone number (7–15 digits, e.g. +91 9876543210).
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#201A2B] mb-1">
                    Application Proposal *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this campaign..."
                    className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-sm text-[#201A2B] outline-none focus:border-[#6C4BFF] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingApp}
                  className="w-full rounded-full btn-coral py-3.5 text-sm font-heading font-bold shadow-md transition disabled:opacity-60 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#201A2B]/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-[28px] border border-[#E7E1D6] bg-white p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <button
              type="button"
              onClick={() => setShowAdvisorAuthModal(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5] text-[#7A7286] hover:bg-[#E7E1D6] hover:text-[#201A2B] transition cursor-pointer"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1ECFF] text-[#6C4BFF]">
              <FiLock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-extrabold text-[#201A2B]">
                Login Required
              </h3>
              <p className="text-sm text-[#7A7286] leading-relaxed max-w-xs mx-auto">
                Please log in to submit your application proposal to this campaign.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="w-full rounded-full btn-coral py-3.5 text-sm font-heading font-bold shadow-md transition cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setShowAdvisorAuthModal(false)}
                className="w-full rounded-full bg-[#FAF8F5] border border-[#E7E1D6] py-2.5 text-xs font-heading font-bold text-[#7A7286] hover:bg-[#E7E1D6] hover:text-[#201A2B] transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer Badge */}
      <footer className="pt-8 pb-2 text-center text-xs font-heading font-bold text-[#7A7286]">
        <div className="inline-flex items-center gap-2">
          <span>{isStorePage ? "Start your store with" : "Start your campaign with"}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-white px-3 py-1 text-xs font-bold font-heading text-[#201A2B] shadow-2xs">
            <FiZap className="h-3.5 w-3.5 fill-[#FF5A36] text-[#FF5A36]" />
            Folksmint
          </span>
        </div>
      </footer>
    </div>
  );
}

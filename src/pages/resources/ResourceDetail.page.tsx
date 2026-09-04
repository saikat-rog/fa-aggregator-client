import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiExternalLink,
  FiUser,
  FiMail,
  FiFileText,
  FiZap,
  FiMessageSquare,
  FiSend,
  FiX,
  FiCheckCircle,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa6";
import {
  getApprovedBusinessRequirementByIdPublic,
  trackRequirementClickApi,
  getMyRequirementApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";

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
  const isStorePage = requirement?.type === "store" || location.pathname.startsWith("/store");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isApprovedAdvisor, setIsApprovedAdvisor] = useState(false);
  const [showAdvisorAuthModal, setShowAdvisorAuthModal] = useState(false);

  const handleApplyByMessageClick = () => {
    if (isApprovedAdvisor) {
      setMsgSent(false);
      const accEmail = getLoggedInUserEmail();
      if (accEmail) setMsgEmail(accEmail);
      setShowMessageModal(true);
    } else {
      setShowAdvisorAuthModal(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    if (!token || userRole !== "advisor") {
      setIsApprovedAdvisor(false);
      return;
    }

    let active = true;
    const checkApproval = async () => {
      try {
        const res = await getMyRequirementApi();
        if (!active) return;
        const approved = Boolean(
          res?.requirement?.status === "approved" ||
            res?.requirements?.some((r) => r.status === "approved")
        );
        setIsApprovedAdvisor(approved);
      } catch {
        if (active) setIsApprovedAdvisor(false);
      }
    };
    void checkApproval();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!identifier) return;
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const item = await getApprovedBusinessRequirementByIdPublic(identifier);
        if (!active) return;
        setRequirement(item);
        if (item?.storeUsername && storeUsername !== item.storeUsername) {
          navigate(`/campaign/${item.storeUsername}`, { replace: true });
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Campaign requirement not found or failed to load.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [id]);

  const onOpenResourceLink = async () => {
    const targetId = requirement?._id || identifier;
    if (!targetId || !requirement) return;
    try {
      setTracking(true);
      const res = await trackRequirementClickApi(targetId);
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

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName.trim() || !msgText.trim()) return;
    if (!isAuthenticated && !msgEmail.trim()) return;

    const emailToUse = msgEmail.trim() || getLoggedInUserEmail() || "";
    const recipientEmail = requirement?.businessEmail || "";
    const companyName = requirement?.companyName || "Campaign";

    if (recipientEmail) {
      const mailtoSubject = encodeURIComponent(`Application for Campaign: ${companyName}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${msgName.trim()}${emailToUse ? `\nEmail: ${emailToUse}` : ""}\n\nMessage / Proposal:\n${msgText.trim()}`
      );
      // Use location.href instead of window.open to prevent popup blockers
      window.location.href = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    }

    setMsgSent(true);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = requirement ? `${baseUrl}/campaign/${requirement.storeUsername || requirement._id}` : (typeof window !== "undefined" ? window.location.href : "");

  return (
    <div className="min-h-screen bg-[#F4F4F6] py-6 px-4 flex flex-col items-center justify-between font-sans">
      <div className="w-full max-w-md space-y-6 mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-2">
          <Link
            to={isStorePage ? "/store" : "/campaign"}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-slate-700 shadow-sm hover:bg-slate-100 transition border border-slate-200/60"
            title={isStorePage ? "Back to All Stores" : "Back to All Campaigns"}
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          {requirement?.postedByAdvisorUsername ? (
            <Link
              to={`/${requirement.postedByAdvisorUsername}`}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-slate-700 shadow-sm hover:bg-slate-100 transition border border-slate-200/60"
              title="Advisor Profile"
            >
              <FiUser className="h-5 w-5" />
            </Link>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-xs">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading campaign details...</p>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-xs">
            <p className="text-base font-semibold">{error}</p>
            <Link
              to={isStorePage ? "/store" : "/campaign"}
              className="mt-4 inline-block rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-rose-700 transition"
            >
              {isStorePage ? "Explore All Stores" : "Explore All Campaigns"}
            </Link>
          </div>
        ) : null}

        {!isLoading && !error && requirement ? (
          <main className="space-y-6">
            {/* Bio Profile Section */}
            <div className="text-center space-y-3">
              {/* Profile Image / Initials Ring */}
              <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1 bg-[#FFCC00] shadow-md flex items-center justify-center">
                {requirement.instagramProfilePictureUrl ? (
                  <img
                    src={getProxiedImageUrl(requirement.instagramProfilePictureUrl)}
                    alt={requirement.companyName}
                    className="h-full w-full rounded-full object-cover border-2 border-white bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-3xl font-extrabold text-white border-2 border-white">
                    {(requirement.companyName || "C").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title & Handle */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {requirement.companyName}
                </h1>
                {requirement.storeUsername ? (
                  <p className="text-sm font-bold text-blue-700">
                    @{requirement.storeUsername}
                  </p>
                ) : null}

                {/* Badges: Category, Goal, Reward, Budget */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                  {requirement.rewardType ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                      🎁 Reward: {requirement.rewardType}
                    </span>
                  ) : null}
                  {requirement.budget ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                      💰 Budget: {requirement.budget}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Social Action Icons Row (if present) */}
              {requirement.socialLinks && (requirement.socialLinks.instagram?.trim() || requirement.socialLinks.youtube?.trim() || requirement.socialLinks.telegram?.trim()) ? (
                <div className="flex items-center justify-center gap-3 pt-2">
                  {requirement.socialLinks.youtube?.trim() ? (
                    <a
                      href={`https://youtube.com/${requirement.socialLinks.youtube.trim().startsWith("@") ? requirement.socialLinks.youtube.trim() : `@${requirement.socialLinks.youtube.trim()}`}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-xl text-red-600 shadow-xs transition hover:scale-105 hover:bg-slate-50"
                      title="YouTube Channel"
                    >
                      <FaYoutube />
                    </a>
                  ) : null}

                  {requirement.socialLinks.telegram?.trim() ? (
                    <a
                      href={`https://t.me/${requirement.socialLinks.telegram.trim().replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-xl text-sky-500 shadow-xs transition hover:scale-105 hover:bg-slate-50"
                      title="Telegram Channel"
                    >
                      <FaTelegram />
                    </a>
                  ) : null}

                  {requirement.socialLinks.instagram?.trim() ? (
                    <a
                      href={`https://instagram.com/${requirement.socialLinks.instagram.trim()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-xl text-pink-600 shadow-xs transition hover:scale-105 hover:bg-slate-50"
                      title="Instagram Profile"
                    >
                      <FaInstagram />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Detailed Requirements Card Box */}
            {requirement.detailedRequirements ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <FiFileText className="h-4 w-4 text-blue-600" />
                  <span>{isStorePage ? "Store Overview & Details" : "What Creators Should Do"}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {requirement.detailedRequirements}
                </p>
              </div>
            ) : null}

            {/* Public Action Options */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                {isStorePage ? "Store Contact & Links" : "Apply for this Campaign"}
              </h3>

              {!isStorePage ? (
                <>
                  {/* Apply by Email (Campaigns only) */}
                  {requirement.businessEmail ? (
                    <a
                      href={`mailto:${requirement.businessEmail}?subject=${encodeURIComponent(`Application for Campaign: ${requirement.companyName}`)}&body=${encodeURIComponent(`Hi ${requirement.companyName},\n\nI am interested in applying for your campaign on Folksmint.\n\nMy Profile / Proposal Details:\n`)}`}
                      className="group w-full rounded-full bg-linear-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white p-2.5 sm:p-3 pr-6 flex items-center justify-between shadow-md transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                        <FiMail className="h-5 w-5" />
                      </div>
                      <span className="flex-1 text-center font-bold text-base sm:text-lg px-2">
                        Apply by Email
                      </span>
                      <FiSend className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                    </a>
                  ) : null}

                  {/* Apply by Message (Always visible button, triggers auth/approval dialog if not approved advisor) */}
                  <button
                    type="button"
                    onClick={handleApplyByMessageClick}
                    className="group w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white p-2.5 sm:p-3 pr-6 flex items-center justify-between shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                      <FiMessageSquare className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-center font-bold text-base sm:text-lg px-2">
                      Apply by Message
                    </span>
                    <FiMessageSquare className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                  </button>
                </>
              ) : (
                /* Contact Store Email Pill (Stores only) */
                requirement.businessEmail ? (
                  <a
                    href={`mailto:${requirement.businessEmail}`}
                    className="group w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white p-2.5 sm:p-3 pr-6 flex items-center justify-between shadow-md transition-all duration-200 active:scale-[0.98]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
                      <FiMail className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-center font-bold text-base sm:text-lg px-2">
                      Contact Store ({requirement.businessEmail})
                    </span>
                    <FiMail className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                  </a>
                ) : null
              )}

              {/* Primary Website Link (Public) */}
              {requirement.url ? (
                <button
                  type="button"
                  disabled={tracking}
                  onClick={() => void onOpenResourceLink()}
                  className="group w-full rounded-full bg-[#EBEBEF] hover:bg-[#E0E0E6] border border-slate-200/70 p-2 sm:p-2.5 pr-6 flex items-center justify-between shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs font-bold">
                    <FiExternalLink className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2">
                    {tracking ? "Opening Website..." : `View ${requirement.companyName} Website`}
                  </span>
                  <FiExternalLink className="h-5 w-5 text-slate-600 group-hover:text-blue-700 transition" />
                </button>
              ) : null}
            </div>

            {/* Social Share & Copy Link Section */}
            <div className="pt-4 flex flex-col items-center justify-center space-y-3">
              <SocialShareButtons
                url={shareUrl}
                title={`Check out campaign requirement for ${requirement.companyName}`}
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
                <p className="font-bold text-base">Application Email Draft Created!</p>
                <p className="text-xs text-emerald-700">
                  Your default email client has been launched with your message pre-filled.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="mt-3 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessageSubmit} className="space-y-4">
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

                {isAuthenticated ? null : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required={!isAuthenticated}
                      value={msgEmail}
                      onChange={(e) => setMsgEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-600"
                    />
                  </div>
                )}

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
                  className="w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer"
                >
                  Send Application Message
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* Advisor Auth Prompt Dialog Modal */}
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

            {!isAuthenticated ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <FiLock className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Advisor Login Required
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Only approved advisors can apply to campaigns by message. Please log in as an Advisor to submit an application proposal.
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate("/auth")}
                    className="w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer"
                  >
                    Log In as Advisor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdvisorAuthModal(false)}
                    className="w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : role === "user" ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <FiAlertCircle className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Advisor Account Required
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                    You are currently logged in as a <span className="font-bold text-slate-900">User</span>. Only approved Advisors can apply to campaigns by message. Please log out and log in as an Advisor.
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      localStorage.removeItem("roles");
                      window.location.href = "/auth";
                    }}
                    className="w-full rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition cursor-pointer"
                  >
                    Log Out & Log In as Advisor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdvisorAuthModal(false)}
                    className="w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <FiAlertCircle className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Advisor Profile Pending Approval
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Your Advisor store profile application is currently under review by an Admin. Only approved Advisors can apply to campaigns by message.
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdvisorAuthModal(false);
                      navigate("/store/apply");
                    }}
                    className="w-full rounded-2xl bg-amber-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition cursor-pointer"
                  >
                    Check Store Profile Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdvisorAuthModal(false)}
                    className="w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Footer Badge */}
      <footer className="pt-8 pb-2 text-center text-xs font-semibold text-slate-600">
        <div className="inline-flex items-center gap-2">
          <span>Start your campaign with</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-xs">
            <FiZap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
            Folksmint
          </span>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiExternalLink,
  FiLock,
  FiUser,
  FiMail,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiZap,
} from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa6";
import {
  getApprovedBusinessRequirementByIdPublic,
  trackRequirementClickApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [requirement, setRequirement] = useState<ApprovedBusinessRequirementItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(false);
  const [showRequirementsDetail, setShowRequirementsDetail] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const item = await getApprovedBusinessRequirementByIdPublic(id);
        if (!active) return;
        setRequirement(item);
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Resource not found or failed to load.");
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
    if (!id || !requirement) return;
    try {
      setTracking(true);
      const res = await trackRequirementClickApi(id);
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

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-[#F4F4F6] py-6 px-4 flex flex-col items-center justify-between font-sans">
      <div className="w-full max-w-md space-y-6 mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-2">
          <Link
            to="/store"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-slate-700 shadow-sm hover:bg-slate-100 transition border border-slate-200/60"
            title="Back to All Resources"
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
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading resource details...</p>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-xs">
            <p className="text-base font-semibold">{error}</p>
            <Link
              to="/store"
              className="mt-4 inline-block rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-rose-700 transition"
            >
              Explore All Resources
            </Link>
          </div>
        ) : null}

        {!isLoading && !error && requirement ? (
          <main className="space-y-6">
            {/* Bio Profile Section */}
            <div className="text-center space-y-3">
              {/* Profile Image with Yellow Accent Ring */}
              <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1 bg-[#FFCC00] shadow-md flex items-center justify-center">
                {requirement.instagramProfilePictureUrl ? (
                  <img
                    src={getProxiedImageUrl(requirement.instagramProfilePictureUrl)}
                    alt={requirement.postedByAdvisorName || requirement.companyName}
                    className="h-full w-full rounded-full object-cover border-2 border-white bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-3xl font-extrabold text-white border-2 border-white">
                    {(requirement.postedByAdvisorName || requirement.companyName).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {requirement.postedByAdvisorName || requirement.companyName}
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-600 px-2 leading-snug">
                  {requirement.companyName ? `Campaign Requirement for ${requirement.companyName}` : "Tap links below to access official details"}
                </p>
              </div>

              {/* Advisor Social Action Icons Row */}
              {requirement.socialLinks && (requirement.socialLinks.instagram || requirement.socialLinks.youtube || requirement.socialLinks.telegram) ? (
                <div className="flex items-center justify-center gap-3 pt-2">
                  {requirement.socialLinks.youtube ? (
                    <a
                      href={`https://youtube.com/${requirement.socialLinks.youtube.startsWith("@") ? requirement.socialLinks.youtube : `@${requirement.socialLinks.youtube}`}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-xl text-red-600 shadow-xs transition hover:scale-105 hover:bg-slate-50"
                      title="YouTube Channel"
                    >
                      <FaYoutube />
                    </a>
                  ) : null}

                  {requirement.socialLinks.telegram ? (
                    <a
                      href={`https://t.me/${requirement.socialLinks.telegram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-xl text-sky-500 shadow-xs transition hover:scale-105 hover:bg-slate-50"
                      title="Telegram Channel"
                    >
                      <FaTelegram />
                    </a>
                  ) : null}

                  {requirement.socialLinks.instagram ? (
                    <a
                      href={`https://instagram.com/${requirement.socialLinks.instagram}`}
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

            {/* Link Pills List Stack */}
            <div className="space-y-3.5 pt-2">
              {/* Pill 1: Primary Resource Link */}
              {isAuthenticated && requirement.url ? (
                <button
                  type="button"
                  disabled={tracking}
                  onClick={() => void onOpenResourceLink()}
                  className="group w-full rounded-full bg-[#EBEBEF] hover:bg-[#E0E0E6] border border-slate-200/70 p-2 sm:p-2.5 pr-6 flex items-center justify-between shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs font-bold">
                    {requirement.instagramProfilePictureUrl ? (
                      <img
                        src={getProxiedImageUrl(requirement.instagramProfilePictureUrl)}
                        alt={requirement.companyName}
                        className="h-full w-full rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <FiExternalLink className="h-5 w-5" />
                    )}
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2">
                    {tracking ? "Opening Link..." : `View ${requirement.companyName} Link`}
                  </span>
                  <FiExternalLink className="h-5 w-5 text-slate-600 group-hover:text-blue-700 transition" />
                </button>
              ) : !isAuthenticated ? (
                <Link
                  to="/auth"
                  className="group w-full rounded-full bg-[#EBEBEF] hover:bg-[#E0E0E6] border border-slate-200/70 p-2 sm:p-2.5 pr-6 flex items-center justify-between shadow-xs transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs font-bold">
                    <FiLock className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2">
                    Log in to Access Official Link
                  </span>
                  <FiLock className="h-5 w-5 text-slate-600 group-hover:text-blue-700 transition" />
                </Link>
              ) : null}

              {/* Pill 2: Business Email / Contact */}
              {requirement.businessEmail ? (
                <a
                  href={`mailto:${requirement.businessEmail}`}
                  className="group w-full rounded-full bg-[#EBEBEF] hover:bg-[#E0E0E6] border border-slate-200/70 p-2 sm:p-2.5 pr-6 flex items-center justify-between shadow-xs transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2 truncate">
                    Contact {requirement.companyName}
                  </span>
                  <FiMail className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition" />
                </a>
              ) : null}

              {/* Pill 3: Telegram Specific Link Pill (if present in social links) */}
              {requirement.socialLinks?.telegram ? (
                <a
                  href={`https://t.me/${requirement.socialLinks.telegram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-full rounded-full bg-[#EBEBEF] hover:bg-[#E0E0E6] border border-slate-200/70 p-2 sm:p-2.5 pr-6 flex items-center justify-between shadow-xs transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs text-xl">
                    <FaTelegram />
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2">
                    Join Telegram Group
                  </span>
                  <FaTelegram className="h-5 w-5 text-slate-600 group-hover:text-sky-500 transition" />
                </a>
              ) : null}

              {/* Pill 4: Advisor Profile Link */}
              {requirement.postedByAdvisorUsername ? (
                <Link
                  to={`/${requirement.postedByAdvisorUsername}`}
                  className="group w-full rounded-full bg-[#EBEBEF] hover:bg-[#E0E0E6] border border-slate-200/70 p-2 sm:p-2.5 pr-6 flex items-center justify-between shadow-xs transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-900 font-bold shadow-xs text-lg">
                    {requirement.postedByAdvisorName ? requirement.postedByAdvisorName.charAt(0).toUpperCase() : "A"}
                  </div>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2">
                    Advisor Profile (@{requirement.postedByAdvisorUsername})
                  </span>
                  <FiUser className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition" />
                </Link>
              ) : null}

              {/* Pill 5: Detailed Requirements Accordion / Expandable Pill */}
              {requirement.detailedRequirements ? (
                <div className="rounded-3xl bg-[#EBEBEF] border border-slate-200/70 overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    onClick={() => setShowRequirementsDetail(!showRequirementsDetail)}
                    className="w-full p-2 sm:p-2.5 pr-6 flex items-center justify-between active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white shadow-xs">
                      <FiFileText className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-center font-bold text-slate-900 text-base sm:text-lg px-2">
                      Detailed Requirements
                    </span>
                    {showRequirementsDetail ? (
                      <FiChevronUp className="h-5 w-5 text-slate-600" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-slate-600" />
                    )}
                  </button>

                  {showRequirementsDetail ? (
                    <div className="p-5 border-t border-slate-200/80 bg-white text-slate-700 text-sm leading-relaxed whitespace-pre-wrap rounded-b-3xl">
                      {requirement.detailedRequirements}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Social Share & Copy Link Section */}
            <div className="pt-4 flex flex-col items-center justify-center space-y-3">
              <SocialShareButtons
                url={shareUrl}
                title={`Check out resource details for ${requirement.companyName}`}
              />
            </div>
          </main>
        ) : null}
      </div>

      {/* SuperProfile / Folksmint Footer Badge */}
      <footer className="pt-8 pb-2 text-center text-xs font-semibold text-slate-600">
        <div className="inline-flex items-center gap-2">
          <span>Start your store with</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-xs">
            <FiZap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
            Folksmint
          </span>
        </div>
      </footer>
    </div>
  );
}


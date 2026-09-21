import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBookmark,
  FaEnvelope,
  FaGlobe,
  FaInstagram,
  FaLocationDot,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa6";
import { useSavedAdvisors } from "../../context/SavedAdvisorsContext";
import {
  ADVISOR_CLICK_TYPES,
  trackAdvisorClick,
} from "../../services/advisor.service";
import { AuthPromptDialog } from "../dialog/AuthPromptDialog";
import { PincodePromptDialog } from "../dialog/PincodePromptDialog";
import {
  getDisplayCategory,
  getDisplayEngagementRate,
} from "./advisorDisplay.utils";

export interface AdvisorCardData {
  id: string;
  name: string;
  username: string;
  pincode?: string;
  industries?: string[];
  country: string;
  state: string;
  marketFocus: string[];
  specialties: string[];
  about: string;
  profilePictureUrl?: string;
  personalWebsite?: string;
  emailForContact?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  ppp?: number | null;
  category?: string | null;
  instagramFollowers?: number | null;
  linkedinFollowers?: number | null;
  twitterFollowers?: number | null;
  facebookFollowers?: number | null;
  youtubeSubscribers?: number | null;
  telegramFollowers?: number | null;
  tiktokFollowers?: number | null;
  followersCount?: number | null;
  instagramEngagementRateScore?: number | null;
}

export interface AdvisorCardProps {
  advisor: AdvisorCardData;
}

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

const getAuthState = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, role: null as string | null };
  }

  return {
    isAuthenticated: Boolean(localStorage.getItem("token")),
    role: localStorage.getItem("role"),
  };
};

export function AdvisorCard({ advisor }: AdvisorCardProps) {
  const navigate = useNavigate();
  const socialLinks = advisor.socialLinks ?? {};
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pincodeDialogOpen, setPincodeDialogOpen] = useState(false);
  const [saveActionError, setSaveActionError] = useState("");
  const [pendingActionType, setPendingActionType] = useState<
    "website" | "email" | "social" | null
  >(null);
  const [pendingTargetAction, setPendingTargetAction] = useState<
    | { kind: "link"; type: "website" | "email" | "social"; url: string }
    | { kind: "save" }
    | null
  >(null);
  const {
    isSaved,
    save,
    unsave,
    isSavingByAdvisorId,
    isUnsavingByAdvisorId,
  } = useSavedAdvisors();

  useEffect(() => {
    const syncAuthState = () => {
      const authState = getAuthState();
      setIsAuthenticated(authState.isAuthenticated);
      setRole(authState.role);
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  const userCanOpenLinks = isAuthenticated && role === "user";

  const isPincodeCollected = () =>
    typeof window !== "undefined" &&
    (sessionStorage.getItem("pincodeCollected") === "true" ||
      localStorage.getItem("pincodeCollected") === "true" ||
      Boolean(localStorage.getItem("userPincode")));

  const executeLinkAction = async (type: "website" | "email" | "social", url: string) => {
    const clickType =
      type === "social"
        ? ADVISOR_CLICK_TYPES.SOCIAL
        : type === "email"
          ? ADVISOR_CLICK_TYPES.EMAIL
          : ADVISOR_CLICK_TYPES.WEBSITE;
    if (type === "email") {
      await trackAdvisorClick(advisor.id, clickType);
      window.location.href = url;
      return;
    }
    void trackAdvisorClick(advisor.id, clickType);
    window.open(url, "_blank", "noreferrer");
  };

  const openAction = (type: "website" | "email" | "social", url: string) => {
    const clickType =
      type === "social"
        ? ADVISOR_CLICK_TYPES.SOCIAL
        : type === "email"
          ? ADVISOR_CLICK_TYPES.EMAIL
          : ADVISOR_CLICK_TYPES.WEBSITE;
    void trackAdvisorClick(advisor.id, clickType);

    if (userCanOpenLinks) {
      if (!isPincodeCollected()) {
        setPendingTargetAction({ kind: "link", type, url });
        setPincodeDialogOpen(true);
        return;
      }
      void executeLinkAction(type, url);
      return;
    }

    setPendingActionType(type);
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
    setPendingActionType(null);
  };

  const logoutAndLoginAsUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    closeAuthDialog();
    navigate("/auth");
  };

  const openProfile = () => {
    void trackAdvisorClick(advisor.id, ADVISOR_CLICK_TYPES.PROFILE);
    navigate(`/${advisor.username}`);
  };

  const executeSaveAction = async () => {
    try {
      setSaveActionError("");
      if (isSaved(advisor.id)) {
        await unsave(advisor.id);
      } else {
        await save(advisor.id);
      }
    } catch (error: unknown) {
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Unable to update saved advisor.";
      setSaveActionError(msg ?? "Unable to update saved advisor.");
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated || role !== "user") {
      setPendingActionType("website");
      setAuthDialogOpen(true);
      return;
    }

    if (!isPincodeCollected()) {
      setPendingTargetAction({ kind: "save" });
      setPincodeDialogOpen(true);
      return;
    }

    await executeSaveAction();
  };

  const handlePincodeSuccess = () => {
    setPincodeDialogOpen(false);
    if (pendingTargetAction) {
      const action = pendingTargetAction;
      setPendingTargetAction(null);
      if (action.kind === "link") {
        executeLinkAction(action.type, action.url);
      } else if (action.kind === "save") {
        void executeSaveAction();
      }
    }
  };

  const formatCount = (value?: number | null) =>
    typeof value === "number" && value > 0
      ? new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : null;

  const isSavedAdvisor = isSaved(advisor.id);
  const saveLoading =
    isSavingByAdvisorId[advisor.id] || isUnsavingByAdvisorId[advisor.id];

  const isUnknownState = !advisor.state || advisor.state === "Unknown state";
  const isUnknownCountry = !advisor.country || advisor.country === "Unknown country";
  const parts = [
    !isUnknownState ? advisor.state : null,
    !isUnknownCountry ? advisor.country : null,
    advisor.pincode ? `PIN ${advisor.pincode}` : null,
  ].filter(Boolean);
  const displayLocation = parts.join(", ") || "India";

  return (
    <>
      <article className="group relative bg-white border border-[#E7E1D6] rounded-[20px] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        {/* Save Bookmark button */}
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saveLoading}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              isSavedAdvisor
                ? "bg-[#E4F5EC] text-[#137A50]"
                : "bg-[#FAF8F5] border border-[#E7E1D6] text-[#7A7286] hover:text-[#201A2B]"
            }`}
          >
            <FaBookmark className="h-2.5 w-2.5" />
            {saveLoading ? "..." : isSavedAdvisor ? "Saved" : "Save"}
          </button>
        </div>

        <div>
          {/* Header row with Avatar + Name */}
          <div className="flex items-start gap-3.5 pr-16">
            <div className="shrink-0">
              {advisor.profilePictureUrl ? (
                <img
                  src={getProxiedImageUrl(advisor.profilePictureUrl)}
                  alt={`${advisor.name} avatar`}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-2xl border border-[#E7E1D6] object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF5A36] to-[#6C4BFF] flex items-center justify-center font-heading font-bold text-white text-lg">
                  {advisor.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <button
                type="button"
                onClick={openProfile}
                className="font-heading font-bold text-base text-[#201A2B] hover:text-[#6C4BFF] transition text-left truncate block w-full"
              >
                {advisor.name}
              </button>
              <div className="font-mono-code text-xs text-[#6C4BFF] font-medium mt-0.5">
                @{advisor.username}
              </div>
            </div>
          </div>

          {/* Badges / Pill row */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            <span className="badge-pill bg-[#FFEAE3] text-[#D6431E]">
              <FaLocationDot className="h-2.5 w-2.5" />
              {displayLocation}
            </span>

            {advisor.category && (
              <span className="badge-pill bg-[#F1ECFF] text-[#5A3FE0]">
                {getDisplayCategory(advisor.category)}
              </span>
            )}

            {getDisplayEngagementRate(advisor.instagramEngagementRateScore) !== "N/A" && (
              <span className="badge-pill bg-[#FAF8F5] border border-[#E7E1D6] text-[#201A2B] font-mono-code">
                {getDisplayEngagementRate(advisor.instagramEngagementRateScore)} eng.
              </span>
            )}
          </div>

          {/* Bio snippet */}
          {advisor.about && (
            <p
              className="text-xs text-[#7A7286] leading-relaxed mt-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {advisor.about}
            </p>
          )}

          {/* Social connection chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {socialLinks.instagram && (
              <button
                type="button"
                onClick={() =>
                  openAction(
                    "social",
                    `https://instagram.com/${socialLinks.instagram}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-[#FDFCFA] px-2.5 py-1 text-xs font-semibold text-[#201A2B] hover:bg-[#F1ECFF] hover:border-[#6C4BFF] transition cursor-pointer"
              >
                <FaInstagram className="text-[#FF5A36]" />
                <span>Instagram</span>
                {formatCount(advisor.instagramFollowers) && (
                  <span className="font-mono-code font-bold text-[10px] text-[#6C4BFF]">
                    {formatCount(advisor.instagramFollowers)}
                  </span>
                )}
              </button>
            )}

            {socialLinks.youtube && (
              <button
                type="button"
                onClick={() =>
                  openAction(
                    "social",
                    `https://youtube.com/${socialLinks.youtube?.startsWith("@") ? socialLinks.youtube : `@${socialLinks.youtube}`}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-[#FDFCFA] px-2.5 py-1 text-xs font-semibold text-[#201A2B] hover:bg-[#FFEAE3] hover:border-[#FF5A36] transition cursor-pointer"
              >
                <FaYoutube className="text-[#D6431E]" />
                <span>YouTube</span>
                {formatCount(advisor.youtubeSubscribers) && (
                  <span className="font-mono-code font-bold text-[10px] text-[#D6431E]">
                    {formatCount(advisor.youtubeSubscribers)}
                  </span>
                )}
              </button>
            )}

            {socialLinks.telegram && (
              <button
                type="button"
                onClick={() =>
                  openAction(
                    "social",
                    `https://t.me/${socialLinks.telegram?.replace(/^@/, "")}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-[#FDFCFA] px-2.5 py-1 text-xs font-semibold text-[#201A2B] hover:bg-[#F1ECFF] hover:border-[#6C4BFF] transition cursor-pointer"
              >
                <FaTelegram className="text-[#6C4BFF]" />
                <span>Telegram</span>
                {formatCount(advisor.telegramFollowers) && (
                  <span className="font-mono-code font-bold text-[10px] text-[#6C4BFF]">
                    {formatCount(advisor.telegramFollowers)}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-4 border-t border-[#E7E1D6] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {advisor.personalWebsite && (
              <button
                type="button"
                onClick={() => openAction("website", advisor.personalWebsite as string)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A7286] hover:text-[#201A2B] bg-[#FAF8F5] border border-[#E7E1D6] px-2.5 py-1 rounded-lg transition"
              >
                <FaGlobe className="h-3 w-3" /> Website
              </button>
            )}
            {advisor.emailForContact && (
              <button
                type="button"
                onClick={() => openAction("email", `mailto:${advisor.emailForContact}`)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A7286] hover:text-[#201A2B] bg-[#FAF8F5] border border-[#E7E1D6] px-2.5 py-1 rounded-lg transition"
              >
                <FaEnvelope className="h-3 w-3" /> Email
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={openProfile}
            className="inline-flex items-center gap-1.5 font-heading font-bold text-xs text-[#201A2B] hover:text-[#6C4BFF] transition ml-auto"
          >
            View profile <FaArrowRight className="h-3 w-3" />
          </button>
        </div>

        {saveActionError && (
          <p className="text-[11px] font-medium text-rose-600 mt-2">{saveActionError}</p>
        )}
      </article>

      <AuthPromptDialog
        open={authDialogOpen}
        role={role}
        actionType={pendingActionType}
        onClose={closeAuthDialog}
        onLoginAsUser={() => {
          closeAuthDialog();
          navigate("/auth");
        }}
        onLogoutAndLoginAsUser={logoutAndLoginAsUser}
      />
      <PincodePromptDialog
        open={pincodeDialogOpen}
        onClose={() => setPincodeDialogOpen(false)}
        onSuccess={handlePincodeSuccess}
      />
    </>
  );
}

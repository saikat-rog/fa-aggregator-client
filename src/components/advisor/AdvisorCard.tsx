import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBookmark,
  FaChartLine,
  FaCircleCheck,
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import type { AdvisorApiItem } from "../../pages/HomePage";
import { useSavedAdvisors } from "../../context/SavedAdvisorsContext";
import {
  ADVISOR_CLICK_TYPES,
  trackAdvisorClick,
} from "../../services/advisor.service";
import { AuthPromptDialog } from "../ui/AuthPromptDialog";

export interface AdvisorCardData {
  id: string;
  name: string;
  username: string;
  industries?: string[];
  country: string;
  state: string;
  marketFocus: string[];
  specialties: string[];
  about: string;
  profilePictureUrl?: string;
  personalWebsite?: string;
  emailForContact?: string;
  socialLinks?: AdvisorApiItem["socialLinks"];
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
  const [saveActionError, setSaveActionError] = useState("");
  const [pendingActionType, setPendingActionType] = useState<
    "website" | "email" | "social" | null
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

  const socialButtonClassName =
    "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20";

  const openAction = (type: "website" | "email" | "social", url: string) => {
    if (userCanOpenLinks) {
      const clickType =
        type === "social"
          ? ADVISOR_CLICK_TYPES.SOCIAL
          : type === "email"
            ? ADVISOR_CLICK_TYPES.EMAIL
            : ADVISOR_CLICK_TYPES.WEBSITE;
      void trackAdvisorClick(advisor.id, clickType);
      if (type === "email") {
        window.location.href = url;
        return;
      }

      window.open(url, "_blank", "noreferrer");
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

  const handleToggleSave = async () => {
    if (!isAuthenticated || role !== "user") {
      setPendingActionType("website");
      setAuthDialogOpen(true);
      return;
    }

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

  const isSavedAdvisor = isSaved(advisor.id);
  const saveLoading =
    isSavingByAdvisorId[advisor.id] || isUnsavingByAdvisorId[advisor.id];

  return (
    <>
      <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saveLoading}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed ${
              isSavedAdvisor
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            <FaBookmark className="h-3 w-3" />
            {saveLoading ? "..." : isSavedAdvisor ? "Saved" : "Save"}
          </button>
        </div>
        <div className="grid lg:grid-cols-[280px_1fr]">
          <div className="relative bg-linear-to-br from-blue-700 to-blue-500 p-5 text-white">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-white/10" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    {advisor.profilePictureUrl ? (
                      <img
                        src={getProxiedImageUrl(advisor.profilePictureUrl)}
                        alt={`${advisor.name} avatar`}
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-16 rounded-3xl border border-white/40 object-cover shadow-lg shadow-blue-950/20"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/40 bg-white/10 text-lg font-semibold text-white shadow-lg shadow-blue-950/20">
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
                      className="truncate text-xl font-semibold tracking-tight text-white hover:cursor-pointer text-left w-full"
                    >
                      {advisor.name}
                    </button>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="flex items-center gap-1.5 text-sm text-blue-100">
                        <FaLocationDot className="text-blue-100" />
                        {advisor.state}, {advisor.country}
                      </p>
                      <button
                        type="button"
                        onClick={openProfile}
                        className="inline-flex items-center rounded-full border border-white/20 bg-black px-2.5 py-1 text-xs font-semibold tracking-wide text-white hover:bg-white/20 transition"
                      >
                        @{advisor.username}
                      </button>
                      {advisor.industries?.length ? (
                        <p className="inline-flex items-center rounded-full uppercase border border-white/20 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-blue-700">
                          {advisor.industries.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                  About
                </p>
                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {advisor.about}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-50">
                  Connect
                </div>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.instagram ? (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(
                          "social",
                          `https://instagram.com/${socialLinks.instagram}`,
                        )
                      }
                      className={socialButtonClassName}
                    >
                      <FaInstagram /> Instagram
                    </button>
                  ) : null}
                  {socialLinks.linkedin ? (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(
                          "social",
                          `https://linkedin.com/in/${socialLinks.linkedin}`,
                        )
                      }
                      className={socialButtonClassName}
                    >
                      <FaLinkedin /> LinkedIn
                    </button>
                  ) : null}
                  {socialLinks.twitter ? (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(
                          "social",
                          `https://x.com/${socialLinks.twitter}`,
                        )
                      }
                      className={socialButtonClassName}
                    >
                      <FaXTwitter /> Twitter
                    </button>
                  ) : null}
                  {socialLinks.facebook ? (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(
                          "social",
                          `https://facebook.com/${socialLinks.facebook}`,
                        )
                      }
                      className={socialButtonClassName}
                    >
                      <FaFacebook /> Facebook
                    </button>
                  ) : null}
                  {socialLinks.youtube ? (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(
                          "social",
                          `https://youtube.com/${socialLinks.youtube}`,
                        )
                      }
                      className={socialButtonClassName}
                    >
                      <FaYoutube /> YouTube
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-5 p-5">
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <FaChartLine className="mr-1.5 inline text-blue-600" />
                  Market Focus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {advisor.marketFocus.slice(0, 3).map((item) => (
                    <span
                      key={`${advisor.id}-${item}`}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] text-blue-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <FaCircleCheck className="mr-1.5 inline text-blue-600" />
                  Expertise Indices
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {advisor.specialties.slice(0, 3).map((item) => (
                    <span
                      key={`${advisor.id}-${item}`}
                      className="inline-flex items-center gap-1 rounded-full border border-blue-700 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {advisor.personalWebsite ? (
                <button
                  type="button"
                  onClick={() =>
                    openAction("website", advisor.personalWebsite as string)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <FaGlobe /> Website
                </button>
              ) : null}
              {advisor.emailForContact ? (
                <button
                  type="button"
                  onClick={() =>
                    openAction("email", `mailto:${advisor.emailForContact}`)
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  <FaEnvelope /> Email
                </button>
              ) : null}
            </div>
            {saveActionError ? (
              <p className="text-xs font-medium text-rose-600">{saveActionError}</p>
            ) : null}

            <button
              type="button"
              onClick={() => navigate(`/${advisor.username}`)}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 w-full"
            >
              View more <FaArrowRight />
            </button>
          </div>
        </div>
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
    </>
  );
}

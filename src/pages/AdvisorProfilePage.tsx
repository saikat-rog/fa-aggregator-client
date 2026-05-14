import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AboutCard } from "../components/advisor-profile/AboutCard";
import { ContactFormCard } from "../components/advisor-profile/ContactFormCard";
import { EducationalDisclaimer } from "../components/advisor-profile/EducationalDisclaimer";
import { ExpertiseCard } from "../components/advisor-profile/ExpertiseCard";
import { ProfileHeroCard } from "../components/advisor-profile/ProfileHeroCard";
import { AuthPromptDialog } from "../components/ui/AuthPromptDialog";
import { NotFoundState } from "../components/ui/NotFoundState";
import { useSavedAdvisors } from "../context/SavedAdvisorsContext";
import {
  ADVISOR_CLICK_TYPES,
  getAdvisorByUsernameApi,
  submitAdvisorEnquiry,
  trackAdvisorClick,
} from "../services/advisor.service";
import type { AdvisorApiItem } from "./HomePage";

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

export function AdvisorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [advisor, setAdvisor] = useState<AdvisorApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingActionType, setPendingActionType] = useState<
    "website" | "email" | "social" | null
  >(null);
  const [saveActionError, setSaveActionError] = useState("");
  const {
    isSaved,
    save,
    unsave,
    isSavingByAdvisorId,
    isUnsavingByAdvisorId,
    setSavedLocally,
  } = useSavedAdvisors();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "general",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  useEffect(() => {
    const fetchAdvisor = async () => {
      if (!username) {
        setError("Username not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getAdvisorByUsernameApi(username);

        if (response.success && response.data?.advisor) {
          setAdvisor(response.data.advisor);
        } else {
          setError(response.msg || "Failed to load advisor profile");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisor();
  }, [username]);

  useEffect(() => {
    if (!advisor?.id) return;
    void trackAdvisorClick(advisor.id, ADVISOR_CLICK_TYPES.PROFILE);
  }, [advisor?.id]);

  const userCanOpenLinks = isAuthenticated && role === "user";

  const socialLinks = useMemo(() => {
    if (!advisor) return {};
    const links = advisor.socialLinks ?? {};
    return {
      instagram: links.instagram,
      linkedin: links.linkedin,
      twitter: links.twitter,
      facebook: links.facebook,
      youtube: links.youtube,
      tiktok: links.tiktok,
      instagramFollowers: advisor.instagramFollowers,
      linkedinFollowers: advisor.linkedinFollowers,
      twitterFollowers: advisor.twitterFollowers,
      facebookFollowers: advisor.facebookFollowers,
      youtubeSubscribers: advisor.youtubeSubscribers,
      tiktokFollowers: advisor.tiktokFollowers,
    };
  }, [advisor]);

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

  const shareProfile = async () => {
    const profileUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = advisor?.name ? `${advisor.name} profile` : "Advisor profile";
    if (advisor?.id) {
      void trackAdvisorClick(advisor.id, ADVISOR_CLICK_TYPES.PROFILE_SHARE);
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: profileUrl,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(profileUrl);
        setFormMessage({
          type: "success",
          text: "Profile link copied. You can share it now.",
        });
      }
    } catch {
      // user cancelled or share failed; no-op
    }
  };

  const openAction = (type: "website" | "email" | "social", url: string) => {
    if (userCanOpenLinks) {
      const clickType =
        type === "social"
          ? ADVISOR_CLICK_TYPES.SOCIAL
          : type === "email"
            ? ADVISOR_CLICK_TYPES.EMAIL
            : ADVISOR_CLICK_TYPES.WEBSITE;
      if (advisor?.id) {
        void trackAdvisorClick(advisor.id, clickType);
      }
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

  const handleToggleSave = async () => {
    if (!advisor?.id) return;
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

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisor) return;
    if (!userCanOpenLinks) {
      setPendingActionType("email");
      setAuthDialogOpen(true);
      return;
    }

    setFormSubmitting(true);
    setFormMessage(null);

    try {
      const response = await submitAdvisorEnquiry(advisorData.id, {
        subject: formData.subject,
        message: formData.message,
        category: formData.category,
      });

      if (response.success) {
        setSavedLocally(advisorData.id);
        setFormMessage({
          type: "success",
          text: `Submitted! ${advisorData.name} will connect you soon.`,
        });
        setFormData({
          subject: "",
          message: "",
          category: "general",
        });
      } else {
        setFormMessage({
          type: "error",
          text: response.msg || "Failed to submit query",
        });
      }
    } catch (err) {
      setFormMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-slate-600">Loading advisor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !advisor) {
    return <NotFoundState onButtonClick={() => navigate("/")} />;
  }

  const advisorData = advisor as Required<typeof advisor>;

  return (
    <div className="min-h-screen pb-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden">
          <EducationalDisclaimer />

          <div className="grid gap-6 py-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:p-8">
            <div className="space-y-3">
              <ProfileHeroCard
                name={advisorData.name}
                username={advisorData.username}
                state={advisorData.state}
                country={advisorData.country}
                industry={advisorData.industries?.join(", ")}
                profilePictureUrl={advisorData.profilePictureUrl || undefined}
                personalWebsite={advisorData.personalWebsite}
                emailForContact={advisorData.emailForContact}
                userCanOpenLinks={userCanOpenLinks}
                socialLinks={socialLinks}
                onWebsiteOpen={(url) => openAction("website", url)}
                onEmailOpen={(mailto) => openAction("email", mailto)}
                onShareProfile={shareProfile}
                onSocialOpen={(url) => openAction("social", url)}
                isSaved={isSaved(advisorData.id)}
                saveLoading={
                  isSavingByAdvisorId[advisorData.id] ||
                  isUnsavingByAdvisorId[advisorData.id]
                }
                onToggleSave={handleToggleSave}
                getProxiedImageUrl={getProxiedImageUrl}
              />
              {saveActionError ? (
                <p className="px-2 text-sm font-medium text-rose-600">
                  {saveActionError}
                </p>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2">
                <AboutCard about={advisorData.about} />
                <ExpertiseCard
                  advisorId={advisorData.id}
                  marketFocus={advisorData.marketFocus}
                  expertiseIndeces={advisorData.expertiseIndeces}
                />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <ContactFormCard
                advisorName={advisorData.name}
                formData={formData}
                formSubmitting={formSubmitting}
                canSubmitEnquiry={userCanOpenLinks}
                formMessage={formMessage}
                onChange={handleFormChange}
                onLockedSubmit={() => {
                  setPendingActionType("email");
                  setAuthDialogOpen(true);
                }}
                onSubmit={handleFormSubmit}
              />
            </aside>
          </div>
        </section>
      </div>

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
    </div>
  );
}

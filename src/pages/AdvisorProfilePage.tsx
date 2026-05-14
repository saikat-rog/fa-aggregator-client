import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AboutCard } from "../components/advisor-profile/AboutCard";
import { ContactFormCard } from "../components/advisor-profile/ContactFormCard";
import { EducationalDisclaimer } from "../components/advisor-profile/EducationalDisclaimer";
import { ExpertiseCard } from "../components/advisor-profile/ExpertiseCard";
import { ProfessionalConnectCard } from "../components/advisor-profile/ProfessionalConnectCard";
import { ProfileHeroCard } from "../components/advisor-profile/ProfileHeroCard";
import { AuthPromptDialog } from "../components/ui/AuthPromptDialog";
import { NotFoundState } from "../components/ui/NotFoundState";
import {
  getAdvisorByUsernameApi,
  submitAdvisorQueryApi,
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
  const [revealedContactInfo, setRevealedContactInfo] = useState({
    website: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    countryCode: "91",
    phone: "",
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

  const openAction = (type: "website" | "email" | "social", url: string) => {
    if (userCanOpenLinks) {
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

  const revealContactInfo = (type: "website" | "email") => {
    if (!userCanOpenLinks) {
      setPendingActionType(type);
      setAuthDialogOpen(true);
      return;
    }

    setRevealedContactInfo((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "countryCode") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }
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

    const countryCodeRegex = /^[0-9]{1,4}$/;
    const phoneRegex = /^[0-9]{7,15}$/;
    const hasPhone = formData.phone.trim().length > 0;
    if (hasPhone && !countryCodeRegex.test(formData.countryCode.trim())) {
      setFormMessage({
        type: "error",
        text: "Please enter a valid country code.",
      });
      return;
    }
    if (hasPhone && !phoneRegex.test(formData.phone.trim())) {
      setFormMessage({
        type: "error",
        text: "Please enter a valid phone number (7-15 digits).",
      });
      return;
    }

    setFormSubmitting(true);
    setFormMessage(null);

    try {
      const fullPhone = hasPhone
        ? `+${formData.countryCode}${formData.phone}`
        : "";
      const response = await submitAdvisorQueryApi({
        advisorId: advisorData.id,
        subject: formData.subject,
        message: formData.message,
        phone: fullPhone,
        category: formData.category,
      });

      if (response.success) {
        setFormMessage({
          type: "success",
          text: `Submitted! ${advisorData.name} will connect you soon.`,
        });
        setFormData({
          subject: "",
          message: "",
          countryCode: "91",
          phone: "",
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
    <div className="min-h-screen py-8 text-slate-900">
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
                profilePictureUrl={advisorData.profilePictureUrl}
                socialLinks={socialLinks}
                onSocialOpen={(url) => openAction("social", url)}
                getProxiedImageUrl={getProxiedImageUrl}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <AboutCard about={advisorData.about} />
                <ProfessionalConnectCard
                  personalWebsite={advisorData.personalWebsite}
                  emailForContact={advisorData.emailForContact}
                  userCanOpenLinks={userCanOpenLinks}
                  revealedContactInfo={revealedContactInfo}
                  onWebsiteOpen={(url) => openAction("website", url)}
                  onEmailOpen={(mailto) => openAction("email", mailto)}
                  onReveal={revealContactInfo}
                />
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
        onLogoutAndLoginAsUser={logoutAndLoginAsUser}
      />
    </div>
  );
}

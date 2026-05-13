import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { AboutCard } from "../components/advisor-profile/AboutCard";
import { ContactFormCard } from "../components/advisor-profile/ContactFormCard";
import { EducationalDisclaimer } from "../components/advisor-profile/EducationalDisclaimer";
import { ExpertiseCard } from "../components/advisor-profile/ExpertiseCard";
import { ProfessionalConnectCard } from "../components/advisor-profile/ProfessionalConnectCard";
import { ProfileHeroCard } from "../components/advisor-profile/ProfileHeroCard";
import { AuthPromptDialog } from "../components/ui/AuthPromptDialog";
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
    name: "",
    email: "",
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

  const userCanOpenLinks = isAuthenticated && role === "user";

  const socialLinks = useMemo(() => {
    if (!advisor?.socialLinks) return {};
    const links = advisor.socialLinks;
    return {
      instagram: links.instagram,
      linkedin: links.linkedin,
      twitter: links.twitter,
      facebook: links.facebook,
      youtube: links.youtube,
      instagramFollowers: links.instagramFollowers,
      linkedinFollowers: links.linkedinFollowers,
      twitterFollowers: links.twitterFollowers,
      facebookFollowers: links.facebookFollowers,
      youtubeSubscribers: links.youtubeSubscribers,
    };
  }, [advisor?.socialLinks]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisor) return;

    setFormSubmitting(true);
    setFormMessage(null);

    try {
      const response = await submitAdvisorQueryApi({
        advisorUsername: advisor.username as string,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        category: formData.category,
      });

      if (response.success) {
        setFormMessage({
          type: "success",
          text: "Query submitted successfully! The advisor will get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
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
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <FaArrowLeft /> Back to Advisors
          </button>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {error || "Advisor not found"}
            </h2>
            <p className="mt-2 text-slate-600">
              The advisor profile you're looking for doesn't exist or couldn't be
              loaded.
            </p>
          </div>
        </div>
      </div>
    );
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
                formMessage={formMessage}
                onChange={handleFormChange}
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

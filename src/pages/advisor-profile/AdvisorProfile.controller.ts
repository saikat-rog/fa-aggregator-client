import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSavedAdvisors } from "../../context/SavedAdvisorsContext";
import {
  ADVISOR_CLICK_TYPES,
  getAdvisorByUsernameApi,
  submitAdvisorEnquiry,
  trackAdvisorClick,
} from "../../services/advisor.service";
import type { AdvisorApiItem } from "../home/Home.page";

const getAuthState = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, role: null as string | null };
  }
  return {
    isAuthenticated: Boolean(localStorage.getItem("token")),
    role: localStorage.getItem("role"),
  };
};

type PendingTargetAction =
  | { kind: "link"; type: "website" | "email" | "social"; url: string }
  | { kind: "save" }
  | { kind: "enquiry" };

export function useAdvisorProfileController() {
  const { username, slug } = useParams<{ username?: string; slug?: string }>();
  const activeUsername = username ?? slug;
  const navigate = useNavigate();

  const [advisor, setAdvisor] = useState<AdvisorApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pincodeDialogOpen, setPincodeDialogOpen] = useState(false);
  const [pendingTargetAction, setPendingTargetAction] =
    useState<PendingTargetAction | null>(null);
  const [emailVisible, setEmailVisible] = useState(false);
  const [pendingActionType, setPendingActionType] = useState<
    "website" | "email" | "social" | null
  >(null);
  const [saveActionError, setSaveActionError] = useState("");
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

  const {
    isSaved,
    save,
    unsave,
    isSavingByAdvisorId,
    isUnsavingByAdvisorId,
    setSavedLocally,
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

  useEffect(() => {
    const fetchAdvisor = async () => {
      if (!activeUsername) {
        setError("Username not found");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await getAdvisorByUsernameApi(activeUsername);
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
    void fetchAdvisor();
  }, [activeUsername]);

  useEffect(() => {
    if (!advisor?.id) return;
    void trackAdvisorClick(advisor.id, ADVISOR_CLICK_TYPES.PROFILE);
  }, [advisor?.id]);

  const userCanOpenLinks = isAuthenticated && role === "user";

  const isPincodeCollected = () => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("pincodeCollected") === "true";
  };

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
    const profileUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = advisor?.name
      ? `${advisor.name} profile`
      : "Advisor profile";
    if (advisor?.id) {
      void trackAdvisorClick(advisor.id, ADVISOR_CLICK_TYPES.PROFILE_SHARE);
    }
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: profileUrl });
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
      // no-op
    }
  };

  const executeLinkAction = async (
    type: "website" | "email" | "social",
    url: string,
  ) => {
    if (type === "email") {
      setEmailVisible(true);
      if (advisor?.id) {
        await trackAdvisorClick(advisor.id, ADVISOR_CLICK_TYPES.EMAIL);
      }
      window.location.href = url;
      return;
    }
    const clickType =
      type === "social"
        ? ADVISOR_CLICK_TYPES.SOCIAL
        : ADVISOR_CLICK_TYPES.WEBSITE;
    if (advisor?.id) {
      void trackAdvisorClick(advisor.id, clickType);
    }
    window.open(url, "_blank", "noreferrer");
  };

  const openAction = (type: "website" | "email" | "social", url: string) => {
    const clickType =
      type === "social"
        ? ADVISOR_CLICK_TYPES.SOCIAL
        : type === "email"
          ? ADVISOR_CLICK_TYPES.EMAIL
          : ADVISOR_CLICK_TYPES.WEBSITE;
    if (advisor?.id) {
      void trackAdvisorClick(advisor.id, clickType);
    }
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

  const executeSaveAction = async () => {
    if (!advisor?.id) return;
    try {
      setSaveActionError("");
      if (isSaved(advisor.id)) await unsave(advisor.id);
      else await save(advisor.id);
    } catch (error: unknown) {
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response
          ?.data?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data
              ?.msg
          : "Unable to update saved advisor.";
      setSaveActionError(msg ?? "Unable to update saved advisor.");
    }
  };

  const handleToggleSave = async () => {
    if (!advisor?.id) return;
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

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const executeEnquirySubmit = async () => {
    if (!advisor) return;
    setFormSubmitting(true);
    setFormMessage(null);
    try {
      const response = await submitAdvisorEnquiry(advisor.id, {
        subject: formData.subject,
        message: formData.message,
        category: formData.category,
      });
      if (response.success) {
        setSavedLocally(advisor.id);
        setFormMessage({
          type: "success",
          text: `Submitted! ${advisor.name} will connect you soon.`,
        });
        setFormData({ subject: "", message: "", category: "general" });
      } else {
        setFormMessage({
          type: "error",
          text: response.msg || "Failed to submit query",
        });
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.msg || err?.response?.data?.message || (err instanceof Error ? err.message : "An error occurred");
      setFormMessage({
        type: "error",
        text: serverMsg,
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisor) return;
    if (!userCanOpenLinks) {
      setPendingActionType("email");
      setAuthDialogOpen(true);
      return;
    }
    if (!isPincodeCollected()) {
      setPendingTargetAction({ kind: "enquiry" });
      setPincodeDialogOpen(true);
      return;
    }
    await executeEnquirySubmit();
  };

  const handlePincodeSuccess = () => {
    setPincodeDialogOpen(false);
    setEmailVisible(true);
    if (pendingTargetAction) {
      const action = pendingTargetAction;
      setPendingTargetAction(null);
      if (action.kind === "link") {
        executeLinkAction(action.type, action.url);
      } else if (action.kind === "save") {
        void executeSaveAction();
      } else if (action.kind === "enquiry") {
        void executeEnquirySubmit();
      }
    }
  };

  return {
    advisor,
    loading,
    error,
    navigate,
    role,
    authDialogOpen,
    pincodeDialogOpen,
    emailVisible,
    pendingActionType,
    saveActionError,
    userCanOpenLinks,
    socialLinks,
    isSaved,
    isSavingByAdvisorId,
    isUnsavingByAdvisorId,
    formData,
    formSubmitting,
    formMessage,
    closeAuthDialog,
    logoutAndLoginAsUser,
    shareProfile,
    openAction,
    setPincodeDialogOpen,
    handlePincodeSuccess,
    handleToggleSave,
    handleFormChange,
    handleFormSubmit,
    setPendingActionType,
    setAuthDialogOpen,
  };
}

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitBusinessRequirement } from "../../services/businessRequirements.service";
import {
  FiBriefcase,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiGlobe,
  FiLock,
  FiUserCheck,
  FiX,
} from "react-icons/fi";

const influencerScopeOptions = [
  "Local Hybrid (City/Region)",
  "National",
  "Regional (Multi-state)",
  "Global",
  "Niche Community",
] as const;

const campaignObjectiveOptions = [
  "Direct Company Enquiry",
  "Brand Awareness",
  "Website Traffic",
  "Lead Generation",
  "Product Sales",
  "App Installs",
  "Community Growth",
] as const;

type FormState = {
  companyName: string;
  businessEmail: string;
  url: string;
  currentMonthlySales: string;
  goalMonthlySales: string;
  desiredInfluencerScope: string;
  campaignObjective: string;
  detailedRequirements: string;
};

const initialState: FormState = {
  companyName: "",
  businessEmail: "",
  url: "",
  currentMonthlySales: "",
  goalMonthlySales: "",
  desiredInfluencerScope: "",
  campaignObjective: "",
  detailedRequirements: "",
};

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
const isValidUrl = (value: string) => {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return ["http:", "https:"].includes(parsed.protocol) && parsed.hostname.includes(".");
  } catch {
    return false;
  }
};

export function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showUnapprovedModal, setShowUnapprovedModal] = useState(false);

  const fieldErrors = useMemo(() => {
    const errors: Record<keyof FormState, string> = {
      companyName: "",
      businessEmail: "",
      url: "",
      currentMonthlySales: "",
      goalMonthlySales: "",
      desiredInfluencerScope: "",
      campaignObjective: "",
      detailedRequirements: "",
    };

    if (!form.companyName.trim()) errors.companyName = "Company name is required.";
    if (!form.businessEmail.trim()) {
      errors.businessEmail = "Business email is required.";
    } else if (!isValidEmail(form.businessEmail.trim())) {
      errors.businessEmail = "Enter a valid email address.";
    }

    if (!form.url.trim()) {
      errors.url = "Website or Landing Page URL is required.";
    } else if (!isValidUrl(form.url.trim())) {
      errors.url = "Enter a valid website or landing page link (e.g. www.example.com or https://example.com).";
    }

    if (!form.currentMonthlySales.trim()) errors.currentMonthlySales = "Current monthly sales is required.";
    if (!form.goalMonthlySales.trim()) errors.goalMonthlySales = "Goal monthly sales is required.";
    if (!form.desiredInfluencerScope.trim()) errors.desiredInfluencerScope = "Select an influencer scope.";
    if (!form.campaignObjective.trim()) errors.campaignObjective = "Select a campaign objective.";
    if (!form.detailedRequirements.trim()) errors.detailedRequirements = "Detailed requirements are required.";

    return errors;
  }, [form]);

  const isFormValid = useMemo(
    () => Object.values(fieldErrors).every((value) => !value),
    [fieldErrors],
  );

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("Please correct the highlighted fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "advisor") {
      setShowAdvisorModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitBusinessRequirement({
        companyName: form.companyName.trim(),
        businessEmail: form.businessEmail.trim(),
        url: normalizeUrl(form.url.trim()),
        currentMonthlySales: form.currentMonthlySales.trim(),
        goalMonthlySales: form.goalMonthlySales.trim(),
        desiredInfluencerScope: form.desiredInfluencerScope.trim(),
        campaignObjective: form.campaignObjective.trim(),
        detailedRequirements: form.detailedRequirements.trim(),
      });
      setSuccessMessage(`${response.msg || "Business requirements received."} Your submission is awaiting admin approval.`);
      setForm(initialState);
      setSubmitAttempted(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      const msg =
        error instanceof Error && error.message
          ? error.message
          : "Unable to submit requirements. Please try again.";
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("approved advisor")) {
        setShowUnapprovedModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-linear-to-br from-blue-700 to-blue-900 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold lg:text-5xl">Business Requirements</h1>
        <p className="mt-3 max-w-3xl text-blue-100">
          Share your business goals and campaign requirements. Our team will align you with
          relevant influencer opportunities.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Post Business Requirements</h2>
        <p className="mt-1 text-sm text-slate-600">
          Complete the form below to submit campaign requirements for approval.
        </p>

        {successMessage ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Company Name</span>
            <div className="relative">
              <FiBriefcase className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.companyName ? <span className="text-xs text-rose-600">{fieldErrors.companyName}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Business Email</span>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <input
                type="email"
                value={form.businessEmail}
                onChange={(e) => setField("businessEmail", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.businessEmail ? <span className="text-xs text-rose-600">{fieldErrors.businessEmail}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span className="mb-1 block">Website / Landing Page URL</span>
            <div className="relative">
              <FiGlobe className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <input
                type="text"
                value={form.url}
                onChange={(e) => setField("url", e.target.value)}
                placeholder="e.g. www.example.com or https://example.com"
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.url ? <span className="text-xs text-rose-600">{fieldErrors.url}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Current Monthly Sales</span>
            <div className="relative">
              <FiTrendingUp className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.currentMonthlySales}
                onChange={(e) => setField("currentMonthlySales", e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 50000"
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.currentMonthlySales ? <span className="text-xs text-rose-600">{fieldErrors.currentMonthlySales}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Goal Monthly Sales</span>
            <div className="relative">
              <FiTarget className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.goalMonthlySales}
                onChange={(e) => setField("goalMonthlySales", e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 200000"
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.goalMonthlySales ? <span className="text-xs text-rose-600">{fieldErrors.goalMonthlySales}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Desired Influencer Scope</span>
            <div className="relative">
              <FiUsers className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <select
                value={form.desiredInfluencerScope}
                onChange={(e) => setField("desiredInfluencerScope", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              >
                <option value="">Select scope</option>
                {influencerScopeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {submitAttempted && fieldErrors.desiredInfluencerScope ? <span className="text-xs text-rose-600">{fieldErrors.desiredInfluencerScope}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Campaign Objective</span>
            <div className="relative">
              <FiFileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <select
                value={form.campaignObjective}
                onChange={(e) => setField("campaignObjective", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              >
                <option value="">Select objective</option>
                {campaignObjectiveOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {submitAttempted && fieldErrors.campaignObjective ? <span className="text-xs text-rose-600">{fieldErrors.campaignObjective}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span className="mb-1 block">Detailed Requirements</span>
            <div className="relative">
              <FiMessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
              <textarea
                value={form.detailedRequirements}
                onChange={(e) => setField("detailedRequirements", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex items-center justify-between">
              {submitAttempted && fieldErrors.detailedRequirements ? (
                <span className="text-xs text-rose-600">{fieldErrors.detailedRequirements}</span>
              ) : (
                <span />
              )}
              <span className="text-xs text-slate-500">{form.detailedRequirements.length} chars</span>
            </div>
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Post Requirements"}
            </button>
          </div>
        </form>
      </section>

      {/* Advisor Login Required Modal */}
      {showAdvisorModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAdvisorModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <FiLock className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">Advisor Login Required</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Posting business requirements is exclusively available to registered <span className="font-semibold text-slate-800">Advisors</span> on Folksmint. Please log in with your Advisor account to submit your campaign requirement.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdvisorModal(false);
                  navigate("/auth?role=advisor");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-800 transition"
              >
                <FiUserCheck className="h-4 w-4" />
                Log In as Advisor
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Advisor Approval Required Modal */}
      {showUnapprovedModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-100 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowUnapprovedModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <FiLock className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">Approved Advisor Required</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Posting business requirements is exclusively allowed for <span className="font-semibold text-slate-800">Approved Advisors</span>. Your advisor profile must be reviewed and approved by an admin before you can post business requirements.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowUnapprovedModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

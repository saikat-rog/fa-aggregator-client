import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitBusinessRequirement } from "../../services/businessRequirements.service";
import {
  FiBriefcase,
  FiFileText,
  FiMail,
  FiGlobe,
  FiLock,
  FiUserCheck,
  FiX,
  FiCheckCircle,
  FiShare2,
} from "react-icons/fi";

type FormState = {
  companyName: string;
  businessEmail: string;
  url: string;
  detailedRequirements: string;
};

const initialState: FormState = {
  companyName: "",
  businessEmail: "",
  url: "",
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
      detailedRequirements: "",
    };

    if (!form.companyName.trim()) {
      errors.companyName = "Company name is required.";
    }

    if (!form.businessEmail.trim()) {
      errors.businessEmail = "Business email is required.";
    } else if (!isValidEmail(form.businessEmail.trim())) {
      errors.businessEmail = "Please enter a valid business email address.";
    }

    if (!form.url.trim()) {
      errors.url = "Website URL is required.";
    } else if (!isValidUrl(form.url.trim())) {
      errors.url = "Please enter a valid web address (e.g. www.example.com).";
    }

    if (!form.detailedRequirements.trim()) {
      errors.detailedRequirements = "Detailed requirements are required.";
    }

    return errors;
  }, [form]);

  const isFormValid = useMemo(() => {
    return !Object.values(fieldErrors).some((err) => Boolean(err));
  }, [fieldErrors]);

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      await submitBusinessRequirement({
        companyName: form.companyName.trim(),
        businessEmail: form.businessEmail.trim().toLowerCase(),
        url: normalizeUrl(form.url),
        detailedRequirements: form.detailedRequirements.trim(),
      });

      setSuccessMessage(
        "Your requirement submission was created and sent for Admin review!",
      );
      setForm(initialState);
      setSubmitAttempted(false);
    } catch (err: any) {
      const status = err?.response?.status || (typeof err === "object" && err !== null && "status" in err ? err.status : null);
      const serverMsg = err?.response?.data?.msg || err?.response?.data?.message || err?.response?.data?.error || (err instanceof Error ? err.message : "");
      
      const displayMsg = (serverMsg && !serverMsg.startsWith("Request failed with status code"))
        ? serverMsg
        : "You must be an approved advisor to submit business requirements.";

      if (status === 401) {
        setShowAdvisorModal(true);
        return;
      }

      if (
        status === 403 ||
        serverMsg.toLowerCase().includes("approved by admin") ||
        serverMsg.toLowerCase().includes("approved by an admin") ||
        serverMsg.toLowerCase().includes("have to be approved")
      ) {
        setShowUnapprovedModal(true);
        return;
      }

      setErrorMessage(displayMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 px-6 py-12 text-center text-white lg:px-10">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-blue-600/30 blur-3xl" />
        <h1 className="relative text-3xl font-bold lg:text-5xl">Submit Business Requirement</h1>
        <p className="relative mx-auto mt-3 max-w-xl text-base text-blue-100">
          Share your campaign goals & contact info. Approved requirements will be listed in the Resources section.
        </p>
      </section>

      {/* Main Form Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{successMessage}</p>
                <p className="text-sm mt-0.5">Once approved by an admin, it will appear live under the Resources tab.</p>
              </div>
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 text-sm font-medium">
            {errorMessage}
          </div>
        ) : null}

        {/* Auto-populated social info notice */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-xs font-semibold text-sky-900">
          <FiShare2 className="h-5 w-5 text-sky-600 shrink-0" />
          <span>
            <strong>Note:</strong> Your social media profile links (Instagram, YouTube, Telegram) and profile picture will be automatically attached from your database profile.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-bold text-slate-700">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className={`w-full rounded-xl border ${
                    submitAttempted && fieldErrors.companyName
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-300 bg-white"
                  } pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden` }
                />
              </div>
              {submitAttempted && fieldErrors.companyName ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.companyName}</p>
              ) : null}
            </div>

            {/* Business Email */}
            <div>
              <label htmlFor="businessEmail" className="block text-sm font-bold text-slate-700">
                Business Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="businessEmail"
                  type="email"
                  value={form.businessEmail}
                  onChange={(e) => handleChange("businessEmail", e.target.value)}
                  placeholder="contact@company.com"
                  className={`w-full rounded-xl border ${
                    submitAttempted && fieldErrors.businessEmail
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-300 bg-white"
                  } pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden` }
                />
              </div>
              {submitAttempted && fieldErrors.businessEmail ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.businessEmail}</p>
              ) : null}
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-bold text-slate-700">
              Website <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <FiGlobe className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="url"
                type="text"
                value={form.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://company.com"
                className={`w-full rounded-xl border ${
                  submitAttempted && fieldErrors.url
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-300 bg-white"
                } pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden` }
              />
            </div>
            {submitAttempted && fieldErrors.url ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.url}</p>
            ) : null}
          </div>

          {/* Detailed Requirements */}
          <div>
            <label htmlFor="detailedRequirements" className="block text-sm font-bold text-slate-700">
              Detailed Requirements <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <FiFileText className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
              <textarea
                id="detailedRequirements"
                rows={5}
                value={form.detailedRequirements}
                onChange={(e) => handleChange("detailedRequirements", e.target.value)}
                placeholder="Describe your business background, campaign goals, target audience, and key requirements..."
                className={`w-full rounded-xl border ${
                  submitAttempted && fieldErrors.detailedRequirements
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-300 bg-white"
                } pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden` }
              />
            </div>
            {submitAttempted && fieldErrors.detailedRequirements ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.detailedRequirements}</p>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-700 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-blue-800 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Submitting Requirement..." : "Submit Business Requirement"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal 1: Not logged in */}
      {showAdvisorModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <FiLock className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Advisor Account Required</h3>
            <p className="mt-2 text-sm text-slate-600">
              Only logged in advisors can post business requirements. Please log in to your advisor account.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal 2: Unapproved advisor */}
      {showUnapprovedModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <FiUserCheck className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowUnapprovedModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Approval Required</h3>
            <p className="mt-2 text-sm text-slate-600">
              Your advisor application must be approved by Admin before you can submit business requirements.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowUnapprovedModal(false)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

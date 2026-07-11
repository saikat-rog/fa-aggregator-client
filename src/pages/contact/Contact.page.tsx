import { useMemo, useState } from "react";
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isHttpUrl = (value: string) => {
  if (!value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const fieldErrors = useMemo(() => {
    return {
      companyName: !form.companyName.trim() ? "Company Name is required" : "",
      businessEmail: !form.businessEmail.trim()
        ? "Business Email is required"
        : !emailRegex.test(form.businessEmail.trim())
          ? "Enter a valid email"
          : "",
      url: !form.url.trim()
        ? "Website or campaign URL is required"
        : !isHttpUrl(form.url)
          ? "Enter a valid HTTP or HTTPS URL"
          : "",
      currentMonthlySales:
        !form.currentMonthlySales.trim() ? "Current Monthly Sales is required" : "",
      goalMonthlySales:
        !form.goalMonthlySales.trim() ? "Goal Monthly Sales is required" : "",
      desiredInfluencerScope: !form.desiredInfluencerScope
        ? "Desired Influencer Scope is required"
        : "",
      campaignObjective: !form.campaignObjective ? "Campaign Objective is required" : "",
      detailedRequirements: !form.detailedRequirements.trim()
        ? "Detailed Requirements is required"
        : "",
    };
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

    try {
      setIsSubmitting(true);
      const response = await submitBusinessRequirement({
        companyName: form.companyName.trim(),
        businessEmail: form.businessEmail.trim(),
        url: form.url.trim(),
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {successMessage ? (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Company Name</span>
            <div className="relative">
              <FiBriefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                value={form.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.companyName ? <span className="text-xs text-rose-600">{fieldErrors.companyName}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span className="mb-1 block">Website or campaign URL</span>
            <div className="relative">
              <FiGlobe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                type="url"
                required
                inputMode="url"
                placeholder="https://example.com"
                value={form.url}
                onChange={(e) => setField("url", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.url ? <span className="text-xs text-rose-600">{fieldErrors.url}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Business Email</span>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                type="email"
                value={form.businessEmail}
                onChange={(e) => setField("businessEmail", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.businessEmail ? <span className="text-xs text-rose-600">{fieldErrors.businessEmail}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Current Monthly Sales</span>
            <div className="relative">
              <FiTrendingUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                type="text"
                value={form.currentMonthlySales}
                onChange={(e) => setField("currentMonthlySales", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.currentMonthlySales ? <span className="text-xs text-rose-600">{fieldErrors.currentMonthlySales}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Goal Monthly Sales</span>
            <div className="relative">
              <FiTarget className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                type="text"
                value={form.goalMonthlySales}
                onChange={(e) => setField("goalMonthlySales", e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
            {submitAttempted && fieldErrors.goalMonthlySales ? <span className="text-xs text-rose-600">{fieldErrors.goalMonthlySales}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span className="mb-1 block">Desired Influencer Scope</span>
            <div className="relative">
              <FiUsers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <select
                value={form.desiredInfluencerScope}
                onChange={(e) => setField("desiredInfluencerScope", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 outline-none focus:border-blue-400"
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
              <FiFileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <select
                value={form.campaignObjective}
                onChange={(e) => setField("campaignObjective", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 outline-none focus:border-blue-400"
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
              disabled={isSubmitting || !isFormValid}
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Post Requirements"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

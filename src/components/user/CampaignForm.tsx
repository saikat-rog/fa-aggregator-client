import { useMemo, useState, useEffect } from "react";
import {
  FiBriefcase,
  FiMail,
  FiGlobe,
  FiCheckCircle,
  FiAtSign,
  FiTarget,
  FiDollarSign,
  FiGift,
} from "react-icons/fi";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import {
  duplicateStoreUsernameCheckApi,
  getMyRequirementApi,
  submitBusinessRequirement,
  updateMyRequirementApi,
  type BusinessRequirementItem,
} from "../../services/businessRequirements.service";

type CampaignFormState = {
  companyName: string;
  storeUsername: string;
  businessEmail: string;
  url: string;
  campaignGoal: string;
  budget: string;
  rewardType: "Paid" | "Barter" | "Both";
  detailedRequirements: string;
};

const CAMPAIGN_GOAL_OPTIONS = [
  "Foot traffic",
  "Brand awareness",
  "Online orders",
  "Event turnout",
];

const REWARD_TYPE_OPTIONS: Array<{ value: "Paid" | "Barter" | "Both"; label: string; icon: React.ReactNode }> = [
  { value: "Paid", label: "Paid", icon: <FiDollarSign className="h-4 w-4" /> },
  { value: "Barter", label: "Barter", icon: <FiGift className="h-4 w-4" /> },
  { value: "Both", label: "Both", icon: <HiSparkles className="h-4 w-4 text-purple-600" /> },
];

const initialState: CampaignFormState = {
  companyName: "",
  storeUsername: "",
  businessEmail: "",
  url: "",
  campaignGoal: "Foot traffic",
  budget: "",
  rewardType: "Both",
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

const STORE_USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;
const isValidStoreUsername = (value: string) => STORE_USERNAME_REGEX.test(value);
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

export function CampaignForm() {
  const [form, setForm] = useState<CampaignFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [existingCampaign, setExistingCampaign] = useState<BusinessRequirementItem | null>(null);
  const [storeUsernameError, setStoreUsernameError] = useState("");
  const [isCheckingStoreUsername, setIsCheckingStoreUsername] = useState(false);
  const [isStoreUsernameAvailable, setIsStoreUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const loadMyCampaign = async () => {
      try {
        const req = await getMyRequirementApi();
        if (req) {
          setExistingCampaign(req);
          const activeFields = req.pendingEdit ? { ...req, ...req.pendingEdit } : req;
          setForm({
            companyName: activeFields.companyName || "",
            storeUsername: activeFields.storeUsername || "",
            businessEmail: activeFields.businessEmail || "",
            url: activeFields.url || "",
            campaignGoal: activeFields.campaignGoal || "Foot traffic",
            budget: activeFields.budget || "",
            rewardType: (activeFields.rewardType as "Paid" | "Barter" | "Both") || "Both",
            detailedRequirements: activeFields.detailedRequirements || "",
          });
        }
      } catch {
        // ignore load errors
      }
    };
    void loadMyCampaign();
  }, []);

  const fieldErrors = useMemo(() => {
    const errors: Record<keyof CampaignFormState, string> = {
      companyName: "",
      storeUsername: "",
      businessEmail: "",
      url: "",
      campaignGoal: "",
      budget: "",
      rewardType: "",
      detailedRequirements: "",
    };

    if (!form.companyName.trim()) {
      errors.companyName = "Company name is required.";
    }

    if (!form.storeUsername.trim()) {
      errors.storeUsername = "Username is required.";
    } else if (!isValidStoreUsername(form.storeUsername.trim())) {
      errors.storeUsername = "Invalid username. Use 3-30 chars: letters, numbers, . or _";
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
      errors.detailedRequirements = "This field is required.";
    }

    return errors;
  }, [form]);

  const isFormValid = useMemo(() => {
    return !Object.values(fieldErrors).some((err) => Boolean(err));
  }, [fieldErrors]);

  const handleChange = (field: keyof CampaignFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "storeUsername") {
      setStoreUsernameError("");
      setIsStoreUsernameAvailable(null);
    }
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const checkStoreUsernameAvailability = async (input: string) => {
    const cleaned = input.trim().toLowerCase();
    if (!cleaned) {
      setIsStoreUsernameAvailable(null);
      setStoreUsernameError("");
      return;
    }

    if (!isValidStoreUsername(cleaned)) {
      setIsStoreUsernameAvailable(null);
      setStoreUsernameError("Invalid username. Use 3-30 chars: letters, numbers, . or _");
      return;
    }

    if (
      existingCampaign &&
      (existingCampaign.storeUsername?.toLowerCase() === cleaned ||
        existingCampaign.pendingEdit?.storeUsername?.toLowerCase() === cleaned)
    ) {
      setIsStoreUsernameAvailable(true);
      setStoreUsernameError("");
      return;
    }

    try {
      setIsCheckingStoreUsername(true);
      setStoreUsernameError("");
      const availabilityResponse = await duplicateStoreUsernameCheckApi(cleaned);
      const isTaken =
        availabilityResponse?.isTaken === true ||
        availabilityResponse?.exists === true ||
        availabilityResponse?.available === false ||
        availabilityResponse?.isAvailable === false;

      if (isTaken) {
        setIsStoreUsernameAvailable(false);
        setStoreUsernameError("This handle is already taken.");
        return;
      }

      setIsStoreUsernameAvailable(true);
      setStoreUsernameError("");
    } catch {
      setIsStoreUsernameAvailable(null);
      setStoreUsernameError("Could not verify handle availability right now.");
    } finally {
      setIsCheckingStoreUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      const payload = {
        companyName: form.companyName.trim(),
        storeUsername: form.storeUsername.trim().toLowerCase(),
        businessEmail: form.businessEmail.trim().toLowerCase(),
        url: normalizeUrl(form.url),
        campaignGoal: form.campaignGoal,
        budget: form.budget.trim(),
        rewardType: form.rewardType,
        detailedRequirements: form.detailedRequirements.trim(),
      };

      if (existingCampaign) {
        const res = await updateMyRequirementApi(payload);
        setSuccessMessage(
          res.msg || "Your campaign updates have been submitted for Admin approval!"
        );
        const updated = await getMyRequirementApi();
        if (updated) setExistingCampaign(updated);
      } else {
        const res = await submitBusinessRequirement(payload);
        setSuccessMessage(
          res.msg || "Your campaign was submitted and sent for Admin review!"
        );
        const created = await getMyRequirementApi();
        if (created) setExistingCampaign(created);
      }
      setSubmitAttempted(false);
    } catch (err: unknown) {
      const serverMsg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { msg?: string } } }).response?.data?.msg ===
          "string"
          ? (err as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Failed to submit campaign requirement.";

      setErrorMessage(serverMsg || "Failed to submit campaign requirement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Tell us what you need</h2>
        <p className="mt-1 text-sm text-slate-500">
          Post your campaign requirement. Visible to every advisor & creator once approved.
        </p>
      </div>

      {successMessage ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">{successMessage}</p>
              <p className="text-sm mt-0.5">
                Once approved by an admin, it will appear live under the Campaign tab.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 text-sm font-medium">
          {errorMessage}
        </div>
      ) : null}

      {existingCampaign ? (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900 text-sm font-medium flex items-center justify-between">
          <div>
            <p className="font-bold">
              Campaign Status:{" "}
              <span className="uppercase text-blue-700">{existingCampaign.status}</span>
            </p>
            {existingCampaign.editStatus === "pending" ? (
              <p className="text-xs text-amber-700 mt-1 font-semibold">
                ⏳ You have proposed updates currently pending Admin approval.
              </p>
            ) : existingCampaign.status === "approved" ? (
              <p className="text-xs text-emerald-700 mt-1 font-semibold">
                ✓ Your campaign is live on the site. You can submit updates below.
              </p>
            ) : (
              <p className="text-xs text-slate-600 mt-1">
                Your campaign is under initial Admin review.
              </p>
            )}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Campaign Goal Dropdown */}
        <div>
          <label htmlFor="campaignGoal" className="block text-sm font-bold text-slate-800 mb-1.5">
            Campaign goal
          </label>
          <div className="relative">
            <FiTarget className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              id="campaignGoal"
              value={form.campaignGoal}
              onChange={(e) => handleChange("campaignGoal", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
            >
              {CAMPAIGN_GOAL_OPTIONS.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Budget (optional, if paid) */}
        <div>
          <label htmlFor="budget" className="block text-sm font-bold text-slate-800 mb-1.5">
            Budget <span className="text-slate-400 font-normal">(optional, if paid)</span>
          </label>
          <input
            id="budget"
            type="text"
            value={form.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
            placeholder="e.g. ₹2,000 per post"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>

        {/* 3. Reward Type (Paid / Barter / Both) */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Reward type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {REWARD_TYPE_OPTIONS.map((opt) => {
              const isSelected = form.rewardType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("rewardType", opt.value)}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold transition border cursor-pointer ${
                    isSelected
                      ? "border-purple-600 bg-purple-50 text-purple-700 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. What should creators do? * (Detailed Requirements) */}
        <div>
          <label htmlFor="detailedRequirements" className="block text-sm font-bold text-slate-800 mb-1.5">
            What should creators do? <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="detailedRequirements"
            rows={4}
            value={form.detailedRequirements}
            onChange={(e) => handleChange("detailedRequirements", e.target.value)}
            placeholder="e.g. 1 reel + 2 stories featuring our new weekend brunch menu."
            className={`w-full rounded-xl border ${
              submitAttempted && fieldErrors.detailedRequirements
                ? "border-rose-400 bg-rose-50/30"
                : "border-slate-200 bg-slate-50/50 focus:bg-white"
            } p-4 text-sm text-slate-900 outline-none focus:border-blue-600 transition`}
          />
          {submitAttempted && fieldErrors.detailedRequirements ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.detailedRequirements}</p>
          ) : null}
        </div>

        {/* 5. Company Name, Handle, Email, Website */}
        <div className="pt-4 border-t border-slate-100 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Brand & Contact Info
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Company / Brand Name */}
            <div>
              <label htmlFor="companyName" className="block text-xs font-bold text-slate-700 mb-1">
                Company / Brand Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="e.g. Acme Studio"
                  className={`w-full rounded-xl border ${
                    submitAttempted && fieldErrors.companyName
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-200 bg-white"
                  } pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600`}
                />
              </div>
              {submitAttempted && fieldErrors.companyName ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.companyName}</p>
              ) : null}
            </div>

            {/* Unique Campaign Handle / Username */}
            <div>
              <label htmlFor="storeUsername" className="block text-xs font-bold text-slate-700 mb-1">
                Campaign Handle / Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FiAtSign className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="storeUsername"
                  type="text"
                  value={form.storeUsername}
                  onChange={(e) => handleChange("storeUsername", e.target.value)}
                  onBlur={() => void checkStoreUsernameAvailability(form.storeUsername)}
                  placeholder="e.g. acme_deals"
                  className={`w-full rounded-xl border ${
                    (submitAttempted && fieldErrors.storeUsername) || storeUsernameError
                      ? "border-rose-400 bg-rose-50/30"
                      : isStoreUsernameAvailable
                      ? "border-emerald-400 bg-emerald-50/20"
                      : "border-slate-200 bg-white"
                  } pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600`}
                />
              </div>
              {isCheckingStoreUsername ? (
                <p className="mt-1 text-xs text-blue-600">Checking handle availability...</p>
              ) : null}
              {!isCheckingStoreUsername && isStoreUsernameAvailable ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <FaCircleCheck className="h-3 w-3" />
                  Handle is available.
                </p>
              ) : null}
              {storeUsernameError || (submitAttempted && fieldErrors.storeUsername) ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                  {storeUsernameError.toLowerCase().includes("taken") ? (
                    <FaCircleXmark className="h-3 w-3 shrink-0" />
                  ) : null}
                  {storeUsernameError || fieldErrors.storeUsername}
                </p>
              ) : null}
            </div>

            {/* Business Email */}
            <div>
              <label htmlFor="businessEmail" className="block text-xs font-bold text-slate-700 mb-1">
                Contact / Business Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
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
                      : "border-slate-200 bg-white"
                  } pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600`}
                />
              </div>
              {submitAttempted && fieldErrors.businessEmail ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.businessEmail}</p>
              ) : null}
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="url" className="block text-xs font-bold text-slate-700 mb-1">
                Website / Target URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
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
                      : "border-slate-200 bg-white"
                  } pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600`}
                />
              </div>
              {submitAttempted && fieldErrors.url ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.url}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-linear-to-r from-orange-500 to-amber-600 py-4 text-base font-bold text-white shadow-lg hover:from-orange-600 hover:to-amber-700 transition disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting
              ? "Submitting Campaign..."
              : existingCampaign
              ? "Update Campaign"
              : "Post campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}

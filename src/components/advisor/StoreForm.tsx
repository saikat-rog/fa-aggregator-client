import { useMemo, useState, useEffect } from "react";
import {
  FiBriefcase,
  FiFileText,
  FiMail,
  FiLock,
  FiGlobe,
  FiCheckCircle,
  FiAtSign,
  FiShare2,
} from "react-icons/fi";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import {
  duplicateStoreUsernameCheckApi,
  getMyRequirementApi,
  submitBusinessRequirement,
  updateMyRequirementApi,
  type BusinessRequirementItem,
} from "../../services/businessRequirements.service";

type StoreFormState = {
  companyName: string;
  storeUsername: string;
  businessEmail: string;
  url: string;
  detailedRequirements: string;
};

const initialState: StoreFormState = {
  companyName: "",
  storeUsername: "",
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

export function StoreForm() {
  const [form, setForm] = useState<StoreFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [existingStore, setExistingStore] = useState<BusinessRequirementItem | null>(null);
  const [storeUsernameError, setStoreUsernameError] = useState("");
  const [isCheckingStoreUsername, setIsCheckingStoreUsername] = useState(false);
  const [isStoreUsernameAvailable, setIsStoreUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const loadMyStore = async () => {
      try {
        const req = await getMyRequirementApi();
        if (req) {
          setExistingStore(req);
          const activeFields = req.pendingEdit ? { ...req, ...req.pendingEdit } : req;
          setForm({
            companyName: activeFields.companyName || "",
            storeUsername: activeFields.storeUsername || "",
            businessEmail: activeFields.businessEmail || "",
            url: activeFields.url || "",
            detailedRequirements: activeFields.detailedRequirements || "",
          });
        }
      } catch {
        // ignore load errors
      }
    };
    void loadMyStore();
  }, []);

  const fieldErrors = useMemo(() => {
    const errors: Record<keyof StoreFormState, string> = {
      companyName: "",
      storeUsername: "",
      businessEmail: "",
      url: "",
      detailedRequirements: "",
    };

    if (!form.companyName.trim()) {
      errors.companyName = "Company name is required.";
    }

    if (!form.storeUsername.trim()) {
      errors.storeUsername = "Store username is required.";
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
      errors.detailedRequirements = "Detailed requirements are required.";
    }

    return errors;
  }, [form]);

  const isFormValid = useMemo(() => {
    return !Object.values(fieldErrors).some((err) => Boolean(err));
  }, [fieldErrors]);

  const handleChange = (field: keyof StoreFormState, value: string) => {
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
      existingStore &&
      (existingStore.storeUsername?.toLowerCase() === cleaned ||
        existingStore.pendingEdit?.storeUsername?.toLowerCase() === cleaned)
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
        setStoreUsernameError("This store username is already taken.");
        return;
      }

      setIsStoreUsernameAvailable(true);
      setStoreUsernameError("");
    } catch {
      setIsStoreUsernameAvailable(null);
      setStoreUsernameError("Could not verify store username availability right now.");
    } finally {
      setIsCheckingStoreUsername(false);
    }
  };

    // Read-only view if advisor already submitted store listing application
  if (existingStore) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              Store Application Submitted
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Your Store Application</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Status: <span className="font-bold uppercase text-blue-700">{existingStore.status}</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900 text-xs font-medium mb-6 flex items-start gap-2.5">
          <FiLock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Store applications cannot be edited or re-submitted.</p>
            <p className="mt-0.5 text-amber-800">
              Advisors can only have one active store listing application. If you need assistance, please contact support.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-800">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company / Store Name</p>
              <p className="text-base font-bold text-slate-900 mt-1">{existingStore.companyName || "—"}</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Handle</p>
              <p className="text-base font-bold text-blue-700 mt-1">@{existingStore.storeUsername || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
        detailedRequirements: form.detailedRequirements.trim(),
      };

      if (existingStore) {
        const res = await updateMyRequirementApi(payload);
        setSuccessMessage(
          res.msg || "Your store requirement updates have been submitted for Admin approval!"
        );
        const updated = await getMyRequirementApi();
        if (updated) setExistingStore(updated);
      } else {
        const res = await submitBusinessRequirement(payload);
        setSuccessMessage(
          res.msg || "Your store application was submitted and sent for Admin review!"
        );
        const created = await getMyRequirementApi();
        if (created) setExistingStore(created);
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
          : "Failed to submit store requirement.";

      setErrorMessage(serverMsg || "Failed to submit store requirement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {existingStore ? "Manage Store Requirement" : "Submit Store Listing Application"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Share your store details & contact info. Approved store requirements will be listed under the Store section.
        </p>
      </div>

      {successMessage ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">{successMessage}</p>
              <p className="text-sm mt-0.5">
                Once approved by an admin, it will appear live under the Store tab.
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

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-xs font-semibold text-sky-900">
        <FiShare2 className="h-5 w-5 text-sky-600 shrink-0" />
        <span>
          <strong>Note:</strong> Your social media profile links (Instagram, YouTube, Telegram) and profile picture will be automatically attached from your profile.
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
                } pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600`}
              />
            </div>
            {submitAttempted && fieldErrors.companyName ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.companyName}</p>
            ) : null}
          </div>

          {/* Store Username */}
          <div>
            <label htmlFor="storeUsername" className="block text-sm font-bold text-slate-700">
              Store Username <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <FiAtSign className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="storeUsername"
                type="text"
                value={form.storeUsername}
                onChange={(e) => handleChange("storeUsername", e.target.value)}
                onBlur={() => void checkStoreUsernameAvailability(form.storeUsername)}
                placeholder="choose a unique store username (e.g. acme_deals)"
                className={`w-full rounded-xl border ${
                  (submitAttempted && fieldErrors.storeUsername) || storeUsernameError
                    ? "border-rose-400 bg-rose-50/30"
                    : isStoreUsernameAvailable
                    ? "border-emerald-400 bg-emerald-50/20"
                    : "border-slate-300 bg-white"
                } pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600`}
              />
            </div>
            {isCheckingStoreUsername ? (
              <p className="mt-1 text-xs text-blue-600">Checking store username availability...</p>
            ) : null}
            {!isCheckingStoreUsername && isStoreUsernameAvailable ? (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <FaCircleCheck className="h-3 w-3" />
                Store username is available.
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
            <p className="mt-1 text-[11px] text-slate-500">
              Your store link: <code className="rounded bg-slate-100 px-1 py-0.5 font-semibold text-blue-700">/store/{form.storeUsername.trim().toLowerCase() || "username"}</code>
            </p>
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
                } pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600`}
              />
            </div>
            {submitAttempted && fieldErrors.businessEmail ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.businessEmail}</p>
            ) : null}
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
                } pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600`}
              />
            </div>
            {submitAttempted && fieldErrors.url ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.url}</p>
            ) : null}
          </div>
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
              placeholder="Describe your business background, store details, target audience, and key requirements..."
              className={`w-full rounded-xl border ${
                submitAttempted && fieldErrors.detailedRequirements
                  ? "border-rose-400 bg-rose-50/30"
                  : "border-slate-300 bg-white"
              } pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600`}
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
            {isSubmitting
              ? "Submitting Requirement..."
              : existingStore
              ? "Update Store Requirement"
              : "Submit Store Listing Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import {
  advisorFormOptionsApi,
  duplicateUsernameCheckApi,
  submitAdvisorApplicationApi,
  type AdvisorApplicationPayload,
  type AdvisorFormOptionsResponseData,
} from "../../services/advisor.service";
import {
  getAdvisorApplicationFieldErrors,
  normalizeCategory,
  parsePpp,
} from "./applicationForm.utils";

type ApplicationFormProps = {
  onSubmitted?: () => void;
};


const HANDLE_REGEX = /^[a-zA-Z0-9._]{2,30}$/;
const isValidHandle = (value: string) => HANDLE_REGEX.test(value);
const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;
const isValidUsername = (value: string) => USERNAME_REGEX.test(value);

const handleOrUndefined = (value: FormDataEntryValue | null) => {
  const raw = String(value || "").trim();
  if (!raw) return undefined;
  return raw.startsWith("@") ? raw.slice(1) : raw;
};

const ApplicationForm = ({ onSubmitted }: ApplicationFormProps) => {
  const [applicationNote, setApplicationNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [options, setOptions] = useState<AdvisorFormOptionsResponseData | null>(null);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [pppValue, setPppValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [pppError, setPppError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsOptionsLoading(true);
        const data = await advisorFormOptionsApi();
        setOptions(data);
      } catch (error) {
        setErrorMessage("Failed to load form options. Please refresh and try again.");
      } finally {
        setIsOptionsLoading(false);
      }
    };

    loadOptions();
  }, []);

  const statesForCountry = useMemo(() => {
    if (!options || !selectedCountry) return [];
    return options.locations[selectedCountry]?.states ?? [];
  }, [options, selectedCountry]);

  const countryOptions = useMemo(() => {
    if (!options) return [];
    if (options.countries?.length) {
      return [...options.countries].sort((a, b) => a.localeCompare(b));
    }
    return Object.keys(options.locations || {}).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [options]);

  const allIndices = useMemo(() => {
    if (!options) return [];
    return Array.from(
      new Set(Object.values(options.marketIndicesByCountry).flat()),
    ).sort((a, b) => a.localeCompare(b));
  }, [options]);

  const industryOptions = useMemo(
    () => [...(options?.industries ?? [])].sort((a, b) => a.localeCompare(b)),
    [options],
  );

  const submitListingApplication = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const cleanedUsername = username.trim();
    const socialLinks = {
      instagram: handleOrUndefined(formData.get("instagram")),
      linkedin: handleOrUndefined(formData.get("linkedin")),
      twitter: handleOrUndefined(formData.get("twitter")),
      facebook: handleOrUndefined(formData.get("facebook")),
      youtube: handleOrUndefined(formData.get("youtube")),
    };
    const parsedPpp = parsePpp(pppValue);
    const trimmedCategory = normalizeCategory(categoryValue);

    const socialHandles = [
      socialLinks.instagram,
      socialLinks.linkedin,
      socialLinks.twitter,
      socialLinks.facebook,
      socialLinks.youtube,
    ].filter(Boolean) as string[];
    const selectedCountryValue = String(formData.get("country") || "").trim();

    if (!selectedCountryValue) {
      setUsernameError("");
      setErrorMessage("Please select a country.");
      return;
    }
    const fieldErrors = getAdvisorApplicationFieldErrors({
      pppValue,
      categoryValue,
    });
    if (fieldErrors.pppError || fieldErrors.categoryError) {
      setPppError(fieldErrors.pppError);
      setCategoryError(fieldErrors.categoryError);
      setErrorMessage("");
      return;
    }
    if (parsedPpp === null) {
      return;
    }

    const payload: AdvisorApplicationPayload = {
      username: cleanedUsername,
      industry: selectedIndustry,
      ppp: parsedPpp,
      category: trimmedCategory,
      country: selectedCountryValue,
      state: String(formData.get("state") || "").trim(),
      about: String(formData.get("about") || "").trim(),
      marketFocus: selectedMarkets,
      emailForContact: String(formData.get("emailForContact") || "").trim(),
      personalWebsite:
        String(formData.get("personalWebsite") || "").trim() || undefined,
      expertiseIndeces: selectedIndices,
      socialLinks,
    };

    if (!payload.industry) {
      setUsernameError("");
      setErrorMessage("Please select an industry.");
      return;
    }

    if (!cleanedUsername) {
      setErrorMessage("");
      setUsernameError("Username is required.");
      return;
    }

    if (!isValidUsername(cleanedUsername)) {
      setErrorMessage("");
      setUsernameError(
        "Invalid username. Use 3-30 chars: letters, numbers, . or _",
      );
      return;
    }

    if (statesForCountry.length > 0 && !payload.state) {
      setErrorMessage("Please select a state.");
      return;
    }

    if (payload.marketFocus.length === 0) {
      setErrorMessage("Please select at least one market focus.");
      return;
    }

    if (payload.expertiseIndeces.length === 0) {
      setErrorMessage("Please select at least one expertise index.");
      return;
    }

    if (socialHandles.length === 0) {
      setErrorMessage("Please provide at least one social media handle.");
      return;
    }

    if (!socialHandles.every(isValidHandle)) {
      setErrorMessage(
        "One or more social handles are invalid. Use 2-30 chars: letters, numbers, . or _",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setApplicationNote("");
      setUsernameError("");
      setPppError("");
      setCategoryError("");
      setIsCheckingUsername(true);

      const availabilityResponse = await duplicateUsernameCheckApi(cleanedUsername);
      const isTaken =
        availabilityResponse?.isTaken === true ||
        availabilityResponse?.exists === true ||
        availabilityResponse?.available === false ||
        availabilityResponse?.isAvailable === false ||
        availabilityResponse?.data?.isTaken === true ||
        availabilityResponse?.data?.exists === true ||
        availabilityResponse?.data?.available === false ||
        availabilityResponse?.data?.isAvailable === false;

      if (isTaken) {
        setUsernameError("This username is already taken. Please choose another.");
        return;
      }

      await submitAdvisorApplicationApi(payload);

      setApplicationNote(
        "Application submitted successfully. Our team will review it within 24-48 hours.",
      );
      onSubmitted?.();
      formElement.reset();
      setUsername("");
      setSelectedCountry("");
      setSelectedState("");
      setSelectedIndustry("");
      setSelectedMarkets([]);
      setSelectedIndices([]);
      setPppValue("");
      setCategoryValue("");
      setIsUsernameAvailable(null);
    } catch (error: unknown) {
      const apiError =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Failed to submit application. Please try again.";

      setErrorMessage(apiError ?? "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsCheckingUsername(false);
    }
  };

  const checkUsernameAvailability = async (input: string) => {
    const cleaned = input.trim();
    if (!cleaned) {
      setIsUsernameAvailable(null);
      setUsernameError("");
      return;
    }

    if (!isValidUsername(cleaned)) {
      setIsUsernameAvailable(null);
      setUsernameError(
        "Invalid username. Use 3-30 chars: letters, numbers, . or _",
      );
      return;
    }

    try {
      setIsCheckingUsername(true);
      setUsernameError("");
      const availabilityResponse = await duplicateUsernameCheckApi(cleaned);
      const isTaken =
        availabilityResponse?.isTaken === true ||
        availabilityResponse?.exists === true ||
        availabilityResponse?.available === false ||
        availabilityResponse?.isAvailable === false ||
        availabilityResponse?.data?.isTaken === true ||
        availabilityResponse?.data?.exists === true ||
        availabilityResponse?.data?.available === false ||
        availabilityResponse?.data?.isAvailable === false;

      if (isTaken) {
        setIsUsernameAvailable(false);
        setUsernameError("This username is already taken.");
        return;
      }

      setIsUsernameAvailable(true);
      setUsernameError("");
    } catch {
      setIsUsernameAvailable(null);
      setUsernameError("Could not verify username availability right now.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleField = (name: string, placeholder: string) => (
    <label className="flex items-center rounded-xl border border-blue-100 bg-white px-4 py-3 focus-within:border-blue-400">
      <span className="mr-1 text-slate-400">@</span>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className="w-full outline-none"
      />
    </label>
  );

  const toggleMarket = (market: string) => {
    setSelectedMarkets((prev) =>
      prev.includes(market)
        ? prev.filter((item) => item !== market)
        : [...prev, market],
    );
  };

  const toggleIndex = (indexName: string) => {
    setSelectedIndices((prev) =>
      prev.includes(indexName)
        ? prev.filter((item) => item !== indexName)
        : [...prev, indexName],
    );
  };

  return (
    <article className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-5 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-cyan-50 p-4">
        <p className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
          Listing Application
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          Build Your Public Advisor Profile
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Complete the details below to get reviewed and start receiving qualified leads.
        </p>
      </div>

      {isOptionsLoading ? (
        <p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Loading advisor form options...
        </p>
      ) : null}

      <form onSubmit={submitListingApplication} className="space-y-3">
        <div>
          <label className="flex items-center rounded-xl border border-blue-100 bg-white px-4 py-3 focus-within:border-blue-400">
            <span className="mr-1 text-slate-400">@</span>
            <input
              required
              name="username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setUsernameError("");
                setIsUsernameAvailable(null);
              }}
              onBlur={() => checkUsernameAvailability(username)}
              placeholder="choose a unique username"
              className="w-full outline-none"
            />
          </label>
          {isCheckingUsername ? (
            <p className="mt-1 text-xs text-blue-600">Checking username...</p>
          ) : null}
          {!isCheckingUsername && isUsernameAvailable ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600">
              <FaCircleCheck className="h-3 w-3" />
              Username is available.
            </p>
          ) : null}
          {usernameError ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-rose-600">
              {usernameError.toLowerCase().includes("taken") ? (
                <FaCircleXmark className="h-3 w-3" />
              ) : null}
              {usernameError}
            </p>
          ) : null}
        </div>

        <div className={`grid gap-3 ${statesForCountry.length > 0 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
          <select
            required
            name="country"
            value={selectedCountry}
            onChange={(event) => {
              setSelectedCountry(event.target.value);
              setSelectedState("");
            }}
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
          >
            <option value="">Select country</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {statesForCountry.length > 0 ? (
            <select
              required
              name="state"
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
            >
              <option value="">Select state</option>
              {statesForCountry.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <select
          required
          name="industry"
          value={selectedIndustry}
          onChange={(event) => setSelectedIndustry(event.target.value)}
          className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
        >
          <option value="">Select industry</option>
          {industryOptions.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <input
              required
              name="ppp"
              type="number"
              min={0}
              step="any"
              value={pppValue}
              onChange={(event) => {
                setPppValue(event.target.value);
                setPppError("");
              }}
              placeholder="PPP (non-negative number)"
              className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
            />
            {pppError ? (
              <p className="mt-1 text-xs text-rose-600">{pppError}</p>
            ) : null}
          </div>
          <div>
            <input
              required
              name="category"
              type="text"
              value={categoryValue}
              onChange={(event) => {
                setCategoryValue(event.target.value);
                setCategoryError("");
              }}
              placeholder="Category"
              className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
            />
            {categoryError ? (
              <p className="mt-1 text-xs text-rose-600">{categoryError}</p>
            ) : null}
          </div>
        </div>

        <input
          required
          name="emailForContact"
          type="email"
          placeholder="Email to be displayed on your profile"
          className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
        />

        <input
          name="personalWebsite"
          type="url"
          placeholder="Your website URL (optional)"
          className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
        />

        <p className="text-md text-slate-600 py-2">
          At least one social handle is required
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {handleField("instagram", "instagram handle")}
          {handleField("linkedin", "linkedin handle")}
          {handleField("twitter", "twitter/x handle")}
          {handleField("facebook", "facebook handle")}
          {handleField("youtube", "youtube handle")}
        </div>

        <textarea
          name="about"
          rows={4}
          placeholder="Short description for your public profile (optional)"
          className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
        />

        <div>
          <p className="text-md text-slate-600 py-2">
            Market Focus (choose one or more)
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(options?.markets || []).map((market) => {
              const isSelected = selectedMarkets.includes(market);
              return (
                <button
                  key={market}
                  type="button"
                  onClick={() => toggleMarket(market)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400"
                  }`}
                >
                  {market}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-md text-slate-600 py-2">
            Expertise indices (choose one or more)
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {allIndices.map((indexName) => {
              const isSelected = selectedIndices.includes(indexName);
              return (
                <button
                  key={indexName}
                  type="button"
                  onClick={() => toggleIndex(indexName)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
                    isSelected
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:border-cyan-400"
                  }`}
                >
                  {indexName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={isSubmitting || isOptionsLoading || isCheckingUsername}
            type="submit"
            className="rounded-xl bg-blue-600 w-full px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit For Approval"}
          </button>
          
        </div>
          <p><strong>NOTE: </strong>Once submitted, please DM us in our official instagram page "invest24" from your given Instagram profile.</p>
      </form>

      {applicationNote ? (
        <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          {applicationNote}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </article>
  );
};

export default ApplicationForm;

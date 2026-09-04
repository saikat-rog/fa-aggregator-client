import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiUser, FiBriefcase, FiAlertCircle, FiShield, FiPhone, FiCheck } from "react-icons/fi";
import {
  googleAuthApi,
  type AuthRole,
  type AuthSuccessPayload,
} from "../../services/auth.service";

type GooglePhoneState = {
  open: boolean;
  idToken: string;
  role: AuthRole;
};

const GOOGLE_REDIRECT_STATE_KEY = "folksmintGoogleRedirectState";
const ADVISOR_DECLARATION_MESSAGE =
  "Please confirm you are an authorized financial advisor or content creator before proceeding.";

const persistAuthSession = (authResponse: AuthSuccessPayload) => {
  localStorage.setItem("token", authResponse.accessToken);
  if ((authResponse as any).email) {
    localStorage.setItem("userEmail", (authResponse as any).email);
  }
  localStorage.setItem("role", authResponse.role);
  localStorage.setItem(
    "roles",
    JSON.stringify(Array.isArray(authResponse.roles) ? authResponse.roles : [authResponse.role]),
  );
  localStorage.setItem("googleLinked", "true");
  if (authResponse.hasPincode || authResponse.pincode) {
    localStorage.setItem("pincodeCollected", "true");
    if (authResponse.pincode) {
      localStorage.setItem("userPincode", authResponse.pincode);
    }
  }
};

const navigateByRole = (navigate: ReturnType<typeof useNavigate>, role: AuthRole) => {
  if (role === "advisor") {
    navigate("/a/dashboard");
    return;
  }
  navigate("/u/dashboard");
};

const extractApiMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { msg?: string } } }).response?.data
      ?.msg === "string"
  ) {
    return (error as { response?: { data?: { msg?: string } } }).response?.data
      ?.msg as string;
  }
  return "";
};

type CountryCodeOption = {
  code: string;
  label: string;
  digits: number;
  maxDigits: number;
  placeholder: string;
  regex?: RegExp;
  errorMsg?: string;
};

const COUNTRY_CODE_OPTIONS: CountryCodeOption[] = [
  { code: "91", label: "+91 🇮🇳 India", digits: 10, maxDigits: 10, placeholder: "10-digit mobile number", regex: /^[6-9]\d{9}$/, errorMsg: "Indian mobile number must be 10 digits starting with 6, 7, 8, or 9" },
  { code: "1", label: "+1 🇺🇸 USA", digits: 10, maxDigits: 10, placeholder: "10-digit mobile number", regex: /^[2-9]\d{9}$/, errorMsg: "US phone number must be 10 digits" },
];

const RightAuthForms = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRole = searchParams.get("role");
  const initialRole: AuthRole = urlRole === "advisor" ? "advisor" : "user";

  const [formRole, setFormRole] = useState<AuthRole>(initialRole);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [advisorDeclarationChecked, setAdvisorDeclarationChecked] = useState(false);
  const [persistedAuth, setPersistedAuth] = useState<AuthSuccessPayload | null>(null);

  const [googlePhone, setGooglePhone] = useState<GooglePhoneState>({
    open: false,
    idToken: "",
    role: "user",
  });
  const [googlePhoneForm, setGooglePhoneForm] = useState({
    countryCode: "91",
    customCountryCode: "",
    phone: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const getEffectiveCountryCode = () => {
    if (googlePhoneForm.countryCode === "custom") {
      return googlePhoneForm.customCountryCode.replace(/\D/g, "");
    }
    return googlePhoneForm.countryCode.replace(/\D/g, "");
  };

  const getEffectiveMaxDigits = () => {
    const matched = COUNTRY_CODE_OPTIONS.find((c) => c.code === googlePhoneForm.countryCode);
    if (matched) return matched.maxDigits;
    return 12;
  };

  const validatePhone = (code: string, phoneStr: string) => {
    if (!phoneStr.trim()) return "";
    const cleanCode = code.replace(/\D/g, "");
    const cleanPhone = phoneStr.replace(/\D/g, "");

    if (!cleanCode || cleanCode.length < 1 || cleanCode.length > 4) {
      return "Please enter a valid country code (1-4 digits).";
    }

    const matched = COUNTRY_CODE_OPTIONS.find((c) => c.code === cleanCode);
    if (matched) {
      if (matched.regex && !matched.regex.test(cleanPhone)) {
        return matched.errorMsg || "Invalid phone number.";
      }
    } else {
      if (cleanPhone.length < 7 || cleanPhone.length > 12) {
        return "Phone number must be between 7 and 12 digits.";
      }
    }

    return "";
  };

  const formRoleRef = useRef<AuthRole>(initialRole);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "advisor" || roleParam === "user") {
      setFormRole(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    formRoleRef.current = formRole;
  }, [formRole]);

  const changeRole = (newRole: AuthRole) => {
    setFormRole(newRole);
    setErrorMessage("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("role", newRole);
        return next;
      },
      { replace: true },
    );
  };

  const getGoogleClientId = () =>
    import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const redirectToGoogleSignIn = (selectedRole: AuthRole) => {
    const clientId = getGoogleClientId();
    if (!clientId) {
      setErrorMessage("Google login is not configured.");
      return;
    }

    const nonce =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    sessionStorage.setItem(
      GOOGLE_REDIRECT_STATE_KEY,
      JSON.stringify({
        role: selectedRole,
        nonce,
      }),
    );

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin + window.location.pathname,
      response_type: "id_token",
      scope: "openid email profile",
      nonce,
      prompt: "select_account",
    });

    window.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
  };

  const applyAuthSuccess = (authResponse: AuthSuccessPayload) => {
    persistAuthSession(authResponse);
    navigateByRole(navigate, authResponse.role);
  };

  const onGoogleCredential = async (credential?: string) => {
    if (!credential) {
      setErrorMessage("Google sign-in failed. Please try again.");
      return;
    }

    setErrorMessage("");
    try {
      setIsGoogleSubmitting(true);
      // Attempt silent auth first
      const response = await googleAuthApi({
        idToken: credential,
        role: formRoleRef.current,
        phone: "",
      });

      // If user already has a phone number registered, do not prompt for phone
      if (response.hasPhone || Boolean(response.phone)) {
        applyAuthSuccess(response);
        return;
      }

      // User has no phone number: prompt the optional phone number dialog
      setPersistedAuth(response);
      setGooglePhone({
        open: true,
        idToken: credential,
        role: formRoleRef.current,
      });
    } catch (err: unknown) {
      setErrorMessage(extractApiMessage(err) || "Google authentication failed.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const onGooglePhoneSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPhoneError("");
    const phone = googlePhoneForm.phone.trim();
    const effectiveCode = getEffectiveCountryCode();

    if (phone) {
      const err = validatePhone(effectiveCode, phone);
      if (err) {
        setPhoneError(err);
        return;
      }
    }

    const formattedPhone = phone ? `+${effectiveCode}${phone.replace(/\D/g, "")}` : "";

    if (formattedPhone && googlePhone.idToken) {
      try {
        setIsGoogleSubmitting(true);
        setErrorMessage("");
        const response = await googleAuthApi({
          idToken: googlePhone.idToken,
          role: googlePhone.role,
          phone: formattedPhone,
        });
        applyAuthSuccess(response);
        return;
      } catch (error: unknown) {
        setErrorMessage(extractApiMessage(error) || "Failed to save phone number.");
        setIsGoogleSubmitting(false);
        return;
      }
    }

    // If phone field left blank, proceed with persisted session
    if (persistedAuth) {
      applyAuthSuccess(persistedAuth);
    } else {
      setGooglePhone({ open: false, idToken: "", role: "user" });
    }
  };

  const onGooglePhoneSkip = () => {
    if (persistedAuth) {
      applyAuthSuccess(persistedAuth);
    } else {
      setGooglePhone({ open: false, idToken: "", role: "user" });
    }
  };

  const handleGoogleAuthClick = () => {
    setErrorMessage("");

    if (formRole === "advisor" && !advisorDeclarationChecked) {
      setErrorMessage(ADVISOR_DECLARATION_MESSAGE);
      return;
    }

    redirectToGoogleSignIn(formRole);
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const idToken = hashParams.get("id_token");
    if (!idToken) return;

    const storedState = sessionStorage.getItem(GOOGLE_REDIRECT_STATE_KEY);
    sessionStorage.removeItem(GOOGLE_REDIRECT_STATE_KEY);

    try {
      const parsedState = storedState
        ? (JSON.parse(storedState) as { role?: AuthRole })
        : null;
      if (parsedState?.role) {
        formRoleRef.current = parsedState.role;
        setFormRole(parsedState.role);
      }
    } catch {
      // Continue with current role
    }

    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search,
    );
    void onGoogleCredential(idToken);
  }, []);

  return (
    <section className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xl shadow-slate-200/40">
      <div>
        {/* Header Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <FiShield className="h-4 w-4" />
            <span>Fast & Secure Google Login</span>
          </div>
          <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Get started in seconds
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose your role below to continue with your Google account.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6 rounded-2xl bg-slate-100/90 p-1.5 backdrop-blur-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => changeRole("user")}
              className={`flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                formRole === "user"
                  ? "bg-white text-blue-700 shadow-md shadow-slate-200/60 ring-1 ring-blue-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <FiUser className={`h-4 w-4 ${formRole === "user" ? "text-blue-600" : "text-slate-400"}`} />
              <span>User</span>
            </button>

            <button
              type="button"
              onClick={() => changeRole("advisor")}
              className={`flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                formRole === "advisor"
                  ? "bg-white text-cyan-800 shadow-md shadow-slate-200/60 ring-1 ring-cyan-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <FiBriefcase className={`h-4 w-4 ${formRole === "advisor" ? "text-cyan-600" : "text-slate-400"}`} />
              <span>Financial Advisor</span>
            </button>
          </div>
        </div>

        {/* Dynamic Role Info Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={formRole}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
          >
            {formRole === "user" ? (
              <div className="flex items-start gap-3 text-xs text-blue-950">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-sm text-blue-900">Looking for Financial Advice</p>
                  <p className="mt-0.5 text-slate-600">
                    Discover top SEBI registered and verified financial advisors, view profiles, and send direct enquiries.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-xs text-cyan-950">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-sm text-cyan-900">Financial Advisor Portal</p>
                  <p className="mt-0.5 text-slate-600">
                    Set up your advisor profile, showcase credentials, track analytics, and manage client enquiries.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Advisor Declaration Checkbox if Advisor is selected */}
        {formRole === "advisor" && (
          <div className="mb-6">
            <label className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900 cursor-pointer transition hover:bg-amber-50">
              <input
                type="checkbox"
                checked={advisorDeclarationChecked}
                onChange={(e) => setAdvisorDeclarationChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-cyan-600"
              />
              <span className="leading-relaxed">
                I confirm that I am a legitimate financial advisor / financial content creator and will provide accurate information.
              </span>
            </label>
          </div>
        )}

        {/* Single Primary Google Sign-In Action */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleAuthClick}
            disabled={isGoogleSubmitting}
            className="group relative flex w-full items-center justify-center gap-3.5 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-bold text-slate-800 shadow-md shadow-slate-200/50 transition-all hover:border-blue-400 hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Google SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-6 w-6 shrink-0 transition-transform group-hover:scale-105"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.8 0 0 0 0 0 0l6.2 5.2C37 38.6 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
              />
            </svg>

            <span className="hover:cursor-pointer">
              {isGoogleSubmitting
                ? "Authenticating with Google..."
                : `Continue with Google`}
            </span>
          </button>

          {/* Error Message */}
          {errorMessage ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
            >
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="mt-8 border-t border-slate-100 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <FiCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>No password needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Instant profile setup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-bit OAuth security</span>
          </div>
        </div>
      </div>

      {/* Mobile Number Popup Dialog (Optional for Google Sign In - Shown only when user has no phone) */}
      <AnimatePresence>
        {googlePhone.open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={onGooglePhoneSubmit}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                <FiPhone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Add Phone Number (Optional)</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Provide your mobile number to receive updates and connect with {googlePhone.role === "advisor" ? "clients" : "advisors"}, or click Skip to continue as <span className="font-semibold text-slate-700">{googlePhone.role}</span>.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <div className="flex h-12 gap-2">
                  <select
                    value={googlePhoneForm.countryCode}
                    onChange={(event) => {
                      setPhoneError("");
                      const val = event.target.value;
                      const matched = COUNTRY_CODE_OPTIONS.find((c) => c.code === val);
                      setGooglePhoneForm((prev) => ({
                        ...prev,
                        countryCode: val,
                        phone: matched ? prev.phone.slice(0, matched.maxDigits) : prev.phone,
                      }));
                    }}
                    aria-label="Select Country Code"
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  >
                    {COUNTRY_CODE_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                    
                  </select>

                  

                  <input
                    value={googlePhoneForm.phone}
                    onChange={(event) => {
                      setPhoneError("");
                      const maxLen = getEffectiveMaxDigits();
                      const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, maxLen);
                      setGooglePhoneForm((prev) => ({
                        ...prev,
                        phone: digitsOnly,
                      }));
                    }}
                    maxLength={getEffectiveMaxDigits()}
                    inputMode="numeric"
                    aria-label="Mobile number"
                    placeholder={
                      COUNTRY_CODE_OPTIONS.find((c) => c.code === googlePhoneForm.countryCode)?.placeholder ??
                      "Mobile number (Optional)"
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-4 text-sm font-medium outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {phoneError ? (
                  <p className="text-xs font-semibold text-rose-600 px-1">{phoneError}</p>
                ) : null}
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isGoogleSubmitting}
                  onClick={onGooglePhoneSkip}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={isGoogleSubmitting}
                  className="rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-800 disabled:opacity-60 transition"
                >
                  {isGoogleSubmitting ? "Completing..." : "Continue"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

export default RightAuthForms;

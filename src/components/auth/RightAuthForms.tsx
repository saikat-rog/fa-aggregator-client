import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordApi,
  googleAuthApi,
  loginApi,
  registerApi,
  reVerifyEmailApi,
  resetPasswordApi,
  verifyEmailApi,
  type AuthRole,
  type AuthSuccessPayload,
} from "../../services/auth.service";

type AuthMode = "login" | "signup";
type SignupStep = "details" | "otp";
type ForgotStep = "request" | "reset";

type PendingSignup = {
  email: string;
  password: string;
  role: AuthRole;
};

type GoogleCompletionState = {
  open: boolean;
  idToken: string;
  role: AuthRole;
};

type GoogleCompletionFieldKey = "name" | "phone";
type GoogleCompletionField = {
  key: GoogleCompletionFieldKey;
  label: string;
  required: boolean;
  placeholder: string;
  type?: "text" | "tel";
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (params: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: (listener?: (notification: PromptMomentNotification) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

type PromptMomentNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

const GOOGLE_REDIRECT_STATE_KEY = "invest24GoogleRedirectState";
const GOOGLE_ONLY_HELP_TEXT =
  "After login, create password in Settings";
const GOOGLE_ONLY_FALLBACK_MESSAGE =
  "Google authentication is enabled for this account. Please login with Google first, then set a password.";
const NO_PASSWORD_FOR_ROLE_MESSAGE =
  "This role has no password yet. Login with Google and create a password first.";
const ADVISOR_DECLARATION_MESSAGE =
  "Please confirm you are an influencer and not claiming anything fake.";

const persistAuthSession = (authResponse: AuthSuccessPayload) => {
  localStorage.setItem("token", authResponse.accessToken);
  localStorage.setItem("role", authResponse.role);
  localStorage.setItem(
    "roles",
    JSON.stringify(Array.isArray(authResponse.roles) ? authResponse.roles : [authResponse.role]),
  );
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

const RightAuthForms = () => {
  const [formRole, setFormRole] = useState<AuthRole>("user");
  const [mode, setMode] = useState<AuthMode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("details");
  const [forgotStep, setForgotStep] = useState<ForgotStep>("request");

  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [advisorDeclarationChecked, setAdvisorDeclarationChecked] =
    useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [resendAttempts, setResendAttempts] = useState(0);
  const [otpCooldownStarted, setOtpCooldownStarted] = useState(false);
  const [googleClientReady, setGoogleClientReady] = useState(false);
  const [showGoogleOnlyGuidance, setShowGoogleOnlyGuidance] = useState(false);
  const [forgotPayload, setForgotPayload] = useState({
    email: "",
    role: "user" as AuthRole,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [googleCompletion, setGoogleCompletion] = useState<GoogleCompletionState>({
    open: false,
    idToken: "",
    role: "user",
  });
  const [googleCompletionForm, setGoogleCompletionForm] = useState({
    name: "",
    phone: "",
    countryCode: "91",
  });
  const googleCompletionFields: GoogleCompletionField[] = [
    {
      key: "name",
      label: "Full name",
      required: true,
      placeholder: "Full name",
      type: "text",
    },
    {
      key: "phone",
      label: "Phone (optional)",
      required: false,
      placeholder: "Phone (optional)",
      type: "tel",
    },
  ];

  const navigate = useNavigate();
  const pendingSignupEmail = pendingSignup?.email || "your email";
  const digitRefs = useRef<HTMLInputElement[]>([]);
  const googleIdTokenRef = useRef<string>("");
  const formRoleRef = useRef<AuthRole>("user");
  const modeRef = useRef<AuthMode>("login");
  const googleFlowModeRef = useRef<AuthMode>("login");
  const hiddenGoogleButtonContainerRef = useRef<HTMLDivElement | null>(null);
  const hasRenderedHiddenGoogleButtonRef = useRef(false);
  const MAX_RESEND_ATTEMPTS = 5;

  const getGoogleClientId = () =>
    import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const redirectToGoogleSignIn = (sourceMode: AuthMode) => {
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
        mode: sourceMode,
        role: formRoleRef.current,
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

  const resetSignupFlow = () => {
    setSignupStep("details");
    setPendingSignup(null);
    setSuccessMessage("");
    setErrorMessage("");
    setOtpDigits(Array(6).fill(""));
    setResendCooldown(0);
    setResendMessage("");
    setResendAttempts(0);
    setCountryCode("91");
    setAdvisorDeclarationChecked(false);
    setOtpCooldownStarted(false);
    setShowGoogleOnlyGuidance(false);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
    setShowGoogleOnlyGuidance(false);
    setForgotOpen(false);
    setForgotStep("request");
    if (nextMode === "login") {
      resetSignupFlow();
    }
  };

  const switchRole = (nextRole: AuthRole) => {
    setFormRole(nextRole);
    setForgotOpen(false);
    setForgotStep("request");
    resetSignupFlow();
  };

  useEffect(() => {
    formRoleRef.current = formRole;
  }, [formRole]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const applyAuthSuccess = (authResponse: AuthSuccessPayload, viaGoogle: boolean) => {
    persistAuthSession(authResponse);
    if (viaGoogle) {
      localStorage.setItem("googleLinked", "true");
    }
    navigateByRole(navigate, authResponse.role);
  };

  const tryGoogleAuth = async (params: {
    idToken: string;
    role: AuthRole;
    name?: string;
    phone?: string;
  }) => {
    const response = await googleAuthApi(params);
    applyAuthSuccess(response, true);
  };

  const onGoogleCredential = async (credential?: string) => {
    if (!credential) {
      setErrorMessage("Google sign-in failed. Please try again.");
      return;
    }

    googleIdTokenRef.current = credential;
    setIsGoogleSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (googleFlowModeRef.current === "signup") {
        setGoogleCompletion({
          open: true,
          idToken: credential,
          role: formRoleRef.current,
        });
        return;
      }

      await tryGoogleAuth({ idToken: credential, role: formRoleRef.current });
    } catch (error: unknown) {
      const message = extractApiMessage(error);
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;
      const lowerMessage = message.toLowerCase();
      const nameRequired =
        status === 422 &&
        (lowerMessage.includes("name") || lowerMessage.includes("required"));
      const incompleteSignup = status === 422;

      if (nameRequired || incompleteSignup) {
        setGoogleCompletion({
          open: true,
          idToken: credential,
          role: formRoleRef.current,
        });
        return;
      }

      setErrorMessage(message || "Google authentication failed.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const initGoogleClient = () => {
    const clientId = getGoogleClientId();
    if (!clientId) {
      setErrorMessage("Google login is not configured.");
      return;
    }

    if (!window.google?.accounts?.id) {
      setErrorMessage("Google SDK failed to load.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        void onGoogleCredential(response.credential);
      },
    });

    setGoogleClientReady(true);
  };

  const handleGoogleSignIn = (sourceMode: AuthMode) => {
    googleFlowModeRef.current = sourceMode;
    setErrorMessage("");
    setSuccessMessage("");
    setShowGoogleOnlyGuidance(false);

    if (!googleClientReady) {
      initGoogleClient();
    }

    if (!window.google?.accounts?.id) {
      setErrorMessage("Google login is not configured.");
      return;
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        redirectToGoogleSignIn(sourceMode);
      }
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const password = String(formData.get("password") || "");
    const phone = String(formData.get("phone") || "").trim();
    const fullPhone = phone ? `+${countryCode}${phone}` : undefined;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");
      setShowGoogleOnlyGuidance(false);

      let authResponse: AuthSuccessPayload | null = null;
      if (mode === "signup") {
        if (signupStep === "details") {
          if (formRole === "advisor" && !advisorDeclarationChecked) {
            setErrorMessage(ADVISOR_DECLARATION_MESSAGE);
            return;
          }
          await registerApi(email, password, name, fullPhone, formRole);
          setPendingSignup({ email, password, role: formRole });
          setSignupStep("otp");
          setSuccessMessage(
            "We sent a 6-digit verification code to your email. Enter it below to finish creating your account.",
          );
          return;
        }

        if (!pendingSignup) {
          setSignupStep("details");
          setErrorMessage("Your signup session expired. Please register again.");
          return;
        }

        const otpToVerify = otpDigits.join("");
        if (otpToVerify.length !== 6) {
          setErrorMessage("Enter the 6-digit OTP sent to your email.");
          return;
        }

        await verifyEmailApi(pendingSignup.email, otpToVerify);
        setSuccessMessage("Email verified successfully. Signing you in now...");
        authResponse = await loginApi(
          pendingSignup.email,
          pendingSignup.password,
          pendingSignup.role,
        );
      } else {
        authResponse = await loginApi(email, password, formRole);
      }

      if (authResponse?.accessToken) {
        applyAuthSuccess(authResponse, false);
      }
    } catch (error: unknown) {
      const fallbackMessage =
        mode === "signup"
          ? "Signup failed. Please try again."
          : "Login failed. Please check your credentials.";
      const apiError = extractApiMessage(error);
      const normalized = (apiError || "").toLowerCase();
      const shouldShowGoogleHelp =
        normalized.includes("google authentication is enabled") ||
        apiError === GOOGLE_ONLY_FALLBACK_MESSAGE;

      setErrorMessage(apiError || fallbackMessage);
      setShowGoogleOnlyGuidance(shouldShowGoogleHelp);
      if (mode === "signup" && signupStep === "otp") {
        setSuccessMessage(
          "We could not verify your email. Check the code and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!pendingSignup?.email) {
      setErrorMessage("No email available to resend the code.");
      return;
    }

    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setErrorMessage(
        "You have reached the maximum resend attempts. Contact support.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setResendMessage("");
      await reVerifyEmailApi(pendingSignup.email, pendingSignup.role);
      setResendMessage("OTP resent to your email again.");
      setResendCooldown(16);
      setResendAttempts((s) => s + 1);
    } catch (error: unknown) {
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 429) {
        setErrorMessage("Too many requests. Try again later.");
      } else {
        setErrorMessage(extractApiMessage(error) || "Could not resend OTP. Try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgotRequest = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");
      await forgotPasswordApi(forgotPayload.email, forgotPayload.role);
      setForgotStep("reset");
      setSuccessMessage("OTP sent. Enter code and set your new password.");
    } catch (error: unknown) {
      setErrorMessage(extractApiMessage(error) || "Could not send reset OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgotReset = async () => {
    if (forgotPayload.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (forgotPayload.newPassword !== forgotPayload.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");
      await resetPasswordApi({
        email: forgotPayload.email,
        role: forgotPayload.role,
        otp: forgotPayload.otp,
        newPassword: forgotPayload.newPassword,
      });
      setSuccessMessage("Password reset successful. You can sign in now.");
      setForgotOpen(false);
      setForgotStep("request");
      setForgotPayload({
        email: "",
        role: formRole,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      const msg = extractApiMessage(error);
      const normalized = msg.toLowerCase();
      const noPasswordForRole =
        normalized.includes("no password") && normalized.includes("role");
      setErrorMessage(
        noPasswordForRole ? NO_PASSWORD_FOR_ROLE_MESSAGE : msg || "Could not reset password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleCompletionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = googleCompletionForm.name.trim();
    if (!name) {
      setErrorMessage("Name is required to complete Google signup.");
      return;
    }

    const phone = googleCompletionForm.phone.trim();
    const fullPhone = phone
      ? `+${googleCompletionForm.countryCode}${phone}`
      : undefined;

    try {
      setIsGoogleSubmitting(true);
      setErrorMessage("");
      await tryGoogleAuth({
        idToken: googleCompletion.idToken,
        role: googleCompletion.role,
        name,
        phone: fullPhone,
      });
    } catch (error: unknown) {
      setErrorMessage(extractApiMessage(error) || "Could not complete Google signup.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const idToken = hashParams.get("id_token");
    if (!idToken) return;

    const storedState = sessionStorage.getItem(GOOGLE_REDIRECT_STATE_KEY);
    sessionStorage.removeItem(GOOGLE_REDIRECT_STATE_KEY);

    try {
      const parsedState = storedState
        ? (JSON.parse(storedState) as {
            mode?: AuthMode;
            role?: AuthRole;
          })
        : null;
      if (parsedState?.role) {
        formRoleRef.current = parsedState.role;
        setFormRole(parsedState.role);
      }
      if (parsedState?.mode) {
        googleFlowModeRef.current = parsedState.mode;
        setMode(parsedState.mode);
      }
    } catch {
      // Continue with the current role/mode if stored redirect state is invalid.
    }

    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search,
    );
    void onGoogleCredential(idToken);
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initGoogleClient();
      } else {
        existingScript.addEventListener("load", initGoogleClient, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleClient;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (signupStep === "otp" && !otpCooldownStarted) {
      setResendCooldown(16);
      setOtpCooldownStarted(true);
    }

    if (signupStep === "otp") {
      const idx = otpDigits.findIndex((d) => d === "");
      const toFocus = idx === -1 ? 5 : idx;
      setTimeout(() => digitRefs.current[toFocus]?.focus(), 40);
    }
  }, [signupStep, otpCooldownStarted, otpDigits]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(
      () => setResendCooldown((c) => (c > 0 ? c - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [resendCooldown]);

  useEffect(() => {
    if (!forgotOpen) return;
    setForgotPayload((prev) => ({ ...prev, role: formRole }));
  }, [forgotOpen, formRole]);

  useEffect(() => {
    if (!googleClientReady) return;
    if (!hiddenGoogleButtonContainerRef.current) return;
    if (!window.google?.accounts?.id) return;
    if (hasRenderedHiddenGoogleButtonRef.current) return;

    window.google.accounts.id.renderButton(hiddenGoogleButtonContainerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: 280,
    });
    hasRenderedHiddenGoogleButtonRef.current = true;
  }, [googleClientReady]);

  const canSubmitForgotRequest = useMemo(
    () => forgotPayload.email.trim().length > 0,
    [forgotPayload.email],
  );
  const disablePrimarySubmit =
    isSubmitting ||
    isGoogleSubmitting ||
    (mode === "signup" &&
      signupStep === "details" &&
      formRole === "advisor" &&
      !advisorDeclarationChecked &&
      !forgotOpen);

  return (
    <section className="rounded-3xl border border-blue-100 bg-white py-4 px-3 md:p-5 shadow-lg">
      <div
        ref={hiddenGoogleButtonContainerRef}
        className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
        aria-hidden="true"
      />
      {successMessage ? (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      <div className="mb-5 rounded-2xl p-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Continue as
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => switchRole("user")}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              formRole === "user"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
            }`}
          >
            Looking for Advisors
          </button>
          <button
            type="button"
            onClick={() => switchRole("advisor")}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              formRole === "advisor"
                ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200"
            }`}
          >
            I am a Financial Advisor
          </button>
        </div>
      </div>

      <div className="mb-5 flex rounded-full border border-blue-500 bg-slate-100 p-1">
        <button
          onClick={() => switchMode("login")}
          type="button"
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            mode === "login" ? "bg-blue-700 text-white shadow" : "text-slate-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => switchMode("signup")}
          type="button"
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            mode === "signup" ? "bg-blue-700 text-white shadow" : "text-slate-600"
          }`}
        >
          Signup
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={`${formRole}-${mode}-${signupStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
          onSubmit={onSubmit}
          className="relative space-y-3 rounded-2xl p-4 transition"
        >
          {!forgotOpen && formRole === "advisor" && mode === "signup" ? (
            <div className="rounded-xl border border-blue-400 bg-white/70 px-2 py-2 text-xs font-semibold text-blue-800">
              NOTE: Advisor onboarding mode: these details are used for advisor
              profile review.
            </div>
          ) : null}

          {!forgotOpen && mode === "signup" && signupStep === "details" ? (
            <>
              <input
                name="name"
                required
                placeholder="Full name"
                autoComplete="name"
                className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
              />
              <div className="rounded-xl bg-white p-2">
                <div className="flex items-stretch gap-2">
                  <div className="flex h-12 w-20 overflow-hidden rounded-lg border border-blue-100 bg-white">
                    <div className="flex h-full items-center border-r border-blue-100 bg-slate-50 px-2 text-sm font-semibold text-slate-500">
                      +
                    </div>
                    <input
                      value={countryCode}
                      onChange={(event) =>
                        setCountryCode(event.target.value.replace(/\D/g, ""))
                      }
                      inputMode="numeric"
                      aria-label="Country code"
                      placeholder="91"
                      className="h-full w-full bg-transparent px-2 text-center text-base font-medium text-slate-700 outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number (optional)"
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="^$|[0-9]{7,15}"
                    title="Enter a valid phone number (7-15 digits)."
                    onChange={(event) => {
                      event.currentTarget.value = event.currentTarget.value.replace(
                        /\D/g,
                        "",
                      );
                    }}
                    className="h-12 flex-1 rounded-lg border border-blue-100 px-3 py-3 text-base outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </>
          ) : null}

          {!forgotOpen && mode === "signup" && signupStep === "otp" ? (
            <div className="space-y-3 rounded-2xl border border-dashed border-blue-200 bg-white/80 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Verify your email
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  We sent a 6-digit code to {pendingSignupEmail}.
                </p>
              </div>
              <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                One-time password
              </label>
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      digitRefs.current[i] = el as HTMLInputElement;
                    }}
                    value={otpDigits[i]}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                      setOtpDigits((prev) => {
                        const next = [...prev];
                        next[i] = v;
                        return next;
                      });
                      if (v && i < 5) {
                        digitRefs.current[i + 1]?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                        digitRefs.current[i - 1]?.focus();
                      }
                    }}
                    onPaste={(e) => {
                      const text = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      if (!text) return;
                      const chars = text.split("");
                      setOtpDigits((prev) => {
                        const next = [...prev];
                        for (let j = 0; j < 6; j++) next[j] = chars[j] || "";
                        return next;
                      });
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="h-12 w-12 rounded-md border border-blue-100 bg-slate-50 text-center text-2xl font-mono outline-none focus:border-blue-400"
                  />
                ))}
              </div>
              {resendCooldown > 0 ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="60"
                      strokeDashoffset="0"
                      fill="none"
                    />
                  </svg>
                  <span>{`Resend available in ${resendCooldown}s`}</span>
                </div>
              ) : null}
              <div className="mt-2 flex items-center justify-center gap-3">
                {resendCooldown === 0 ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={
                      resendCooldown > 0 ||
                      isSubmitting ||
                      resendAttempts >= MAX_RESEND_ATTEMPTS
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                      resendCooldown > 0
                        ? "border border-slate-200 bg-white text-slate-600"
                        : "border border-blue-100 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : resendAttempts >= MAX_RESEND_ATTEMPTS
                        ? "Limit reached"
                        : "Resend code"}
                  </button>
                ) : null}
                {resendMessage ? (
                  <p className="text-sm text-emerald-700">{resendMessage}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {!forgotOpen && (mode === "signup" && signupStep === "otp" ? null : (
            <>
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                autoComplete="email"
                className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
              />
            </>
          ))}

          {!forgotOpen && mode === "signup" && signupStep === "details" && formRole === "advisor" ? (
            <label className="mt-1 inline-flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={advisorDeclarationChecked}
                onChange={(event) =>
                  setAdvisorDeclarationChecked(event.target.checked)
                }
                className="mt-0.5 h-4 w-4 accent-blue-600"
              />
              <span>
                Please confirm you are an influencer already and not claiming
                anything fake.
              </span>
            </label>
          ) : null}

          {!forgotOpen ? (
          <button
            disabled={disablePrimarySubmit}
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : signupStep === "details"
                    ? "Create account"
                    : "Verify & Sign in"}
            </button>
          ) : null}

          {!forgotOpen && (mode === "login" || (mode === "signup" && signupStep === "details")) ? (
            <>
              <div className="my-2 flex items-center gap-2 text-xs text-slate-500">
                <span className="h-px flex-1 bg-slate-200" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <button
                type="button"
                onClick={() => handleGoogleSignIn(modeRef.current)}
                disabled={isGoogleSubmitting}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5 shrink-0"
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
                {isGoogleSubmitting
                  ? "Please wait..."
                  : mode === "login"
                    ? "Continue with Google"
                    : "Sign up with Google"}
              </button>
            </>
          ) : null}

          {errorMessage && errorMessage !== ADVISOR_DECLARATION_MESSAGE ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          {showGoogleOnlyGuidance ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">Google login required for this role.</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn("login")}
                  className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                >
                  Continue with Google
                </button>
                <span>{GOOGLE_ONLY_HELP_TEXT}</span>
              </div>
            </div>
          ) : null}

          {!forgotOpen && mode === "login" ? (
            <button
              type="button"
              onClick={() => {
                setForgotOpen(true);
                setForgotStep("request");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="w-full text-sm text-blue-700"
            >
              Forgot password?
            </button>
          ) : null}

          {forgotOpen && mode === "login" ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                Forgot password for <span className="capitalize">{formRole}</span> role
              </p>
              {forgotStep === "request" ? (
                <div className="space-y-2">
                  <input
                    value={forgotPayload.email}
                    onChange={(e) =>
                      setForgotPayload((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Email"
                    type="email"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    disabled={!canSubmitForgotRequest || isSubmitting}
                    onClick={onForgotRequest}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send OTP
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    value={forgotPayload.otp}
                    onChange={(e) =>
                      setForgotPayload((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, "") }))
                    }
                    placeholder="OTP"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
                  />
                  <input
                    value={forgotPayload.newPassword}
                    onChange={(e) =>
                      setForgotPayload((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    placeholder="New password (min 8)"
                    type="password"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
                  />
                  <input
                    value={forgotPayload.confirmPassword}
                    onChange={(e) =>
                      setForgotPayload((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Confirm new password"
                    type="password"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onForgotReset}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reset password
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep("request")}
                    className="text-xs font-semibold text-blue-700 underline"
                  >
                    Start over
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setForgotOpen(false);
                  setForgotStep("request");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="w-full text-sm font-semibold text-blue-700 underline"
              >
                Back to sign in
              </button>
            </div>
          ) : null}

          {isSubmitting || isGoogleSubmitting ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow">
                <svg className="h-5 w-5 animate-spin text-blue-600" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                    fill="none"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-700">Processing...</span>
              </div>
            </div>
          ) : null}
        </motion.form>
      </AnimatePresence>

      <AnimatePresence>
        {googleCompletion.open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={onGoogleCompletionSubmit}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-slate-900">Complete your profile to finish signup</h3>
              <p className="mt-1 text-sm text-slate-600">
                Name is required to complete Google signup. Phone is optional.
              </p>

              <div className="mt-4 space-y-3">
                {googleCompletionFields.map((field) =>
                  field.key === "phone" ? (
                    <div key={field.key} className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">
                        {field.label}
                      </label>
                      <div className="flex items-stretch gap-2">
                        <div className="flex h-11 w-20 overflow-hidden rounded-lg border border-slate-300 bg-white">
                          <div className="flex h-full items-center border-r border-slate-200 bg-slate-50 px-2 text-sm font-semibold text-slate-500">
                            +
                          </div>
                          <input
                            value={googleCompletionForm.countryCode}
                            onChange={(event) =>
                              setGoogleCompletionForm((prev) => ({
                                ...prev,
                                countryCode: event.target.value.replace(/\D/g, ""),
                              }))
                            }
                            inputMode="numeric"
                            aria-label="Country code"
                            placeholder="91"
                            className="h-full w-full bg-transparent px-2 text-center text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>
                        <input
                          value={googleCompletionForm.phone}
                          onChange={(event) =>
                            setGoogleCompletionForm((prev) => ({
                              ...prev,
                              phone: event.target.value.replace(/\D/g, ""),
                            }))
                          }
                          placeholder={field.placeholder}
                          inputMode="numeric"
                          className="h-11 flex-1 rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </div>
                    </div>
                  ) : (
                    <label key={field.key} className="block space-y-1">
                      <span className="text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>
                      <input
                        value={googleCompletionForm.name}
                        onChange={(e) =>
                          setGoogleCompletionForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        required={field.required}
                        type={field.type ?? "text"}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ),
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setGoogleCompletion({
                      open: false,
                      idToken: "",
                      role: formRole,
                    })
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGoogleSubmitting}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGoogleSubmitting ? "Saving..." : "Continue"}
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

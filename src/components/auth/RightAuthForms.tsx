import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginApi,
  registerApi,
  verifyEmailApi,
  reVerifyEmailApi,
} from "../../services/auth.service";

type AuthMode = "login" | "signup";
type FormRole = "user" | "advisor";
type SignupStep = "details" | "otp";

type PendingSignup = {
  email: string;
  password: string;
  role: FormRole;
};

const RightAuthForms = () => {
  const [formRole, setFormRole] = useState<FormRole>("user");
  const [mode, setMode] = useState<AuthMode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("details");

  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(
    null,
  );
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const navigate = useNavigate();
  const pendingSignupEmail = pendingSignup?.email || "your email";
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const digitRefs = useRef<HTMLInputElement[]>([]);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [otpCooldownStarted, setOtpCooldownStarted] = useState(false);
  const MAX_RESEND_ATTEMPTS = 5;

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
    setOtpCooldownStarted(false);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    if (nextMode === "login") {
      resetSignupFlow();
    }
  };

  const switchRole = (nextRole: FormRole) => {
    setFormRole(nextRole);
    resetSignupFlow();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const name = String(formData.get("name") || email.split("@")[0]);
    const password = String(formData.get("password") || "");
    const phone = String(formData.get("phone") || "");
    const fullPhone = phone ? `+${countryCode}${phone}` : "";

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      let authResponse: { accessToken?: string } | null = null;
      if (mode === "signup") {
        if (signupStep === "details") {
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
          setErrorMessage(
            "Your signup session expired. Please register again.",
          );
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
        localStorage.setItem("token", authResponse.accessToken);
        localStorage.setItem("role", formRole);
      }

      formRole === "advisor"
        ? navigate("/a/dashboard")
        : navigate("/u/dashboard");
    } catch (error: unknown) {
      const fallbackMessage =
        mode === "signup"
          ? "Signup failed. Please try again."
          : "Login failed. Please check your credentials.";
      const apiError =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response
          ?.data?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data
              ?.msg
          : "";
      setErrorMessage(apiError || fallbackMessage);
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
      await reVerifyEmailApi(pendingSignup.email);
      setResendMessage("OTP resent to your email again.");
      setResendCooldown(16);
      setResendAttempts((s) => s + 1);
    } catch (error: unknown) {
      const status = (error as any)?.response?.status;
      if (status === 429)
        setErrorMessage("Too many requests. Try again later.");
      else {
        const apiErr =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { msg?: string } } }).response
            ?.data?.msg === "string"
            ? (error as { response?: { data?: { msg?: string } } }).response
                ?.data?.msg
            : "";
        setErrorMessage(apiErr || "Could not resend OTP. Try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // keep a joined OTP string if needed elsewhere by reading otpDigits.join('')

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

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
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

      <div className="mb-5 flex rounded-full bg-slate-100 p-1 border border-blue-500">
        <button
          onClick={() => switchMode("login")}
          type="button"
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            mode === "login"
              ? "bg-blue-700 text-white shadow"
              : "text-slate-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          type="button"
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            mode === "signup"
              ? "bg-blue-700 text-white shadow"
              : "text-slate-600"
          }`}
        >
          Signup
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={`${formRole}-${mode}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
          onSubmit={onSubmit}
          className={`relative space-y-3 rounded-2xl p-4 transition `}
        >
          {formRole === "advisor" && mode === "signup" ? (
            <div className="rounded-xl border font-semibold border-blue-400 bg-white/70 px-2 py-2 text-xs font-large text-blue-800">
              NOTE: Advisor onboarding mode: these details are used for advisor
              profile review.
            </div>
          ) : null}

          {mode === "signup" && signupStep === "details" ? (
            <>
              <input
                name="name"
                required
                placeholder="Full name"
                autoComplete="name"
                className="w-full rounded-xl px-4 py-3 outline-none border border-blue-100 focus:border-blue-400"
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
                    placeholder="Phone number"
                    autoComplete="tel"
                      className="h-12 flex-1 rounded-lg border border-blue-100 px-3 py-3 text-base outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </>
          ) : null}

          {mode === "signup" && signupStep === "otp" ? (
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
                {resendCooldown == 0 ? <button
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
                </button> : null}
                {resendMessage ? (
                  <p className="text-sm text-emerald-700">{resendMessage}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {mode === "signup" && signupStep === "otp" ? null : (
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
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
              />
            </>
          )}

          <button
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : signupStep === "details"
                  ? "Create account"
                  : "Verify & Sign in"}
          </button>
          {errorMessage ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setForgotOpen((value) => !value)}
            className="w-full text-sm text-blue-700"
          >
            Forgot password?
          </button>

          <AnimatePresence>
            {forgotOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800"
              >
                Reset link would be sent to your email in real backend
                integration.
              </motion.div>
            ) : null}
          </AnimatePresence>
          {isSubmitting ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow">
                <svg
                  className="h-5 w-5 animate-spin text-blue-600"
                  viewBox="0 0 24 24"
                >
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
                <span className="text-sm font-medium text-slate-700">
                  Processing...
                </span>
              </div>
            </div>
          ) : null}
        </motion.form>
      </AnimatePresence>
    </section>
  );
};
export default RightAuthForms;

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../../services/auth.service";

type AuthMode = "login" | "signup";
type FormRole = "user" | "advisor";

const RightAuthForms = () => {
  const [formRole, setFormRole] = useState<FormRole>("user");
  const [mode, setMode] = useState<AuthMode>("login");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const name = String(formData.get("name") || email.split("@")[0]);
    const password = String(formData.get("password") || "");
    const phone = String(formData.get("phone") || "");

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      let authResponse: { accessToken?: string } | null = null;
      if (mode === "signup") {
        await registerApi(email, password, name, phone, formRole);
      } else {
        authResponse = await loginApi(email, password, formRole);
      }

      if (authResponse?.accessToken) {
        localStorage.setItem("token", authResponse.accessToken);
        localStorage.setItem("role", formRole);
      }

      formRole === "advisor" ? navigate("/a/dashboard") : navigate("/u/dashboard");
    } catch (error: unknown) {
      const fallbackMessage = mode === "signup" ? "Signup failed. Please try again." : "Login failed. Please check your credentials.";
      const apiError =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "";
      setErrorMessage(apiError || fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Continue as
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => setFormRole("user")}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              formRole === "user"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
            }`}
          >
            Looking for Advisors
          </button>
          <button
            onClick={() => setFormRole("advisor")}
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

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          {formRole === "advisor" ? "Advisor" : "User"} Access
        </h2>
      </div>

      <div className="mb-5 flex rounded-full bg-slate-100 p-1">
          <button
            onClick={() => setMode("login")}
            type="button"
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-blue-700 shadow"
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
                ? "bg-white text-blue-700 shadow"
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
          className={`space-y-3 rounded-2xl p-4 transition ${
            formRole === "advisor"
              ? "border border-cyan-100 bg-cyan-50/40"
              : "border border-blue-100 bg-blue-50/30"
          }`}
        >
          {formRole === "advisor" ? (
            <div className="rounded-xl border border-cyan-200 bg-white/70 px-3 py-2 text-xs font-medium text-cyan-800">
              Advisor onboarding mode: these details are used for advisor
              profile review.
            </div>
          ) : null}

          {mode === "signup" ? (
            <>
              <input
                name="name"
                required
                placeholder="Full name"
                autoComplete="name"
                className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone number (optional)"
                autoComplete="tel"
                className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
              />
            </>
          ) : null}

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
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400"
          />

          {mode === "signup" && formRole === "advisor" ? (
            <>
              <input
                name="country"
                required
                placeholder="Country"
                autoComplete="country-name"
                className="w-full rounded-xl border border-cyan-200 px-4 py-3 outline-none focus:border-cyan-500"
              />
              <input
                name="state"
                required
                placeholder="State"
                autoComplete="address-level1"
                className="w-full rounded-xl border border-cyan-200 px-4 py-3 outline-none focus:border-cyan-500"
              />
              <input
                name="city"
                required
                placeholder="City"
                autoComplete="address-level2"
                className="w-full rounded-xl border border-cyan-200 px-4 py-3 outline-none focus:border-cyan-500"
              />
              <input
                name="specialty"
                required
                placeholder="Specialties (comma separated)"
                className="w-full rounded-xl border border-cyan-200 px-4 py-3 outline-none focus:border-cyan-500"
              />
              <textarea
                name="about"
                rows={3}
                required
                placeholder="Short professional bio"
                className="w-full rounded-xl border border-cyan-200 px-4 py-3 outline-none focus:border-cyan-500"
              />
            </>
          ) : null}

          <button
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
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
        </motion.form>
      </AnimatePresence>
    </section>
  );
};
export default RightAuthForms;

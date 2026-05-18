import { useState } from "react";
import {
  createPasswordApi,
  type AuthRole,
} from "../../services/auth.service";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400";

export function LoginMethodsCard() {
  const [role, setRole] = useState<AuthRole>("user");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const googleLinked = localStorage.getItem("googleLinked") === "true";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      await createPasswordApi({ role, password });
      setSuccess(`Password saved for ${role} role.`);
      setPassword("");
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (err as { response?: { data?: { msg?: string } } }).response?.data
              ?.msg
          : "Could not save password.";
      setError(msg || "Could not save password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Login methods</h2>
      <p className="mt-1 text-sm text-slate-600">
        Google linked: {googleLinked ? "Yes" : "Unknown"}
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AuthRole)}
            className={`${inputClassName} mt-1`}
          >
            <option value="user">User</option>
            <option value="advisor">Advisor</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          New password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className={`${inputClassName} mt-1`}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Create/Update password"}
        </button>

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}
      </form>
    </section>
  );
}

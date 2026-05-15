import { useState } from "react";
import { adminLoginApi } from "../../services/admin/admin.service";
import { inputClassName, statusErrorClassName } from "./adminPage.shared";

export function AdminLoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = await adminLoginApi({ email, password });
      localStorage.setItem("token", payload.accessToken);
      localStorage.setItem("role", payload.role);
      window.location.reload();
    } catch {
      setError("Admin login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/95 p-7 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Control Room</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Admin Login</h2>
      <p className="mt-1 text-sm text-slate-600">Authenticate using /admin/login</p>
      <div className="mt-4 space-y-3">
        <input className={`w-full ${inputClassName}`} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={`w-full ${inputClassName}`} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      <button disabled={loading} className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}

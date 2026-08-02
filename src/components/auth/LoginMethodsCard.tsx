import { FiCheckCircle, FiShield } from "react-icons/fi";

export function LoginMethodsCard() {
  const googleLinked = localStorage.getItem("googleLinked") === "true";
  const role = localStorage.getItem("role") || "user";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <FiShield className="h-4 w-4 text-blue-600" />
        <span>Authentication Method</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Your account uses single sign-on via Google OAuth.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs font-medium text-emerald-900">
        <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold text-emerald-950">Google Login Active ({role})</p>
          <p className="text-emerald-700 font-normal mt-0.5">
            {googleLinked ? "Account is linked with Google." : "Logged in via Google."}
          </p>
        </div>
      </div>
    </section>
  );
}

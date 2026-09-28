import { FiCheckCircle, FiShield } from "react-icons/fi";

export function LoginMethodsCard() {
  const googleLinked = localStorage.getItem("googleLinked") === "true";
  const role = localStorage.getItem("role") || "user";
  const personaName = role === "advisor" ? "Creator" : role === "user" ? "Business" : "Admin";

  return (
    <section className="rounded-[24px] border border-[var(--line)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold font-heading text-[var(--ink)]">
        <FiShield className="h-4 w-4 text-[var(--indigo)]" />
        <span>Authentication Method</span>
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Your account uses single sign-on via Google OAuth.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3.5 text-xs font-semibold text-[var(--indigo)]">
        <FiCheckCircle className="h-5 w-5 text-[var(--indigo)] shrink-0" />
        <div>
          <p className="font-bold text-[var(--ink)]">Google Login Active ({personaName})</p>
          <p className="text-[var(--muted)] font-normal mt-0.5">
            {googleLinked ? "Account is linked with Google." : "Logged in via Google."}
          </p>
        </div>
      </div>
    </section>
  );
}


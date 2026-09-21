import { FiCheckCircle, FiShield } from "react-icons/fi";

export function LoginMethodsCard() {
  const googleLinked = localStorage.getItem("googleLinked") === "true";
  const role = localStorage.getItem("role") || "user";
  const personaName = role === "advisor" ? "Creator" : role === "user" ? "Business" : "Admin";

  return (
    <section className="rounded-[24px] border border-[#E7E1D6] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold font-heading text-[#201A2B]">
        <FiShield className="h-4 w-4 text-[#FF5A36]" />
        <span>Authentication Method</span>
      </div>
      <p className="mt-1 text-xs text-[#7A7286]">
        Your account uses single sign-on via Google OAuth.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#1F9D6B]/30 bg-[#1F9D6B]/10 p-3.5 text-xs font-semibold text-[#1F9D6B]">
        <FiCheckCircle className="h-5 w-5 text-[#1F9D6B] shrink-0" />
        <div>
          <p className="font-bold text-[#1F9D6B]">Google Login Active ({personaName})</p>
          <p className="text-[#1F9D6B]/80 font-normal mt-0.5">
            {googleLinked ? "Account is linked with Google." : "Logged in via Google."}
          </p>
        </div>
      </div>
    </section>
  );
}

import { FiShield, FiZap, FiUsers, FiCheckCircle } from "react-icons/fi";
import { Radio } from "lucide-react";

const LeftInfo = () => {
  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#201A2B] p-7 text-white shadow-xl border border-[#E7E1D6]">
      {/* Decorative gradient overlay & glow shapes */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#6C4BFF]/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#FF5A36]/20 blur-2xl" />

      <div className="relative z-10 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A36] text-white">
              <Radio className="h-3.5 w-3.5" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-[11px] font-bold font-mono-code uppercase tracking-wider text-white/90 backdrop-blur-md">
              <FiShield className="h-3 w-3 text-[#FF5A36]" />
              Secure Auth Portal
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold font-heading tracking-tight text-white sm:text-4xl">
            Welcome to <span className="bg-gradient-to-r from-[#FF5A36] to-[#6C4BFF] bg-clip-text text-transparent">Folksmint</span>
          </h1>
          <p className="mt-2.5 text-sm text-white/80 leading-relaxed">
            The premier marketplace connecting local businesses with nearby creators for real store footfall and viral promotion.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition hover:bg-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A36]/20 text-[#FF5A36]">
              <FiZap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Instant 1-Click Access</h3>
              <p className="mt-0.5 text-xs text-white/70">
                Log in seamlessly with your Google Account for both Businesses and Creators.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition hover:bg-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6C4BFF]/20 text-[#6C4BFF]">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Dual Persona Hub</h3>
              <p className="mt-0.5 text-xs text-white/70">
                Seamlessly toggle between posting business campaigns or applying as a creative partner.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition hover:bg-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F9D6B]/20 text-[#1F9D6B]">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Hyperlocal PIN Matching</h3>
              <p className="mt-0.5 text-xs text-white/70">
                Matches are calculated based on your 6-digit PIN code without intrusive location tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeftInfo;
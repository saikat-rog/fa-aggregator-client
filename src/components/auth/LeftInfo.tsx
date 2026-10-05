import { FiShield, FiZap, FiUsers, FiMapPin } from "react-icons/fi";

const LeftInfo = () => {
  return (
    <div className="bg-[var(--card)] p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[var(--line)] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <img
            src="/favicon.svg"
            alt="Folksmint"
            className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
            width={32}
            height={32}
          />
          <span className="font-heading font-bold text-base text-[var(--ink)]">Folksmint</span>
        </div>

        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold font-heading text-[var(--ink)] leading-snug">
          Grow your local brand or creator career.
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          The all-in-one platform connecting nearby shops, local businesses, and verified creators for real footfall and campaigns.
        </p>

        {/* Feature Cards Grid */}
        <div className="mt-6 space-y-3.5">
          <div className="flex items-start gap-3.5 rounded-xl border border-[var(--line)] bg-white p-4 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--indigo)] font-bold">
              <FiZap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-heading text-[var(--ink)]">1-Click Google Sign-In</h3>
              <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">
                Log in instantly with your Google Account — no password needed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-[var(--line)] bg-white p-4 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--indigo)] font-bold">
              <FiUsers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-heading text-[var(--ink)]">Dual Persona Hub</h3>
              <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">
                Switch seamlessly between posting business briefs or managing your creator store.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-[var(--line)] bg-white p-4 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--indigo)] font-bold">
              <FiMapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-heading text-[var(--ink)]">Hyperlocal PIN Matching</h3>
              <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">
                Discover creators and campaigns matched by your 6-digit PIN code.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1.5 font-medium">
          <FiShield className="text-[var(--indigo)] h-3.5 w-3.5" /> Secure Google OAuth 2.0
        </span>
        <span>Folksmint &copy; 2026</span>
      </div>
    </div>
  );
};

export default LeftInfo;
import { FiShield, FiZap, FiUsers, FiCheckCircle } from "react-icons/fi";

const LeftInfo = () => {
  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 p-7 text-white shadow-2xl shadow-blue-900/30">
      {/* Decorative gradient overlay & glow shapes */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-2xl" />

      <div className="relative z-10 space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-200 backdrop-blur-md">
            <FiShield className="h-3.5 w-3.5 text-cyan-400" />
            Secure Authentication Portal
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome to <span className="bg-linear-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">Folksmint</span>
          </h1>
          <p className="mt-2.5 text-base text-blue-100/90 leading-relaxed">
            The premier platform connecting individuals with verified financial advisors. One-click, hassle-free Google login.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md transition hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300">
              <FiZap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Instant 1-Click Access</h3>
              <p className="mt-0.5 text-xs text-blue-100/80">
                Log in seamlessly with your Google Account for both Users and Advisors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md transition hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/20 text-blue-300">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Dual Role Hub</h3>
              <p className="mt-0.5 text-xs text-blue-100/80">
                Select your persona to access customized user discovery or advisor management tools.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md transition hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Verified & Privacy First</h3>
              <p className="mt-0.5 text-xs text-blue-100/80">
                Strict data compliance. Your data remains encrypted and safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeftInfo;
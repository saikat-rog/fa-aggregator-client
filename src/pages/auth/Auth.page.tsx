import LeftInfo from '../../components/auth/LeftInfo'
import RightAuthForms from '../../components/auth/RightAuthForms'

export function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-8 sm:py-12">
      {/* Background ambient decorative glows */}
      <div className="pointer-events-none absolute -top-12 left-1/4 h-72 w-72 rounded-full bg-[#2563EB]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 right-1/4 h-72 w-72 rounded-full bg-[#1D4ED8]/5 blur-3xl" />

      <div className="relative w-full max-w-[940px] overflow-hidden rounded-[24px] border border-[var(--line)] bg-white shadow-xl grid lg:grid-cols-[0.95fr_1.05fr]">
        <LeftInfo />
        <RightAuthForms />
      </div>
    </div>
  )
}





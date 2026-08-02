import LeftInfo from '../../components/auth/LeftInfo'
import RightAuthForms from '../../components/auth/RightAuthForms'

export function AuthPage() {
  return (
    <div className="relative mx-auto my-4 max-w-5xl px-2 py-4 sm:px-4">
      {/* Background ambient decorative glows */}
      <div className="pointer-events-none absolute -top-12 left-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 right-1/4 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        <LeftInfo />
        <RightAuthForms />
      </div>
    </div>
  )
}


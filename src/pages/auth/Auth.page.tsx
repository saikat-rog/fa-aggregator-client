import LeftInfo from '../../components/auth/LeftInfo'
import RightAuthForms from '../../components/auth/RightAuthForms'

export function AuthPage() {

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
      <LeftInfo />
      <RightAuthForms />
    </div>
  )
}

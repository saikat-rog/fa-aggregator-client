import { Navigate } from 'react-router-dom'
import type { Role } from '../../types'

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    return children
  }

  const hasToken = Boolean(localStorage.getItem('token'))
  const role = localStorage.getItem('role') as Role | null

  if (!hasToken) {
    return children
  }

  if (role === 'advisor') {
    return <Navigate to="/a/dashboard" replace />
  }

  if (role === 'admin') {
    return <Navigate to="/lol" replace />
  }

  return <Navigate to="/u/dashboard" replace />
}

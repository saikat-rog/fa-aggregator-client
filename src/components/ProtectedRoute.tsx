import { Navigate } from 'react-router-dom'
import type { Role } from '../types'

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Role[] }) {
  const isAuthenticated = Boolean(localStorage.getItem('token'))
  const authRole = localStorage.getItem('role')
  const role = authRole as Role | null

  if (!isAuthenticated || !role) {
    return <Navigate to="/auth" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'advisor') {
      return <Navigate to="/fa" replace />
    }

    if (role === 'admin') {
      return <Navigate to="/lol" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { logoutApi } from '../services/auth.service'

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')))
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'))

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem('token')))
      setRole(localStorage.getItem('role'))
    }

    window.addEventListener('storage', syncAuthState)
    window.addEventListener('focus', syncAuthState)

    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener('focus', syncAuthState)
    }
  }, [])

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('token')))
    setRole(localStorage.getItem('role'))
  }, [location.pathname])

  const links = [
    { to: '/', label: 'Home' },
    ...(isAuthenticated
      ? role === 'advisor'
        ? [{ to: '/a/dashboard', label: 'Dashboard' }]
        : role === 'user'
          ? [{ to: '/u/dashboard', label: 'Dashboard' }]
          : []
      : []),
      { to: '/blogs', label: 'Blogs' },
  ]

  const handleLogout = async () => {
    try {
      await logoutApi()
    } catch {
      // Even if API fails, clear local auth state on client.
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      setIsAuthenticated(false)
      setRole(null)
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e8f2ff_0,#f8fbff_50%,#ffffff_100%)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/u" className="text-xl font-bold tracking-tight text-blue-700">
            Invest24
          </Link>
          <nav className="flex items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

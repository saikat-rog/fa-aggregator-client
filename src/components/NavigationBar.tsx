import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { logoutApi } from '../services/auth.service'
import { MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, NavBody, Navbar } from './ui/resizable-navbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')))
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'))
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    setIsMobileMenuOpen(false)
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
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact Us' },
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
      setIsMobileMenuOpen(false)
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-linear(circle_at_top,#e8f2ff_0,#f8fbff_50%,#ffffff_100%)] text-slate-900">
      <Navbar className="px-4">
        <NavBody>
          <Link to="/u" className="shrink-0 text-xl font-bold tracking-tight text-blue-700">
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
                className="rounded-full bg-red-700 px-8 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
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
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <Link to="/u" className="shrink-0 text-lg font-bold tracking-tight text-blue-700">
              Invest24
            </Link>
            <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen((prev) => !prev)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen}>
            <nav className="flex w-full flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-200'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="w-full border-t border-blue-100 pt-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:from-blue-700 hover:to-blue-600"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main className="mx-auto max-w-6xl px-4 py-8 pt-10 lg:pt-28">{children}</main>
    </div>
  )
}

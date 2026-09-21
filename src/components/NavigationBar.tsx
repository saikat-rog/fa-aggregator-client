import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { Radio, Menu, X, ArrowUp } from "lucide-react";
import { logoutApi } from "../services/auth.service";

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("token")));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("token")));
    setRole(localStorage.getItem("role"));
    setIsMobileMenuOpen(false);
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/creators", label: "Browse Creators" },
    { to: "/store", label: "Store" },
    { to: "/campaign", label: "Campaign" },
    { to: "/blogs", label: "Blogs" },
    { to: "/pricing", label: "Pricing" },
    ...(isAuthenticated
      ? role === "advisor"
        ? [
            { to: "/a/dashboard", label: "Dashboard" },
            { to: "/store/apply", label: "Apply for Store" },
          ]
        : role === "user"
        ? [
            { to: "/u/dashboard", label: "Dashboard" },
            { to: "/campaign/apply", label: "Post a Campaign" },
          ]
        : role === "admin"
        ? [{ to: "/admin", label: "Admin" }]
        : []
      : []),
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Even if API fails, clear local auth state on client.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsAuthenticated(false);
      setRole(null);
      setIsMobileMenuOpen(false);
      navigate("/auth");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#201A2B] font-sans flex flex-col justify-between">
      {/* Top Announcement Bar */}
      <div className="bg-[#201A2B] text-white py-2 px-4 text-center font-heading text-xs font-semibold tracking-wide">
        Real customers for businesses, real income for creators — free to join, one click to start.
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E1D6]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="brand-mark shadow-sm">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div className="font-heading font-extrabold text-xl tracking-tight text-[#201A2B]">
              Folksmint
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `font-heading text-sm font-semibold transition ${
                    isActive ? "text-[#6C4BFF]" : "text-[#7A7286] hover:text-[#201A2B]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={role === "advisor" ? "/a/dashboard" : role === "user" ? "/u/dashboard" : "/admin"}
                  className="btn-ghost text-xs px-3.5 py-1.5 rounded-full"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-[#D6431E] bg-[#FFEAE3] hover:bg-[#FFD7CD] px-3.5 py-1.5 rounded-full transition"
                >
                  <FiLogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?role=advisor"
                  className="btn-violet text-xs px-4 py-2 rounded-full shadow-xs"
                >
                  I'm a creator
                </Link>
                <Link
                  to="/auth?role=user"
                  className="btn-coral text-xs px-4 py-2 rounded-full shadow-xs"
                >
                  I run a business
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-[#E7E1D6] text-[#201A2B]"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-[#E7E1D6] bg-white px-4 py-3 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block font-heading text-sm font-semibold py-2 px-3 rounded-lg transition ${
                    isActive
                      ? "bg-[#F1ECFF] text-[#6C4BFF]"
                      : "text-[#201A2B] hover:bg-[#F0ECE4]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-[#E7E1D6] flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 font-heading text-sm font-bold text-[#D6431E] bg-[#FFEAE3] py-2 rounded-xl"
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/auth?role=advisor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-violet text-center text-xs py-2.5 rounded-xl font-bold"
                  >
                    I'm a creator
                  </Link>
                  <Link
                    to="/auth?role=user"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-coral text-center text-xs py-2.5 rounded-xl font-bold"
                  >
                    I run a business
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">{children}</main>

      {/* Mohalla Footer */}
      <footer className="border-t border-[#E7E1D6] bg-[#FAF8F5] pt-12 pb-8 text-center text-xs text-[#7A7286]">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2.5">
            <div className="brand-mark h-7 w-7 rounded-lg">
              <Radio className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-[#201A2B]">Folksmint</span>
          </div>
          <p className="max-w-md mx-auto text-xs leading-relaxed">
            Where your neighborhood does business. Connect with trusted creators and growing local brands.
          </p>

          <div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 font-medium text-xs text-[#7A7286] hover:text-[#6C4BFF] transition cursor-pointer"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-2 font-medium">
            <Link to="/pricing" className="hover:text-[#201A2B]">Pricing</Link>
            <span aria-hidden="true">·</span>
            <Link to="/stories" className="hover:text-[#201A2B]">Success stories</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[#201A2B]">Terms & Conditions</Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacy" className="hover:text-[#201A2B]">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/how-we-make-money" className="hover:text-[#201A2B]">How we make money</Link>
          </div>

          <div className="pt-2">
            <Link to="/admin" className="text-[11px] text-[#A79FB0] hover:text-[#7A7286] underline">
              Admin panel
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

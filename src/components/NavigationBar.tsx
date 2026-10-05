import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
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
    { to: "/#business", label: "For Business" },
    { to: "/#creators", label: "For Creators" },
    { to: "/creators", label: "Browse Creators" },
    { to: "/store", label: "Biolinks Store" },
    { to: "/campaign", label: "Campaigns" },
    { to: "/blogs", label: "Blog" },
    ...(isAuthenticated
      ? role === "advisor"
        ? [
            { to: "/store/apply", label: "Apply for Store" },
          ]
        : role === "user"
        ? [
            { to: "/campaign/apply", label: "Post a Campaign" },
          ]
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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans flex flex-col justify-between">
      {/* Header */}
      <header>
        <nav className="nav">
          {/* Logo */}
          <Link to="/" className="logo">
            <img
              src="/favicon.svg"
              alt="Folksmint"
              className="w-[34px] h-[34px] rounded-[10px] object-contain flex-shrink-0"
              width={34}
              height={34}
            />
            Folksmint
          </Link>

          {/* Desktop Navigation Links */}
          <div className={`navlinks ${isMobileMenuOpen ? "open" : ""}`} id="navLinks">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (link.to === "/" && location.pathname === "/" && !location.hash) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={({ isActive }) => {
                  if (link.to.includes("#")) {
                    const hash = link.to.substring(link.to.indexOf("#"));
                    return location.hash === hash ? "active" : "";
                  }
                  if (link.to === "/") {
                    return location.pathname === "/" && !location.hash ? "active" : "";
                  }
                  return isActive ? "active" : "";
                }}
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to={role === "advisor" ? "/a/dashboard" : role === "user" ? "/u/dashboard" : "/admin"}
                  className="navcta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="navcta"
                  style={{ background: "#e11d48", border: "none", cursor: "pointer", marginTop: "10px" }}
                >
                  <FiLogOut style={{ marginRight: "6px" }} /> Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="navcta" onClick={() => setIsMobileMenuOpen(false)}>
                Get started
              </Link>
            )}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-2" id="navCtaDesktop">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={role === "advisor" ? "/a/dashboard" : role === "user" ? "/u/dashboard" : "/admin"}
                  className="navcta"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 font-semibold text-[0.85rem] text-rose-100 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-400/20 px-3.5 py-1.5 rounded-[30px] transition cursor-pointer"
                >
                  <FiLogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="navcta">
                Get started
              </Link>
            )}
          </div>

          {/* Mobile Menu Burger */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="burger"
            id="navBurger"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </nav>
        <div
          className={`nav-scrim ${isMobileMenuOpen ? "open" : ""}`}
          id="navScrim"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </header>

      {/* Main Content */}
      <main className="w-full flex-1">{children}</main>

      {/* Folksmint Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            {/* Brand details */}
            <div className="foot-brand">
              <div className="logo" style={{ color: "var(--ink)" }}>
                <img
                  src="/favicon.svg"
                  alt="Folksmint"
                  className="w-[34px] h-[34px] rounded-[10px] object-contain flex-shrink-0"
                  width={34}
                  height={34}
                />
                Folksmint
              </div>
              <p style={{ marginTop: "12px", maxWidth: "32ch" }}>
                Local business tools and creator commerce, one login.
              </p>

              {/* Social links */}
              <div className="social-row">
                <a
                  className="ic-facebook"
                  href="https://facebook.com/folksmint"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                  </svg>
                </a>
                <a
                  className="ic-instagram"
                  href="https://instagram.com/folksmint"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.11 1.15 1.76.25.64.42 1.37.47 2.43C22 8.94 22 9.28 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.21-1.15 1.76-.55.55-1.11.9-1.76 1.15-.64.25-1.37.42-2.43.47C15.06 22 14.72 22 12 22s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.21-.6-1.76-1.15-.55-.55-.9-1.11-1.15-1.76-.25-.64-.42-1.37-.47-2.43C2 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76.55-.55 1.11-.9 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.36-1.02.67-.31.31-.51.6-.67 1.02-.12.31-.26.78-.3 1.65C4.27 8.75 4.26 9.07 4.26 12s.01 3.25.06 4.3c.04.87.18 1.34.3 1.65.16.42.36.71.67 1.02.31.31.6.51 1.02.67.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.36 1.02-.67.31-.31.51-.6.67-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.3s-.01-3.25-.06-4.3c-.04-.87-.18-1.34-.3-1.65-.16-.42-.36-.71-.67-1.02-.31-.31-.6-.51-1.02-.67-.31-.12-.78-.26-1.65-.3C14.99 3.81 14.67 3.8 12 3.8zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7zm5.35-1.99a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                  </svg>
                </a>
                <a
                  className="ic-x"
                  href="https://x.com/folksmint"
                  aria-label="X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M18.24 2.5h3.3l-7.2 8.23L22.8 21.5h-6.62l-5.18-6.78-5.93 6.78H1.77l7.7-8.8L1.2 2.5h6.79l4.68 6.2 5.57-6.2zm-1.16 17.02h1.83L7.02 4.38H5.06l12.02 15.14z" />
                  </svg>
                </a>
                <a
                  className="ic-youtube"
                  href="https://youtube.com/@folksmint"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                  </svg>
                </a>
                <a
                  className="ic-tiktok"
                  href="https://tiktok.com/@folksmint"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.06-2.78v-3.3a6.1 6.1 0 1 0 5.26 6.04V8.2a7.1 7.1 0 0 0 4.4 1.5V6.5a3.9 3.9 0 0 1-4.4-4.2V2z" />
                  </svg>
                </a>
                <a
                  className="ic-linkedin"
                  href="https://linkedin.com/company/folksmint"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Grid */}
            <div className="foot-links">
              <Link to="/#business">For Business</Link>
              <Link to="/#creators">For Creators</Link>
              <Link to="/creators">Browse Creators</Link>
              <Link to="/store">Biolinks Store</Link>
              <Link to="/campaign">Campaigns</Link>
              <Link to="/auth">Sign In</Link>
              <Link to="/blogs">Blog</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms and Conditions</Link>
              <Link to="/stories">Success Stories</Link>
              <Link to="/admin">Admin</Link>
            </div>
          </div>

          <div className="foot-bottom">
            © 2026 Folksmint
          </div>
        </div>
      </footer>
    </div>
  );
}



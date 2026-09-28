import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeSeo } from "./Home.seo";
import type { HomePageProps } from "./Home.types";
export type { AdvisorApiItem } from "./Home.types";

const FAQ = [
  {
    q: "Is Folksmint free to use?",
    a: "Yes — creating an account and browsing campaigns or creators is free. Business and Creator plans unlock deeper tools like verified-click tracking, the biolink store, and campaign management, and both come with a 14-day free trial.",
  },
  {
    q: "Why isn't my campaign or profile showing up yet?",
    a: "New campaigns and profiles go through a quick review before they go live, usually within a few hours. If it's been longer than a day, check your dashboard for any flagged details that need fixing.",
  },
  {
    q: "Does my pincode limit what I can see?",
    a: "No — you can browse every campaign and creator on Folksmint regardless of location. Your pincode just helps us surface local collaborations first, since those tend to convert best.",
  },
  {
    q: "What happens after I accept an applicant?",
    a: "You'll get their contact details and campaign brief unlocks in your dashboard. Payment stays with Folksmint until the deliverable is marked complete, so both sides are protected.",
  },
  {
    q: "Can I use Folksmint on both sides?",
    a: "Yes — plenty of local business owners are also creators. You can run a Business plan and a Creator plan on the same account.",
  },
];

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="newsletter-box">
      <div className="nl-icon">📣</div>
      <h3>Get new campaigns & creator drops in your inbox</h3>
      <p>Curated updates with the highest-converting local collaborations. No spam.</p>

      {subscribed ? (
        <p style={{ color: "var(--indigo)", fontWeight: 700 }}>✓ Subscribed!</p>
      ) : (
        <form onSubmit={handleSubscribe} id="nlForm" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="nl-input"
          />
          <button type="submit" className="pill-btn pill-navy" style={{ width: "100%", textAlign: "center" }}>
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export function HomePage(_props: HomePageProps = {}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <div className="w-full" id="page-home">
      <HomeSeo />

      {/* Hero Section */}
      <section className="hero">
        <div className="wrap">
          <div className="bag">💰</div>
          <h1>A Simpler Solution</h1>
          <p className="lead">
            No more paying for 6+ different apps to run your business or your creator career. Folksmint brings it all home — for shopkeepers and creators alike.
          </p>
          <div className="hero-actions">
            <a href="#business" className="pill-btn pill-navy">
              I run a business
            </a>
            <a href="#creators" className="pill-btn pill-outline">
              I'm a creator
            </a>
          </div>
        </div>
      </section>

      {/* For Business Section */}
      <section id="business">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">For local business</div>
            <h2>Everything AI marketing does</h2>
            <p>One dashboard replaces your SEO tool, your social media manager, and your review-reply habit.</p>
          </div>

          <div className="stack-wrap stack-wrap-single">
            <div className="stack-card">
              <div className="stack-title">📈 Visibility & audits</div>
              <div className="stack-row">
                <span className="emo">🔍</span>
                <div>
                  <div className="t">Free Google Score Audit</div>
                  <div className="r">Full audit of your online performance</div>
                </div>
                <span className="price">$25</span>
              </div>
              <div className="stack-row">
                <span className="emo">🔑</span>
                <div>
                  <div className="t">SEO Keyword Analysis</div>
                  <div className="r">Targeted keywords to boost search traffic</div>
                </div>
                <span className="price">$20</span>
              </div>
              <div className="stack-row">
                <span className="emo">🎯</span>
                <div>
                  <div className="t">Competitor Analysis</div>
                  <div className="r">See what's working for others nearby</div>
                </div>
                <span className="price">$20</span>
              </div>

              <div className="stack-title">💬 Reputation & content</div>
              <div className="stack-row">
                <span className="emo">✍️</span>
                <div>
                  <div className="t">Personalized Google Review Replies</div>
                  <div className="r">On-brand replies drafted automatically</div>
                </div>
                <span className="price">$15</span>
              </div>
              <div className="stack-row">
                <span className="emo">🖼️</span>
                <div>
                  <div className="t">Weekly Image Updates for Google</div>
                  <div className="r">Keeps your profile fresh and current</div>
                </div>
                <span className="price">$15</span>
              </div>
              <div className="stack-row">
                <span className="emo">📲</span>
                <div>
                  <div className="t">AI Social Posting</div>
                  <div className="r">Captions + images, posted to FB & IG together</div>
                </div>
                <span className="price">$29</span>
              </div>
              <div className="stack-row">
                <span className="emo">📊</span>
                <div>
                  <div className="t">Daily Reports on WhatsApp</div>
                  <div className="r">Your numbers, delivered where you already are</div>
                </div>
                <span className="price">$10</span>
              </div>

              <div className="stack-total">
                <span className="emo">✕</span>
                <span className="t">What you'd spend otherwise</span>
                <span className="price">$134/mo</span>
              </div>
              <div className="stack-join">
                <span className="emo">🪙</span>
                <span className="t">Join Folksmint Business</span>
                <span className="price">$19/mo</span>
              </div>
              <div className="trial-note">✨ 14-day free trial, cancel anytime</div>
              <Link to="/auth?role=user" className="pill-btn pill-navy plan-cta">
                Start My Free Trial →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section id="creators">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">For Creators</div>
            <h2>Everything your creator business needs</h2>
            <p>One dashboard replaces your storefront, booking tool, course platform, and audience growth stack.</p>
          </div>

          <div className="stack-wrap stack-wrap-single">
            <div className="stack-card">
              <div className="stack-title">🛍️ Storefront & sales</div>
              <div className="stack-row">
                <span className="emo">📱</span>
                <div>
                  <div className="t">Mobile "Link-in-Bio" Store</div>
                  <div className="r">Replaces Squarespace, Linktree</div>
                </div>
                <span className="price">$29</span>
              </div>
              <div className="stack-row">
                <span className="emo">📅</span>
                <div>
                  <div className="t">Calendar Invites & Bookings</div>
                  <div className="r">Replaces Calendly, Acuity</div>
                </div>
                <span className="price">$15</span>
              </div>
              <div className="stack-row">
                <span className="emo">🎓</span>
                <div>
                  <div className="t">Course Builder</div>
                  <div className="r">Replaces Kajabi</div>
                </div>
                <span className="price">$119</span>
              </div>

              <div className="stack-title">📣 Growth & community</div>
              <div className="stack-row">
                <span className="emo">📈</span>
                <div>
                  <div className="t">Audience Analytics</div>
                  <div className="r">Replaces Google Analytics</div>
                </div>
                <span className="price">$10</span>
              </div>
              <div className="stack-row">
                <span className="emo">✈️</span>
                <div>
                  <div className="t">Instagram AutoDMs</div>
                  <div className="r">Replaces Manychat</div>
                </div>
                <span className="price">$15</span>
              </div>
              <div className="stack-row">
                <span className="emo">✉️</span>
                <div>
                  <div className="t">Email List / Newsletter Builder</div>
                  <div className="r">Own your audience, not just your followers</div>
                </div>
                <span className="price">$29</span>
              </div>
              <div className="stack-row">
                <span className="emo">🔒</span>
                <div>
                  <div className="t">Exclusive Creator Community</div>
                  <div className="r">Access to fellow creators & swipe files</div>
                </div>
                <span className="price">$97</span>
              </div>
              <div className="stack-row">
                <span className="emo">🛠️</span>
                <div>
                  <div className="t">1:1 Creator Strategy Coaching</div>
                  <div className="r">Personal guidance on growing your store</div>
                </div>
                <span className="price">$99</span>
              </div>

              <div className="stack-total">
                <span className="emo">✕</span>
                <span className="t">What you'd spend otherwise</span>
                <span className="price">$413/mo</span>
              </div>
              <div className="stack-join">
                <span className="emo">🪙</span>
                <span className="t">Join Folksmint Creator</span>
                <span className="price">$29/mo</span>
              </div>
              <div className="trial-note">✨ 14-day free trial, cancel anytime</div>
              <Link to="/auth?role=advisor" className="pill-btn pill-navy plan-cta">
                Start My Free Trial →
              </Link>
            </div>
          </div>

          {/* Plus Campaigns Banner */}
          <div className="camp-banner">
            <h3>Plus: Campaigns, included for everyone</h3>
            <p>
              Businesses post paid local gigs. Creators apply and get booked. No separate influencer agency, no cold DMs — it's built into the same account.
            </p>
            <Link
              to="/campaign"
              className="pill-btn"
            >
              See open campaigns
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Rows */}
      <section className="features-section">
        <div className="wrap">
          <div className="feature-row">
            <div className="feature-icon">
              <svg viewBox="0 0 140 140" width="100" height="100">
                <rect x="18" y="60" width="104" height="52" rx="4" fill="#fff" />
                <rect x="18" y="60" width="104" height="52" rx="4" fill="none" stroke="var(--line)" />
                <path d="M20 60l6-24h88l6 24z" fill="#2563EB" />
                <path d="M20 60l6-24h20l-4 24z" fill="#1D4ED8" />
                <path d="M90 60l-4-24h20l6 24z" fill="#1D4ED8" />
                <rect x="30" y="72" width="26" height="26" rx="2" fill="#DCE8FF" />
                <rect x="84" y="72" width="26" height="26" rx="2" fill="#DCE8FF" />
                <rect x="60" y="80" width="20" height="32" rx="2" fill="#1D4ED8" />
                <circle cx="76" cy="96" r="1.6" fill="#fff" />
              </svg>
            </div>
            <div className="feature-text">
              <h3>No Coding Required</h3>
              <p>
                Folksmint is the simplest way to get started. Set up your storefront, campaigns, and marketing tools in a few minutes — no developer needed.
              </p>
            </div>
          </div>

          <div className="feature-row reverse">
            <div className="feature-icon">
              <svg viewBox="0 0 140 140" width="100" height="100">
                <rect x="24" y="76" width="92" height="34" rx="6" fill="#DCE8FF" />
                <rect x="24" y="76" width="92" height="34" rx="6" fill="none" stroke="var(--line)" />
                <rect x="40" y="46" width="60" height="40" rx="6" fill="#fff" stroke="var(--line)" />
                <rect x="46" y="52" width="48" height="22" rx="2" fill="#1D4ED8" />
                <circle cx="52" cy="80" r="3" fill="#2563EB" />
                <circle cx="62" cy="80" r="3" fill="#2563EB" />
                <circle cx="72" cy="80" r="3" fill="#2563EB" />
                <path d="M84 30l12 8-12 8z" fill="#FBBF24" />
                <path d="M96 38h14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="feature-text">
              <h3>1-Tap Checkout</h3>
              <p>
                Your customers and clients shouldn't have to jump through hoops to pay. Folksmint's checkout is built to convert.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-icon">
              <svg viewBox="0 0 140 140" width="100" height="100">
                <rect x="48" y="24" width="44" height="92" rx="10" fill="#fff" stroke="var(--line)" />
                <rect x="53" y="32" width="34" height="66" rx="3" fill="#DCE8FF" />
                <circle cx="70" cy="106" r="4" fill="#1D4ED8" />
                <circle cx="30" cy="46" r="14" fill="#2563EB" />
                <text x="30" y="51" fontSize="13" textAnchor="middle" fill="#fff" fontFamily="sans-serif">📅</text>
                <circle cx="110" cy="46" r="14" fill="#FBBF24" />
                <text x="110" y="51" fontSize="13" textAnchor="middle" fill="#fff" fontFamily="sans-serif">✉️</text>
                <circle cx="30" cy="90" r="14" fill="#22C55E" />
                <text x="30" y="95" fontSize="13" textAnchor="middle" fill="#fff" fontFamily="sans-serif">💳</text>
              </svg>
            </div>
            <div className="feature-text">
              <h3>Integrates With Your Favorite Apps</h3>
              <p>
                Folksmint connects with the tools you already use — social, calendar, payments, and email — so nothing breaks when you switch over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background: "var(--card)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Testimonials</div>
            <h2>What people are saying</h2>
          </div>

          <div className="testi-grid">
            <div className="testi-card">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iY3NreSIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZFOEM5Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZEMTk5Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNjc2t5KSIvPgogIDxyZWN0IHg9IjAiIHk9IjE1MCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNEOUMzQTMiLz4KICA8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIzNjAiIGhlaWdodD0iMTAwIiBmaWxsPSIjN0M0QTJEIi8+CiAgPHJlY3QgeD0iMzAiIHk9IjcwIiB3aWR0aD0iOTAiIGhlaWdodD0iNzAiIGZpbGw9IiMzQjI0MTciLz4KICA8cmVjdCB4PSIxNDAiIHk9IjcwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjM0IyNDE3Ii8+CiAgPHJlY3QgeD0iMjgwIiB5PSI3MCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjM0IyNDE3Ii8+CiAgPHJlY3QgeD0iMCIgeT0iMTUwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE0IiBmaWxsPSIjNUIzQTIyIi8+CiAgPHJlY3QgeD0iNjAiIHk9IjE2NCIgd2lkdGg9IjI4MCIgaGVpZ2h0PSI3MCIgcng9IjQiIGZpbGw9IiNBOTc0NEMiLz4KICA8cmVjdCB4PSI2MCIgeT0iMTY0IiB3aWR0aD0iMjgwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjOEM1QjM3Ii8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTkwIiByPSIxMiIgZmlsbD0iI2ZmZiIvPgogIDxyZWN0IHg9Ijk0IiB5PSIxODYiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxNCIgcng9IjIiIGZpbGw9IiM0QTJFMUEiLz4KICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxOTIiIHI9IjEwIiBmaWxsPSIjZmZmIi8+CiAgPHJlY3QgeD0iMTQ0IiB5PSIxODgiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IiM0QTJFMUEiLz4KICA8ZWxsaXBzZSBjeD0iMjIwIiBjeT0iMjAwIiByeD0iMjAiIHJ5PSI4IiBmaWxsPSIjRThCOThBIi8+CiAgPGVsbGlwc2UgY3g9IjIyMCIgY3k9IjE5NiIgcng9IjIwIiByeT0iOCIgZmlsbD0iI0Y0RDNBOCIvPgogIDxlbGxpcHNlIGN4PSIyNzAiIGN5PSIyMDAiIHJ4PSIxOCIgcnk9IjciIGZpbGw9IiNFOEI5OEEiLz4KICA8ZWxsaXBzZSBjeD0iMjcwIiBjeT0iMTk2IiByeD0iMTgiIHJ5PSI3IiBmaWxsPSIjRjREM0E4Ii8+CiAgPHJlY3QgeD0iMCIgeT0iMjM0IiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjY2IiBmaWxsPSIjNUIzQTIyIi8+Cjwvc3ZnPgo="
                alt="Meera R.'s cafe"
              />
              <div className="testi-scrim" />
              <div className="testi-text">
                <p>"We filled a 6-creator campaign in under a week — Folksmint handled the applications so we didn't have to chase anyone."</p>
                <div className="testi-who">Meera R.</div>
                <div className="testi-role">Café Owner</div>
              </div>
            </div>

            <div className="testi-card">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ2JnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNEREVGRTMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNCOURFQzYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2diZykiLz4KICA8cmVjdCB4PSIwIiB5PSIyMTAiIHdpZHRoPSI0MDAiIGhlaWdodD0iOTAiIGZpbGw9IiM4RkFGOUEiLz4KICA8cmVjdCB4PSIwIiB5PSIyMDAiIHdpZHRoPSI0MDAiIGhlaWdodD0iMTIiIGZpbGw9IiM2RTkwODAiLz4KICA8cmVjdCB4PSIzMCIgeT0iNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTIwIiByeD0iNiIgZmlsbD0iIzJFNEEzRSIvPgogIDxyZWN0IHg9IjI3MCIgeT0iNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTIwIiByeD0iNiIgZmlsbD0iIzJFNEEzRSIvPgogIDxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiByeD0iNiIgZmlsbD0iIzFENEVEOCIvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjExNSIgcj0iMTgiIGZpbGw9IiMxRDRFRDgiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIxMTUiIHI9IjE4IiBmaWxsPSIjMUQ0RUQ4Ii8+CiAgPHJlY3QgeD0iODAiIHk9IjIyMCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxNCIgcng9IjciIGZpbGw9IiMyNTYzRUIiLz4KICA8cmVjdCB4PSIxNDAiIHk9IjE1MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiMwRjIxM0YiLz4KICA8Y2lyY2xlIGN4PSIxNDAiIGN5PSIxNTUiIHI9IjE2IiBmaWxsPSIjMEYyMTNGIi8+CiAgPGNpcmNsZSBjeD0iMjYwIiBjeT0iMTU1IiByPSIxNiIgZmlsbD0iIzBGMjEzRiIvPgo8L3N2Zz4K"
                alt="Rohan M.'s gym"
              />
              <div className="testi-scrim" />
              <div className="testi-text">
                <p>"My biolink store finally looks like it belongs to a real business, not a link dump. Bookings went up almost immediately."</p>
                <div className="testi-who">Rohan M.</div>
                <div className="testi-role">Fitness Creator</div>
              </div>
            </div>

            <div className="testi-card">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icmJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFNEU5RkIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNDOUQ0RjciLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3JiZykiLz4KICA8cmVjdCB4PSIwIiB5PSIyMzAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNzAiIGZpbGw9IiNCNEMwRTgiLz4KICA8cmVjdCB4PSIzMCIgeT0iNTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiM1QjZCODUiLz4KICA8cmVjdCB4PSIzNjAiIHk9IjUwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTgwIiBmaWxsPSIjNUI2Qjg1Ii8+CiAgPHJlY3QgeD0iMzAiIHk9IjU1IiB3aWR0aD0iMzQwIiBoZWlnaHQ9IjgiIGZpbGw9IiM1QjZCODUiLz4KICA8cmVjdCB4PSI1NSIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzI1NjNFQiIvPgogIDxyZWN0IHg9IjEwNSIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iI0Q2NDU0NSIvPgogIDxyZWN0IHg9IjE1NSIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iI0ZCQkYyNCIvPgogIDxyZWN0IHg9IjIwNSIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzIyQzU1RSIvPgogIDxyZWN0IHg9IjI1NSIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzFENEVEOCIvPgogIDxyZWN0IHg9IjMwNSIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzdDM0FFRCIvPgogIDxyZWN0IHg9IjQwIiB5PSIxODAiIHdpZHRoPSIzMjAiIGhlaWdodD0iMTIiIGZpbGw9IiM4Nzk3QjgiLz4KICA8cmVjdCB4PSIxNTAiIHk9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiMxRDRFRDgiLz4KPC9zdmc+Cg=="
                alt="Karan B.'s shop"
              />
              <div className="testi-scrim" />
              <div className="testi-text">
                <p>"Verified clicks means I'm not paying for bots. It's the first affiliate tool that felt honest about what I was buying."</p>
                <div className="testi-who">Karan B.</div>
                <div className="testi-role">Local Retailer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Newsletter */}
      <section id="faq" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <h2 style={{ textAlign: "center", marginBottom: "28px" }}>
            Frequently asked
          </h2>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <div key={item.q} className={`faq-item ${faqOpen === i ? "open" : ""}`}>
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="faq-q"
                >
                  {item.q}
                  <span>+</span>
                </button>
                <div className="faq-a">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          <NewsletterSection />
        </div>
      </section>

      {/* Trial CTA */}
      <section className="trial-cta">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)" }}>
            Try Folksmint Free for 14 Days
          </h2>
          <Link
            to="/auth"
            className="pill-btn pill-navy"
            style={{ marginTop: "24px", padding: "16px 44px", fontSize: "1.05rem", display: "inline-flex" }}
          >
            Start My Free Trial →
          </Link>
        </div>
      </section>
    </div>
  );
}



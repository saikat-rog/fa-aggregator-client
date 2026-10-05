import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeSeo } from "./Home.seo";
import type { HomePageProps } from "./Home.types";
import { getPricingPlansApi, type PricingPlan } from "../../services/pricing.service";
import { subscribeNewsletterApi } from "../../services/newsletter.service";
export type { AdvisorApiItem } from "./Home.types";

const DEFAULT_BUSINESS_PLAN: PricingPlan = {
  _id: "default-business",
  planId: "business",
  name: "Folksmint Business",
  kicker: "For local business",
  heading: "Everything AI marketing does",
  subheading: "One dashboard replaces your SEO tool, your social media manager, and your review-reply habit.",
  price: "$19",
  period: "mo",
  yearlyPrice: "$15",
  yearlyPeriod: "mo",
  yearlyDiscountPercent: 21,
  yearlyOriginalTotal: "$114/mo",
  originalTotal: "$134/mo",
  originalTotalLabel: "What you'd spend otherwise",
  joinLabel: "Join Folksmint Business (Monthly)",
  trialNote: "✨ 14-day free trial, cancel anytime",
  buttonText: "Start Monthly Trial →",
  buttonLink: "/auth?role=user",
  yearlyButtonText: "Get Yearly Plan (Save 21%) →",
  yearlyButtonLink: "/auth?role=user&billing=yearly",
  paymentLink: "",
  yearlyPaymentLink: "",
  categories: [
    {
      title: "📈 Visibility & audits",
      items: [
        { emoji: "🔍", title: "Free Google Score Audit", description: "Full audit of your online performance", price: "$25" },
        { emoji: "🔑", title: "SEO Keyword Analysis", description: "Targeted keywords to boost search traffic", price: "$20" },
        { emoji: "🎯", title: "Competitor Analysis", description: "See what's working for others nearby", price: "$20" },
      ],
    },
    {
      title: "💬 Reputation & content",
      items: [
        { emoji: "✍️", title: "Personalized Google Review Replies", description: "On-brand replies drafted automatically", price: "$15" },
        { emoji: "🖼️", title: "Weekly Image Updates for Google", description: "Keeps your profile fresh and current", price: "$15" },
        { emoji: "📲", title: "AI Social Posting", description: "Captions + images, posted to FB & IG together", price: "$29" },
        { emoji: "📊", title: "Daily Reports on WhatsApp", description: "Your numbers, delivered where you already are", price: "$10" },
      ],
    },
  ],
};

const DEFAULT_CREATOR_PLAN: PricingPlan = {
  _id: "default-creators",
  planId: "creators",
  name: "Folksmint Creator",
  kicker: "For Creators",
  heading: "Everything your creator business needs",
  subheading: "One dashboard replaces your storefront, booking tool, course platform, and audience growth stack.",
  price: "$29",
  period: "mo",
  yearlyPrice: "$22",
  yearlyPeriod: "mo",
  yearlyDiscountPercent: 24,
  yearlyOriginalTotal: "$330/mo",
  originalTotal: "$413/mo",
  originalTotalLabel: "What you'd spend otherwise",
  joinLabel: "Join Folksmint Creator (Monthly)",
  trialNote: "✨ 14-day free trial, cancel anytime",
  buttonText: "Start Monthly Trial →",
  buttonLink: "/auth?role=advisor",
  yearlyButtonText: "Get Yearly Plan (Save 24%) →",
  yearlyButtonLink: "/auth?role=advisor&billing=yearly",
  paymentLink: "",
  yearlyPaymentLink: "",
  categories: [
    {
      title: "🛍️ Storefront & sales",
      items: [
        { emoji: "📱", title: "Mobile \"Link-in-Bio\" Store", description: "Replaces Squarespace, Linktree", price: "$29" },
        { emoji: "📅", title: "Calendar Invites & Bookings", description: "Replaces Calendly, Acuity", price: "$15" },
        { emoji: "🎓", title: "Course Builder", description: "Replaces Kajabi", price: "$119" },
      ],
    },
    {
      title: "📣 Growth & community",
      items: [
        { emoji: "📈", title: "Audience Analytics", description: "Replaces Google Analytics", price: "$10" },
        { emoji: "✈️", title: "Instagram AutoDMs", description: "Replaces Manychat", price: "$15" },
        { emoji: "✉️", title: "Email List / Newsletter Builder", description: "Own your audience, not just your followers", price: "$29" },
        { emoji: "🔒", title: "Exclusive Creator Community", description: "Access to fellow creators & swipe files", price: "$97" },
        { emoji: "🛠️", title: "1:1 Creator Strategy Coaching", description: "Personal guidance on growing your store", price: "$99" },
      ],
    },
  ],
};

function getYearlyDiscount(plan: PricingPlan): number {
  if (typeof plan.yearlyDiscountPercent === "number" && plan.yearlyDiscountPercent > 0) {
    return plan.yearlyDiscountPercent;
  }
  const parseNum = (val?: string) => {
    if (!val) return 0;
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const m = parseNum(plan.price);
  const y = parseNum(plan.yearlyPrice);
  if (m > 0 && y > 0) {
    if (y < m) {
      return Math.round(((m - y) / m) * 100);
    }
    const annualM = m * 12;
    if (y < annualM) {
      return Math.round(((annualM - y) / annualM) * 100);
    }
  }
  return 0;
}

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      await subscribeNewsletterApi(cleanEmail, "homepage_newsletter");
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to subscribe. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-box">
      <div className="nl-icon">📣</div>
      <h3>Get new campaigns & creator drops in your inbox</h3>
      <p>Curated updates with the highest-converting local collaborations. No spam.</p>

      {subscribed ? (
        <div style={{ padding: "14px 18px", background: "rgba(37,99,235,0.08)", borderRadius: "14px", border: "1px solid var(--line)", textAlign: "center" }}>
          <p style={{ color: "var(--indigo)", fontWeight: 700, margin: 0, fontSize: "1.05rem" }}>
            ✓ You're on the list!
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "6px" }}>
            A thank-you confirmation email is on its way to your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} id="nlForm" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="you@example.com"
            required
            disabled={loading}
            className="nl-input"
          />
          {errorMsg ? (
            <p style={{ color: "var(--red)", fontSize: "0.8rem", textAlign: "left", margin: 0 }}>
              {errorMsg}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="pill-btn pill-navy"
            style={{ width: "100%", textAlign: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}

export function HomePage(_props: HomePageProps = {}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
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

  useEffect(() => {
    getPricingPlansApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPricingPlans(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load pricing plans:", err);
      });
  }, []);

  const businessPlan: PricingPlan =
    pricingPlans.find((p) => p.planId === "business") ||
    pricingPlans[0] ||
    DEFAULT_BUSINESS_PLAN;

  const creatorPlan: PricingPlan =
    pricingPlans.find((p) => p.planId === "creators" || p.planId === "creator") ||
    pricingPlans[1] ||
    DEFAULT_CREATOR_PLAN;

  const businessDiscount = getYearlyDiscount(businessPlan);
  const creatorDiscount = getYearlyDiscount(creatorPlan);

  const businessYearlyBtnText =
    businessPlan.yearlyButtonText ||
    (businessDiscount > 0
      ? `Get Yearly Plan (Save ${businessDiscount}%) →`
      : "Get Yearly Plan →");

  const creatorYearlyBtnText =
    creatorPlan.yearlyButtonText ||
    (creatorDiscount > 0
      ? `Get Yearly Plan (Save ${creatorDiscount}%) →`
      : "Get Yearly Plan →");

  return (
    <div className="w-full" id="page-home">
      <HomeSeo />

      {/* Hero Section */}
      <section className="hero">
        <div className="wrap">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            All-in-One Commerce & Growth Stack
          </div>

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

          {/* Value Highlights Pill Bar */}
          <div className="mt-10 pt-6 border-t border-blue-100/60 flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-medium">
              <span className="text-blue-600 font-bold">✓</span> 14-Day Free Trial
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-medium">
              <span className="text-blue-600 font-bold">✓</span> No Coding Required
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-medium">
              <span className="text-blue-600 font-bold">✓</span> Hyperlocal Pincode Matching
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-medium">
              <span className="text-blue-600 font-bold">✓</span> 1-Tap Checkout
            </span>
          </div>
        </div>
      </section>

      {/* Plans Section (For Business & For Creators Side by Side on Desktop) */}
      <section className="py-8 md:py-14">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-stretch">
            {/* For Business Column */}
            <div id="business" className="flex flex-col h-full scroll-mt-24">
              <div className="section-head !mb-6 text-center lg:text-left lg:mx-0 lg:max-w-none lg:min-h-[160px] flex flex-col justify-start">
                <div>
                  <div className="kicker">{businessPlan.kicker || "For local business"}</div>
                </div>
                <h2>{businessPlan.heading || "Everything AI marketing does"}</h2>
                <p>{businessPlan.subheading || "One dashboard replaces your SEO tool, your social media manager, and your review-reply habit."}</p>
              </div>

              <div className="stack-card flex flex-col justify-between flex-1">
                <div>
                  {(businessPlan.categories || []).map((cat, catIdx) => (
                    <React.Fragment key={cat.title || catIdx}>
                      <div className="stack-title">{cat.title}</div>
                      {(cat.items || []).map((item, itemIdx) => (
                        <div className="stack-row" key={item.title || itemIdx}>
                          <span className="emo">{item.emoji || "✨"}</span>
                          <div>
                            <div className="t">{item.title}</div>
                            {item.description ? <div className="r">{item.description}</div> : null}
                          </div>
                          {item.price ? <span className="price">{item.price}</span> : null}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4 pt-2 border-t border-[var(--line)]">
                  <div className="stack-total">
                    <span className="emo">✕</span>
                    <span className="t">{businessPlan.originalTotalLabel || "What you'd spend otherwise"}</span>
                    <span className="price">{businessPlan.originalTotal || "$134/mo"}</span>
                  </div>
                  <div className="stack-join">
                    <span className="emo">🪙</span>
                    <span className="t">{businessPlan.joinLabel || "Join Folksmint Business"}</span>
                    <span className="price">
                      {businessPlan.price
                        ? businessPlan.period
                          ? `${businessPlan.price}/${businessPlan.period}`
                          : businessPlan.price
                        : "$19/mo"}
                    </span>
                  </div>

                  {/* Yearly Price Comparison Row if configured */}
                  {businessPlan.yearlyPrice ? (
                    <div
                      className="stack-join"
                      style={{
                        marginTop: "8px",
                        background: "rgba(34, 197, 94, 0.08)",
                        borderColor: "rgba(34, 197, 94, 0.25)",
                      }}
                    >
                      <span className="emo">⭐</span>
                      <span className="t" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>Yearly Plan (Billed Annually)</span>
                        {businessDiscount > 0 ? (
                          <span
                            style={{
                              background: "#22C55E",
                              color: "white",
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 7px",
                              borderRadius: "9999px",
                              lineHeight: 1,
                            }}
                          >
                            {businessDiscount}% OFF
                          </span>
                        ) : null}
                      </span>
                      <span className="price" style={{ color: "#15803D", fontWeight: 800 }}>
                        {businessPlan.yearlyPrice}
                        {businessPlan.yearlyPeriod ? `/${businessPlan.yearlyPeriod}` : "/mo"}
                      </span>
                    </div>
                  ) : null}

                  {businessPlan.trialNote ? (
                    <div className="trial-note">{businessPlan.trialNote}</div>
                  ) : null}

                  {/* Action Buttons: Monthly & Yearly */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                    {/* Monthly CTA Button */}
                    {businessPlan.paymentLink ? (
                      <a
                        href={businessPlan.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill-btn pill-navy plan-cta"
                        style={{ width: "100%", textAlign: "center", display: "inline-flex", justifyContent: "center" }}
                      >
                        {businessPlan.buttonText || "Start Monthly Trial →"}
                      </a>
                    ) : (
                      <Link
                        to={businessPlan.buttonLink || "/auth?role=user"}
                        className="pill-btn pill-navy plan-cta"
                        style={{ width: "100%", textAlign: "center", display: "inline-flex", justifyContent: "center" }}
                      >
                        {businessPlan.buttonText || "Start Monthly Trial →"}
                      </Link>
                    )}

                    {/* Yearly CTA Button */}
                    {businessPlan.yearlyPrice ? (
                      businessPlan.yearlyPaymentLink ? (
                        <a
                          href={businessPlan.yearlyPaymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill-btn plan-cta"
                          style={{
                            width: "100%",
                            textAlign: "center",
                            display: "inline-flex",
                            justifyContent: "center",
                            background: "#0F172A",
                            color: "white",
                            border: "1px solid #22C55E",
                            boxShadow: "0 4px 14px rgba(34,197,94,0.18)",
                          }}
                        >
                          {businessYearlyBtnText}
                        </a>
                      ) : (
                        <Link
                          to={businessPlan.yearlyButtonLink || "/auth?role=user&billing=yearly"}
                          className="pill-btn plan-cta"
                          style={{
                            width: "100%",
                            textAlign: "center",
                            display: "inline-flex",
                            justifyContent: "center",
                            background: "#0F172A",
                            color: "white",
                            border: "1px solid #22C55E",
                            boxShadow: "0 4px 14px rgba(34,197,94,0.18)",
                          }}
                        >
                          {businessYearlyBtnText}
                        </Link>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* For Creators Column */}
            <div id="creators" className="flex flex-col h-full scroll-mt-24">
              <div className="section-head !mb-6 text-center lg:text-left lg:mx-0 lg:max-w-none lg:min-h-[160px] flex flex-col justify-start">
                <div>
                  <div className="kicker">{creatorPlan.kicker || "For Creators"}</div>
                </div>
                <h2>{creatorPlan.heading || "Everything your creator business needs"}</h2>
                <p>{creatorPlan.subheading || "One dashboard replaces your storefront, booking tool, course platform, and audience growth stack."}</p>
              </div>

              <div className="stack-card flex flex-col justify-between flex-1">
                <div>
                  {(creatorPlan.categories || []).map((cat, catIdx) => (
                    <React.Fragment key={cat.title || catIdx}>
                      <div className="stack-title">{cat.title}</div>
                      {(cat.items || []).map((item, itemIdx) => (
                        <div className="stack-row" key={item.title || itemIdx}>
                          <span className="emo">{item.emoji || "✨"}</span>
                          <div>
                            <div className="t">{item.title}</div>
                            {item.description ? <div className="r">{item.description}</div> : null}
                          </div>
                          {item.price ? <span className="price">{item.price}</span> : null}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4 pt-2 border-t border-[var(--line)]">
                  <div className="stack-total">
                    <span className="emo">✕</span>
                    <span className="t">{creatorPlan.originalTotalLabel || "What you'd spend otherwise"}</span>
                    <span className="price">{creatorPlan.originalTotal || "$413/mo"}</span>
                  </div>
                  <div className="stack-join">
                    <span className="emo">🪙</span>
                    <span className="t">{creatorPlan.joinLabel || "Join Folksmint Creator"}</span>
                    <span className="price">
                      {creatorPlan.price
                        ? creatorPlan.period
                          ? `${creatorPlan.price}/${creatorPlan.period}`
                          : creatorPlan.price
                        : "$29/mo"}
                    </span>
                  </div>

                  {/* Yearly Price Comparison Row if configured */}
                  {creatorPlan.yearlyPrice ? (
                    <div
                      className="stack-join"
                      style={{
                        marginTop: "8px",
                        background: "rgba(34, 197, 94, 0.08)",
                        borderColor: "rgba(34, 197, 94, 0.25)",
                      }}
                    >
                      <span className="emo">⭐</span>
                      <span className="t" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>Yearly Plan (Billed Annually)</span>
                        {creatorDiscount > 0 ? (
                          <span
                            style={{
                              background: "#22C55E",
                              color: "white",
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 7px",
                              borderRadius: "9999px",
                              lineHeight: 1,
                            }}
                          >
                            {creatorDiscount}% OFF
                          </span>
                        ) : null}
                      </span>
                      <span className="price" style={{ color: "#15803D", fontWeight: 800 }}>
                        {creatorPlan.yearlyPrice}
                        {creatorPlan.yearlyPeriod ? `/${creatorPlan.yearlyPeriod}` : "/mo"}
                      </span>
                    </div>
                  ) : null}

                  {creatorPlan.trialNote ? (
                    <div className="trial-note">{creatorPlan.trialNote}</div>
                  ) : null}

                  {/* Action Buttons: Monthly & Yearly */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                    {/* Monthly CTA Button */}
                    {creatorPlan.paymentLink ? (
                      <a
                        href={creatorPlan.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill-btn pill-navy plan-cta"
                        style={{ width: "100%", textAlign: "center", display: "inline-flex", justifyContent: "center" }}
                      >
                        {creatorPlan.buttonText || "Start Monthly Trial →"}
                      </a>
                    ) : (
                      <Link
                        to={creatorPlan.buttonLink || "/auth?role=advisor"}
                        className="pill-btn pill-navy plan-cta"
                        style={{ width: "100%", textAlign: "center", display: "inline-flex", justifyContent: "center" }}
                      >
                        {creatorPlan.buttonText || "Start Monthly Trial →"}
                      </Link>
                    )}

                    {/* Yearly CTA Button */}
                    {creatorPlan.yearlyPrice ? (
                      creatorPlan.yearlyPaymentLink ? (
                        <a
                          href={creatorPlan.yearlyPaymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill-btn plan-cta"
                          style={{
                            width: "100%",
                            textAlign: "center",
                            display: "inline-flex",
                            justifyContent: "center",
                            background: "#0F172A",
                            color: "white",
                            border: "1px solid #22C55E",
                            boxShadow: "0 4px 14px rgba(34,197,94,0.18)",
                          }}
                        >
                          {creatorYearlyBtnText}
                        </a>
                      ) : (
                        <Link
                          to={creatorPlan.yearlyButtonLink || "/auth?role=advisor&billing=yearly"}
                          className="pill-btn plan-cta"
                          style={{
                            width: "100%",
                            textAlign: "center",
                            display: "inline-flex",
                            justifyContent: "center",
                            background: "#0F172A",
                            color: "white",
                            border: "1px solid #22C55E",
                            boxShadow: "0 4px 14px rgba(34,197,94,0.18)",
                          }}
                        >
                          {creatorYearlyBtnText}
                        </Link>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
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
      <section id="testimonials" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Testimonials</div>
            <h2>What people are saying</h2>
          </div>

          <div className="testi-grid">
            <div className="testi-card group">
              <img
                src="/images/testi-cafe-meera.jpg"
                alt="Meera R.'s cafe"
                loading="lazy"
              />
              <div className="testi-scrim" />
              <div className="testi-text">
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                  ★★★★★
                </div>
                <p>"We filled a 6-creator campaign in under a week — Folksmint handled the applications so we didn't have to chase anyone."</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/15">
                  <div>
                    <div className="testi-who">Meera R.</div>
                    <div className="testi-role">Café Owner</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 backdrop-blur-xs">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="testi-card group">
              <img
                src="/images/testi-fitness-rohan.jpg"
                alt="Rohan M.'s gym"
                loading="lazy"
              />
              <div className="testi-scrim" />
              <div className="testi-text">
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                  ★★★★★
                </div>
                <p>"My biolink store finally looks like it belongs to a real business, not a link dump. Bookings went up almost immediately."</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/15">
                  <div>
                    <div className="testi-who">Rohan M.</div>
                    <div className="testi-role">Fitness Creator</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 backdrop-blur-xs">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="testi-card group">
              <img
                src="/images/testi-retail-karan.jpg"
                alt="Karan B.'s shop"
                loading="lazy"
              />
              <div className="testi-scrim" />
              <div className="testi-text">
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                  ★★★★★
                </div>
                <p>"Verified clicks means I'm not paying for bots. It's the first affiliate tool that felt honest about what I was buying."</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/15">
                  <div>
                    <div className="testi-who">Karan B.</div>
                    <div className="testi-role">Local Retailer</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 backdrop-blur-xs">
                    Verified
                  </span>
                </div>
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

import { Link } from "react-router-dom";

const TESTIMONIALS = [
  {
    name: "Meera R.",
    role: "Café Owner",
    location: "Pune",
    quote: "We filled a 6-creator campaign in under a week — Folksmint handled the applications so we didn't have to chase anyone.",
  },
  {
    name: "Rohan M.",
    role: "Fitness Creator",
    location: "Bengaluru",
    quote: "My biolink store finally looks like it belongs to a real business, not a link dump. Bookings went up almost immediately.",
  },
  {
    name: "Karan B.",
    role: "Local Retailer",
    location: "Delhi",
    quote: "Verified clicks means I'm not paying for bots. It's the first affiliate tool that felt honest about what I was buying.",
  },
];

export function TestimonialsPage() {
  return (
    <div className="max-w-[1040px] mx-auto px-6 py-10 space-y-8">
      <section className="text-center max-w-2xl mx-auto">
        <div className="text-[var(--indigo)] font-bold text-[0.9rem] mb-2 uppercase tracking-wide">
          Testimonials
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
          What people are saying
        </h1>
        <p className="mt-3 text-base text-[var(--muted)] leading-relaxed">
          See how local shop owners and creators streamline marketing and grow their revenues on Folksmint.
        </p>
      </section>

      <div className="testi-grid">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="testi-card">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1D4ED8] to-[#2563EB]" />
            <div className="testi-scrim" />
            <div className="testi-text">
              <p>"{t.quote}"</p>
              <div className="testi-who">{t.name}</div>
              <div className="testi-role">{t.role} · {t.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevenueModelPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div>
        <div className="text-[var(--indigo)] font-bold text-[0.9rem] mb-2 uppercase tracking-wide">
          Platform Economics
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[var(--ink)]">
          How Folksmint Works
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Simple SaaS subscription with zero hidden fees and verified click tracking.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-[18px] p-6">
          <h3 className="font-heading font-bold text-lg text-[var(--ink)] mb-2">Folksmint Business ($19/mo)</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Local businesses pay a simple flat monthly subscription to replace their SEO audit tools, social post schedulers, and review-reply management with built-in AI.
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--line)] rounded-[18px] p-6">
          <h3 className="font-heading font-bold text-lg text-[var(--ink)] mb-2">Folksmint Creator ($29/mo)</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Creators replace multiple separate subscriptions (Linktree, Calendly, Kajabi, Manychat) with a single, high-converting biolink store, 1-tap checkout, and coaching tools.
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--line)] rounded-[18px] p-6">
          <h3 className="font-heading font-bold text-lg text-[var(--ink)] mb-2">Campaigns & Protection</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Businesses post gigs and payouts are safely held until creator deliverables are marked complete. No bot clicks or fraudulent impressions.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div id="page-terms">
      <section id="terms" className="legal-page">
        <div className="wrap">
          <Link to="/" style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem" }}>
            ← Back to Folksmint
          </Link>
          <h2 style={{ margin: "20px 0 30px" }}>
            Terms and Conditions
          </h2>

          <div className="legal-section">
            <h3>Acceptance of Terms</h3>
            <p>
              By creating a Folksmint account, you agree to these terms. If you don't agree, please don't use the platform.
            </p>
          </div>

          <div className="legal-section">
            <h3>Using Folksmint</h3>
            <p>
              Businesses and creators must provide accurate profile information and use the platform only for legitimate campaigns and collaborations.
            </p>
          </div>

          <div className="legal-section">
            <h3>Payments &amp; Fees</h3>
            <p>
              Subscription fees are billed per your chosen plan. Campaign payouts to creators are held by Folksmint until deliverables are marked complete, then released.
            </p>
          </div>

          <div className="legal-section">
            <h3>Responsibilities</h3>
            <p>
              Businesses are responsible for the campaigns they post; creators are responsible for delivering what they agree to. Folksmint is not a party to the underlying agreement between them.
            </p>
          </div>

          <div className="legal-section">
            <h3>Termination</h3>
            <p>
              Either side may cancel their subscription at any time. We may suspend accounts that violate these terms or engage in fraudulent click activity.
            </p>
          </div>

          <div className="legal-section">
            <h3>Limitation of Liability</h3>
            <p>
              Folksmint is provided "as is." We aren't liable for disputes between businesses and creators beyond facilitating the campaign and payment process.
            </p>
          </div>

          <div className="legal-section">
            <h3>Changes to These Terms</h3>
            <p>
              We may update these terms from time to time; continued use of Folksmint after changes means you accept the updated terms.
            </p>
          </div>

          <div className="legal-section">
            <h3>Contact Us</h3>
            <p>
              Questions about these terms can be sent to legal@folksmint.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div id="page-privacy">
      <section id="privacy" className="legal-page">
        <div className="wrap">
          <Link to="/" style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem" }}>
            ← Back to Folksmint
          </Link>
          <h2 style={{ margin: "20px 0 30px" }}>
            Privacy Policy
          </h2>

          <div className="legal-section">
            <h3>Overview</h3>
            <p>
              Folksmint collects only the information needed to run campaigns, process payments, and connect businesses with creators. This page explains what we collect and how it's used.
            </p>
          </div>

          <div className="legal-section">
            <h3>Information We Collect</h3>
            <p>
              Account details (name, email, phone, pincode), campaign and payment activity, and basic usage data such as pages visited and clicks tracked for verified-click billing.
            </p>
          </div>

          <div className="legal-section">
            <h3>How We Use It</h3>
            <p>
              To match businesses with relevant creators, process payouts, prevent fraud on verified clicks, and send you campaign or account updates you've opted into.
            </p>
          </div>

          <div className="legal-section">
            <h3>Data Sharing</h3>
            <p>
              We share only what's necessary with payment processors and, when you apply to or accept a campaign, with the other party involved. We do not sell your personal data.
            </p>
          </div>

          <div className="legal-section">
            <h3>Your Rights</h3>
            <p>
              You can request a copy of your data, ask us to correct it, or delete your account at any time from your dashboard settings or by contacting us.
            </p>
          </div>

          <div className="legal-section">
            <h3>Contact Us</h3>
            <p>
              Questions about this policy can be sent to privacy@folksmint.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


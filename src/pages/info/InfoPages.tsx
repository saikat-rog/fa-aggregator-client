import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Check, Wallet, ArrowRight, Users, LayoutDashboard, Megaphone, ExternalLink } from "lucide-react";
import { ReachRadar } from "../../components/home/ReachRadar";
import { getPricingPlansApi, type PricingPlan } from "../../services/pricing.service";

export const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "month",
    tag: "gray",
    audience: "FOR BUSINESSES · TRY THE MARKETPLACE",
    pitch: "Enough to test whether local creators actually move the needle, before committing to anything.",
    features: [
      "1 active campaign per month",
      "Basic applicant dashboard",
      "Standard visibility to creators",
      "Barter or paid campaigns",
    ],
    buttonText: "Get Started Free",
    paymentLink: "",
  },
  {
    name: "Growth",
    price: "₹299",
    period: "month",
    tag: "violet",
    audience: "FOR BUSINESSES · RUN CAMPAIGNS ON REPEAT",
    pitch: "For businesses that want a steady stream of local creators, not a one-off experiment.",
    features: [
      "Unlimited active campaigns",
      "Full analytics dashboard",
      "Priority placement to nearby creators",
      "Faster application turnaround",
    ],
    buttonText: "Subscribe to Growth",
    paymentLink: "",
  },
  {
    name: "Pro / Studio",
    price: "From ₹50,000",
    period: "90-day sprint",
    tag: "coral",
    audience: "FOR BUSINESSES · A 90-DAY GROWTH SPRINT",
    pitch: "We start with a diagnostic report — infra, interiors, pricing, schemes, and advertising — then run a fully managed 90-day campaign against it, with a checkpoint every 30 days so you always know where things stand.",
    features: [
      "Professional photography & design",
      "Video and ad shoots",
      "Access to high-profile, invite-only creators",
      "Team-managed posting & local marketing",
    ],
    buttonText: "Book a Sprint",
    paymentLink: "",
  },
];

const STUDIO_TIMELINE = [
  { day: "Day 0", title: "Diagnostic report", body: "A written audit — infra, interiors, pricing, schemes, ads — with specific, actionable recommendations across everything, not just creator campaigns." },
  { day: "Day 30", title: "Checkpoint 1 — early movement", body: "First read on what's shifting, what isn't, and why — shown against your baseline, not promised as a fixed number." },
  { day: "Day 60", title: "Checkpoint 2 — trend & comparison", body: "Scale what's working, adjust what isn't. Benchmarked against comparable local competitors so the trend has real context." },
  { day: "Day 90", title: "Final report", body: "Full before/after comparison against your original diagnostic and the local market — the complete picture, not a guarantee." },
];

const CREATOR_FEES = [
  { rate: "Free", tag: "CREATORS · BARTER DEALS", body: "Always free for both sides. No platform fee, ever, on a barter match — this is most of early volume." },
  { rate: "5–10%", tag: "CREATORS · PAID DEALS ONLY", body: "A payment-protection fee, charged only when cash actually changes hands — never on barter, never upfront." },
];

const ESCROW_FLOW = ["Business pays platform", "Held in escrow", "Content confirmed live", "Creator paid, minus 5–10%"];

export function PricingPage() {
  const [plans, setPlans] = React.useState<PricingPlan[] | typeof PLANS>(PLANS);
  const [, setLoading] = React.useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() =>
    Boolean(typeof window !== "undefined" && localStorage.getItem("token"))
  );

  React.useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("token")));
    getPricingPlansApi()
      .then((data) => {
        if (data && data.length > 0) {
          setPlans(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load live pricing plans:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <section className="bg-white border border-[#E7E1D6] rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#201A2B]">
            Pricing
          </h1>
          <p className="mt-3 text-base text-[#7A7286] leading-relaxed">
            Businesses pay to grow, creators pay only when they earn. Barter — the majority of early volume — stays free for everyone.
          </p>
        </div>
        <div className="shrink-0">
          <ReachRadar size={180} pulsing />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, i) => {
          const isViolet = p.tag === "violet";
          const isCoral = p.tag === "coral";
          const isFree =
            (p as PricingPlan).planId === "free" || p.name.toLowerCase().trim() === "free";
          const buttonText =
            p.buttonText || (isFree ? "Get Started Free" : isCoral ? "Book a Sprint" : "Choose Plan");

          const hasPaymentLink = Boolean(p.paymentLink && p.paymentLink.trim() !== "");

          return (
            <div
              key={(p as PricingPlan)._id || p.name}
              className={`relative bg-white border rounded-[20px] p-6 md:p-8 flex flex-col ${
                isViolet
                  ? "border-[#6C4BFF] shadow-[0_8px_24px_rgba(108,75,255,0.12)]"
                  : isCoral
                  ? "border-[#FF5A36] shadow-[0_8px_24px_rgba(255,90,54,0.12)]"
                  : "border-[#E7E1D6]"
              }`}
            >
              <div className="font-mono-code text-xs text-[#7A7286] absolute top-6 right-6 font-semibold">
                0{i + 1}
              </div>
              <div className="font-heading font-bold text-lg text-[#201A2B] uppercase tracking-wide">
                {p.name}
              </div>
              <div className="font-heading font-extrabold text-3xl text-[#201A2B] my-2">
                {p.price}
                <span className="text-xs font-medium text-[#7A7286]"> / {p.period}</span>
              </div>
              <div className={`font-mono-code text-[11px] font-semibold mb-3 ${isCoral ? "text-[#D6431E]" : "text-[#5A3FE0]"}`}>
                {p.audience}
              </div>
              <p className="text-sm text-[#7A7286] leading-relaxed mb-6">
                {p.pitch}
              </p>

              <div className="space-y-3 mb-6 pt-4 border-t border-[#E7E1D6] flex-1">
                {(p.features || []).map((f: string) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-[#4C4557]">
                    <CheckCircle2 className="h-4 w-4 text-[#1F9D6B] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Action / Payment Button */}
              <div className="mt-auto pt-4 border-t border-[#F0EAE1]">
                {isFree ? (
                  isAuthenticated ? (
                    <button
                      type="button"
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-heading font-bold text-sm tracking-wide bg-[#EAF7EE] text-[#137A50] border border-[#BDE5CA] cursor-default select-none shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Active</span>
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-heading font-bold text-sm tracking-wide bg-[#201A2B] hover:bg-[#342D40] text-white shadow-sm transition"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight className="h-4 w-4 opacity-80" />
                    </Link>
                  )
                ) : hasPaymentLink ? (
                  <a
                    href={p.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-heading font-bold text-sm tracking-wide transition shadow-sm ${
                      isCoral
                        ? "bg-[#FF5A36] hover:bg-[#E04826] text-white shadow-[0_4px_14px_rgba(255,90,54,0.25)]"
                        : isViolet
                        ? "bg-[#6C4BFF] hover:bg-[#5A3FE0] text-white shadow-[0_4px_14px_rgba(108,75,255,0.25)]"
                        : "bg-[#201A2B] hover:bg-[#342D40] text-white"
                    }`}
                  >
                    <span>{buttonText}</span>
                    <ExternalLink className="h-4 w-4 opacity-80" />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Payment link is currently disabled / not set"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-heading font-bold text-sm tracking-wide bg-[#F4F1EC] text-[#A59EAD] border border-[#E7E1D6] cursor-not-allowed select-none opacity-80"
                  >
                    <span>{buttonText}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#E7E1D6] rounded-[20px] p-6 md:p-8">
        <h2 className="font-heading font-bold text-xl text-[#201A2B]">
          Pro / Studio — the 90-day sprint, step by step
        </h2>
        <p className="text-sm text-[#7A7286] mt-1 mb-6">
          A checkpoint every 30 days, so you always know where things stand.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STUDIO_TIMELINE.map((t) => (
            <div key={t.day} className="bg-[#FDFCFA] border border-[#E7E1D6] rounded-[14px] p-4">
              <div className="font-mono-code font-bold text-xs text-[#D6431E] mb-1.5">{t.day}</div>
              <div className="font-heading font-bold text-sm text-[#201A2B] mb-1.5">{t.title}</div>
              <p className="text-xs text-[#7A7286] leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E7E1D6] rounded-[20px] p-6 md:p-8">
        <h2 className="font-heading font-bold text-xl text-[#201A2B]">
          For creators
        </h2>
        <p className="text-sm text-[#7A7286] mt-1 mb-6">
          Always free on barter. A protection fee only when real money moves.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {CREATOR_FEES.map((f) => (
            <div key={f.tag} className="bg-[#FDFCFA] border border-[#E7E1D6] rounded-[16px] p-5">
              <div className="font-heading font-extrabold text-2xl text-[#5A3FE0]">{f.rate}</div>
              <div className="font-mono-code text-[11px] font-semibold text-[#7A7286] my-1.5">{f.tag}</div>
              <p className="text-xs text-[#7A7286] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {ESCROW_FLOW.map((step, i) => (
            <React.Fragment key={step}>
              <span className="bg-[#F1ECFF] text-[#5A3FE0] font-heading font-semibold text-xs px-3.5 py-2 rounded-full">
                {step}
              </span>
              {i < ESCROW_FLOW.length - 1 && <ArrowRight className="h-4 w-4 text-[#E7E1D6] shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    name: "Meera Kapoor",
    role: "Food creator",
    location: "Agra, Uttar Pradesh",
    quote: "I had 6,000 followers and no idea how to turn that into anything. My first barter deal was a free brunch for a reel — three weeks later a café offered me a paid post. That never happened before this.",
    stat: "3 paid deals",
    statLabel: "in first 2 months",
  },
  {
    name: "Kettle & Crumb Café",
    role: "Business, Café / Restaurant",
    location: "Agra, Uttar Pradesh",
    quote: "We tried boosting Instagram posts for months with barely any local walk-ins to show for it. One weekend campaign with two nearby creators brought in more actual footfall than our entire ad budget that quarter.",
    stat: "+22%",
    statLabel: "weekend footfall",
  },
  {
    name: "Arjun Mehta",
    role: "Fitness creator",
    location: "New Delhi, Delhi",
    quote: "The biolink page alone was worth signing up for — one link for my Instagram, YouTube, and the brands I've worked with. Businesses actually check my work before accepting.",
    stat: "4.8K",
    statLabel: "profile clicks",
  },
  {
    name: "Glow Salon",
    role: "Business, Salon / Spa",
    location: "New Delhi, Delhi",
    quote: "Being able to see a creator's actual location and engagement before accepting made this feel real, not random. We only work with people who are genuinely nearby now.",
    stat: "12 campaigns",
    statLabel: "run to date",
  },
];

export function TestimonialsPage() {
  return (
    <div className="space-y-8">
      <section className="bg-white border border-[#E7E1D6] rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#201A2B]">
            Success stories
          </h1>
          <p className="mt-3 text-base text-[#7A7286] leading-relaxed">
            Real stories showing how local creators and businesses build thriving partnerships.
          </p>
        </div>
        <div className="shrink-0">
          <ReachRadar size={180} pulsing />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="bg-white border border-[#E7E1D6] rounded-[18px] p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FF5A36] to-[#6C4BFF] text-white font-heading font-bold text-base flex items-center justify-center mb-4">
                {t.name.charAt(0)}
              </div>
              <p className="text-sm text-[#4C4557] italic leading-relaxed mb-6">
                "{t.quote}"
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-[#E7E1D6] pt-4">
              <div>
                <div className="font-heading font-bold text-sm text-[#201A2B]">{t.name}</div>
                <div className="text-xs text-[#7A7286] mt-0.5">{t.role} · {t.location}</div>
              </div>
              <div className="text-right">
                <div className="font-heading font-extrabold text-base text-[#5A3FE0]">{t.stat}</div>
                <div className="text-[10px] text-[#7A7286]">{t.statLabel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REVENUE_STREAMS = [
  { icon: Users, tag: "Always free", title: "Barter deals, for everyone", body: "No platform fee, ever, on a barter match between a business and a creator — this is most of the early volume, and it stays free permanently." },
  { icon: Wallet, tag: "5–10%, paid deals only", title: "A payment-protection fee", body: "Charged only when cash actually changes hands, never on barter and never upfront: the business pays in advance, funds sit in escrow, and once the content is confirmed live, the creator is paid minus 5–10%." },
  { icon: LayoutDashboard, tag: "₹299/month, optional", title: "Growth plan for businesses", body: "Unlimited active campaigns, a full analytics dashboard, priority placement to nearby creators, and faster application turnaround." },
  { icon: Megaphone, tag: "From ₹50,000", title: "Pro / Studio — a managed 90-day sprint", body: "A done-for-you engagement: a diagnostic report, professional photo/video production, invite-only creator access, and a team-managed campaign with checkpoints every 30 days." },
];

export function RevenueModelPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#E7E1D6] rounded-[20px] p-6 md:p-10 space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#201A2B]">
          How we make money
        </h1>
        <p className="text-sm text-[#7A7286] mt-1">
          Transparently, and only when you do. Incentives stay aligned with creators and businesses.
        </p>
      </div>

      <div className="divide-y divide-[#E7E1D6]">
        {REVENUE_STREAMS.map((r) => (
          <div key={r.title} className="py-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#F1ECFF] text-[#5A3FE0] flex items-center justify-center shrink-0">
              <r.icon className="h-5 w-5" />
            </div>
            <div>
              <span className="badge-pill bg-[#E4F5EC] text-[#137A50] text-[10px] mb-1.5">
                {r.tag}
              </span>
              <div className="font-heading font-bold text-base text-[#201A2B] mt-1">{r.title}</div>
              <p className="text-xs text-[#7A7286] leading-relaxed mt-1">{r.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[#E7E1D6]">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 rounded-xl bg-[#6C4BFF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#5A3FE0] transition"
        >
          See full pricing <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: string }[] }) {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#E7E1D6] rounded-[20px] p-6 md:p-10">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#201A2B]">{title}</h1>
      <p className="text-xs text-[#7A7286] mt-1 mb-6">Last updated {updated}</p>
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-heading font-bold text-base text-[#201A2B] mb-1.5">{s.heading}</h2>
            <p className="text-sm text-[#7A7286] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="September 2026"
      sections={[
        { heading: "Marketplace Terms", body: "Our platform connects creators and businesses for marketing collaborations. We facilitate transparent communication and deal matching." },
        { heading: "Authentic Representations", body: "Businesses and creators agree to provide genuine metrics, location pincodes, and portfolios." },
        { heading: "Payment & Escrow", body: "Paid campaigns utilize payment protection ensuring creators are compensated once agreed deliverables are verified live." },
        { heading: "Content Standards", body: "All content produced under campaigns must comply with local consumer protection guidelines and advertising standards." },
      ]}
    />
  );
}

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 2026"
      sections={[
        { heading: "Information Collected", body: "We collect basic profile details including name, business name, public social handles, and location pincode to facilitate local discovery." },
        { heading: "Location & Pincode Usage", body: "Pincodes are used purely to calculate geographic proximity and display relevant local opportunities." },
        { heading: "Data Protection", body: "We do not sell personal data to third parties. Contact details are shared only when businesses initiate explicit connections." },
      ]}
    />
  );
}

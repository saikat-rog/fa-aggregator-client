import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  Megaphone,
  Users,
  Target,
  LayoutDashboard,
  Clock,
  Link2 as LinkIcon,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { HomeSeo } from "./Home.seo";
import { ReachRadar } from "../../components/home/ReachRadar";
import { PLANS } from "../info/InfoPages";
import type { HomePageProps } from "./Home.types";
export type { AdvisorApiItem } from "./Home.types";

const BENEFITS = {
  business: [
    {
      title: "Every post is a customer walking in",
      body: "Creators who actually live nearby turn content into foot traffic, not just impressions.",
    },
    {
      title: "Pay only when it works",
      body: "Paid, barter, or both — nothing spent until an approved creator delivers.",
    },
  ],
  creator: [
    {
      title: "Your following finally pays",
      body: "Cash, meals, or services from real local businesses — no follower minimum required.",
    },
    {
      title: "One link. Every business can find you",
      body: "Your free profile puts Instagram, YouTube, and your portfolio in one place.",
    },
  ],
};

const HOW_IT_WORKS = {
  business: [
    {
      title: "Set up your profile",
      body: "Business name, category, and pincode — once, ever.",
    },
    {
      title: "Post what you need",
      body: "A goal, a reward (paid or barter), and a one-line brief — live once approved.",
    },
    {
      title: "Review & accept",
      body: "Applicants land in your dashboard — accept or decline in a click.",
    },
  ],
  creator: [
    {
      title: "Create your profile",
      body: "Name, handle, pincode, and your links — all in one place.",
    },
    {
      title: "Browse open campaigns",
      body: "Every live, approved campaign on Folksmint, no matter your location.",
    },
    {
      title: "Apply & get picked",
      body: "Send a short note. Track responses directly from your dashboard.",
    },
  ],
};

const FEATURES = [
  {
    icon: Target,
    title: "Open to every creator",
    body: "Pincode is shown as context, never used to filter who can see or apply to a campaign.",
  },
  {
    icon: LayoutDashboard,
    title: "Live dashboards",
    body: "Both sides get real metrics — applications over time, category breakdowns, acceptance rates.",
  },
  {
    icon: Clock,
    title: "Reviewed before going live",
    body: "New campaigns and creator profiles are checked by admins, keeping the directory genuine.",
  },
  {
    icon: LinkIcon,
    title: "Free biolink for creators",
    body: "One shareable page with all your links — Instagram, YouTube, portfolio, WhatsApp.",
  },
];

const FAQ = [
  {
    q: "Is Folksmint free to use?",
    a: "There's a free plan for businesses (1 campaign/month) and it's always free for creators on barter deals. Paid deals carry a 5–10% payment-protection fee, and businesses can upgrade to Growth or Pro/Studio for managed campaigns.",
  },
  {
    q: "Why isn't my campaign or profile showing up yet?",
    a: "New campaigns and creator profiles are reviewed by an admin before they go public — this keeps the directory clean. Check your dashboard for a 'Pending review' status.",
  },
  {
    q: "Does my pincode limit what I can see?",
    a: "No. Pincode is shown for context only — every creator can see and apply to every open campaign, regardless of location.",
  },
  {
    q: "What happens after I accept an applicant?",
    a: "Their status updates to 'accepted' immediately, visible on both sides for coordination and content delivery.",
  },
  {
    q: "Can I use Folksmint on both sides?",
    a: "Yes — switch between creator and business profiles anytime from the top navigation.",
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
    <div className="bg-white border border-[#E7E1D6] rounded-[20px] p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-[#F1ECFF] text-[#5A3FE0] flex items-center justify-center mx-auto mb-3">
        <Megaphone className="h-5 w-5" />
      </div>
      <h3 className="font-heading font-bold text-lg text-[#201A2B]">
        Get new campaigns & creator drops in your inbox
      </h3>
      <p className="text-xs text-[#7A7286] mt-1 mb-6">
        Curated updates with the highest-converting local collaborations. No spam.
      </p>

      {subscribed ? (
        <div className="inline-flex items-center gap-2 font-heading font-bold text-sm text-[#1F9D6B] bg-[#E4F5EC] px-4 py-2 rounded-full">
          <CheckCircle2 className="h-4 w-4" /> You're on the list!
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 rounded-xl border border-[#E7E1D6] bg-[#FDFCFA] px-3.5 py-2.5 text-xs text-[#201A2B] outline-none focus:border-[#6C4BFF]"
          />
          <button
            type="submit"
            className="btn-violet rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export function HomePage(_props: HomePageProps = {}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="space-y-14">
      <HomeSeo />

      {/* Hero Section */}
      <section className="bg-white border border-[#E7E1D6] rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#201A2B] leading-[1.15]">
            Local businesses. Local creators. Zero distance.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#7A7286] leading-relaxed max-w-lg">
            Folksmint connects nano and micro creators with nearby businesses that need real, local promotion — paid or bartered, no agency, no minimum follower count.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/campaign"
              className="btn-coral inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs"
            >
              <Megaphone className="h-4 w-4" /> See live campaigns
            </Link>
            <Link
              to="/creators"
              className="btn-ghost inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              <Users className="h-4 w-4" /> Browse creators
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-[#E7E1D6]">
            <div className="font-mono-code text-xs text-[#201A2B]">
              <b className="font-extrabold text-base text-[#6C4BFF]">100+</b> creators signed up
            </div>
            <div className="font-mono-code text-xs text-[#201A2B]">
              <b className="font-extrabold text-base text-[#FF5A36]">18</b> campaigns live
            </div>
            <div className="font-mono-code text-xs text-[#201A2B]">
              <b className="font-extrabold text-base text-[#1F9D6B]">All of India</b> eligible
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <ReachRadar size={220} pulsing />
        </div>
      </section>

      {/* Money Banner */}
      <section className="bg-gradient-to-r from-[#FF5A36] to-[#6C4BFF] rounded-[20px] p-8 text-center text-white shadow-md">
        <Sparkles className="h-6 w-6 mx-auto mb-2 text-white/90" />
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
          One click. Real money.
        </h2>
        <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-md mx-auto leading-relaxed">
          Post a campaign or apply to one — everyone on Folksmint is one click closer to earning.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl text-[#201A2B]">
            What you actually get
          </h2>
          <p className="text-xs text-[#7A7286] mt-1">
            Built specifically for neighborhood commerce and hyper-local audience engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Businesses */}
          <div className="bg-[#FAF8F5] border border-[#E7E1D6] rounded-[20px] p-6 sm:p-8 space-y-4">
            <span className="badge-pill bg-[#FFEAE3] text-[#D6431E]">
              For businesses
            </span>
            <div className="font-heading font-bold text-lg text-[#201A2B]">
              More foot traffic. Less ad spend. All local.
            </div>
            <div className="space-y-4 pt-2">
              {BENEFITS.business.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#FF5A36] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-heading font-bold text-sm text-[#201A2B]">{b.title}</div>
                    <div className="text-xs text-[#7A7286] leading-relaxed mt-0.5">{b.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Creators */}
          <div className="bg-[#FAF8F5] border border-[#E7E1D6] rounded-[20px] p-6 sm:p-8 space-y-4">
            <span className="badge-pill bg-[#F1ECFF] text-[#5A3FE0]">
              For creators
            </span>
            <div className="font-heading font-bold text-lg text-[#201A2B]">
              Real income, right from your own neighborhood.
            </div>
            <div className="space-y-4 pt-2">
              {BENEFITS.creator.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#6C4BFF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-heading font-bold text-sm text-[#201A2B]">{b.title}</div>
                    <div className="text-xs text-[#7A7286] leading-relaxed mt-0.5">{b.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl text-[#201A2B]">
            How it works
          </h2>
          <p className="text-xs text-[#7A7286] mt-1">
            Simple 3-step lifecycle for business posts and creator applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="font-heading font-bold text-sm text-[#D6431E] uppercase tracking-wider mb-2">
              For businesses
            </div>
            {HOW_IT_WORKS.business.map((step, i) => (
              <div key={step.title} className="bg-white border border-[#E7E1D6] rounded-[16px] p-5">
                <div className="font-mono-code font-bold text-xs text-[#FF5A36] h-6 w-6 rounded-md bg-[#FFEAE3] flex items-center justify-center mb-2">
                  {i + 1}
                </div>
                <div className="font-heading font-bold text-sm text-[#201A2B]">{step.title}</div>
                <div className="text-xs text-[#7A7286] mt-1 leading-relaxed">{step.body}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="font-heading font-bold text-sm text-[#5A3FE0] uppercase tracking-wider mb-2">
              For creators
            </div>
            {HOW_IT_WORKS.creator.map((step, i) => (
              <div key={step.title} className="bg-white border border-[#E7E1D6] rounded-[16px] p-5">
                <div className="font-mono-code font-bold text-xs text-[#6C4BFF] h-6 w-6 rounded-md bg-[#F1ECFF] flex items-center justify-center mb-2">
                  {i + 1}
                </div>
                <div className="font-heading font-bold text-sm text-[#201A2B]">{step.title}</div>
                <div className="text-xs text-[#7A7286] mt-1 leading-relaxed">{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Teaser */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl text-[#201A2B]">
            Plans, starting at ₹0
          </h2>
          <p className="text-xs text-[#7A7286] mt-1">
            Grow at your own pace — from one-off local tests to fully managed sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`bg-white border rounded-[20px] p-6 flex flex-col justify-between ${
                p.tag === "violet"
                  ? "border-[#6C4BFF] shadow-[0_8px_24px_rgba(108,75,255,0.12)]"
                  : p.tag === "coral"
                  ? "border-[#FF5A36] shadow-[0_8px_24px_rgba(255,90,54,0.12)]"
                  : "border-[#E7E1D6]"
              }`}
            >
              <div>
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#7A7286]">
                  {p.name}
                </div>
                <div className="font-heading font-extrabold text-2xl text-[#201A2B] my-2">
                  {p.price}
                  <span className="text-xs font-normal text-[#7A7286]"> / {p.period}</span>
                </div>
                <p className="text-xs text-[#7A7286] leading-relaxed mb-4">
                  {p.pitch}
                </p>
              </div>
              <Link
                to="/pricing"
                className="font-heading font-bold text-xs text-[#6C4BFF] hover:underline inline-flex items-center gap-1"
              >
                Learn more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#7A7286]">
          <Wallet className="h-4 w-4 text-[#6C4BFF]" />
          <span>Creators: always free on barter · 5–10% payment-protection fee on paid deals only</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl text-[#201A2B]">
            Built for both sides
          </h2>
          <p className="text-xs text-[#7A7286] mt-1">
            Tools designed to make local sponsorships seamless, transparent, and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white border border-[#E7E1D6] rounded-[18px] p-6">
              <div className="h-9 w-9 rounded-xl bg-[#F1ECFF] text-[#5A3FE0] flex items-center justify-center mb-3">
                <f.icon className="h-4.5 w-4.5" />
              </div>
              <div className="font-heading font-bold text-sm text-[#201A2B] mb-1">{f.title}</div>
              <div className="text-xs text-[#7A7286] leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl text-[#201A2B]">
            Frequently asked
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQ.map((item, i) => (
            <div key={item.q} className="bg-white border border-[#E7E1D6] rounded-[14px] overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full text-left p-4.5 font-heading font-bold text-sm text-[#201A2B] flex items-center justify-between gap-4 cursor-pointer hover:text-[#6C4BFF] transition"
              >
                <span>{item.q}</span>
                <span className="font-mono-code text-base text-[#6C4BFF] shrink-0">
                  {faqOpen === i ? "−" : "+"}
                </span>
              </button>
              {faqOpen === i && (
                <p className="text-xs text-[#7A7286] leading-relaxed px-4.5 pb-4 pt-0">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <NewsletterSection />
      </section>
    </div>
  );
}

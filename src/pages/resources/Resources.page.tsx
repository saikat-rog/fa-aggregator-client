import { useEffect, useState } from "react";
import { FiExternalLink, FiLock, FiEye, FiPlusCircle, FiArrowRight } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  getApprovedBusinessRequirements,
  trackRequirementClickApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";

const PAGE_SIZE = 10;

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

type SampleCampaign = {
  _id: string;
  companyName: string;
  storeUsername?: string;
  category?: string;
  budget?: string;
  rewardType?: string;
  campaignGoal?: string;
  businessEmail?: string;
  url?: string;
  detailedRequirements?: string;
  socialLinks?: { instagram?: string; youtube?: string; telegram?: string };
};

const SAMPLE_CAMPAIGNS: SampleCampaign[] = [
  {
    _id: "sample-1",
    companyName: "Chai & Co.",
    storeUsername: "chaiandco",
    category: "Food & Cafes",
    budget: "$50",
    rewardType: "Cash + Free Drinks",
    campaignGoal: "Reel for new autumn menu",
    businessEmail: "collab@chaiandco.in",
    url: "https://chaiandco.in",
    detailedRequirements: "Visit our flagship cafe in Koregaon Park. Create a 30-45s engaging Instagram Reel showcasing our new signature spiced saffron chai & dessert pairing.",
    socialLinks: { instagram: "chaiandco_official" },
  },
  {
    _id: "sample-2",
    companyName: "Fernwood Salon & Spa",
    storeUsername: "fernwoodspa",
    category: "Beauty & Wellness",
    budget: "$30",
    rewardType: "Cash + Spa Package",
    campaignGoal: "Before/after story set",
    businessEmail: "partners@fernwood.com",
    url: "https://fernwood.com",
    detailedRequirements: "Experience our organic facial or hair therapy and post a 3-part aesthetic story set tagging @fernwoodspa with honest review and booking link.",
    socialLinks: { instagram: "fernwoodspa", telegram: "fernwooddeals" },
  },
  {
    _id: "sample-3",
    companyName: "Urban Threads",
    storeUsername: "urbanthreads",
    category: "Fashion & Retail",
    budget: "$75",
    rewardType: "Cash + Free Outfits",
    campaignGoal: "Try-on haul video",
    businessEmail: "creators@urbanthreads.store",
    url: "https://urbanthreads.store",
    detailedRequirements: "We'll send you 3 pieces from our modern streetwear collection. Produce 1 high-energy styling reel and 2 carousel photos.",
    socialLinks: { instagram: "urbanthreads", youtube: "urbanthreadsofficial" },
  },
  {
    _id: "sample-4",
    companyName: "PowerHouse Gym",
    storeUsername: "powerhousemumbai",
    category: "Fitness",
    budget: "$45",
    rewardType: "Cash + 3 Months Membership",
    campaignGoal: "Trainer day-in-the-life",
    businessEmail: "marketing@powerhousegym.in",
    url: "https://powerhousegym.in",
    detailedRequirements: "Film a dynamic gym workout session, showcase the equipment & trainers, and share your favorite post-workout protein smoothie.",
    socialLinks: { instagram: "powerhouse_mumbai" },
  },
  {
    _id: "sample-5",
    companyName: "Bloom Bakery",
    storeUsername: "bloombakery",
    category: "Food & Cafes",
    budget: "$35",
    rewardType: "Cash + Bakery Box",
    campaignGoal: "Product photography set",
    businessEmail: "hello@bloombakery.com",
    url: "https://bloombakery.com",
    detailedRequirements: "Capture 10 high-resolution lifestyle photos and short b-roll clips featuring our fresh pastries and artisanal sourdough breads.",
    socialLinks: { instagram: "bloombakeryhyd" },
  },
  {
    _id: "sample-6",
    companyName: "GlowLab Spa",
    storeUsername: "glowlab",
    category: "Beauty & Wellness",
    budget: "$35",
    rewardType: "Cash + Treatment",
    campaignGoal: "Client testimonial reel",
    businessEmail: "collab@glowlabspa.in",
    url: "https://glowlabspa.in",
    detailedRequirements: "Film an authentic video reviewing your skin glow treatment with before/after skin texture close-ups.",
    socialLinks: { instagram: "glowlabspa" },
  },
];

export function ResourcesPage() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<ApprovedBusinessRequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [appliedGigs, setAppliedGigs] = useState<Set<string>>(new Set());

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const showPostCampaignButton = !isAuthenticated || role === "user";

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const onPostCampaignClick = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    navigate("/campaign/apply");
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const payload = await getApprovedBusinessRequirements({ page, limit: PAGE_SIZE, type: "campaign" });
        if (!active) return;
        setRequirements(payload.requirements ?? []);
        setTotalPages(payload.pagination?.totalPages ?? 0);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : "Could not load approved requirements right now.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [page]);

  const onOpenResourceLink = async (id: string, fallbackUrl?: string) => {
    try {
      setTrackingId(id);
      const res = await trackRequirementClickApi(id, "campaign");
      const targetUrl = res.url || fallbackUrl;
      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    } finally {
      setTrackingId("");
    }
  };

  const toggleApplySample = (id: string) => {
    setAppliedGigs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div id="page-campaigns">
      {/* Header / Hero */}
      <section style={{ background: "var(--card)", borderBottom: "1px solid var(--line)", padding: "48px 0 36px" }}>
        <div className="wrap">
          <Link to="/" style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem" }}>
            ← Back to Folksmint
          </Link>
          <div className="section-head" style={{ marginTop: "20px" }}>
            <div className="kicker">Campaigns</div>
            <h2>Businesses hire. Creators apply.</h2>
            <p>Every campaign here comes from a real Folksmint business, paid directly through the platform.</p>

            {showPostCampaignButton && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={onPostCampaignClick}
                  className="pill-btn pill-navy"
                  style={{ padding: "10px 24px", fontSize: "0.9rem" }}
                >
                  <FiPlusCircle style={{ marginRight: "6px" }} />
                  Post a Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Campaign List Section */}
      <section style={{ padding: "48px 0 80px", background: "var(--bg)" }}>
        <div className="wrap">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 bg-[var(--card)] border border-[var(--line)] rounded-[24px]">
              <div className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--indigo)]">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--indigo)]" />
                <span>Loading campaigns...</span>
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-[20px] border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          {/* Interactive Fallback Cards when no live backend campaigns are present */}
          {!isLoading && !error && requirements.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SAMPLE_CAMPAIGNS.map((item) => {
                const isApplied = appliedGigs.has(item._id);
                const itemShareUrl = `${baseUrl}/campaign/${item.storeUsername || item._id}`;
                return (
                  <article
                    key={item._id}
                    className="flex flex-col justify-between rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7 shadow-xs hover:shadow-md transition duration-200"
                  >
                    <div>
                      {/* Card Top Title Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                              {item.companyName}
                            </h3>
                            {item.storeUsername ? (
                              <span className="text-xs font-bold text-[var(--indigo)] bg-[var(--indigo)]/10 px-2.5 py-0.5 rounded-full border border-[var(--indigo)]/20">
                                @{item.storeUsername}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg)] border border-[var(--line)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)] shrink-0">
                          <FiEye className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      </div>

                      {/* Badges Row */}
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {item.budget ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                            💰 Budget: {item.budget}
                          </span>
                        ) : null}
                        {item.rewardType ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                            🎁 Reward: {item.rewardType}
                          </span>
                        ) : null}
                        {item.category ? (
                          <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
                            🏷️ {item.category}
                          </span>
                        ) : null}
                        {item.campaignGoal ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                            🎯 Goal: {item.campaignGoal}
                          </span>
                        ) : null}
                      </div>

                      {/* Business Contact & Website */}
                      {item.businessEmail ? (
                        <p className="mt-3 text-xs sm:text-sm text-[var(--muted)]">
                          <span className="font-semibold text-[var(--navy)]">Business Email:</span>{" "}
                          <a href={`mailto:${item.businessEmail}`} className="text-[var(--indigo)] hover:underline">
                            {item.businessEmail}
                          </a>
                        </p>
                      ) : null}

                      {item.url ? (
                        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] truncate">
                          <span className="font-semibold text-[var(--navy)]">Website:</span>{" "}
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--indigo)] hover:underline font-medium"
                          >
                            {item.url}
                          </a>
                        </p>
                      ) : null}

                      {/* Social Links */}
                      {item.socialLinks && (item.socialLinks.instagram || item.socialLinks.youtube || item.socialLinks.telegram) ? (
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-semibold text-[var(--muted)]">Socials:</span>
                          {item.socialLinks.instagram ? (
                            <a
                              href={`https://instagram.com/${item.socialLinks.instagram}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-800 hover:bg-pink-100 transition"
                            >
                              <FaInstagram /> Instagram
                            </a>
                          ) : null}
                          {item.socialLinks.youtube ? (
                            <a
                              href={`https://youtube.com/${item.socialLinks.youtube.startsWith("@") ? item.socialLinks.youtube : `@${item.socialLinks.youtube}`}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800 hover:bg-red-100 transition"
                            >
                              <FaYoutube /> YouTube
                            </a>
                          ) : null}
                          {item.socialLinks.telegram ? (
                            <a
                              href={`https://t.me/${item.socialLinks.telegram.replace(/^@/, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition"
                            >
                              <FaTelegram /> Telegram
                            </a>
                          ) : null}
                        </div>
                      ) : null}

                      {/* What Should Creators Do Box */}
                      {item.detailedRequirements ? (
                        <div className="mt-3.5 rounded-[18px] bg-[var(--bg)] p-3.5 sm:p-4 border border-[var(--line)]">
                          <span className="text-xs font-bold text-[var(--navy)] block mb-1">
                            What should creators do?
                          </span>
                          <p className="text-xs sm:text-sm text-[var(--navy)]/80 leading-relaxed whitespace-pre-wrap">
                            {item.detailedRequirements}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-[var(--line)] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {item.url ? (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--indigo)] hover:underline cursor-pointer"
                          >
                            <span>Visit Official Site</span>
                            <FiExternalLink aria-hidden="true" />
                          </a>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={() => toggleApplySample(item._id)}
                          className={`apply-btn ${isApplied ? "applied" : ""}`}
                          style={{ minWidth: "90px", textAlign: "center" }}
                        >
                          {isApplied ? "Applied ✓" : "Apply Now"}
                        </button>
                      </div>

                      <SocialShareButtons
                        url={itemShareUrl}
                        title={`Check out creator campaign for ${item.companyName} on Folksmint`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {/* Live Backend Requirements */}
          {!isLoading && !error && requirements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requirements.map((item) => {
                const itemSlug = item.storeUsername || item._id;
                const itemShareUrl = `${baseUrl}/campaign/${itemSlug}`;
                return (
                  <article
                    key={item._id}
                    className="flex flex-col justify-between rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7 shadow-xs hover:shadow-md transition duration-200"
                  >
                    <div>
                      {/* Card Top Title Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/campaign/${itemSlug}`} className="group flex items-center gap-2 flex-wrap text-decoration-none">
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)] group-hover:text-[var(--indigo)] transition">
                              {item.companyName}
                            </h3>
                            {item.storeUsername ? (
                              <span className="text-xs font-bold text-[var(--indigo)] bg-[var(--indigo)]/10 px-2.5 py-0.5 rounded-full border border-[var(--indigo)]/20">
                                @{item.storeUsername}
                              </span>
                            ) : null}
                          </Link>
                        </div>
                        <Link
                          to={`/campaign/${itemSlug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-xs font-semibold text-[var(--navy)] hover:border-[var(--indigo)] hover:text-[var(--indigo)] transition shrink-0"
                        >
                          <FiEye className="h-3.5 w-3.5" />
                          Details
                        </Link>
                      </div>

                      {/* Badges Row */}
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {item.budget ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                            💰 Budget: {item.budget}
                          </span>
                        ) : null}
                        {item.rewardType ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                            🎁 Reward: {item.rewardType}
                          </span>
                        ) : null}
                        {item.category ? (
                          <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
                            🏷️ {item.category}
                          </span>
                        ) : null}
                        {item.campaignGoal ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                            🎯 Goal: {item.campaignGoal}
                          </span>
                        ) : null}
                      </div>

                      {/* Author / Posted By Info */}
                      {item.postedByAdvisorName ? (
                        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                          {item.instagramProfilePictureUrl ? (
                            <img
                              src={getProxiedImageUrl(item.instagramProfilePictureUrl)}
                              alt={item.postedByAdvisorName}
                              className="h-6 w-6 rounded-full object-cover border border-[var(--line)]"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--indigo)]/10 text-[10px] font-bold text-[var(--indigo)]">
                              {item.postedByAdvisorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span>
                            Posted by{" "}
                            {item.postedByAdvisorUsername ? (
                              <Link to={`/${item.postedByAdvisorUsername}`} className="font-semibold text-[var(--navy)] hover:text-[var(--indigo)] hover:underline">
                                {item.postedByAdvisorName}
                              </Link>
                            ) : (
                              <span className="font-semibold text-[var(--navy)]">{item.postedByAdvisorName}</span>
                            )}
                          </span>
                        </div>
                      ) : null}

                      {/* Business Email & Website */}
                      {item.businessEmail ? (
                        <p className="mt-3 text-xs sm:text-sm text-[var(--muted)]">
                          <span className="font-semibold text-[var(--navy)]">Business Email:</span>{" "}
                          <a href={`mailto:${item.businessEmail}`} className="text-[var(--indigo)] hover:underline">
                            {item.businessEmail}
                          </a>
                        </p>
                      ) : null}

                      {item.url ? (
                        <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] truncate">
                          <span className="font-semibold text-[var(--navy)]">Website / Link:</span>{" "}
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--indigo)] hover:underline font-medium"
                          >
                            {item.url}
                          </a>
                        </p>
                      ) : null}

                      {/* Social Links */}
                      {item.socialLinks && (item.socialLinks.instagram || item.socialLinks.youtube || item.socialLinks.telegram) ? (
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-semibold text-[var(--muted)]">Social Links:</span>
                          {item.socialLinks.instagram ? (
                            <a
                              href={`https://instagram.com/${item.socialLinks.instagram}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-800 hover:bg-pink-100 transition"
                            >
                              <FaInstagram /> Instagram
                            </a>
                          ) : null}
                          {item.socialLinks.youtube ? (
                            <a
                              href={`https://youtube.com/${item.socialLinks.youtube.startsWith("@") ? item.socialLinks.youtube : `@${item.socialLinks.youtube}`}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800 hover:bg-red-100 transition"
                            >
                              <FaYoutube /> YouTube
                            </a>
                          ) : null}
                          {item.socialLinks.telegram ? (
                            <a
                              href={`https://t.me/${item.socialLinks.telegram.replace(/^@/, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition"
                            >
                              <FaTelegram /> Telegram
                            </a>
                          ) : null}
                        </div>
                      ) : null}

                      {/* What Should Creators Do Box */}
                      {item.detailedRequirements ? (
                        <div className="mt-3.5 rounded-[18px] bg-[var(--bg)] p-3.5 sm:p-4 border border-[var(--line)]">
                          <span className="text-xs font-bold text-[var(--navy)] block mb-1">
                            What should creators do?
                          </span>
                          <p className="text-xs sm:text-sm text-[var(--navy)]/80 leading-relaxed whitespace-pre-wrap">
                            {item.detailedRequirements}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-[var(--line)] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {isAuthenticated && item.url ? (
                          <button
                            type="button"
                            disabled={trackingId === item._id}
                            onClick={() => void onOpenResourceLink(item._id, item.url)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--indigo)] hover:underline disabled:opacity-60 cursor-pointer"
                          >
                            <span>{trackingId === item._id ? "Opening..." : "View Resource Link"}</span>
                            <FiExternalLink aria-hidden="true" />
                          </button>
                        ) : !isAuthenticated ? (
                          <Link
                            to="/auth"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--indigo)] hover:underline"
                          >
                            <FiLock className="h-3.5 w-3.5 text-[var(--muted)]" />
                            Log in to access link
                          </Link>
                        ) : (
                          <span />
                        )}

                        <Link
                          to={`/campaign/${itemSlug}`}
                          className="inline-flex items-center gap-1.5 font-bold text-xs text-[var(--navy)] hover:text-[var(--indigo)] transition"
                        >
                          <span>Apply & Details</span>
                          <FiArrowRight />
                        </Link>
                      </div>

                      <SocialShareButtons
                        url={itemShareUrl}
                        title={`Check out business requirement for ${item.companyName} on Folksmint`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 ? (
            <nav aria-label="Requirements pagination" className="flex items-center justify-center gap-3 pt-10">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="chip disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-[var(--muted)]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="chip disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}



import { useEffect, useState } from "react";
import { FiExternalLink, FiLock, FiEye, FiFileText } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  getApprovedBusinessRequirements,
  trackRequirementClickApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";

const PAGE_SIZE = 12;
const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

const SAMPLE_BIOLINKS = [
  { name: "Angelica Kauffman", tag: "Fashion & Lifestyle", avatar: "👗", links: ["📷 Instagram", "🛍️ Shop the Look", "📅 Book a Call"] },
  { name: "Alexandra Silva", tag: "Beauty & Skincare", avatar: "💄", links: ["📷 Instagram", "💄 Shop Products", "✉️ Join Newsletter"] },
  { name: "Rohan Mehta", tag: "Fitness & Wellness", avatar: "🏋️", links: ["📷 Instagram", "🏋️ Book a Session", "🎥 YouTube Channel"] },
  { name: "Priya Nair", tag: "Food & Cafes", avatar: "🍰", links: ["📷 Instagram", "🍰 Shop Recipes", "📅 Book a Pop-up"] },
  { name: "Karan Bose", tag: "Tech & Gadgets", avatar: "🎧", links: ["📷 Instagram", "🎧 Shop Gear", "✉️ Join Newsletter"] },
  { name: "Sana Sheikh", tag: "Travel", avatar: "🧳", links: ["📷 Instagram", "🧳 Book a Trip", "🎥 YouTube Channel"] },
];

export function StorePage() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<ApprovedBusinessRequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const showApplyStoreButton = !isAuthenticated || role === "advisor";

  const onApplyStoreClick = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    navigate("/store/apply");
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const payload = await getApprovedBusinessRequirements({ page, limit: PAGE_SIZE, type: "store" });
        if (!active) return;
        setRequirements(payload.requirements ?? []);
        setTotalPages(payload.pagination?.totalPages ?? 0);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : "Could not load approved store listings right now.");
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
      const res = await trackRequirementClickApi(id, "store");
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

  return (
    <div id="page-biolinks">
      <section id="biolinks" style={{ background: "var(--card)", borderBottom: "1px solid var(--line)", padding: "60px 0" }}>
        <div className="wrap">
          <Link to="/" style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem" }}>
            ← Back to Folksmint
          </Link>
          <div className="section-head" style={{ marginTop: "20px" }}>
            <div className="kicker">Live Biolinks Store</div>
            <h2>Every creator's storefront, one tap away</h2>
            <p>Browse live Folksmint biolink pages — book a call, shop a drop, or join a newsletter, all in one place.</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "20px" }}>
              <span className="cat-pill font-bold">
                {requirements.length > 0 ? `${requirements.length} Live Creator Stores` : "Verified Creator Storefronts"}
              </span>
              {showApplyStoreButton && (
                <button
                  type="button"
                  onClick={onApplyStoreClick}
                  className="pill-btn pill-navy"
                  style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                >
                  <FiFileText style={{ marginRight: "6px" }} />
                  Apply for store listing
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 bg-[var(--bg)] border border-[var(--line)] rounded-[20px]">
              <div className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--indigo)]">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--indigo)]" />
                <span>Loading store listings...</span>
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          {!isLoading && !error && requirements.length === 0 ? (
            <div id="biolinkList" className="biolink-grid">
              {SAMPLE_BIOLINKS.map((c) => (
                <div key={c.name} className="biolink-card">
                  <div className="avatar">{c.avatar}</div>
                  <h4>{c.name}</h4>
                  <div className="tagline">{c.tag}</div>
                  {c.links.map((l) => (
                    <button key={l} type="button" className="link-pill">
                      {l}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : null}

      {!isLoading && !error && requirements.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {requirements.map((item) => {
            const itemSlug = item.storeUsername || item._id;
            const itemShareUrl = `${baseUrl}/store/${itemSlug}`;
            return (
              <article
                key={item._id}
                className="bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:border-[var(--indigo)] transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/store/${itemSlug}`} className="group">
                      <h2 className="font-heading text-lg font-bold text-[var(--ink)] group-hover:text-[var(--indigo)] transition">
                        {item.companyName}
                      </h2>
                    </Link>
                    <Link
                      to={`/store/${itemSlug}`}
                      className="inline-flex items-center gap-1 font-heading text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] px-2.5 py-1 rounded-lg shrink-0 transition"
                    >
                      <FiEye className="h-3 w-3" />
                      Details
                    </Link>
                  </div>

                  {item.postedByAdvisorName ? (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
                      {item.instagramProfilePictureUrl ? (
                        <img
                          src={getProxiedImageUrl(item.instagramProfilePictureUrl)}
                          alt={item.postedByAdvisorName}
                          className="h-5 w-5 rounded-full object-cover border border-[var(--line)]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-[var(--indigo)]">
                          {item.postedByAdvisorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>
                        Posted by{" "}
                        {item.postedByAdvisorUsername ? (
                          <Link to={`/${item.postedByAdvisorUsername}`} className="font-semibold text-[var(--ink)] hover:text-[var(--indigo)]">
                            {item.postedByAdvisorName}
                          </Link>
                        ) : (
                          <span className="font-semibold text-[var(--ink)]">{item.postedByAdvisorName}</span>
                        )}
                      </span>
                    </div>
                  ) : null}

                  {item.businessEmail ? (
                    <p className="mt-3 text-xs text-[var(--muted)]">
                      <span className="font-semibold text-[var(--ink)]">Business Email:</span>{" "}
                      <a href={`mailto:${item.businessEmail}`} className="text-[var(--indigo)] hover:underline">
                        {item.businessEmail}
                      </a>
                    </p>
                  ) : null}

                  {item.socialLinks && (item.socialLinks.instagram || item.socialLinks.youtube || item.socialLinks.telegram) ? (
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      {item.socialLinks.instagram ? (
                        <a
                          href={`https://instagram.com/${item.socialLinks.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--indigo)]"
                        >
                          <FaInstagram className="text-pink-600" /> Instagram
                        </a>
                      ) : null}
                      {item.socialLinks.youtube ? (
                        <a
                          href={`https://youtube.com/${item.socialLinks.youtube.startsWith("@") ? item.socialLinks.youtube : `@${item.socialLinks.youtube}`}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--indigo)]"
                        >
                          <FaYoutube className="text-red-600" /> YouTube
                        </a>
                      ) : null}
                      {item.socialLinks.telegram ? (
                        <a
                          href={`https://t.me/${item.socialLinks.telegram.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--indigo)]"
                        >
                          <FaTelegram className="text-blue-500" /> Telegram
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {item.detailedRequirements ? (
                    <p className="mt-3 text-xs text-[var(--muted)] line-clamp-3">
                      <span className="font-semibold text-[var(--ink)]">Store Details:</span> {item.detailedRequirements}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--line)] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {isAuthenticated && item.url ? (
                      <button
                        type="button"
                        disabled={trackingId === item._id}
                        onClick={() => void onOpenResourceLink(item._id, item.url)}
                        className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-[var(--indigo)] hover:underline disabled:opacity-60 cursor-pointer"
                      >
                        {trackingId === item._id ? "Opening..." : "View Store Link"}
                        <FiExternalLink aria-hidden="true" />
                      </button>
                    ) : !isAuthenticated ? (
                      <Link
                        to="/auth"
                        className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-[var(--indigo)] hover:underline"
                      >
                        <FiLock className="h-3.5 w-3.5 text-[var(--muted)]" />
                        Log in to access link
                      </Link>
                    ) : null}

                    <Link
                      to={`/store/${itemSlug}`}
                      className="font-heading text-xs font-bold text-[var(--ink)] hover:text-[var(--indigo)]"
                    >
                      Store Details →
                    </Link>
                  </div>

                  <SocialShareButtons
                    url={itemShareUrl}
                    title={`Check out store listing for ${item.companyName}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

          {!isLoading && !error && totalPages > 1 ? (
            <nav aria-label="Store pagination" className="flex items-center justify-center gap-3 pt-6">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="chip"
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
                className="chip"
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



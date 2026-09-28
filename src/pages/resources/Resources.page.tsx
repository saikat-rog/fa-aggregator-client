import { useEffect, useState, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  getApprovedBusinessRequirements,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";

const PAGE_SIZE = 10;

const SAMPLE_CAMPAIGNS = [
  { name: "Chai & Co. — reel for new autumn menu", cat: "Food", payout: "$50", meta: "Pune · 1 reel, in-store shoot" },
  { name: "Fernwood Salon — before/after story set", cat: "Beauty", payout: "$30", meta: "Bengaluru · 3 stories" },
  { name: "Urban Threads — try-on haul video", cat: "Retail", payout: "$75", meta: "Delhi · 1 video, 2 posts" },
  { name: "PowerHouse Gym — trainer day-in-the-life", cat: "Fitness", payout: "$45", meta: "Mumbai · 1 reel" },
  { name: "Bloom Bakery — product photography set", cat: "Food", payout: "$35", meta: "Hyderabad · 10 photos" },
  { name: "GlowLab Spa — client testimonial reel", cat: "Beauty", payout: "$35", meta: "Chennai · 1 reel" },
];

export function ResourcesPage() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<ApprovedBusinessRequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [appliedGigs, setAppliedGigs] = useState<Set<string>>(new Set());

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const showPostCampaignButton = !isAuthenticated || role === "user";

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

  const toggleApplySample = (name: string) => {
    setAppliedGigs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const filteredSampleCampaigns = useMemo(() => {
    if (selectedCat === "all") return SAMPLE_CAMPAIGNS;
    return SAMPLE_CAMPAIGNS.filter((c) => c.cat.toLowerCase().includes(selectedCat.toLowerCase()));
  }, [selectedCat]);

  return (
    <div id="page-campaigns">
      <section id="campaigns" style={{ background: "var(--card)", borderBottom: "1px solid var(--line)", padding: "60px 0" }}>
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
                  style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                >
                  <FiPlusCircle style={{ marginRight: "6px" }} />
                  Post a Campaign
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="chip-row" id="chipRow">
            {[
              { id: "all", label: "All" },
              { id: "Food", label: "Food & cafes" },
              { id: "Retail", label: "Retail" },
              { id: "Beauty", label: "Beauty & wellness" },
              { id: "Fitness", label: "Fitness" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedCat(chip.id)}
                className={`chip ${selectedCat === chip.id ? "active" : ""}`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 bg-[var(--bg)] border border-[var(--line)] rounded-[20px]">
              <div className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--indigo)]">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--indigo)]" />
                <span>Loading campaigns...</span>
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          {/* When no live backend campaigns, show interactive curated campaigns from design */}
          {!isLoading && !error && requirements.length === 0 ? (
            <div id="campaignList">
              {filteredSampleCampaigns.map((c) => {
                const isApplied = appliedGigs.has(c.name);
                return (
                  <div key={c.name} className="campaign-row">
                    <div>
                      <h4>{c.name}</h4>
                      <div className="meta">{c.meta}</div>
                    </div>
                    <div className="cat-pill">{c.cat}</div>
                    <div className="payout">{c.payout}</div>
                    <button
                      type="button"
                      onClick={() => toggleApplySample(c.name)}
                      className={`apply-btn ${isApplied ? "applied" : ""}`}
                    >
                      {isApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Live backend requirements */}
          {!isLoading && !error && requirements.length > 0 ? (
            <div id="campaignList">
              {requirements.map((item) => {
                const itemSlug = item.storeUsername || item._id;
                const payoutDisplay = item.budget ? item.budget : "$35 - $100";
                return (
                  <article key={item._id} className="campaign-row">
                    <div>
                      <Link to={`/campaign/${itemSlug}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h4>
                          {item.companyName} {item.campaignGoal ? `— ${item.campaignGoal}` : ""}
                        </h4>
                      </Link>
                      <div className="meta">
                        {item.category || "General"} · {item.detailedRequirements ? item.detailedRequirements.slice(0, 75) + "..." : "Local promotion"}
                      </div>
                    </div>

                    <div className="cat-pill">{item.category || "Brand"}</div>
                    <div className="payout">{payoutDisplay}</div>
                    <Link to={`/campaign/${itemSlug}`} className="apply-btn">
                      Apply
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : null}

          {!isLoading && !error && totalPages > 1 ? (
            <nav aria-label="Requirements pagination" className="flex items-center justify-center gap-3 pt-6">
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



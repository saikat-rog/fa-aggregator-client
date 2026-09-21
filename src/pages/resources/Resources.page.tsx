import { useEffect, useState } from "react";
import { FiExternalLink, FiLock, FiEye, FiPlusCircle } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  getApprovedBusinessRequirements,
  trackRequirementClickApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";
import { ReachRadar } from "../../components/home/ReachRadar";

const PAGE_SIZE = 10;

export function ResourcesPage() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<ApprovedBusinessRequirementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");

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

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

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

  return (
    <div className="space-y-8">
      {/* Mohalla Header */}
      <section className="bg-white border border-[#E7E1D6] rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#201A2B] tracking-tight">
            Every campaign live on Folksmint.
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#7A7286] leading-relaxed">
            Admin-reviewed campaigns only — open to anyone browsing, no account needed until you're ready to apply.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="font-mono-code text-xs text-[#201A2B] bg-[#F1ECFF] px-3.5 py-1.5 rounded-full font-semibold">
              <b className="text-[#6C4BFF]">{requirements.length}</b> live campaigns
            </span>
            {showPostCampaignButton && (
              <button
                type="button"
                onClick={onPostCampaignClick}
                className="btn-coral inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold shadow-xs cursor-pointer"
              >
                <FiPlusCircle className="h-4 w-4" />
                Post a campaign
              </button>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <ReachRadar size={180} pulsing />
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 bg-white border border-[#E7E1D6] rounded-[20px]">
          <div className="inline-flex items-center gap-3 text-sm font-semibold text-[#6C4BFF]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
            <span>Loading campaigns...</span>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && requirements.length === 0 ? (
        <div className="bg-white border border-[#E7E1D6] rounded-[20px] p-10 text-center">
          <p className="font-heading font-bold text-lg text-[#201A2B]">No live campaigns right now</p>
          <p className="text-xs text-[#7A7286] mt-1">Check back soon for new local campaign drops.</p>
        </div>
      ) : null}

      {!isLoading && !error && requirements.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {requirements.map((item) => {
            const itemSlug = item.storeUsername || item._id;
            const itemShareUrl = `${baseUrl}/campaign/${itemSlug}`;
            return (
              <article
                key={item._id}
                className="bg-white border border-[#E7E1D6] rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/campaign/${itemSlug}`} className="group flex items-center gap-2 flex-wrap">
                        <h2 className="font-heading text-lg font-bold text-[#201A2B] group-hover:text-[#6C4BFF] transition">
                          {item.companyName}
                        </h2>
                        {item.storeUsername ? (
                          <span className="font-mono-code text-[11px] font-semibold text-[#6C4BFF] bg-[#F1ECFF] px-2 py-0.5 rounded-full">
                            @{item.storeUsername}
                          </span>
                        ) : null}
                      </Link>
                    </div>
                    <Link
                      to={`/campaign/${itemSlug}`}
                      className="inline-flex items-center gap-1 font-heading text-xs font-semibold text-[#7A7286] hover:text-[#201A2B] bg-[#FAF8F5] border border-[#E7E1D6] px-2.5 py-1 rounded-lg shrink-0 transition"
                    >
                      <FiEye className="h-3 w-3" />
                      Details
                    </Link>
                  </div>

                  {/* Pills */}
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {item.budget ? (
                      <span className="badge-pill bg-[#FFEAE3] text-[#D6431E]">
                        💰 Budget: {item.budget}
                      </span>
                    ) : null}
                    {item.rewardType ? (
                      <span className="badge-pill bg-[#F1ECFF] text-[#5A3FE0]">
                        🎁 Reward: {item.rewardType}
                      </span>
                    ) : null}
                    {item.category ? (
                      <span className="badge-pill bg-[#FAF8F5] border border-[#E7E1D6] text-[#201A2B]">
                        🏷️ {item.category}
                      </span>
                    ) : null}
                    {item.campaignGoal ? (
                      <span className="badge-pill bg-[#FAF8F5] border border-[#E7E1D6] text-[#7A7286]">
                        🎯 Goal: {item.campaignGoal}
                      </span>
                    ) : null}
                  </div>

                  {item.detailedRequirements ? (
                    <div className="mt-3.5 text-xs text-[#4C4557] rounded-xl bg-[#FAF8FF] p-3.5 border border-[#EFEBFF]">
                      <span className="font-heading font-bold text-[#201A2B] block mb-1">
                        What should creators do?
                      </span>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {item.detailedRequirements}
                      </p>
                    </div>
                  ) : null}

                  {item.businessEmail ? (
                    <p className="mt-3 text-xs text-[#7A7286]">
                      <span className="font-semibold text-[#201A2B]">Business Email:</span>{" "}
                      <a href={`mailto:${item.businessEmail}`} className="text-[#6C4BFF] hover:underline">
                        {item.businessEmail}
                      </a>
                    </p>
                  ) : null}

                  {item.socialLinks && (item.socialLinks.instagram || item.socialLinks.youtube || item.socialLinks.telegram) ? (
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-semibold text-[#7A7286]">Social Links:</span>
                      {item.socialLinks.instagram ? (
                        <a
                          href={`https://instagram.com/${item.socialLinks.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[#E7E1D6] bg-[#FDFCFA] px-2.5 py-0.5 text-xs font-semibold text-[#201A2B] hover:border-[#6C4BFF]"
                        >
                          <FaInstagram className="text-[#FF5A36]" /> Instagram
                        </a>
                      ) : null}
                      {item.socialLinks.youtube ? (
                        <a
                          href={`https://youtube.com/${item.socialLinks.youtube.startsWith("@") ? item.socialLinks.youtube : `@${item.socialLinks.youtube}`}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[#E7E1D6] bg-[#FDFCFA] px-2.5 py-0.5 text-xs font-semibold text-[#201A2B] hover:border-[#FF5A36]"
                        >
                          <FaYoutube className="text-[#D6431E]" /> YouTube
                        </a>
                      ) : null}
                      {item.socialLinks.telegram ? (
                        <a
                          href={`https://t.me/${item.socialLinks.telegram.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[#E7E1D6] bg-[#FDFCFA] px-2.5 py-0.5 text-xs font-semibold text-[#201A2B] hover:border-[#6C4BFF]"
                        >
                          <FaTelegram className="text-[#6C4BFF]" /> Telegram
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 pt-4 border-t border-[#E7E1D6] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {isAuthenticated && item.url ? (
                      <button
                        type="button"
                        disabled={trackingId === item._id}
                        onClick={() => void onOpenResourceLink(item._id, item.url)}
                        className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-[#6C4BFF] hover:text-[#5A3FE0] disabled:opacity-60 cursor-pointer"
                      >
                        {trackingId === item._id ? "Opening..." : "View Resource Link"}
                        <FiExternalLink aria-hidden="true" />
                      </button>
                    ) : !isAuthenticated ? (
                      <Link
                        to="/auth"
                        className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-[#6C4BFF] hover:underline"
                      >
                        <FiLock className="h-3.5 w-3.5 text-[#7A7286]" />
                        Log in to access link
                      </Link>
                    ) : null}

                    <Link
                      to={`/campaign/${itemSlug}`}
                      className="font-heading text-xs font-bold text-[#201A2B] hover:text-[#6C4BFF]"
                    >
                      Apply & Details →
                    </Link>
                  </div>

                  <SocialShareButtons
                    url={itemShareUrl}
                    title={`Check out business requirement for ${item.companyName}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {!isLoading && !error && totalPages > 1 ? (
        <nav aria-label="Requirements pagination" className="flex items-center justify-center gap-3 pt-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
            className="rounded-xl border border-[#E7E1D6] bg-white px-4 py-2 font-heading text-xs font-semibold text-[#201A2B] disabled:opacity-50 hover:bg-[#F0ECE4] transition"
          >
            Previous
          </button>
          <span className="font-mono-code text-xs text-[#7A7286]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-xl border border-[#E7E1D6] bg-white px-4 py-2 font-heading text-xs font-semibold text-[#201A2B] disabled:opacity-50 hover:bg-[#F0ECE4] transition"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}

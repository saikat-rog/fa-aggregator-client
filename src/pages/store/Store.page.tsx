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
import { ReachRadar } from "../../components/home/ReachRadar";

const PAGE_SIZE = 10;
const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

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
    <div className="space-y-8">
      {/* Mohalla Header */}
      <section className="bg-white border border-[#E7E1D6] rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#201A2B] tracking-tight">
            Discover verified creator storefronts.
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#7A7286] leading-relaxed">
            Explore dedicated store profiles, exclusive services, and direct partnerships posted by verified local creators.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="font-mono-code text-xs text-[#201A2B] bg-[#F1ECFF] px-3.5 py-1.5 rounded-full font-semibold">
              <b className="text-[#6C4BFF]">{requirements.length}</b> stores active
            </span>
            {showApplyStoreButton && (
              <button
                type="button"
                onClick={onApplyStoreClick}
                className="btn-violet inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold shadow-xs cursor-pointer"
              >
                <FiFileText className="h-4 w-4" />
                Apply for store listing
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
        <div className="bg-white border border-[#E7E1D6] rounded-[20px] p-10 text-center">
          <p className="font-heading font-bold text-lg text-[#201A2B]">No store listings available yet</p>
          <p className="text-xs text-[#7A7286] mt-1">Check back soon for new creator drops and store listings.</p>
        </div>
      ) : null}

      {!isLoading && !error && requirements.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {requirements.map((item) => {
            const itemSlug = item.storeUsername || item._id;
            const itemShareUrl = `${baseUrl}/store/${itemSlug}`;
            return (
              <article
                key={item._id}
                className="bg-white border border-[#E7E1D6] rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/store/${itemSlug}`} className="group">
                      <h2 className="font-heading text-lg font-bold text-[#201A2B] group-hover:text-[#6C4BFF] transition">
                        {item.companyName}
                      </h2>
                    </Link>
                    <Link
                      to={`/store/${itemSlug}`}
                      className="inline-flex items-center gap-1 font-heading text-xs font-semibold text-[#7A7286] hover:text-[#201A2B] bg-[#FAF8F5] border border-[#E7E1D6] px-2.5 py-1 rounded-lg shrink-0 transition"
                    >
                      <FiEye className="h-3 w-3" />
                      Details
                    </Link>
                  </div>

                  {item.postedByAdvisorName ? (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#7A7286]">
                      {item.instagramProfilePictureUrl ? (
                        <img
                          src={getProxiedImageUrl(item.instagramProfilePictureUrl)}
                          alt={item.postedByAdvisorName}
                          className="h-5 w-5 rounded-full object-cover border border-[#E7E1D6]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F1ECFF] text-[10px] font-bold text-[#5A3FE0]">
                          {item.postedByAdvisorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>
                        Posted by{" "}
                        {item.postedByAdvisorUsername ? (
                          <Link to={`/${item.postedByAdvisorUsername}`} className="font-semibold text-[#201A2B] hover:text-[#6C4BFF]">
                            {item.postedByAdvisorName}
                          </Link>
                        ) : (
                          <span className="font-semibold text-[#201A2B]">{item.postedByAdvisorName}</span>
                        )}
                      </span>
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

                  {item.detailedRequirements ? (
                    <p className="mt-3 text-xs text-[#7A7286] line-clamp-3">
                      <span className="font-semibold text-[#201A2B]">Store Details:</span> {item.detailedRequirements}
                    </p>
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
                        {trackingId === item._id ? "Opening..." : "View Store Link"}
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
                      to={`/store/${itemSlug}`}
                      className="font-heading text-xs font-bold text-[#201A2B] hover:text-[#6C4BFF]"
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
        <nav aria-label="Store pagination" className="flex items-center justify-center gap-3 pt-4">
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

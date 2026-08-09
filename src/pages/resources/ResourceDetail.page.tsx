import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiExternalLink, FiLock, FiBriefcase } from "react-icons/fi";
import {
  getApprovedBusinessRequirementByIdPublic,
  trackRequirementClickApi,
  type ApprovedBusinessRequirementItem,
} from "../../services/businessRequirements.service";
import { SocialShareButtons } from "../../components/resources/SocialShareButtons";

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [requirement, setRequirement] = useState<ApprovedBusinessRequirementItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const item = await getApprovedBusinessRequirementByIdPublic(id);
        if (!active) return;
        setRequirement(item);
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Resource not found or failed to load.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [id]);

  const onOpenResourceLink = async () => {
    if (!id || !requirement) return;
    try {
      setTracking(true);
      const res = await trackRequirementClickApi(id);
      const targetUrl = res.url || requirement.url;
      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      if (requirement.url) {
        window.open(requirement.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setTracking(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to All Approved Resources
      </Link>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
          <p className="mt-3 text-sm font-medium">Loading resource details...</p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="text-base font-semibold">{error}</p>
          <Link
            to="/resources"
            className="mt-4 inline-block rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Explore Resources
          </Link>
        </div>
      ) : null}

      {!isLoading && !error && requirement ? (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <FiBriefcase className="h-3.5 w-3.5" />
                Verified Business Requirement
              </span>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{requirement.companyName}</h1>
              {requirement.postedByAdvisorName ? (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  {requirement.instagramProfilePictureUrl ? (
                    <img
                      src={getProxiedImageUrl(requirement.instagramProfilePictureUrl)}
                      alt={requirement.postedByAdvisorName}
                      className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                      {requirement.postedByAdvisorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Posted by Advisor</span>
                    {requirement.postedByAdvisorUsername ? (
                      <Link
                        to={`/${requirement.postedByAdvisorUsername}`}
                        className="block text-base font-bold text-slate-900 hover:text-blue-700 transition"
                      >
                        {requirement.postedByAdvisorName}{" "}
                        <span className="text-xs font-normal text-slate-500">(@{requirement.postedByAdvisorUsername})</span>
                      </Link>
                    ) : (
                      <p className="text-base font-bold text-slate-900">{requirement.postedByAdvisorName}</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>


          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Campaign Objective</p>
              <p className="mt-1 text-base font-medium text-slate-900">{requirement.campaignObjective || "—"}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Desired Influencer Scope</p>
              <p className="mt-1 text-base font-medium text-slate-900">{requirement.desiredInfluencerScope || "—"}</p>
            </div>
          </div>

          {requirement.detailedRequirements ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Detailed Requirements</h3>
              <p className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
                {requirement.detailedRequirements}
              </p>
            </div>
          ) : null}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              {isAuthenticated && requirement.url ? (
                <button
                  type="button"
                  disabled={tracking}
                  onClick={() => void onOpenResourceLink()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60 cursor-pointer"
                >
                  {tracking ? "Opening..." : "View Official Resource Link"}
                  <FiExternalLink className="h-4 w-4" />
                </button>
              ) : !isAuthenticated ? (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <FiLock className="h-4 w-4 text-blue-600" />
                  Log in to Access Official Resource Link
                </Link>
              ) : null}
            </div>

            <SocialShareButtons
              url={shareUrl}
              title={`Requirement details for ${requirement.companyName}`}
            />
          </div>
        </article>
      ) : null}
    </div>
  );
}

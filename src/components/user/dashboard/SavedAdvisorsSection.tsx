import { FaBookmark, FaRotateRight } from "react-icons/fa6";
import { AdvisorCard, type AdvisorCardData } from "../../advisor/AdvisorCard";
import type { SavedAdvisor } from "../../../services/advisor.service";

type SavedAdvisorsSectionProps = {
  isLoading: boolean;
  error: string;
  savedAdvisors: SavedAdvisor[];
  onRefresh: () => void;
};

export function SavedAdvisorsSection({
  isLoading,
  error,
  savedAdvisors,
  onRefresh,
}: SavedAdvisorsSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-800">
          <FaBookmark className="text-blue-700" />
          Saved Advisors
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FaRotateRight className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-flex items-center gap-3 text-sm font-medium text-blue-700">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
            <span>Loading advisors...</span>
          </div>
        </div>
      ) : error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      ) : savedAdvisors.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">No saved advisors yet</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {savedAdvisors.map((advisor) => {
            const cardData: AdvisorCardData = {
              id: advisor.id,
              name: advisor.name?.trim() || "Verified Advisor",
              username: advisor.username || "unknown",
              industries: advisor.industries ?? [],
              country: advisor.country || "Unknown country",
              state: advisor.state || "Unknown state",
              marketFocus: advisor.marketFocus ?? ["All Markets"],
              specialties:
                advisor.expertiseIndeces?.length
                  ? advisor.expertiseIndeces
                  : advisor.marketFocus?.length
                    ? advisor.marketFocus
                    : ["General Planning"],
              about: advisor.about || "No advisor bio available yet.",
              personalWebsite: advisor.personalWebsite,
              emailForContact: advisor.emailForContact,
              socialLinks: advisor.socialLinks,
            };

            return <AdvisorCard key={advisor.id} advisor={cardData} />;
          })}
        </div>
      )}
    </section>
  );
}

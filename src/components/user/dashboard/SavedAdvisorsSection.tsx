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
        <div className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50 p-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
            <FaBookmark className="h-5 w-5" />
          </div>
          <p className="text-base font-semibold text-slate-800">No saved advisors yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Save advisors while browsing to shortlist and compare later.
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            <FaRotateRight className="h-3.5 w-3.5" />
            Refresh list
          </button>
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

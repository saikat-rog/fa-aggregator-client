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
    <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 md:p-8 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 text-xl font-bold font-heading text-[#201A2B]">
            <FaBookmark className="text-[#FF5A36] h-5 w-5" />
            Saved Creators
          </h2>
          <p className="text-xs text-[#7A7286] mt-0.5">
            Quickly access creators you bookmarked for current or future campaigns.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-1.5 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-[#6C4BFF]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
            <span>Loading saved creators...</span>
          </div>
        </div>
      ) : error ? (
        <p className="rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] p-4 text-xs font-medium text-[#B91C1C]">
          {error}
        </p>
      ) : savedAdvisors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E7E1D6] bg-[#FAF8F5] p-8 text-center">
          <p className="text-sm font-bold font-heading text-[#201A2B]">No saved creators yet</p>
          <p className="mt-1 text-xs text-[#7A7286]">
            Bookmark creators you want to keep handy for quick reference and collaboration.
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2 text-xs font-bold font-heading text-[#201A2B] hover:bg-[#FAF8F5] transition cursor-pointer shadow-xs"
          >
            <FaRotateRight className="h-3 w-3 text-[#7A7286]" />
            Refresh list
          </button>
        </div>
      ) : (
        <div className="mt-4 grid auto-rows-fr gap-4 md:grid-cols-2">
          {savedAdvisors.map((advisor) => {
            const cardData: AdvisorCardData = {
              id: advisor.id,
              name: advisor.name?.trim() || "Verified Advisor",
              username: advisor.username || "unknown",
              industries: advisor.industries ?? [],
              country: advisor.country?.trim() || "",
              state: advisor.state?.trim() || "",
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
              ppp: advisor.ppp,
              category: advisor.category,
              instagramFollowers: advisor.instagramFollowers,
              youtubeSubscribers: advisor.youtubeSubscribers,
              telegramFollowers: advisor.telegramFollowers,
              followersCount:
                (advisor.instagramFollowers || 0) +
                (advisor.youtubeSubscribers || 0) +
                (advisor.telegramFollowers || 0) ||
                null,
              instagramEngagementRateScore: advisor.instagramEngagementRateScore,
            };

            return <AdvisorCard key={advisor.id} advisor={cardData} />;
          })}
        </div>
      )}
    </section>
  );
}

import { FaBookmark, FaInbox, FaBullhorn, FaUsers } from "react-icons/fa6";

type UserStatsCardsProps = {
  enquiriesLoading: boolean;
  totalEnquiries: number;
  savedLoading: boolean;
  totalSavedAdvisors: number;
  campaignsLoading?: boolean;
  totalCampaigns?: number;
  totalAdvisorsApplied?: number;
};

export function UserStatsCards({
  enquiriesLoading,
  totalEnquiries,
  savedLoading,
  totalSavedAdvisors,
  campaignsLoading = false,
  totalCampaigns = 0,
  totalAdvisorsApplied = 0,
}: UserStatsCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Campaigns */}
      <article className="bg-white border border-[#E7E1D6] rounded-[18px] p-4.5 flex items-center gap-3.5 shadow-xs">
        <div className="h-11 w-11 rounded-[12px] bg-[#FFEAE3] text-[#D6431E] flex items-center justify-center shrink-0">
          <FaBullhorn className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading font-extrabold text-2xl text-[#201A2B] leading-none">
            {campaignsLoading ? "..." : totalCampaigns}
          </p>
          <p className="text-xs text-[#7A7286] font-medium mt-1">Campaigns posted</p>
        </div>
      </article>

      {/* 2. Total Creators Applied */}
      <article className="bg-white border border-[#E7E1D6] rounded-[18px] p-4.5 flex items-center gap-3.5 shadow-xs">
        <div className="h-11 w-11 rounded-[12px] bg-[#F1ECFF] text-[#5A3FE0] flex items-center justify-center shrink-0">
          <FaUsers className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading font-extrabold text-2xl text-[#201A2B] leading-none">
            {campaignsLoading ? "..." : totalAdvisorsApplied}
          </p>
          <p className="text-xs text-[#7A7286] font-medium mt-1">Creators applied</p>
        </div>
      </article>

      {/* 3. Total Enquiries */}
      <article className="bg-white border border-[#E7E1D6] rounded-[18px] p-4.5 flex items-center gap-3.5 shadow-xs">
        <div className="h-11 w-11 rounded-[12px] bg-[#E4F5EC] text-[#137A50] flex items-center justify-center shrink-0">
          <FaInbox className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading font-extrabold text-2xl text-[#201A2B] leading-none">
            {enquiriesLoading ? "..." : totalEnquiries}
          </p>
          <p className="text-xs text-[#7A7286] font-medium mt-1">Direct enquiries</p>
        </div>
      </article>

      {/* 4. Total Saved Creators */}
      <article className="bg-white border border-[#E7E1D6] rounded-[18px] p-4.5 flex items-center gap-3.5 shadow-xs">
        <div className="h-11 w-11 rounded-[12px] bg-[#FFF8E6] text-[#B8860B] flex items-center justify-center shrink-0">
          <FaBookmark className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading font-extrabold text-2xl text-[#201A2B] leading-none">
            {savedLoading ? "..." : totalSavedAdvisors}
          </p>
          <p className="text-xs text-[#7A7286] font-medium mt-1">Saved creators</p>
        </div>
      </article>
    </section>
  );
}

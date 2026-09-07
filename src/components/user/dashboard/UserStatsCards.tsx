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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Campaigns Applied / Posted by user */}
      <article className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm hover:border-indigo-200 transition">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FaBullhorn className="text-indigo-600" />
          Total Campaigns
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {campaignsLoading ? "..." : totalCampaigns}
        </p>
        <p className="mt-1 text-xs text-slate-500">Campaigns posted by you</p>
      </article>

      {/* 2. Total Advisors Applied to user campaigns */}
      <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm hover:border-blue-200 transition">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FaUsers className="text-blue-600" />
          Advisors Applied
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {campaignsLoading ? "..." : totalAdvisorsApplied}
        </p>
        <p className="mt-1 text-xs text-slate-500">Unique advisors per campaign</p>
      </article>

      {/* 3. Total Enquiries */}
      <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm hover:border-emerald-200 transition">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FaInbox className="text-emerald-600" />
          Total Enquiries
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {enquiriesLoading ? "..." : totalEnquiries}
        </p>
        <p className="mt-1 text-xs text-slate-500">All direct enquiries sent</p>
      </article>

      {/* 4. Total Saved Advisors */}
      <article className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm hover:border-amber-200 transition">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FaBookmark className="text-amber-600" />
          Saved Advisors
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {savedLoading ? "..." : totalSavedAdvisors}
        </p>
        <p className="mt-1 text-xs text-slate-500">Your shortlisted advisors</p>
      </article>
    </section>
  );
}

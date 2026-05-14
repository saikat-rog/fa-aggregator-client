import { FaBookmark, FaInbox } from "react-icons/fa6";

type UserStatsCardsProps = {
  enquiriesLoading: boolean;
  totalEnquiries: number;
  savedLoading: boolean;
  totalSavedAdvisors: number;
};

export function UserStatsCards({
  enquiriesLoading,
  totalEnquiries,
  savedLoading,
  totalSavedAdvisors,
}: UserStatsCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-4">
      <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FaInbox className="text-blue-600" />
          Total Enquiries
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {enquiriesLoading ? "..." : totalEnquiries}
        </p>
        <p className="mt-1 text-xs text-slate-500">All enquiries submitted by you</p>
      </article>

      <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <FaBookmark className="text-blue-600" />
          Total Saved Advisors
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {savedLoading ? "..." : totalSavedAdvisors}
        </p>
        <p className="mt-1 text-xs text-slate-500">Your saved advisors list size</p>
      </article>
    </section>
  );
}

import { FaReadme } from "react-icons/fa6";

type DailyGrowthSectionProps = {
  onReadNow: () => void;
};

export function DailyGrowthSection({ onReadNow }: DailyGrowthSectionProps) {
  return (
    <section>
      <div className="w-full rounded-2xl p-5 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full text-blue-700">
          <FaReadme className="h-10 w-10" />
        </span>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          Daily Growth
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">Grow yourself by daily reading</p>
        <p className="mt-1 text-sm text-slate-600">
          Explore insights and stay sharp with fresh blog content.
        </p>
        <button
          type="button"
          onClick={onReadNow}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Read Now
        </button>
      </div>
    </section>
  );
}

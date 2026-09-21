import { FaReadme } from "react-icons/fa6";

type DailyGrowthSectionProps = {
  onReadNow: () => void;
};

export function DailyGrowthSection({ onReadNow }: DailyGrowthSectionProps) {
  return (
    <section className="rounded-[22px] border border-[#E7E1D6] bg-white p-6 md:p-8 text-center shadow-xs">
      <div className="max-w-md mx-auto space-y-2">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFEAE3] text-[#D6431E] shadow-xs">
          <FaReadme className="h-6 w-6" />
        </span>
        <p className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#FF5A36] pt-1">
          Daily Growth
        </p>
        <p className="text-xl font-bold font-heading text-[#201A2B]">Grow with creator marketing insights</p>
        <p className="text-xs text-[#7A7286]">
          Explore guides, tips, and case studies to supercharge your influencer partnerships.
        </p>
        <button
          type="button"
          onClick={onReadNow}
          className="mt-3 btn-coral inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
        >
          Read Blog Insights →
        </button>
      </div>
    </section>
  );
}

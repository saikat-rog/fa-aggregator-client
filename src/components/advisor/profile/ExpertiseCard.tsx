import { FaCircleCheck, FaBullseye } from "react-icons/fa6";

type ExpertiseCardProps = {
  advisorId: string;
  marketFocus?: string[];
  expertiseIndeces?: string[];
};

export function ExpertiseCard({
  advisorId,
  marketFocus,
  expertiseIndeces,
}: ExpertiseCardProps) {
  return (
    <section className="space-y-6 rounded-[24px] border border-[#E7E1D6] bg-white p-6 shadow-sm">
      {/* Target Market Focus */}
      <div>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A36]/10 text-[#FF5A36]">
            <FaBullseye className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#7A7286]">
              Target Audience
            </p>
            <h2 className="text-sm font-bold font-heading text-[#201A2B]">Market Focus</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {marketFocus?.length ? (
            marketFocus.map((item) => (
              <span
                key={`${advisorId}-${item}`}
                className="inline-flex items-center rounded-full border border-[#FF5A36]/20 bg-[#FFEAE3]/50 px-3 py-1 text-xs font-semibold text-[#D6431E]"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-xs text-[#7A7286]">No market focus specified</p>
          )}
        </div>
      </div>

      {/* Expertise & Niches */}
      <div>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C4BFF]/10 text-[#6C4BFF]">
            <FaCircleCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#7A7286]">
              Skills &amp; Content
            </p>
            <h2 className="text-sm font-bold font-heading text-[#201A2B]">Expertise Indices</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {expertiseIndeces?.length ? (
            expertiseIndeces.map((item) => (
              <span
                key={`${advisorId}-${item}`}
                className="inline-flex items-center rounded-full border border-[#6C4BFF]/20 bg-[#F1ECFF] px-3 py-1 text-xs font-semibold text-[#6C4BFF]"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-xs text-[#7A7286]">No expertise indices specified</p>
          )}
        </div>
      </div>
    </section>
  );
}

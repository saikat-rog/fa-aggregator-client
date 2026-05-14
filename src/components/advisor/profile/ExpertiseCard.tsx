import { FaCircleCheck } from "react-icons/fa6";

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
    <section className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full text-blue-700">
          <FaCircleCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Market Focus &amp;
          </p>
          <h2 className="text-base font-semibold text-slate-900">Expertise</h2>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {marketFocus?.length ? (
            marketFocus.map((item) => (
              <span
                key={`${advisorId}-${item}`}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No market focus specified</p>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full text-blue-700">
          <FaCircleCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Expertise &amp;
          </p>
          <h2 className="text-base font-semibold text-slate-900">Indeces</h2>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {expertiseIndeces?.length ? (
            expertiseIndeces.map((item) => (
              <span
                key={`${advisorId}-${item}`}
                className="inline-flex items-center rounded-full bg-blue-700 px-3 py-1.5 text-sm font-medium text-white"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No expertise indices specified</p>
          )}
        </div>
      </div>
    </section>
  );
}

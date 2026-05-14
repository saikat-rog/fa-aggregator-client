import { FaCircleInfo } from "react-icons/fa6";

type AboutCardProps = {
  about: string;
};

export function AboutCard({ about }: AboutCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] lg:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700">
          <FaCircleInfo className="w-6 h-6"/>
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            About
          </p>
          <h2 className="text-base font-semibold text-slate-900">
            Awareness Focus
          </h2>
        </div>
      </div>
      <p className="text-sm leading-7 text-slate-600">{about}</p>
    </section>
  );
}

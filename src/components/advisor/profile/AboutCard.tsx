import { FaCircleInfo } from "react-icons/fa6";

type AboutCardProps = {
  about: string;
};

export function AboutCard({ about }: AboutCardProps) {
  return (
    <section className="rounded-[24px] border border-[#E7E1D6] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C4BFF]/10 text-[#6C4BFF]">
          <FaCircleInfo className="w-5 h-5"/>
        </span>
        <div>
          <p className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#7A7286]">
            About the Creator
          </p>
          <h2 className="text-base font-bold font-heading text-[#201A2B]">
            Bio & Creative Focus
          </h2>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-[#7A7286] whitespace-pre-wrap">{about || "No biography provided."}</p>
    </section>
  );
}

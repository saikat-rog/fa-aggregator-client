import { FaCircleInfo } from "react-icons/fa6";

export function EducationalDisclaimer() {
  return (
    <div className="rounded-[18px] border border-[#E7E1D6] bg-[#FFFBF0] px-4 py-3.5 sm:px-6 shadow-xs">
      <p className="flex items-center gap-2 text-xs font-bold font-heading uppercase tracking-wider text-[#B8860B]">
        <FaCircleInfo className="h-3.5 w-3.5 text-[#B8860B]" />
        Creator Discovery & Awareness Directory
      </p>
      <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#7A7286]">
        This profile is provided for hyperlocal creator discovery and collaboration. Ensure you connect directly to verify campaign terms, metrics, and deliverable agreements.
      </p>
    </div>
  );
}

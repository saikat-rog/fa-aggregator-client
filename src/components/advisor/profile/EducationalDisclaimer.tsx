import { FaCircleInfo } from "react-icons/fa6";

export function EducationalDisclaimer() {
  return (
    <div className="border-b border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-6">
      <p className="flex items-center gap-2 text-sm font-semibold text-yellow-500">
        <FaCircleInfo className="text-yellow-500" />
        Educational Directory Disclaimer
      </p>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
        This profile is provided for educational discovery and awareness. We do
        not endorse or verify the listed professional, and the details shown
        here are intended for informational use only.
      </p>
    </div>
  );
}

import { FaEnvelope, FaEye, FaEyeSlash, FaGlobe } from "react-icons/fa6";

type ProfessionalConnectCardProps = {
  personalWebsite?: string;
  emailForContact?: string;
  userCanOpenLinks: boolean;
  revealedContactInfo: { website: boolean; email: boolean };
  onWebsiteOpen: (url: string) => void;
  onEmailOpen: (mailto: string) => void;
  onReveal: (type: "website" | "email") => void;
};

export function ProfessionalConnectCard({
  personalWebsite,
  emailForContact,
  userCanOpenLinks,
  revealedContactInfo,
  onWebsiteOpen,
  onEmailOpen,
  onReveal,
}: ProfessionalConnectCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        Connect Professionally
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {personalWebsite && (
          <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
            <p
              className={`mt-2 break-all rounded-xl px-2.5 py-2 text-xs text-slate-700 ${
                revealedContactInfo.website && userCanOpenLinks
                  ? "bg-white"
                  : "bg-slate-100 blur-sm select-none"
              }`}
            >
              {personalWebsite}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => onWebsiteOpen(personalWebsite)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 transition hover:text-blue-800"
              >
                <FaGlobe /> Website
              </button>
              <button
                type="button"
                onClick={() => onReveal("website")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {revealedContactInfo.website ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        )}

        {emailForContact && (
          <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
            <p
              className={`mt-2 break-all rounded-xl px-2.5 py-2 text-xs text-slate-700 ${
                revealedContactInfo.email && userCanOpenLinks
                  ? "bg-white"
                  : "bg-slate-100 blur-sm select-none"
              }`}
            >
              {emailForContact}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => onEmailOpen(`mailto:${emailForContact}`)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 transition hover:text-blue-800"
              >
                <FaEnvelope /> Email
              </button>
              <button
                type="button"
                onClick={() => onReveal("email")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {revealedContactInfo.email ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

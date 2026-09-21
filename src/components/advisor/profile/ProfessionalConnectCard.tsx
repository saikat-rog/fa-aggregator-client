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
    <section className="rounded-[24px] border border-[#E7E1D6] bg-white p-6 shadow-sm">
      <p className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#7A7286]">
        Connect Directly
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {personalWebsite && (
          <div className="flex h-full flex-col rounded-2xl border border-[#E7E1D6] bg-[#FAF8F5] p-3.5 sm:p-4">
            <p
              className={`mt-2 break-all rounded-xl px-2.5 py-2 text-xs font-semibold ${
                revealedContactInfo.website && userCanOpenLinks
                  ? "bg-white text-[#201A2B] border border-[#E7E1D6]"
                  : "bg-[#E7E1D6]/30 text-[#7A7286] blur-xs select-none"
              }`}
            >
              {personalWebsite}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <button
                type="button"
                onClick={() => onWebsiteOpen(personalWebsite)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C4BFF] transition hover:underline"
              >
                <FaGlobe /> Website
              </button>
              <button
                type="button"
                onClick={() => onReveal("website")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-white px-2.5 py-1 text-[10px] font-bold text-[#201A2B] transition hover:bg-[#FAF8F5]"
              >
                {revealedContactInfo.website ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        )}

        {emailForContact && (
          <div className="flex h-full flex-col rounded-2xl border border-[#E7E1D6] bg-[#FAF8F5] p-3.5 sm:p-4">
            <p
              className={`mt-2 break-all rounded-xl px-2.5 py-2 text-xs font-semibold ${
                revealedContactInfo.email && userCanOpenLinks
                  ? "bg-white text-[#201A2B] border border-[#E7E1D6]"
                  : "bg-[#E7E1D6]/30 text-[#7A7286] blur-xs select-none"
              }`}
            >
              {emailForContact}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <button
                type="button"
                onClick={() => onEmailOpen(`mailto:${emailForContact}`)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A36] transition hover:underline"
              >
                <FaEnvelope /> Email
              </button>
              <button
                type="button"
                onClick={() => onReveal("email")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-white px-2.5 py-1 text-[10px] font-bold text-[#201A2B] transition hover:bg-[#FAF8F5]"
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

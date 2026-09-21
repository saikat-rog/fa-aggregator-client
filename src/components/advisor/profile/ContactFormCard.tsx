import { FaCircleCheck, FaLock, FaPaperPlane } from "react-icons/fa6";

type FormData = {
  subject: string;
  message: string;
  category: string;
};

type ContactFormCardProps = {
  advisorName: string;
  formData: FormData;
  formSubmitting: boolean;
  canSubmitEnquiry: boolean;
  formMessage: { type: "success" | "error"; text: string } | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onLockedSubmit: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ContactFormCard({
  advisorName,
  formData,
  formSubmitting,
  canSubmitEnquiry,
  formMessage,
  onChange,
  onLockedSubmit,
  onSubmit,
}: ContactFormCardProps) {
  return (
    <section className="rounded-[24px] border border-[#E7E1D6] bg-white p-6 sm:p-7 shadow-sm">
      <div className="space-y-1">
        <p className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#FF5A36]">
          Direct Connection
        </p>
        <h2 className="text-xl font-extrabold font-heading text-[#201A2B]">
          Collaborate with {advisorName}
        </h2>
        <p className="text-xs leading-relaxed text-[#7A7286]">
          Send a direct campaign proposal or collaboration inquiry. The creator will receive your message instantly.
        </p>
      </div>

      {formMessage && (
        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs font-semibold ${
            formMessage.type === "success"
              ? "border-[#1F9D6B]/30 bg-[#1F9D6B]/10 text-[#1F9D6B]"
              : "border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C]"
          }`}
        >
          <div className="inline-flex items-center gap-2">
            {formMessage.type === "success" ? (
              <FaCircleCheck className="h-4 w-4" />
            ) : null}
            <span>{formMessage.text}</span>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#201A2B]">
            Inquiry Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] outline-none transition focus:border-[#FF5A36] focus:bg-white focus:ring-2 focus:ring-[#FF5A36]/10"
          >
            <option value="general">General Collaboration</option>
            <option value="consultation">Paid Campaign Pitch</option>
            <option value="mentoring">Barter / Gifting Deal</option>
            <option value="partnership">Brand Sponsorship</option>
            <option value="other">Store Visit & Review</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#201A2B]">
            Subject / Deal Title
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={onChange}
            placeholder="e.g. Hyperlocal promo for cafe opening"
            required
            className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] outline-none transition placeholder:text-[#7A7286]/60 focus:border-[#FF5A36] focus:bg-white focus:ring-2 focus:ring-[#FF5A36]/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#201A2B]">
            Message &amp; Offer Details
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={onChange}
            rows={5}
            required
            placeholder="Describe your brand, deliverables expected, and timeline..."
            className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] outline-none transition placeholder:text-[#7A7286]/60 focus:border-[#FF5A36] focus:bg-white focus:ring-2 focus:ring-[#FF5A36]/10"
          />
        </div>

        <button
          type="submit"
          disabled={formSubmitting}
          onClick={(event) => {
            if (!canSubmitEnquiry) {
              event.preventDefault();
              onLockedSubmit();
            }
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A36] px-5 py-3 text-xs font-bold font-heading text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {formSubmitting ? (
            "Sending inquiry..."
          ) : (
            <>
              {!canSubmitEnquiry ? (
                <FaLock className="h-3.5 w-3.5" />
              ) : (
                <FaPaperPlane className="h-3.5 w-3.5" />
              )}
              Send Inquiry
            </>
          )}
        </button>
      </form>
    </section>
  );
}

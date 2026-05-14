import { FaCircleCheck, FaLock } from "react-icons/fa6";

type FormData = {
  subject: string;
  message: string;
  countryCode: string;
  phone: string;
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
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
        Contact
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-950">
        Contact {advisorName}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Send a direct inquiry. You will receive a response via email.
      </p>

      {formMessage && (
        <div
          className={`mt-4 rounded-2xl border p-4 text-sm ${
            formMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="general">General Inquiry</option>
            <option value="consultation">Consultation Request</option>
            <option value="mentoring">Mentoring Program</option>
            <option value="partnership">Partnership Opportunity</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={onChange}
            placeholder="Subject of your enquiry"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <div className="flex items-stretch gap-2">
            <div className="flex h-12 w-24 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="flex h-full items-center border-r border-slate-200 bg-slate-50 px-2 text-sm font-semibold text-slate-500">
                +
              </div>
              <input
                name="countryCode"
                value={formData.countryCode}
                onChange={onChange}
                inputMode="numeric"
                aria-label="Country code"
                placeholder="91"
                className="h-full w-full bg-transparent px-2 text-center text-sm font-medium text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="Enter your phone number"
              inputMode="numeric"
              pattern="^$|[0-9]{7,15}$"
              title="Enter a valid phone number (7-15 digits)."
              className="h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={onChange}
            rows={5}
            required
            placeholder="Enter your message"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
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
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {formSubmitting ? (
            "Sending..."
          ) : (
            <>
              {!canSubmitEnquiry ? <FaLock className="mr-2 h-3.5 w-3.5" /> : null}
              Send Inquiry
            </>
          )}
        </button>
      </form>
    </section>
  );
}

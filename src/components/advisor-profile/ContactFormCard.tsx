type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
};

type ContactFormCardProps = {
  advisorName: string;
  formData: FormData;
  formSubmitting: boolean;
  formMessage: { type: "success" | "error"; text: string } | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ContactFormCard({
  advisorName,
  formData,
  formSubmitting,
  formMessage,
  onChange,
  onSubmit,
}: ContactFormCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-700">
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
          {formMessage.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
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
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
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
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
        </div>

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

        <button
          type="submit"
          disabled={formSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {formSubmitting ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </section>
  );
}

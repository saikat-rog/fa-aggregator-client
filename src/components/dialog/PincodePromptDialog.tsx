import { useState } from "react";
import { FiUnlock } from "react-icons/fi";
import { updateUserPincode } from "../../services/advisor.service";

interface PincodePromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PincodePromptDialog({
  open,
  onClose,
  onSuccess,
}: PincodePromptDialogProps) {
  const [pincode, setPincode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = pincode.trim();
    if (!/^[1-9]\d{5}$/.test(normalized)) {
      setError("Enter a valid 6-digit Indian PIN code");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await updateUserPincode(normalized);
      sessionStorage.setItem("pincodeCollected", "true");
      onSuccess();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { msg?: string } } }).response?.data
              ?.msg
          : undefined;
      setError(msg || "Unable to save PIN code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-bold text-slate-900">
          Enter your PIN code
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Please provide your 6-digit PIN code to access protected advisor contact details and info.
        </p>
        <label className="mt-4 block text-xs font-semibold text-slate-700">
          PIN code
          <input
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            autoFocus
            required
            placeholder="e.g. 400001"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        {error ? (
          <p role="alert" className="mt-3 text-xs font-semibold text-rose-600">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiUnlock className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Unlock Info"}
          </button>
        </div>
      </form>
    </div>
  );
}

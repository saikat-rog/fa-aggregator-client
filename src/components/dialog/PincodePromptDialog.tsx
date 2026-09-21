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
      localStorage.setItem("pincodeCollected", "true");
      localStorage.setItem("userPincode", normalized);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#201A2B]/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[24px] border border-[#E7E1D6] bg-[#FFFFFF] p-6 shadow-2xl"
      >
        <h2 className="text-xl font-bold font-heading text-[#201A2B]">
          Enter your PIN code
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-[#7A7286]">
          Please provide your 6-digit PIN code to access protected creator contact details and info.
        </p>
        <label className="mt-4 block text-xs font-semibold text-[#201A2B]">
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
            className="mt-1.5 w-full rounded-[12px] border border-[#E7E1D6] bg-[#FAF8F5] px-4 py-2.5 text-base font-semibold text-[#201A2B] outline-none transition focus:border-[#FF5A36] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#FF5A36]/10"
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
            className="rounded-[12px] border border-[#E7E1D6] bg-[#FFFFFF] px-4 py-2.5 text-xs font-bold text-[#201A2B] transition hover:bg-[#F3EFEA] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#FF5A36] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiUnlock className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Unlock Info"}
          </button>
        </div>
      </form>
    </div>
  );
}

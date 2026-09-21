type AdvisorActionType = "website" | "email" | "social" | null;

interface AuthPromptDialogProps {
  open: boolean;
  role: string | null;
  actionType: AdvisorActionType;
  onClose: () => void;
  onLoginAsUser: () => void;
  onLogoutAndLoginAsUser: () => void;
}

export function AuthPromptDialog({
  open,
  role,
  actionType,
  onClose,
  onLoginAsUser,
  onLogoutAndLoginAsUser,
}: AuthPromptDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#201A2B]/60 backdrop-blur-xs px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-[24px] border border-[#E7E1D6] bg-[#FFFFFF] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="advisor-auth-dialog-title"
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5A36]">
            {role === "advisor" ? "Creator action not allowed" : "Sign in required"}
          </p>
          <h3 id="advisor-auth-dialog-title" className="text-2xl font-bold font-heading tracking-tight text-[#201A2B]">
            {role === "advisor"
              ? "Switch to a business account to continue"
              : "Login to continue"}
          </h3>
          <p className="text-sm leading-6 text-[#7A7286]">
            {role === "advisor"
              ? actionType === "email"
                ? "You need a business account before you can contact this creator."
                : actionType === "website"
                  ? "You need a business account before you can open creator websites."
                  : "You need a business account before you can open social links."
              : "Please login as a business to continue."}
          </p>
        </div>

        <div className="mt-6">
          {role === "advisor" ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center rounded-[12px] border border-[#E7E1D6] bg-[#FFFFFF] px-4 py-3 text-sm font-semibold text-[#201A2B] transition hover:bg-[#F3EFEA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onLogoutAndLoginAsUser}
                className="inline-flex flex-1 items-center justify-center rounded-[12px] bg-[#FF5A36] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
              >
                Logout & Switch
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginAsUser}
              className="inline-flex w-full items-center justify-center rounded-[12px] bg-[#FF5A36] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm font-heading"
            >
              Login as Business
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

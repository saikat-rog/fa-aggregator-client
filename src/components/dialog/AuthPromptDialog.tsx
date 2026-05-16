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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl shadow-slate-950/30"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="advisor-auth-dialog-title"
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            {role === "advisor" ? "Advisor action not allowed" : "Sign in required"}
          </p>
          <h3 id="advisor-auth-dialog-title" className="text-2xl font-semibold tracking-tight text-slate-900">
            {role === "advisor"
              ? "Switch to a user account to continue"
              : "Login to continue"}
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            {role === "advisor"
              ? actionType === "email"
                ? "You need a user account before you can contact this advisor."
                : actionType === "website"
                  ? "You need a user account before you can open advisor websites."
                  : "You need a user account before you can open social links."
              : "Please login to continue."}
          </p>
        </div>

        <div className="mt-6">
          {role === "advisor" ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onLogoutAndLoginAsUser}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginAsUser}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

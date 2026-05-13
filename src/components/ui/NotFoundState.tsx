import { FaArrowLeft, FaCircleExclamation } from "react-icons/fa6";

type NotFoundStateProps = {
  title?: string;
  message?: string;
  buttonLabel?: string;
  onButtonClick: () => void;
};

export function NotFoundState({
  title = "Page Not Found",
  message = "This page is not found.",
  buttonLabel = "Go to Home Page",
  onButtonClick,
}: NotFoundStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-32px)] items-center justify-center px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl p-8 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <FaCircleExclamation className="h-7 lg:h-13 lg:w-14 w-7" />
          </div>
          <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-slate-600">{message}</p>
          <button
            type="button"
            onClick={onButtonClick}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FaArrowLeft /> {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

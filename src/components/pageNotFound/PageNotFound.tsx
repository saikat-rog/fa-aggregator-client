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
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-md w-full">
        <div className="rounded-[24px] border border-[#E7E1D6] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36]">
            <FaCircleExclamation className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl lg:text-3xl font-extrabold font-heading text-[#201A2B]">{title}</h2>
          <p className="mt-2 text-xs sm:text-sm text-[#7A7286] font-medium leading-relaxed">{message}</p>
          <button
            type="button"
            onClick={onButtonClick}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#201A2B] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#201A2B]/90 active:scale-95"
          >
            <FaArrowLeft className="text-[#FF5A36]" /> {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock, FiAlertCircle } from "react-icons/fi";
import { StoreForm } from "../../components/advisor/StoreForm";

export function StoreApplyPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6 px-4">
      {/* Back button */}
      <div>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Stores
        </Link>
      </div>

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-12 text-center text-white lg:px-10 shadow-lg">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-indigo-600/30 blur-3xl" />
        <h1 className="relative text-3xl font-extrabold lg:text-5xl tracking-tight">
          Store Listing Application
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-base text-blue-100 font-medium">
          Fill out your store details & requirement information. Once approved by an Admin, your store listing will be published live.
        </p>
      </section>

      {/* Content area based on Auth & Role */}
      {!token ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <FiLock className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Advisor Authentication Required</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            You must be logged in as an Advisor to submit a Store Listing application.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer"
            >
              Log In / Sign Up as Advisor
            </button>
          </div>
        </div>
      ) : role === "user" ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <FiAlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-amber-900">Advisor Access Required</h2>
          <p className="mt-2 text-sm text-amber-800 max-w-md mx-auto">
            Store listing applications are reserved for Advisors. As a User, you can post a Campaign requirement!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/campaign/apply"
              className="rounded-xl bg-amber-700 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-800 transition"
            >
              Go to Post a Campaign
            </Link>
          </div>
        </div>
      ) : (
        <StoreForm />
      )}
    </div>
  );
}

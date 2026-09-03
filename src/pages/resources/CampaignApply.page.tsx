import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock, FiAlertCircle } from "react-icons/fi";
import { CampaignForm } from "../../components/user/CampaignForm";

export function CampaignApplyPage() {
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
          to="/campaign"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
      </div>

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 px-6 py-12 text-center text-white lg:px-10 shadow-lg">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-blue-600/30 blur-3xl" />
        <h1 className="relative text-3xl font-extrabold lg:text-5xl tracking-tight">
          Post a Campaign Requirement
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-base text-blue-100 font-medium">
          Fill out your campaign goals & requirements. Once approved by an Admin, your campaign will be published live.
        </p>
      </section>

      {/* Content area based on Auth & Role */}
      {!token ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <FiLock className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">User Authentication Required</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            You must be logged in as a User to post a Campaign requirement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer"
            >
              Log In / Sign Up as User
            </button>
          </div>
        </div>
      ) : role === "advisor" ? (
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <FiAlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-indigo-900">User Access Required</h2>
          <p className="mt-2 text-sm text-indigo-800 max-w-md mx-auto">
            Campaign requirements are for Users. As an Advisor, you can submit a Store listing application!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/store/apply"
              className="rounded-xl bg-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-800 transition"
            >
              Go to Store Listing Application
            </Link>
          </div>
        </div>
      ) : (
        <CampaignForm />
      )}
    </div>
  );
}

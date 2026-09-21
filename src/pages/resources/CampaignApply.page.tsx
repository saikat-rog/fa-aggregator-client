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
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A7286] hover:text-[#FF5A36] transition"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
      </div>

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#FF5A36] to-[#6C4BFF] px-6 py-12 text-center text-white lg:px-10 shadow-sm">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-black/10 blur-3xl" />
        <h1 className="relative text-3xl font-extrabold font-heading lg:text-5xl tracking-tight">
          Post a Campaign Requirement
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-base text-white/90 font-medium">
          Fill out your campaign goals & requirements. Once approved by an Admin, your campaign will be published live to local creators.
        </p>
      </section>

      {/* Content area based on Auth & Role */}
      {!token ? (
        <div className="rounded-[24px] border border-[#E7E1D6] bg-[#FFFFFF] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5A36]/10 text-[#FF5A36]">
            <FiLock className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold font-heading text-[#201A2B]">Business Authentication Required</h2>
          <p className="mt-2 text-sm text-[#7A7286] max-w-md mx-auto">
            You must be logged in as a Business to post a Campaign requirement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="rounded-[12px] bg-[#FF5A36] px-6 py-3 text-sm font-bold text-white shadow-sm hover:brightness-110 transition cursor-pointer font-heading"
            >
              Log In / Sign Up as Business
            </button>
          </div>
        </div>
      ) : role === "advisor" ? (
        <div className="rounded-[24px] border border-[#6C4BFF]/20 bg-[#6C4BFF]/5 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#6C4BFF]/15 text-[#6C4BFF]">
            <FiAlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold font-heading text-[#201A2B]">Business Access Required</h2>
          <p className="mt-2 text-sm text-[#7A7286] max-w-md mx-auto">
            Campaign requirements are for Businesses. As a Creator, you can submit a Store listing application!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/store/apply"
              className="rounded-[12px] bg-[#6C4BFF] px-6 py-3 text-sm font-bold text-white shadow-sm hover:brightness-110 transition font-heading"
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

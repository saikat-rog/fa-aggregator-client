import { useState, useEffect } from "react";
import { StoreForm } from "../../components/advisor/StoreForm";
import { CampaignForm } from "../../components/user/CampaignForm";

export function ContactPage() {
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#FF5A36] to-[#6C4BFF] px-6 py-12 text-center text-white lg:px-10 shadow-sm">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-black/10 blur-3xl" />
        <h1 className="relative text-3xl font-extrabold font-heading lg:text-5xl">
          {role === "user" ? "Submit Campaign Requirement" : "Submit Store Requirement"}
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-base text-white/90 font-medium">
          {role === "user"
            ? "Share your campaign goals & contact info. Approved campaigns will be listed in the Campaign section for local creators."
            : "Share your store details & contact info. Approved store requirements will be listed in the Store section."}
        </p>
      </section>

      {token && role === "user" ? (
        <CampaignForm />
      ) : token && role === "advisor" ? (
        <StoreForm />
      ) : (
        <div className="space-y-6">
          <StoreForm />
        </div>
      )}
    </div>
  );
}

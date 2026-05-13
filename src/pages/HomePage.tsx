import { useEffect, useMemo, useState } from "react";
import { getAllAdvisorsApi } from "../services/advisor.service";
import { AdvisorCard } from "../components/advisor/AdvisorCard";
import type { AdvisorCardData } from "../components/advisor/AdvisorCard";

export interface AdvisorApiItem {
  id: string;
  profilePictureUrl?: string;
  name?: string;
  country?: string;
  state?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    instagramFollowers?: number;
    linkedinFollowers?: number;
    twitterFollowers?: number;
    facebookFollowers?: number;
    youtubeSubscribers?: number;
  };
  about?: string;
  marketFocus?: string[];
  expertiseIndeces?: string[];
  emailForContact?: string;
  personalWebsite?: string;
  username?: string;
}

export function HomePage() {
  const [query, setQuery] = useState("");
  const [advisors, setAdvisors] = useState<AdvisorCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadAdvisors = async () => {
      try {
        setIsLoading(true);
        setError("");

        const payload = await getAllAdvisorsApi();
        const data = payload?.data ?? payload;

        const mapped = ((data?.advisors as AdvisorApiItem[]) || []).map(
          (item) => ({
            id: item.id,
            name: item.name?.trim() || "Verified Advisor",
            username: item.username || "Anonymous",
            country: item.country || "Unknown country",
            state: item.state || "Unknown state",
            marketFocus: item.marketFocus || ["All Markets"],
            specialties: item.expertiseIndeces?.length
              ? item.expertiseIndeces
              : item.marketFocus?.length
                ? item.marketFocus
                : ["General Planning"],
            about:
              item.about ||
              item.emailForContact ||
              "No advisor bio available yet.",
            profilePictureUrl: item.profilePictureUrl,
            personalWebsite: item.personalWebsite,
            emailForContact: item.emailForContact,
            socialLinks: item.socialLinks,
          }),
        );

        setAdvisors(mapped);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Unable to load advisors";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvisors();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredAdvisors = useMemo(() => {
    const term = query.toLowerCase().trim();

    return advisors.filter((advisor) => {
      if (!term) {
        return true;
      }

      const haystack =
        `${advisor.country} ${advisor.state} ${advisor.specialties.join(" ")} ${advisor.name} ${advisor.about}`.toLowerCase();

      return haystack.includes(term);
    });
  }, [advisors, query]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
        <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
          /u • User Home
        </p>
        <h1 className="text-3xl font-bold">
          Find Trusted Financial Advisors Near You
        </h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Search by location, specialty, or advisor name and discover verified
          experts.
        </p>
        <div className="mt-6 rounded-2xl bg-white p-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by country, state, service, or advisor name"
            className="w-full rounded-xl px-4 py-3 text-slate-900 outline-none"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Available Financial Advisors
        </h2>

        {isLoading ? (
          <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Loading advisors...
          </p>
        ) : null}

        {error ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}. Make sure the backend is running and reachable.
          </p>
        ) : null}

        {!isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAdvisors.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && filteredAdvisors.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            No advisors matched your search. Try another location or specialty.
          </p>
        ) : null}
      </section>
    </div>
  );
}

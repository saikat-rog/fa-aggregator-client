import { useEffect, useMemo, useState } from "react";
import {
  advisorFormOptionsApi,
  getAllAdvisorsApi,
  type AdvisorFormOptionsResponseData,
} from "../services/advisor.service";
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
    tiktok?: string;
  };
  instagramFollowers?: number;
  linkedinFollowers?: number;
  twitterFollowers?: number;
  facebookFollowers?: number;
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
  about?: string;
  marketFocus?: string[];
  expertiseIndeces?: string[];
  emailForContact?: string;
  personalWebsite?: string;
  username?: string;
  industry?: string;
  industries?: string[];
}

export function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [advisors, setAdvisors] = useState<AdvisorCardData[]>([]);
  const [formOptions, setFormOptions] =
    useState<AdvisorFormOptionsResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const countries = useMemo(
    () => (formOptions?.countries ?? []).slice().sort((a, b) => a.localeCompare(b)),
    [formOptions],
  );

  const states = useMemo(
    () =>
      selectedCountry
        ? (formOptions?.locations[selectedCountry]?.states ?? []).slice().sort((a, b) =>
            a.localeCompare(b),
          )
        : [],
    [formOptions, selectedCountry],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadAdvisors = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [advisorsPayload, optionsPayload] = await Promise.all([
          getAllAdvisorsApi(),
          advisorFormOptionsApi(),
        ]);
        const data = advisorsPayload?.data ?? advisorsPayload;

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
        setFormOptions(optionsPayload);
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
      const matchesCountry = selectedCountry
        ? advisor.country === selectedCountry
        : true;
      const matchesState = selectedState ? advisor.state === selectedState : true;

      const haystack =
        `${advisor.country} ${advisor.state} ${advisor.specialties.join(" ")} ${advisor.name} ${advisor.about}`.toLowerCase();

      const matchesSearch = term ? haystack.includes(term) : true;

      return matchesCountry && matchesState && matchesSearch;
    });
  }, [advisors, query, selectedCountry, selectedState]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
        
        <h1 className="text-3xl font-bold">
          Find Trusted Financial Advisors Near You
        </h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Search by location, specialty, or advisor name and discover verified
          experts.
        </p>
        <div className="mt-6 grid gap-2 lg:grid-cols-3">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by country, state, service, or advisor name"
            className="w-full rounded-xl bg-white px-4 py-3 text-slate-900 outline-none"
          />
          <select
            value={selectedCountry}
            onChange={(event) => {
              setSelectedCountry(event.target.value);
              setSelectedState("");
            }}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            disabled={states.length === 0}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-gray-400 disabled:opacity-100 focus:border-blue-400"
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Available Financial Advisors
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="inline-flex items-center gap-3 text-sm font-medium text-blue-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
              <span>Loading advisors...</span>
            </div>
          </div>
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

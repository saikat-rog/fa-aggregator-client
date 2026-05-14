import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaFilter,
  FaCompass,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRotateRight,
  FaTags,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { AdvisorCard } from "../components/advisor/AdvisorCard";
import type { AdvisorCardData } from "../components/advisor/AdvisorCard";
import {
  advisorFormOptionsApi,
  getAllAdvisorsApi,
  type AdvisorFormOptionsResponseData,
  type AdvisorListQueryParams,
} from "../services/advisor.service";

export interface AdvisorApiItem {
  id: string;
  profilePictureUrl?: string | null;
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
  industries?: string[];
}

type AdvisorPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type AdvisorFilters = {
  page: number;
  limit: number;
  country: string;
  state: string;
  industries: string[];
  instagramFollowersGt: string;
  instagramFollowersGte: string;
  youtubeSubscribersGt: string;
  youtubeSubscribersGte: string;
  tiktokFollowersGt: string;
  tiktokFollowersGte: string;
  linkedinFollowersGt: string;
  linkedinFollowersGte: string;
  facebookFollowersGt: string;
  facebookFollowersGte: string;
  twitterFollowersGt: string;
  twitterFollowersGte: string;
};

const followerFields = [
  "instagramFollowers",
  "youtubeSubscribers",
  "tiktokFollowers",
  "linkedinFollowers",
  "facebookFollowers",
  "twitterFollowers",
] as const;

const followerFieldLabels: Record<(typeof followerFields)[number], string> = {
  instagramFollowers: "Followers (minimum)",
  youtubeSubscribers: "Subscribers (minimum)",
  tiktokFollowers: "Followers (minimum)",
  linkedinFollowers: "Followers (minimum)",
  facebookFollowers: "Followers (minimum)",
  twitterFollowers: "Followers (minimum)",
};

const followerFieldUi: Record<
  (typeof followerFields)[number],
  {
    icon: React.ReactNode;
    ringClass: string;
    badgeClass: string;
    inputFocusClass: string;
  }
> = {
  instagramFollowers: {
    icon: <FaInstagram className="h-4 w-4" />,
    ringClass: "ring-pink-200",
    badgeClass: "bg-transparent text-pink-700 border-pink-200",
    inputFocusClass: "focus:border-pink-400",
  },
  youtubeSubscribers: {
    icon: <FaYoutube className="h-4 w-4" />,
    ringClass: "ring-rose-200",
    badgeClass: "bg-transparent text-rose-700 border-rose-200",
    inputFocusClass: "focus:border-rose-400",
  },
  tiktokFollowers: {
    icon: <FaTiktok className="h-4 w-4" />,
    ringClass: "ring-slate-300",
    badgeClass: "bg-transparent text-slate-800 border-slate-300",
    inputFocusClass: "focus:border-slate-500",
  },
  linkedinFollowers: {
    icon: <FaLinkedinIn className="h-4 w-4" />,
    ringClass: "ring-sky-200",
    badgeClass: "bg-transparent text-sky-700 border-sky-200",
    inputFocusClass: "focus:border-sky-400",
  },
  facebookFollowers: {
    icon: <FaFacebookF className="h-4 w-4" />,
    ringClass: "ring-indigo-200",
    badgeClass: "bg-transparent text-indigo-700 border-indigo-200",
    inputFocusClass: "focus:border-indigo-400",
  },
  twitterFollowers: {
    icon: <FaXTwitter className="h-4 w-4" />,
    ringClass: "ring-zinc-300",
    badgeClass: "bg-transparent text-zinc-900 border-zinc-900",
    inputFocusClass: "focus:border-zinc-700",
  },
};

const initialFilters: AdvisorFilters = {
  page: 1,
  limit: 20,
  country: "",
  state: "",
  industries: [],
  instagramFollowersGt: "",
  instagramFollowersGte: "",
  youtubeSubscribersGt: "",
  youtubeSubscribersGte: "",
  tiktokFollowersGt: "",
  tiktokFollowersGte: "",
  linkedinFollowersGt: "",
  linkedinFollowersGte: "",
  facebookFollowersGt: "",
  facebookFollowersGte: "",
  twitterFollowersGt: "",
  twitterFollowersGte: "",
};

function buildAdvisorQuery(filters: AdvisorFilters) {
  const params = new URLSearchParams();

  if (filters.page && filters.page !== 1) params.set("page", String(filters.page));
  if (filters.limit && filters.limit !== 20) params.set("limit", String(filters.limit));
  if (filters.country) params.set("country", filters.country);
  if (filters.state) params.set("state", filters.state);
  if (filters.industries.length > 0) {
    filters.industries.forEach((industry) => params.append("industries", industry));
  }

  for (const field of followerFields) {
    for (const op of ["Gt", "Gte"] as const) {
      const key = `${field}${op}` as keyof AdvisorFilters;
      const val = filters[key];
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      }
    }
  }

  return params.toString();
}

function filtersFromSearchParams(searchParams: URLSearchParams): AdvisorFilters {
  const parseNumberOr = (value: string | null, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const filters: AdvisorFilters = {
    ...initialFilters,
    page: parseNumberOr(searchParams.get("page"), 1),
    limit: 20,
    country: searchParams.get("country") || "",
    state: searchParams.get("state") || "",
    industries: [],
  };

  const industryParams = searchParams.getAll("industries");
  const parsedIndustries =
    industryParams.length > 0
      ? industryParams.flatMap((entry) =>
          entry
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        )
      : [];
  filters.industries = Array.from(new Set(parsedIndustries));

  for (const field of followerFields) {
    for (const op of ["Gt", "Gte"] as const) {
      const key = `${field}${op}` as keyof AdvisorFilters;
      (filters as Record<string, string | number | string[]>)[key] =
        searchParams.get(String(key)) || "";
    }
  }

  return filters;
}

function queryParamsFromFilters(filters: AdvisorFilters): AdvisorListQueryParams {
  const parseOptionalNumber = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const params: AdvisorListQueryParams = {
    page: filters.page,
    limit: filters.limit,
    country: filters.country || undefined,
    state: filters.state || undefined,
    industries: filters.industries.length ? filters.industries : undefined,
  };

  for (const field of followerFields) {
    for (const op of ["Gt", "Gte"] as const) {
      const key = `${field}${op}` as keyof AdvisorFilters;
      const parsed = parseOptionalNumber(String(filters[key]));
      if (parsed !== undefined) {
        (params as Record<string, number | string | undefined>)[key] = parsed;
      }
    }
  }

  return params;
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<AdvisorFilters>(() =>
    filtersFromSearchParams(searchParams),
  );
  const [advisors, setAdvisors] = useState<AdvisorCardData[]>([]);
  const [formOptions, setFormOptions] =
    useState<AdvisorFormOptionsResponseData | null>(null);
  const [pagination, setPagination] = useState<AdvisorPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllFollowerFilters, setShowAllFollowerFilters] = useState(false);

  const countries = useMemo(
    () => {
      if (!formOptions) return [];
      const fromArray = formOptions.countries ?? [];
      if (fromArray.length > 0) {
        return fromArray.slice().sort((a, b) => a.localeCompare(b));
      }
      return Object.keys(formOptions.locations ?? {}).sort((a, b) =>
        a.localeCompare(b),
      );
    },
    [formOptions],
  );

  const states = useMemo(
    () =>
      filters.country
        ? (formOptions?.locations[filters.country]?.states ?? [])
            .slice()
            .sort((a, b) => a.localeCompare(b))
        : [],
    [formOptions, filters.country],
  );
  const industryOptions = useMemo(
    () =>
      (formOptions?.industries ?? [])
        .slice()
        .sort((a, b) => a.localeCompare(b)),
    [formOptions],
  );
  const visibleFollowerFields = showAllFollowerFilters
    ? followerFields
    : followerFields.slice(0, 3);

  useEffect(() => {
    const current = filtersFromSearchParams(searchParams);
    const currentSerialized = buildAdvisorQuery(current);
    const localSerialized = buildAdvisorQuery(filters);
    if (currentSerialized !== localSerialized) {
      setFilters(current);
    }
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const next = buildAdvisorQuery(filters);
      if (next !== searchParams.toString()) {
        setSearchParams(next);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters, searchParams, setSearchParams]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const optionsPayload = await advisorFormOptionsApi();
        setFormOptions(optionsPayload);
      } catch {
        // Non-blocking for listing; we keep filter UI usable with existing values.
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        setIsLoading(true);
        setError("");

        const activeFilters = filtersFromSearchParams(searchParams);
        const params = queryParamsFromFilters(activeFilters);
        const payload = await getAllAdvisorsApi(params);

        if (!payload?.success) {
          setError(payload?.msg || "Unable to load advisors");
          setAdvisors([]);
          return;
        }

        const data = payload?.data;
        const mapped = ((data?.advisors as AdvisorApiItem[]) || []).map((item) => ({
          id: item.id,
          name: item.name?.trim() || "Verified Advisor",
          username: item.username || "Anonymous",
          industries: item.industries ?? [],
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
          profilePictureUrl: item.profilePictureUrl || undefined,
          personalWebsite: item.personalWebsite,
          emailForContact: item.emailForContact,
          socialLinks: item.socialLinks,
        }));

        setAdvisors(mapped);
        setPagination({
          page: data?.pagination?.page ?? 1,
          limit: data?.pagination?.limit ?? filters.limit,
          total: data?.pagination?.total ?? mapped.length,
          totalPages: data?.pagination?.totalPages ?? 1,
        });
      } catch (err) {
        const apiMessage =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { data?: { msg?: string } } }).response?.data
            ?.msg === "string"
            ? (err as { response?: { data?: { msg?: string } } }).response?.data?.msg
            : "Unable to load advisors";
        setError(apiMessage || "Unable to load advisors");
        setAdvisors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvisors();
  }, [searchParams, filters.limit]);

  const setFilterValue = (key: keyof AdvisorFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
        <h1 className="text-3xl font-bold">Find Trusted Financial Advisors Near You</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Filter advisors by location and follower thresholds.
        </p>

        <div className="mt-6 grid gap-2 lg:grid-cols-[1fr_1fr_auto]">
          <select
            value={filters.country}
            onChange={(event) => {
              setFilters((prev) => ({
                ...prev,
                country: event.target.value,
                state: "",
                page: 1,
              }));
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
            value={filters.state}
            onChange={(event) => setFilterValue("state", event.target.value)}
            disabled={!filters.country || states.length === 0}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 focus:border-blue-400"
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setFilters(initialFilters);
                setSearchParams(buildAdvisorQuery(initialFilters));
              }}
              aria-label="Reset filters"
              title="Reset filters"
              className="hidden rounded-xl border border-blue-200 bg-white px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:inline-flex"
            >
              <FaRotateRight />
            </button>
            
          </div>
        </div>

        <div className="mt-3">
          <p className="mb-2 inline-flex items-center gap-1.5 text-md text-white">
            <FaTags />
            Select Industries
          </p>
          <div className="flex flex-wrap gap-2">
            {industryOptions.map((industry) => {
              const isSelected = filters.industries.includes(industry);
              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      industries: isSelected
                        ? prev.industries.filter((item) => item !== industry)
                        : [...prev.industries, industry],
                      page: 1,
                    }))
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs lg:text-sm font-semibold transition ${
                    isSelected
                      ? "border-white bg-white text-blue-700"
                      : "border-white/40 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {industry}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFilters(initialFilters);
            setSearchParams(buildAdvisorQuery(initialFilters));
          }}
          className="my-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:hidden"
        >
          <FaRotateRight />
          Reset Filters
        </button>

        <div className="mt-1">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-md text-white mr-2">
              Search by followers and subscribers count 
            </p>
            <button
              type="button"
              onClick={() => setShowAllFollowerFilters((prev) => !prev)}
              aria-label={showAllFollowerFilters ? "Hide filters" : "Show filters"}
              title={showAllFollowerFilters ? "Hide filters" : "Show filters"}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/70 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
            >
              <FaFilter />
              <span>{showAllFollowerFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showAllFollowerFilters
                ? "max-h-225 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`transition-transform duration-300 ease-out ${
                showAllFollowerFilters ? "translate-y-0" : "-translate-y-2"
              }`}
            >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {visibleFollowerFields.map((field) => {
                const gteKey = `${field}Gte` as keyof AdvisorFilters;
                const ui = followerFieldUi[field];
                return (
                  <div
                    key={field}
                    className={`rounded-2xl border border-white/40 bg-white/90 p-2.5 text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.08)] ring-1 ${ui.ringClass} backdrop-blur`}
                  >
                    <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-600">
                      {followerFieldLabels[field]}
                    </p>
                    <span
                      className={`inline-flex items-center ${ui.badgeClass}`}
                    >
                      {ui.icon}
                    </span>
                    </div>
                    <div className="mt-2">
                      <input
                        type="number"
                        min={0}
                        value={String(filters[gteKey])}
                        onChange={(event) =>
                          setFilterValue(gteKey, event.target.value)
                        }
                        placeholder="Minimum"
                        className={`h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 ${ui.inputFocusClass}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
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
            {error}
          </p>
        ) : null}

        {!isLoading && !error ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {advisors.map((advisor) => (
                <AdvisorCard key={advisor.id} advisor={advisor} />
              ))}
            </div>

            {advisors.length === 0 ? (
              <div className="mt-8 rounded-3xl p-10 text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <FaCompass className="h-7 w-7" />
                </div>
                <p className="mt-4 text-2xl font-bold text-slate-800">
                  No exact match yet
                </p>
                <p className="mt-2 text-base text-slate-600">
                  Try widening your filters a bit. Your ideal advisor may be one
                  step away.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages} • {pagination.total} total advisors
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.min(pagination.totalPages, prev.page + 1),
                    }))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}

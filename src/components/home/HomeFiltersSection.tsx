import { useEffect, useState } from "react";
import { FaFilter, FaRotateRight, FaTags } from "react-icons/fa6";
import {
  followerCountOptions,
  followerFieldPlatformLabels,
  followerFieldUi,
  followerFields,
  type FollowerField,
} from "../../pages/home/Home.constants";
import type { AdvisorFilters } from "../../pages/home/Home.types";

type HomeFiltersSectionProps = {
  filters: AdvisorFilters;
  countries: string[];
  states: string[];
  industryOptions: string[];
  disableUrlSync: boolean;
  onSetFilters: (updater: (prev: AdvisorFilters) => AdvisorFilters) => void;
  onSetSearchParams: (query: string) => void;
  onSetFilterValue: (key: keyof AdvisorFilters, value: string | number) => void;
  onResetFilters: () => void;
};

export function HomeFiltersSection({
  filters,
  countries,
  states,
  industryOptions,
  disableUrlSync,
  onSetFilters,
  onSetSearchParams,
  onSetFilterValue,
  onResetFilters,
}: HomeFiltersSectionProps) {
  const appliedFollowerField =
    followerFields.find((field) => filters[`${field}Gte` as keyof AdvisorFilters]) ??
    "";
  const [selectedFollowerField, setSelectedFollowerField] = useState<
    FollowerField | ""
  >(appliedFollowerField);
  const selectedFollowerCount = selectedFollowerField
    ? String(filters[`${selectedFollowerField}Gte` as keyof AdvisorFilters])
    : "";
  const selectedFollowerUi = selectedFollowerField
    ? followerFieldUi[selectedFollowerField]
    : null;

  useEffect(() => {
    if (appliedFollowerField) {
      setSelectedFollowerField(appliedFollowerField);
    }
  }, [appliedFollowerField]);

  const resetFollowerFilters = (filtersToUpdate: AdvisorFilters) => {
    const nextFilters = { ...filtersToUpdate };
    const nextFollowerFilters = nextFilters as Record<string, string | number | string[]>;
    for (const field of followerFields) {
      nextFollowerFilters[`${field}Gt`] = "";
      nextFollowerFilters[`${field}Gte`] = "";
    }
    return nextFilters;
  };

  const setFollowerFilter = (
    field: FollowerField | "",
    count: string,
    previousFilters: AdvisorFilters,
  ) => {
    const nextFilters = resetFollowerFilters(previousFilters);
    if (field && count) {
      (nextFilters as Record<string, string | number | string[]>)[`${field}Gte`] =
        count;
    }
    return { ...nextFilters, page: 1 };
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
      <h1 className="text-3xl font-bold">Find Trusted Financial Advisors Near You</h1>
      <p className="mt-2 max-w-2xl text-blue-100">
        Filter advisors by location, category, and follower thresholds.
      </p>

      <div className="mt-6 grid gap-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <select
          value={filters.country}
          onChange={(event) => {
            onSetFilters((prev) => ({
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
          onChange={(event) => onSetFilterValue("state", event.target.value)}
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
        <input
          value={filters.category}
          onChange={(event) => onSetFilterValue("category", event.target.value)}
          placeholder="Category (type to search)"
          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedFollowerField("");
              onResetFilters();
              if (!disableUrlSync) {
                onSetSearchParams("");
              }
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
                  onSetFilters((prev) => ({
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
          setSelectedFollowerField("");
          onResetFilters();
          if (!disableUrlSync) {
            onSetSearchParams("");
          }
        }}
        className="my-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:hidden"
      >
        <FaRotateRight />
        Reset Filters
      </button>

      <div className="mt-1">
        <p className="mb-2 inline-flex items-center gap-1.5 text-md text-white">
          <FaFilter />
          Search by followers and subscribers count
        </p>
        <div
          className={`rounded-2xl border border-white/40 bg-white/90 p-3 text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.08)] ring-1 ${
            selectedFollowerUi?.ringClass ?? "ring-blue-200"
          } backdrop-blur`}
        >
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                Platform
              </span>
              <select
                value={selectedFollowerField}
                onChange={(event) => {
                  const nextField = event.target.value as FollowerField | "";
                  setSelectedFollowerField(nextField);
                  onSetFilters((prev) =>
                    setFollowerFilter(
                      nextField,
                      selectedFollowerCount,
                      prev,
                    ),
                  );
                }}
                className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition ${
                  selectedFollowerUi?.inputFocusClass ?? "focus:border-blue-400"
                }`}
              >
                <option value="">Select platform</option>
                {followerFields.map((field) => (
                  <option key={field} value={field}>
                    {followerFieldPlatformLabels[field]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                Followers / Subscribers
              </span>
              <select
                value={selectedFollowerCount}
                disabled={!selectedFollowerField}
                onChange={(event) =>
                  onSetFilters((prev) =>
                    setFollowerFilter(
                      selectedFollowerField as FollowerField,
                      event.target.value,
                      prev,
                    ),
                  )
                }
                className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                  selectedFollowerUi?.inputFocusClass ?? "focus:border-blue-400"
                }`}
              >
                <option value="">Select count</option>
                {followerCountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {selectedFollowerUi ? (
              <div className="flex items-end">
                <span
                  className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${selectedFollowerUi.badgeClass}`}
                >
                  {selectedFollowerUi.icon}
                  {followerFieldPlatformLabels[selectedFollowerField as FollowerField]}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

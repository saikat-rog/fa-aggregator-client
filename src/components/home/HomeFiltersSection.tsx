import { FaFilter, FaRotateRight, FaTags } from "react-icons/fa6";
import {
  followerFieldLabels,
  followerFieldUi,
  type FollowerField,
} from "../../pages/home/Home.constants";
import type { AdvisorFilters } from "../../pages/home/Home.types";

type HomeFiltersSectionProps = {
  filters: AdvisorFilters;
  countries: string[];
  states: string[];
  industryOptions: string[];
  visibleFollowerFields: readonly FollowerField[];
  showAllFollowerFilters: boolean;
  setShowAllFollowerFilters: (value: boolean | ((prev: boolean) => boolean)) => void;
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
  visibleFollowerFields,
  showAllFollowerFilters,
  setShowAllFollowerFilters,
  disableUrlSync,
  onSetFilters,
  onSetSearchParams,
  onSetFilterValue,
  onResetFilters,
}: HomeFiltersSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
      <h1 className="text-3xl font-bold">Find Trusted Financial Advisors Near You</h1>
      <p className="mt-2 max-w-2xl text-blue-100">
        Filter advisors by location and follower thresholds.
      </p>

      <div className="mt-6 grid gap-2 lg:grid-cols-[1fr_1fr_auto]">
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

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
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
        <div className="mb-2 flex items-center gap-2">
          <p className="mr-2 text-md text-white">Search by followers and subscribers count</p>
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
            showAllFollowerFilters ? "max-h-225 opacity-100" : "max-h-0 opacity-0"
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
                      <span className={`inline-flex items-center ${ui.badgeClass}`}>
                        {ui.icon}
                      </span>
                    </div>
                    <div className="mt-2">
                      <input
                        type="number"
                        min={0}
                        value={String(filters[gteKey])}
                        onChange={(event) => onSetFilterValue(gteKey, event.target.value)}
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
  );
}

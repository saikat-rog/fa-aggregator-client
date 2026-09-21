import { useEffect, useState } from "react";
import { FaFilter, FaRotateRight } from "react-icons/fa6";
import {
  followerCountOptions,
  followerFieldPlatformLabels,
  followerFields,
  type FollowerField,
} from "../../pages/home/Home.constants";
import type { AdvisorFilters } from "../../pages/home/Home.types";

type HomeFiltersSectionProps = {
  filters: AdvisorFilters;
  countries: string[];
  states: string[];
  industryOptions: string[];
  categoryOptions?: string[];
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
  categoryOptions = [],
  onSetFilters,
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
    <section className="bg-white border border-[#E7E1D6] rounded-[20px] p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E7E1D6]">
        <div>
          <h2 className="font-heading font-bold text-lg text-[#201A2B] flex items-center gap-2">
            <FaFilter className="text-[#6C4BFF] h-4 w-4" /> Browse Creators
          </h2>
          <p className="text-xs text-[#7A7286] mt-0.5">
            Search and filter by location, niche category, and audience size.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-[#7A7286] hover:text-[#201A2B] bg-[#FAF8F5] border border-[#E7E1D6] px-3 py-1.5 rounded-full transition cursor-pointer"
        >
          <FaRotateRight className="h-3 w-3" /> Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {/* Country */}
        <div>
          <label className="block font-heading text-xs font-semibold text-[#4C4557] mb-1.5">
            Country
          </label>
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
            className="w-full rounded-xl border border-[#E7E1D6] bg-[#FDFCFA] px-3 py-2 text-xs text-[#201A2B] outline-none focus:border-[#6C4BFF]"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block font-heading text-xs font-semibold text-[#4C4557] mb-1.5">
            State / Region
          </label>
          <select
            value={filters.state}
            disabled={!filters.country}
            onChange={(event) => {
              onSetFilters((prev) => ({
                ...prev,
                state: event.target.value,
                page: 1,
              }));
            }}
            className="w-full rounded-xl border border-[#E7E1D6] bg-[#FDFCFA] px-3 py-2 text-xs text-[#201A2B] outline-none focus:border-[#6C4BFF] disabled:opacity-50"
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block font-heading text-xs font-semibold text-[#4C4557] mb-1.5">
            Category
          </label>
          <select
            value={filters.category || ""}
            onChange={(event) => {
              onSetFilters((prev) => ({
                ...prev,
                category: event.target.value,
                page: 1,
              }));
            }}
            className="w-full rounded-xl border border-[#E7E1D6] bg-[#FDFCFA] px-3 py-2 text-xs text-[#201A2B] outline-none focus:border-[#6C4BFF]"
          >
            <option value="">All categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Audience / Followers */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block font-heading text-xs font-semibold text-[#4C4557] mb-1.5">
            Audience threshold
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <select
              value={selectedFollowerField}
              onChange={(e) => {
                const nextField = e.target.value as FollowerField | "";
                setSelectedFollowerField(nextField);
                onSetFilters((prev) =>
                  setFollowerFilter(nextField, selectedFollowerCount, prev),
                );
              }}
              className="rounded-xl border border-[#E7E1D6] bg-[#FDFCFA] px-3 py-2 text-xs text-[#201A2B] outline-none focus:border-[#6C4BFF]"
            >
              <option value="">Choose Platform</option>
              {followerFields.map((field) => (
                <option key={field} value={field}>
                  {followerFieldPlatformLabels[field]}
                </option>
              ))}
            </select>
            <select
              value={selectedFollowerCount}
              disabled={!selectedFollowerField}
              onChange={(e) => {
                const count = e.target.value;
                onSetFilters((prev) =>
                  setFollowerFilter(selectedFollowerField, count, prev),
                );
              }}
              className="rounded-xl border border-[#E7E1D6] bg-[#FDFCFA] px-3 py-2 text-xs text-[#201A2B] outline-none focus:border-[#6C4BFF] disabled:opacity-50"
            >
              <option value="">Followers Threshold</option>
              {followerCountOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

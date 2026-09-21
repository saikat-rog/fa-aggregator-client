import { useHomeController } from "../home/Home.controller";
import { HomeFiltersSection } from "../../components/home/HomeFiltersSection";
import { HomeResultsSection } from "../../components/home/HomeResultsSection";
import { ReachRadar } from "../../components/home/ReachRadar";
import type { HomePageProps } from "../home/Home.types";

export function DiscoverCreatorsPage(props: HomePageProps = {}) {
  const {
    filters,
    countries,
    states,
    industryOptions,
    categoryOptions,
    isLoading,
    error,
    advisors,
    pagination,
    disableUrlSync,
    setFilters,
    setFilterValue,
    resetFilters,
    setSearchParams,
    goPreviousPage,
    goNextPage,
  } = useHomeController(props);

  return (
    <div className="space-y-8">
      {/* Header with ReachRadar */}
      <section className="bg-white border border-[#E7E1D6] rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#201A2B] tracking-tight">
            Browse Creators
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#7A7286] leading-relaxed">
            Browse verified local creators, nano-influencers, and specialists across all categories. Connect directly for collaborations and campaigns.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="font-mono-code text-xs text-[#201A2B] bg-[#F1ECFF] px-3.5 py-1.5 rounded-full font-semibold">
              <b className="text-[#6C4BFF]">{pagination.total}</b> creators registered
            </span>
            <span className="font-mono-code text-xs text-[#201A2B] bg-[#FFEAE3] px-3.5 py-1.5 rounded-full font-semibold">
              <b className="text-[#D6431E]">All categories</b> supported
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <ReachRadar size={180} pulsing />
        </div>
      </section>

      {/* Filter Section */}
      <HomeFiltersSection
        filters={filters}
        countries={countries}
        states={states}
        industryOptions={industryOptions}
        categoryOptions={categoryOptions}
        disableUrlSync={disableUrlSync}
        onSetFilters={setFilters}
        onSetSearchParams={setSearchParams}
        onSetFilterValue={setFilterValue}
        onResetFilters={resetFilters}
      />

      {/* Results Section */}
      <HomeResultsSection
        isLoading={isLoading}
        error={error}
        advisors={advisors}
        pagination={pagination}
        onPreviousPage={goPreviousPage}
        onNextPage={goNextPage}
      />
    </div>
  );
}

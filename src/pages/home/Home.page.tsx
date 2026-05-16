import { HomeSeo } from "./Home.seo";
import { useHomeController } from "./Home.controller";
import { HomeFiltersSection } from "../../components/home/HomeFiltersSection";
import { HomeResultsSection } from "../../components/home/HomeResultsSection";
import type { HomePageProps } from "./Home.types";
export type { AdvisorApiItem } from "./Home.types";

export function HomePage(props: HomePageProps = {}) {
  const {
    filters,
    countries,
    states,
    industryOptions,
    visibleFollowerFields,
    showAllFollowerFilters,
    isLoading,
    error,
    advisors,
    pagination,
    disableUrlSync,
    setFilters,
    setShowAllFollowerFilters,
    setFilterValue,
    resetFilters,
    setSearchParams,
    goPreviousPage,
    goNextPage,
  } = useHomeController(props);

  return (
    <div className="space-y-8">
      <HomeSeo />
      <HomeFiltersSection
        filters={filters}
        countries={countries}
        states={states}
        industryOptions={industryOptions}
        visibleFollowerFields={visibleFollowerFields}
        showAllFollowerFilters={showAllFollowerFilters}
        setShowAllFollowerFilters={setShowAllFollowerFilters}
        disableUrlSync={disableUrlSync}
        onSetFilters={setFilters}
        onSetSearchParams={setSearchParams}
        onSetFilterValue={setFilterValue}
        onResetFilters={resetFilters}
      />
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

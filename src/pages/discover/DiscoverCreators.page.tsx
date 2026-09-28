import { Link } from "react-router-dom";
import { useHomeController } from "../home/Home.controller";
import { HomeFiltersSection } from "../../components/home/HomeFiltersSection";
import { HomeResultsSection } from "../../components/home/HomeResultsSection";
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
    <div id="page-creators">
      <section id="creator-directory" style={{ background: "var(--card)", borderBottom: "1px solid var(--line)", padding: "60px 0" }}>
        <div className="wrap">
          <Link to="/" style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem" }}>
            ← Back to Folksmint
          </Link>
          <div className="section-head" style={{ marginTop: "20px" }}>
            <div className="kicker">Creator Directory</div>
            <h2>Meet creators on Folksmint</h2>
            <p>Businesses browse real creator profiles here before inviting them to a campaign.</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
              <span className="cat-pill font-bold">
                {pagination.total > 0 ? `${pagination.total} Registered Creators` : "Verified Creator Profiles"}
              </span>
              <span className="cat-pill font-bold">
                All Categories &amp; Cities
              </span>
            </div>
          </div>

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
      </section>
    </div>
  );
}



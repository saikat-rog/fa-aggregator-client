import { useParams } from "react-router-dom";
import { NotFoundState } from "../../components/ui/NotFoundState";
import { seoLandings } from "../../config/seoLandings";
import { HomePage } from "./Home.page";

export function SeoLandingPage() {
  const { landingSlug } = useParams();
  const landing = landingSlug ? seoLandings[landingSlug] : undefined;

  if (!landing) {
    return <NotFoundState onButtonClick={() => window.location.assign("/")} />;
  }
  return (
    <HomePage
      disableUrlSync
      initialFiltersOverride={{
        country: landing.filters.country ?? "",
        state: landing.filters.state ?? "",
        industries: landing.filters.industries ?? [],
        page: landing.filters.page ?? 1,
        limit: landing.filters.limit ?? 20,
      }}
    />
  );
}

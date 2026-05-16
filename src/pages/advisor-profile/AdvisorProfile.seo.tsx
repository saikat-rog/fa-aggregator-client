import { Helmet } from "react-helmet-async";
import type { AdvisorApiItem } from "../home/Home.page";

type Props = {
  advisor: AdvisorApiItem;
};

export function AdvisorProfileSeo({ advisor }: Props) {
  const advisorName = advisor.name?.trim() || advisor.username || "Financial Advisor";
  const advisorLocation = [advisor.state, advisor.country].filter(Boolean).join(", ");
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageTitle = `${advisorName} | Financial Advisor${advisorLocation ? ` in ${advisorLocation}` : ""} | Invest24`;
  const pageDescription =
    advisor.about?.trim() ||
    `View ${advisorName}'s advisor profile${advisorLocation ? ` in ${advisorLocation}` : ""} on Invest24.`;
  const pageKeywords = [
    advisorName,
    advisor.username,
    "financial advisor",
    "investment advisor",
    advisor.country,
    advisor.state,
    ...(advisor.industries || []),
    ...(advisor.expertiseIndeces || []),
  ]
    .filter(Boolean)
    .join(", ");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: advisorName,
    url: pageUrl || undefined,
    image: advisor.profilePictureUrl || undefined,
    description: pageDescription,
    homeLocation: advisorLocation || undefined,
    knowsAbout: [...(advisor.industries || []), ...(advisor.expertiseIndeces || [])],
    sameAs: Object.values(advisor.socialLinks || {}).filter(Boolean),
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content="index,follow" />
      {pageUrl ? <link rel="canonical" href={pageUrl} /> : null}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="profile" />
      {pageUrl ? <meta property="og:url" content={pageUrl} /> : null}
      {advisor.profilePictureUrl ? <meta property="og:image" content={advisor.profilePictureUrl} /> : null}

      <meta name="twitter:card" content={advisor.profilePictureUrl ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {advisor.profilePictureUrl ? <meta name="twitter:image" content={advisor.profilePictureUrl} /> : null}

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}


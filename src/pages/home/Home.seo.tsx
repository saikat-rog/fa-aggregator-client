import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { seoLandings } from "../../config/seoLandings";

export function HomeSeo() {
  const { landingSlug, slug } = useParams();
  const activeSlug = landingSlug ?? slug;
  const landing = activeSlug ? seoLandings[activeSlug] : undefined;
  const title = landing?.title || "Find Trusted Financial Advisors | Invest24";
  const description =
    landing?.description ||
    "Discover verified financial advisors by country, state, industries, and audience signals on Invest24.";
  const keywords =
    landing?.slug
      ? `${landing.slug.replaceAll("-", ", ")}, financial advisor, investment advisor, invest24`
      : "financial advisor, investment advisor, wealth advisor, stock market advisor, invest24";
  const pageUrl =
    landing?.canonicalUrl ||
    (typeof window !== "undefined" ? window.location.href : "");
  const siteName = "Invest24";
  const defaultOgImage =
    typeof window !== "undefined"
      ? `${window.location.origin}/favicon.svg`
      : undefined;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: typeof window !== "undefined" ? window.location.origin : undefined,
    potentialAction: {
      "@type": "SearchAction",
      target: `${typeof window !== "undefined" ? window.location.origin : ""}/?country={country}`,
      "query-input": "required name=country",
    },
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: pageUrl || undefined,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {pageUrl ? <meta property="og:url" content={pageUrl} /> : null}
      {defaultOgImage ? <meta property="og:image" content={defaultOgImage} /> : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {defaultOgImage ? <meta name="twitter:image" content={defaultOgImage} /> : null}
      {pageUrl ? <link rel="canonical" href={pageUrl} /> : null}

      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(collectionPageSchema)}</script>
    </Helmet>
  );
}

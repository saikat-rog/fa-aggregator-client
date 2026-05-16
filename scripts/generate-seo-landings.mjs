import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SEO_LANDINGS_PATH = path.join(ROOT, "src/config/seoLandings.ts");
const LOCATIONS_SITEMAP_PATH = path.join(ROOT, "public/sitemap-locations.xml");
const PROFILES_SITEMAP_PATH = path.join(ROOT, "public/sitemap-profiles.xml");
const BLOGS_SITEMAP_PATH = path.join(ROOT, "public/sitemap-blogs.xml");
const SITEMAP_INDEX_PATH = path.join(ROOT, "public/sitemap-index.xml");
const ROBOTS_PATH = path.join(ROOT, "public/robots.txt");
const ENV_LOCAL_PATH = path.join(ROOT, ".env.local");

const toSlug = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

const escapeText = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const PROFILE_SITEMAP_CHUNK_SIZE = 50000;

const readEnvLocal = async () => {
  try {
    const raw = await fs.readFile(ENV_LOCAL_PATH, "utf8");
    const map = {};
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx < 0) return;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      map[key] = value;
    });
    return map;
  } catch {
    return {};
  }
};

const run = async () => {
  const envLocal = await readEnvLocal();
  const apiBase =
    envLocal.VITE_SERVER_URL;

  if (!apiBase) {
    throw new Error(
      "Missing Server URL",
    );
  }

  const siteOrigin =
    envLocal.VITE_FRONTEND_URL 

  const endpoint = `${apiBase.replace(/\/$/, "")}/advisor/form-options`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed fetching advisor options: ${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  const data = payload?.data ?? payload;
  const locations = data?.locations ?? {};
  const countries = Object.keys(locations).sort((a, b) => a.localeCompare(b));

  if (!countries.length) {
    throw new Error("No countries found in advisor form options response.");
  }

  const stateLandings = countries.flatMap((country) => {
    const states = (locations?.[country]?.states ?? [])
      .map((item) => String(item).trim())
      .filter(Boolean);

    return states.map((state) => {
      const slug = `financial-advisors-${toSlug(state)}-${toSlug(country)}`;
      return {
        slug,
        title: `Financial Advisors in ${state}, ${country} | Invest24`,
        description: `Find verified financial advisors in ${state}, ${country} on Invest24.`,
        filters: { country, state },
      };
    });
  });

  const countryLandings = countries.map((country) => {
    const slug = `financial-advisors-${toSlug(country)}`;
    return {
      slug,
      title: `Financial Advisors in ${country} | Invest24`,
      description: `Find verified financial advisors in ${country} on Invest24.`,
      filters: { country },
    };
  });

  const mergedMap = new Map();
  [...countryLandings, ...stateLandings].forEach((item) => {
    mergedMap.set(item.slug, item);
  });
  const merged = [...mergedMap.values()].sort((a, b) => a.slug.localeCompare(b.slug));

  const seoTs = `export type SeoLandingFilters = {
  country?: string;
  state?: string;
  industries?: string[];
  page?: number;
  limit?: number;
};

export type SeoLanding = {
  slug: string;
  title: string;
  description: string;
  canonicalUrl?: string;
  filters: SeoLandingFilters;
};

export const seoLandings: Record<string, SeoLanding> = {
${merged
  .map((item) => `  "${item.slug}": {
    slug: "${item.slug}",
    title: "${item.title.replace(/"/g, '\\"')}",
    description: "${item.description.replace(/"/g, '\\"')}",
    filters: {
      ${item.filters.country ? `country: "${item.filters.country.replace(/"/g, '\\"')}",` : ""}
      ${item.filters.state ? `state: "${item.filters.state.replace(/"/g, '\\"')}",` : ""}
    },
  },`)
  .join("\n")}
};
`;

  await fs.writeFile(SEO_LANDINGS_PATH, seoTs, "utf8");

  const profileUrls = [];
  const fetchProfilesPage = async (page) => {
    const url = `${apiBase.replace(/\/$/, "")}/advisor?page=${page}&limit=200`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed fetching advisors page ${page}: ${res.status} ${res.statusText}`);
    }
    const raw = await res.json();
    const data = raw?.data ?? raw;
    const advisors = Array.isArray(data?.advisors) ? data.advisors : [];
    const pagination = data?.pagination ?? {};
    return { advisors, pagination };
  };

  let currentPage = 1;
  let totalPages = 1;
  do {
    const { advisors, pagination } = await fetchProfilesPage(currentPage);
    for (const advisor of advisors) {
      const username = String(advisor?.username ?? "").trim();
      if (!username) continue;
      profileUrls.push(`${siteOrigin}/${encodeURIComponent(username)}`);
    }
    totalPages = Number(pagination?.totalPages ?? currentPage);
    currentPage += 1;
  } while (currentPage <= totalPages);

  const uniqueProfileUrls = [...new Set(profileUrls)].sort((a, b) =>
    a.localeCompare(b),
  );

  const blogUrls = [];
  const fetchBlogsPage = async (page) => {
    const url = `${apiBase.replace(/\/$/, "")}/blog?page=${page}&limit=200`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed fetching blogs page ${page}: ${res.status} ${res.statusText}`);
    }
    const raw = await res.json();
    const data = raw?.data ?? raw;
    const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
    const pagination = data?.pagination ?? {};
    return { blogs, pagination };
  };

  currentPage = 1;
  totalPages = 1;
  do {
    const { blogs, pagination } = await fetchBlogsPage(currentPage);
    for (const blog of blogs) {
      const slug = String(blog?.slug ?? "").trim();
      if (!slug) continue;
      blogUrls.push(`${siteOrigin}/blog/${encodeURIComponent(slug)}`);
    }
    totalPages = Number(pagination?.totalPages ?? currentPage);
    currentPage += 1;
  } while (currentPage <= totalPages);

  const uniqueBlogUrls = [...new Set(blogUrls)].sort((a, b) => a.localeCompare(b));

  const sitemapUrls = [
    { loc: `${siteOrigin}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${siteOrigin}/blogs`, changefreq: "daily", priority: "0.8" },
    ...merged.map((item) => ({
      loc: `${siteOrigin}/find/${item.slug}`,
      changefreq: "weekly",
      priority: "0.9",
    })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (item) => `  <url>
    <loc>${escapeText(item.loc)}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  await fs.writeFile(LOCATIONS_SITEMAP_PATH, sitemapXml, "utf8");

  const blogsSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueBlogUrls
  .map(
    (loc) => `  <url>
    <loc>${escapeText(loc)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  await fs.writeFile(BLOGS_SITEMAP_PATH, blogsSitemapXml, "utf8");

  const profileSitemapFiles = [];
  for (let i = 0; i < uniqueProfileUrls.length; i += PROFILE_SITEMAP_CHUNK_SIZE) {
    const chunk = uniqueProfileUrls.slice(i, i + PROFILE_SITEMAP_CHUNK_SIZE);
    const chunkIndex = Math.floor(i / PROFILE_SITEMAP_CHUNK_SIZE) + 1;
    const filename = `sitemap-profiles-${chunkIndex}.xml`;
    const filePath = path.join(ROOT, "public", filename);
    const profilesSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk
  .map(
    (loc) => `  <url>
    <loc>${escapeText(loc)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
    await fs.writeFile(filePath, profilesSitemapXml, "utf8");
    profileSitemapFiles.push(filename);
  }

  const legacyProfilesFileExists = await fs
    .access(PROFILES_SITEMAP_PATH)
    .then(() => true)
    .catch(() => false);
  if (legacyProfilesFileExists) {
    await fs.unlink(PROFILES_SITEMAP_PATH);
  }

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeText(`${siteOrigin}/sitemap-locations.xml`)}</loc>
  </sitemap>
  <sitemap>
    <loc>${escapeText(`${siteOrigin}/sitemap-blogs.xml`)}</loc>
  </sitemap>
${profileSitemapFiles
  .map(
    (filename) => `  <sitemap>
    <loc>${escapeText(`${siteOrigin}/${filename}`)}</loc>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`;
  await fs.writeFile(SITEMAP_INDEX_PATH, sitemapIndexXml, "utf8");

  const robots = `User-agent: *
Allow: /

Sitemap: ${siteOrigin}/sitemap-index.xml
`;
  await fs.writeFile(ROBOTS_PATH, robots, "utf8");

  console.log(`Generated ${merged.length} SEO landing pages.`);
  console.log(`Generated ${uniqueProfileUrls.length} profile URLs in sitemap.`);
  console.log(`Generated ${uniqueBlogUrls.length} blog URLs in sitemap.`);
  console.log(`Updated: ${path.relative(ROOT, SEO_LANDINGS_PATH)}`);
  console.log(`Updated: ${path.relative(ROOT, LOCATIONS_SITEMAP_PATH)}`);
  console.log(`Updated: ${path.relative(ROOT, BLOGS_SITEMAP_PATH)}`);
  profileSitemapFiles.forEach((filename) => {
    console.log(`Updated: public/${filename}`);
  });
  console.log(`Updated: ${path.relative(ROOT, SITEMAP_INDEX_PATH)}`);
  console.log(`Updated: ${path.relative(ROOT, ROBOTS_PATH)}`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

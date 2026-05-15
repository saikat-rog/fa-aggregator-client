import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiTag } from "react-icons/fi";
import { publicGetBlogBySlug, type Blog } from "../services/blog.service";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value)
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(/,/g, "")
        .toLowerCase()
    : "-";

function setOrCreateMeta(name: string, content: string) {
  let node = document.querySelector(`meta[name=\"${name}\"]`) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function setOrCreateProperty(property: string, content: string) {
  let node = document.querySelector(`meta[property=\"${property}\"]`) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("property", property);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    publicGetBlogBySlug(slug)
      .then((res) => setBlog(res))
      .catch((err: any) => setError(err?.response?.data?.msg || "Failed to load blog"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    const title = blog.seo?.metaTitle || blog.title;
    const description = blog.seo?.metaDescription || blog.excerpt || "";
    document.title = title;
    setOrCreateMeta("description", description);
    setOrCreateProperty("og:title", title);
    setOrCreateProperty("og:description", description);
    setOrCreateProperty("og:image", blog.seo?.ogImageUrl || blog.coverImageUrl);
    setOrCreateProperty("og:type", "article");
    if (blog.seo?.noIndex) setOrCreateMeta("robots", "noindex,nofollow");
    else setOrCreateMeta("robots", "index,follow");

    if (blog.seo?.canonicalUrl) {
      let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = blog.seo.canonicalUrl;
    }
  }, [blog]);

  return (
    <div className="space-y-4">
      {loading ? <p className="rounded border border-blue-100 bg-blue-50 p-2 text-sm text-blue-700">Loading blog...</p> : null}
      {error ? <p className="rounded border border-red-100 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      {blog ? (
        <article className="space-y-4 rounded-3xl ">
          <h1 className="text-3xl font-semibold text-slate-900">{blog.title}</h1>
          <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><FiCalendar className="text-blue-700" /> {formatDate(blog.publishedAt)}</span>
            <span className="inline-flex items-center gap-1.5"><FiClock className="text-blue-700" /> {blog.readingTimeMinutes || "-"} min read</span>
          </p>
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
            <img src={blog.coverImageUrl} alt={blog.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(blog.tags || []).map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                <FiTag className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>
          <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50/60 p-4 leading-7 text-slate-800">{blog.content || ""}</div>
        </article>
      ) : null}
    </div>
  );
}

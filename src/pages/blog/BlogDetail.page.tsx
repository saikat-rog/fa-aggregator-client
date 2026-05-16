import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiTag } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { BlogNotFound } from "../../components/pageNotFound/BlogPageNotFound";
import { publicGetBlogBySlug, type Blog } from "../../services/blog.service";

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

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setIsNotFound(false);
    publicGetBlogBySlug(slug)
      .then((res) => {
        setBlog(res);
      })
      .catch((err: any) => {
        const status = err?.response?.status;
        const message = err?.response?.data?.msg || "Failed to load blog";
        const notFoundFromMessage =
          typeof message === "string" && message.toLowerCase().includes("not found");
        if (status === 404 || notFoundFromMessage) {
          setIsNotFound(true);
          setBlog(null);
          setError(null);
          return;
        }
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const title = blog?.seo?.metaTitle || blog?.title || "Blog | Invest24";
  const description = blog?.seo?.metaDescription || blog?.excerpt || "";
  const ogImage = blog?.seo?.ogImageUrl || blog?.coverImageUrl || "";
  const robots = blog?.seo?.noIndex ? "noindex,nofollow" : "index,follow";

  return (
    <div className="space-y-4">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robots} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
        {blog?.seo?.canonicalUrl ? <link rel="canonical" href={blog.seo.canonicalUrl} /> : null}
      </Helmet>
      {loading ? <p className="rounded border border-blue-100 bg-blue-50 p-2 text-sm text-blue-700">Loading blog...</p> : null}
      {!loading && isNotFound ? <BlogNotFound /> : null}
      {error ? <p className="rounded border border-red-100 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      {blog && !isNotFound ? (
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

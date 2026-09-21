import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiTag, FiArrowLeft, FiBookOpen, FiShare2, FiCheck } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { BlogNotFound } from "../../components/pageNotFound/BlogPageNotFound";
import { publicGetBlogBySlug, type Blog } from "../../services/blog.service";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently Published";

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const title = blog?.seo?.metaTitle || blog?.title || "Blog | Folksmint";
  const description = blog?.seo?.metaDescription || blog?.excerpt || "";
  const coverImageUrl = blog?.coverImageUrl?.trim() || "";
  const ogImage = blog?.seo?.ogImageUrl || coverImageUrl || "";
  const robots = blog?.seo?.noIndex ? "noindex,nofollow" : "index,follow";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robots} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      </Helmet>

      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2 text-xs font-bold text-[#201A2B] shadow-sm transition hover:bg-[#FAF8F5] hover:border-[#201A2B]"
        >
          <FiArrowLeft className="h-3.5 w-3.5 text-[#FF5A36]" />
          <span>All Articles &amp; Guides</span>
        </Link>

        {blog ? (
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2 text-xs font-bold text-[#201A2B] shadow-sm transition hover:bg-[#FAF8F5]"
            title="Share article"
          >
            {copied ? (
              <>
                <FiCheck className="h-3.5 w-3.5 text-[#1F9D6B]" />
                <span className="text-[#1F9D6B]">Copied Link!</span>
              </>
            ) : (
              <>
                <FiShare2 className="h-3.5 w-3.5 text-[#6C4BFF]" />
                <span>Share</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-[#6C4BFF]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
            Loading article...
          </div>
        </div>
      ) : null}

      {!loading && isNotFound ? <BlogNotFound /> : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      {blog && !isNotFound ? (
        <article className="space-y-6">
          {/* Header Card */}
          <div className="overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A36]/20 bg-[#FFF5F2] px-3 py-1 text-[11px] font-bold font-mono-code text-[#FF5A36]">
                <FiCalendar className="h-3 w-3" />
                {formatDate(blog.publishedAt)}
              </span>

              {blog.readingTimeMinutes ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6C4BFF]/20 bg-[#F1ECFF] px-3 py-1 text-[11px] font-bold font-mono-code text-[#6C4BFF]">
                  <FiClock className="h-3 w-3" />
                  {blog.readingTimeMinutes} min read
                </span>
              ) : null}
            </div>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-extrabold font-heading text-[#201A2B] sm:text-3xl lg:text-4xl leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt if present */}
            {blog.excerpt ? (
              <p className="mt-3 text-sm leading-relaxed text-[#7A7286] font-medium sm:text-base">
                {blog.excerpt}
              </p>
            ) : null}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-[#E7E1D6]/60">
                {blog.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E7E1D6] bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-bold font-mono-code text-[#201A2B]"
                  >
                    <FiTag className="h-2.5 w-2.5 text-[#6C4BFF]" />
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Cover Image */}
          {coverImageUrl ? (
            <div className="aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white shadow-sm">
              <img
                src={coverImageUrl}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {/* Article Body Content */}
          <div className="overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#201A2B] font-body sm:text-base sm:leading-8">
              {blog.content || ""}
            </div>
          </div>

          {/* Bottom Explore Banner */}
          <div className="rounded-[24px] border border-[#E7E1D6] bg-[#FAF8F5] p-6 text-center sm:p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36]">
              <FiBookOpen className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-lg font-bold font-heading text-[#201A2B]">Want more creator insights?</h2>
            <p className="mt-1 text-xs text-[#7A7286]">
              Discover more strategies, playbooks, and campaigns tailored for your brand growth.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/blogs"
                className="rounded-xl border border-[#E7E1D6] bg-white px-4 py-2 text-xs font-bold text-[#201A2B] shadow-sm hover:bg-[#FAF8F5] transition"
              >
                Browse All Articles
              </Link>
              <Link
                to="/discover"
                className="rounded-xl bg-[#201A2B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#201A2B]/90 transition"
              >
                Browse Creators
              </Link>
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}

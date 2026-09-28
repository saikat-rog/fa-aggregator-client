import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiBookOpen } from "react-icons/fi";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { publicListBlogs, type Blog } from "../../services/blog.service";

const getNum = (v: string | null, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function BlogListPage() {
  const [params, setParams] = useSearchParams();
  const page = getNum(params.get("page"), 1);
  const limit = getNum(params.get("limit"), 10);
  const search = params.get("search") ?? "";
  const tag = params.get("tag") ?? "";
  const debouncedSearch = useDebouncedValue(search, 300);

  const [data, setData] = useState<{ blogs: Blog[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setParam = (k: string, v?: string) => {
    const next = new URLSearchParams(params);
    if (!v) next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    document.title = "Folksmint Blog — Guides for businesses & creators";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Practical tips on local marketing, creator storefronts, and running campaigns that actually convert.");
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    publicListBlogs({ page, limit, search: debouncedSearch || undefined, tag: tag || undefined })
      .then(setData)
      .catch((err: any) => setError(err?.response?.data?.msg || "Failed to load blogs"))
      .finally(() => setLoading(false));
  }, [page, limit, debouncedSearch, tag]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const b of data?.blogs || []) (b.tags || []).forEach((t) => set.add(t));
    return [...set];
  }, [data]);

  const hasDbBlogs = Boolean(data?.blogs && data.blogs.length > 0);

  return (
    <div id="page-blog">
      <section id="blog" style={{ padding: "60px 0" }}>
        <div className="wrap">
          <Link to="/" style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem" }}>
            ← Back to Folksmint
          </Link>
          <div className="section-head" style={{ marginTop: "20px" }}>
            <div className="kicker">Blog</div>
            <h2>Guides for businesses &amp; creators</h2>
            <p>Practical tips on local marketing, creator storefronts, and running campaigns that actually convert.</p>
          </div>

          {/* Search and Filters */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "12px", marginBottom: "24px" }}>
            <div style={{ position: "relative" }}>
              <FiSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
              <input
                className="nl-input"
                style={{ paddingLeft: "38px", textAlign: "left" }}
                placeholder="Search articles & guides..."
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
              />
            </div>
            <select
              className="nl-input"
              style={{ textAlign: "left", cursor: "pointer" }}
              value={tag}
              onChange={(e) => setParam("tag", e.target.value || undefined)}
            >
              <option value="">All Topics &amp; Tags</option>
              {tags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-flex items-center gap-3 text-xs font-bold text-[var(--indigo)]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--indigo)]" />
                Loading articles...
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 mb-6">
              {error}
            </div>
          ) : null}

          {/* Published DB blogs */}
          {!loading && !error && hasDbBlogs ? (
            <div className="blog-grid">
              {data?.blogs?.map((b) => {
                const coverImageUrl = b.coverImageUrl?.trim() || "";

                return (
                  <Link
                    key={b._id}
                    to={`/blog/${b.slug}`}
                    className="blog-card"
                  >
                    {coverImageUrl ? (
                      <div className="blog-thumb" style={{ overflow: "hidden" }}>
                        <img
                          src={coverImageUrl}
                          alt={b.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="blog-thumb">
                        📖
                      </div>
                    )}
                    <div className="blog-body">
                      <div className="blog-tag">
                        {(b.tags && b.tags[0]) || "Guide"}
                      </div>
                      <h4>{b.title}</h4>
                      <p>{b.excerpt || ""}</p>
                      <div className="blog-meta">
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-GB") : "Recently Published"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {/* Empty state when no blogs found */}
          {!loading && !error && !hasDbBlogs ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-8">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(37,99,235,0.1)] text-[var(--indigo)] flex items-center justify-center text-2xl mb-4">
                <FiBookOpen />
              </div>
              <h3 className="font-heading font-bold text-lg text-[var(--ink)] mb-1">
                No articles found
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-sm">
                {search || tag ? "No blogs match your search or filter criteria. Try clearing filters." : "Articles and guides will appear here once published."}
              </p>
              {(search || tag) && (
                <button
                  type="button"
                  onClick={() => {
                    setParam("search", undefined);
                    setParam("tag", undefined);
                  }}
                  className="pill-btn pill-navy mt-4 py-2 px-5 text-xs font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : null}

          {data?.pagination && data.pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)] mt-8">
              <p>
                Page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)}
              </p>
              <div className="flex gap-2">
                <button
                  className="chip"
                  disabled={data.pagination.page <= 1}
                  onClick={() => setParam("page", String(data.pagination.page - 1))}
                >
                  Prev
                </button>
                <button
                  className="chip"
                  disabled={data.pagination.page >= data.pagination.totalPages}
                  onClick={() => setParam("page", String(data.pagination.page + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}



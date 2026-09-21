import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiBookOpen, FiCalendar, FiSearch, FiTag, FiArrowRight } from "react-icons/fi";
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
    document.title = "Blog & Insights | Folksmint";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Read market insights, creator strategies, and hyperlocal marketing playbooks on Folksmint.");
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

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[24px] bg-[#201A2B] px-6 py-12 text-center text-white lg:px-10 shadow-sm border border-[#E7E1D6]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#FF5A36]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-[#6C4BFF]/20 blur-3xl" />
        
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-bold font-mono-code uppercase tracking-wider text-white/90 backdrop-blur-md">
          <FiBookOpen className="h-3.5 w-3.5 text-[#FF5A36]" />
          Folksmint Journal &amp; Guides
        </span>
        <h1 className="relative mt-3 text-3xl font-extrabold font-heading lg:text-5xl tracking-tight">
          Insights &amp; Creator Playbooks
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-sm text-white/80 font-medium">
          Hyperlocal growth marketing strategies, creator monetization tips, and community case studies.
        </p>
      </section>

      {/* Search and Filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7286]" />
          <input
            className="w-full rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/10"
            placeholder="Search articles & guides..."
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-[#E7E1D6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] outline-none transition focus:border-[#FF5A36]"
          value={tag}
          onChange={(e) => setParam("tag", e.target.value || undefined)}
        >
          <option value="">All Topics & Tags</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-[#6C4BFF]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E7E1D6] border-t-[#6C4BFF]" />
            Loading articles...
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && (data?.blogs?.length ?? 0) === 0 ? (
        <section className="flex min-h-[40vh] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E7E1D6] bg-[#FAF8F5] px-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36]">
            <FiBookOpen className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-bold font-heading text-[#201A2B]">No articles found</h2>
          <p className="mt-1 max-w-md text-xs text-[#7A7286]">
            Try adjusting your search query or choosing another topic tag.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data?.blogs?.map((b) => {
            const coverImageUrl = b.coverImageUrl?.trim() || "";

            return (
              <Link
                key={b._id}
                to={`/blog/${b.slug}`}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {coverImageUrl ? (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7E1D6]">
                    <img
                      src={coverImageUrl}
                      alt={b.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#FF5A36]/10 via-[#FAF8F5] to-[#6C4BFF]/10 flex items-center justify-center border-b border-[#E7E1D6]">
                    <FiBookOpen className="h-10 w-10 text-[#7A7286]/40" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="inline-flex items-center gap-1.5 font-mono-code text-[11px] font-bold text-[#7A7286]">
                    <FiCalendar className="text-[#FF5A36]" />
                    {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-GB") : "Recently Published"}
                  </p>

                  <h2 className="mt-2 text-xl font-bold font-heading text-[#201A2B] group-hover:text-[#FF5A36] transition line-clamp-2">
                    {b.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#7A7286]">
                    {b.excerpt || ""}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(b.tags || []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full border border-[#6C4BFF]/20 bg-[#F1ECFF] px-2.5 py-0.5 text-[11px] font-bold font-mono-code text-[#6C4BFF]"
                      >
                        <FiTag className="h-3 w-3" />
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-bold font-heading text-[#FF5A36] group-hover:translate-x-0.5 transition">
                    <span>Read Article</span>
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-[#E7E1D6] pt-6 text-xs text-[#7A7286]">
          <p>
            Page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)}
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-xl border border-[#E7E1D6] bg-white px-4 py-2 font-bold text-[#201A2B] disabled:opacity-40 hover:bg-[#FAF8F5] transition"
              disabled={data.pagination.page <= 1}
              onClick={() => setParam("page", String(data.pagination.page - 1))}
            >
              Prev
            </button>
            <button
              className="rounded-xl border border-[#E7E1D6] bg-white px-4 py-2 font-bold text-[#201A2B] disabled:opacity-40 hover:bg-[#FAF8F5] transition"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setParam("page", String(data.pagination.page + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCalendar, FiSearch, FiTag } from "react-icons/fi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { publicListBlogs, type Blog } from "../services/blog.service";

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
    document.title = "Blog | Invest24";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Read market insights and finance blogs.");
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
    <div className="space-y-5">
      
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
          <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Search blogs" value={search} onChange={(e) => setParam("search", e.target.value)} />
        </div>
        <select className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={tag} onChange={(e) => setParam("tag", e.target.value || undefined)}>
          <option value="">All tags</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {loading ? <p className="rounded border border-blue-100 bg-blue-50 p-2 text-sm text-blue-700">Loading blogs...</p> : null}
      {error ? <p className="rounded border border-red-100 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      {!loading && !error && (data?.blogs?.length ?? 0) === 0 ? <p className="rounded border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600">No blogs found.</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.blogs?.map((b) => (
          <Link key={b._id} to={`/blog/${b.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img src={b.coverImageUrl} alt={b.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
            </div>
            <div className="p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-500"><FiCalendar className="text-blue-700" /> {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-GB") : "-"}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{b.title}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600">{b.excerpt || ""}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(b.tags || []).map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <FiTag className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {data?.pagination ? (
        <div className="flex items-center justify-between text-sm">
          <p>Page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)}</p>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={data.pagination.page <= 1} onClick={() => setParam("page", String(data.pagination.page - 1))}>Prev</button>
            <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={data.pagination.page >= data.pagination.totalPages} onClick={() => setParam("page", String(data.pagination.page + 1))}>Next</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

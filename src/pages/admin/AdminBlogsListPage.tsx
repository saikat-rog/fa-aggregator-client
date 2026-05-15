import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { adminDeleteBlog, adminListBlogs, adminPublishBlog, adminUnpublishBlog, type Blog } from "../../services/blog.service";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const getNum = (v: string | null, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function AdminBlogsListPage() {
  const isAdmin = Boolean(localStorage.getItem("token")) && localStorage.getItem("role") === "admin";
  const [params, setParams] = useSearchParams();
  const page = getNum(params.get("page"), 1);
  const limit = getNum(params.get("limit"), 10);
  const status = params.get("status") ?? "";
  const search = params.get("search") ?? "";
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

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListBlogs({ page, limit, status: (status as "draft" | "published") || undefined, search: debouncedSearch || undefined });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [page, limit, status, debouncedSearch]);

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this blog?")) return;
    await adminDeleteBlog(id);
    await load();
  };
  const onPublishToggle = async (item: Blog) => {
    if (item.status === "published") await adminUnpublishBlog(item._id);
    else await adminPublishBlog(item._id);
    await load();
  };

  if (!isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Admin Blogs</h1>
        <Link to="/admin/blogs/new" className="rounded bg-blue-700 px-3 py-2 text-sm font-semibold text-white">New Blog</Link>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <input className="rounded border border-slate-300 px-3 py-2" placeholder="Search" value={search} onChange={(e) => setParam("search", e.target.value)} />
        <select className="rounded border border-slate-300 px-3 py-2" value={status} onChange={(e) => setParam("status", e.target.value || undefined)}>
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2" value={limit} onChange={(e) => { setParam("limit", e.target.value); setParam("page", "1"); }}>
          {[10,20,50].map((n) => <option key={n} value={n}>{n}/page</option>)}
        </select>
      </div>

      {loading ? <p className="rounded border border-blue-100 bg-blue-50 p-2 text-sm text-blue-700">Loading blogs...</p> : null}
      {error ? <p className="rounded border border-red-100 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      {!loading && !error && !data?.blogs?.length ? <p className="rounded border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600">No blogs found.</p> : null}

      {!!data?.blogs?.length ? (
        <div className="overflow-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2">Title</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead>
            <tbody>
              {data.blogs.map((b) => (
                <tr key={b._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{b.title}</td>
                  <td><span className={`rounded-full px-2 py-0.5 text-xs ${b.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{b.status}</span></td>
                  <td>{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-GB") : "-"}</td>
                  <td>
                    <div className="flex flex-wrap gap-1 py-2">
                      <Link to={`/admin/blogs/${b._id}/edit`} className="rounded border border-slate-300 px-2 py-1 text-xs">Edit</Link>
                      <button onClick={() => onPublishToggle(b)} className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700">{b.status === "published" ? "Unpublish" : "Publish"}</button>
                      <Link to={`/blog/${b.slug}`} className="rounded border border-slate-300 px-2 py-1 text-xs">Preview</Link>
                      <button onClick={() => onDelete(b._id)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

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

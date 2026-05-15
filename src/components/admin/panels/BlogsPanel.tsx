import { useEffect, useState } from "react";
import { FiBookOpen, FiEdit3, FiEye, FiPlus, FiSearch, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { BlogForm } from "../../blog/BlogForm";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import {
  adminCreateBlog,
  adminDeleteBlog,
  adminGetBlogById,
  adminListBlogs,
  adminPublishBlog,
  adminUnpublishBlog,
  adminUpdateBlog,
  type Blog,
} from "../../../services/blog.service";
import { PaginationControls } from "../PaginationControls";
import { getNum, inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
  setManyParams: (updates: Record<string, string | undefined>) => void;
}

export function BlogsPanel({ params, setParam, setManyParams }: Props) {
  const page = getNum(params.get("blogsPage"), 1);
  const limit = getNum(params.get("blogsLimit"), 10);
  const status = params.get("blogsStatus") ?? "";
  const search = params.get("blogsSearch") ?? "";
  const mode = params.get("blogsMode") ?? "list";
  const editingId = params.get("blogsId") ?? "";
  const debouncedSearch = useDebouncedValue(search, 300);

  const [data, setData] = useState<{ blogs: Blog[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionInfo, setActionInfo] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingLoading, setEditingLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListBlogs({
        page,
        limit,
        status: (status as "draft" | "published") || undefined,
        search: debouncedSearch || undefined,
      });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, limit, status, debouncedSearch]);

  useEffect(() => {
    if (mode !== "edit" || !editingId) {
      setEditingBlog(null);
      return;
    }
    setEditingLoading(true);
    adminGetBlogById(editingId)
      .then(setEditingBlog)
      .catch((err: any) => setError(err?.response?.data?.msg || "Failed to load blog details."))
      .finally(() => setEditingLoading(false));
  }, [mode, editingId]);

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this blog?")) return;
    setMutating(true);
    setActionInfo(null);
    try {
      await adminDeleteBlog(id);
      setActionInfo("Blog deleted.");
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to delete blog.");
    } finally {
      setMutating(false);
    }
  };

  const onPublishToggle = async (item: Blog) => {
    setMutating(true);
    setActionInfo(null);
    try {
      if (item.status === "published") await adminUnpublishBlog(item._id);
      else await adminPublishBlog(item._id);
      setActionInfo(item.status === "published" ? "Blog moved to draft." : "Blog published.");
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to update blog status.");
    } finally {
      setMutating(false);
    }
  };

  return (
    <section className={panelClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
          <FiBookOpen className="text-blue-700" />
          Blogs
        </h3>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
            onClick={() => setManyParams({ blogsMode: "list", blogsId: undefined })}
          >
            <FiEye /> List
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white"
            onClick={() => setManyParams({ blogsMode: "create", blogsId: undefined })}
          >
            <FiPlus /> New Blog
          </button>
        </div>
      </div>

      {mode === "list" ? (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input className={`${inputClassName} w-full pl-9`} placeholder="Search blog title/content" value={search} onChange={(e) => setParam("blogsSearch", e.target.value)} />
            </div>
            <select className={inputClassName} value={status} onChange={(e) => setParam("blogsStatus", e.target.value || undefined)}>
              <option value="">All status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <select className={inputClassName} value={limit} onChange={(e) => { setParam("blogsLimit", e.target.value); setParam("blogsPage", "1"); }}>
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}/page</option>)}
            </select>
          </div>

          {loading ? <p className={statusInfoClassName}>Loading blogs...</p> : null}
          {error ? <p className={statusErrorClassName}>{error}</p> : null}
          {actionInfo ? <p className={statusInfoClassName}>{actionInfo}</p> : null}
          {!loading && !error && !data?.blogs?.length ? <p className={statusEmptyClassName}>No blogs found.</p> : null}

          {!!data?.blogs?.length ? (
            <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-blue-700">
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Published</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.blogs.map((blog) => (
                    <tr key={blog._id} className="border-b border-slate-100">
                      <td className="px-3 py-2">{blog.title}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${blog.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-GB") : "-"}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1.5">
                          <button className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => setManyParams({ blogsMode: "edit", blogsId: blog._id })}>
                            <FiEdit3 /> Edit
                          </button>
                          <button disabled={mutating} className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 disabled:opacity-60" onClick={() => onPublishToggle(blog)}>
                            <FiUploadCloud /> {blog.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs">
                            <FiEye /> Preview
                          </a>
                          <button disabled={mutating} className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 disabled:opacity-60" onClick={() => onDelete(blog._id)}>
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <PaginationControls pagination={data?.pagination} onPageChange={(v) => setParam("blogsPage", String(v))} onLimitChange={(v) => { setParam("blogsLimit", String(v)); setParam("blogsPage", "1"); }} />
        </>
      ) : null}

      {mode === "create" ? (
        <div className="mt-4">
          <BlogForm
            submitLabel="Create Blog"
            loading={mutating}
            onSubmit={async (payload) => {
              setMutating(true);
              setError(null);
              setActionInfo(null);
              try {
                await adminCreateBlog(payload);
                setActionInfo("Blog created successfully.");
                setManyParams({ blogsMode: "list", blogsId: undefined });
                await load();
              } catch (err: any) {
                setError(err?.response?.data?.msg || "Failed to create blog.");
              } finally {
                setMutating(false);
              }
            }}
          />
        </div>
      ) : null}

      {mode === "edit" ? (
        <div className="mt-4">
          {editingLoading ? <p className={statusInfoClassName}>Loading blog details...</p> : null}
          {!editingLoading && !editingBlog ? <p className={statusEmptyClassName}>Blog not found.</p> : null}
          {editingBlog ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={mutating}
                  className="rounded border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 disabled:opacity-60"
                  onClick={async () => {
                    setMutating(true);
                    try {
                      const updated = editingBlog.status === "published"
                        ? await adminUnpublishBlog(editingBlog._id)
                        : await adminPublishBlog(editingBlog._id);
                      setEditingBlog(updated);
                      setActionInfo(updated.status === "published" ? "Blog published." : "Blog moved to draft.");
                      await load();
                    } catch (err: any) {
                      setError(err?.response?.data?.msg || "Failed to update blog status.");
                    } finally {
                      setMutating(false);
                    }
                  }}
                >
                  {editingBlog.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  disabled={mutating}
                  className="rounded border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 disabled:opacity-60"
                  onClick={async () => {
                    if (!window.confirm("Delete this blog?")) return;
                    setMutating(true);
                    try {
                      await adminDeleteBlog(editingBlog._id);
                      setActionInfo("Blog deleted.");
                      setManyParams({ blogsMode: "list", blogsId: undefined });
                      await load();
                    } catch (err: any) {
                      setError(err?.response?.data?.msg || "Failed to delete blog.");
                    } finally {
                      setMutating(false);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
              <BlogForm
                submitLabel="Save Changes"
                loading={mutating}
                initialValues={{
                  title: editingBlog.title,
                  slug: editingBlog.slug,
                  excerpt: editingBlog.excerpt || "",
                  content: editingBlog.content || "",
                  coverImageUrl: editingBlog.coverImageUrl,
                  tags: (editingBlog.tags || []).join(", "),
                  status: editingBlog.status,
                  seo: editingBlog.seo,
                }}
                onSubmit={async (payload) => {
                  setMutating(true);
                  try {
                    const updated = await adminUpdateBlog(editingBlog._id, payload);
                    setEditingBlog(updated);
                    setActionInfo("Blog updated successfully.");
                    await load();
                  } catch (err: any) {
                    setError(err?.response?.data?.msg || "Failed to update blog.");
                  } finally {
                    setMutating(false);
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}


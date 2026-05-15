import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "../../components/blog/BlogForm";
import { adminDeleteBlog, adminGetBlogById, adminPublishBlog, adminUnpublishBlog, adminUpdateBlog, type Blog } from "../../services/blog.service";

export function AdminBlogEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem("token")) && localStorage.getItem("role") === "admin";
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminGetBlogById(id).then(setBlog).catch((err: any) => setError(err?.response?.data?.msg || "Failed to load blog")).finally(() => setLoading(false));
  }, [id]);

  if (!isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Blog</h1>
        <Link to="/admin/blogs" className="text-sm text-blue-700">Back</Link>
      </div>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="rounded border border-red-100 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      {blog ? (
        <>
          <div className="flex flex-wrap gap-2">
            <button className="rounded border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700" onClick={async () => { if (!id) return; const updated = blog.status === "published" ? await adminUnpublishBlog(id) : await adminPublishBlog(id); setBlog(updated); }}> {blog.status === "published" ? "Unpublish" : "Publish"} </button>
            <button className="rounded border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700" onClick={async () => { if (!id) return; if (!window.confirm("Delete this blog?")) return; await adminDeleteBlog(id); navigate("/admin/blogs"); }}>Delete</button>
          </div>
          <BlogForm
            submitLabel="Save Changes"
            initialValues={{
              title: blog.title,
              slug: blog.slug,
              excerpt: blog.excerpt || "",
              content: blog.content || "",
              coverImageUrl: blog.coverImageUrl,
              tags: (blog.tags || []).join(", "),
              status: blog.status,
              seo: blog.seo,
            }}
            onSubmit={async (payload) => {
              if (!id) return;
              const updated = await adminUpdateBlog(id, payload);
              setBlog(updated);
              window.alert("Blog updated successfully.");
            }}
          />
        </>
      ) : null}
    </div>
  );
}

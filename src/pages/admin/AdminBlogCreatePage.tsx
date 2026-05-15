import { Navigate, useNavigate } from "react-router-dom";
import { BlogForm } from "../../components/blog/BlogForm";
import { adminCreateBlog } from "../../services/blog.service";

export function AdminBlogCreatePage() {
  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem("token")) && localStorage.getItem("role") === "admin";
  if (!isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Create Blog</h1>
      <BlogForm
        submitLabel="Create Blog"
        onSubmit={async (payload) => {
          await adminCreateBlog(payload);
          window.alert("Blog created successfully.");
          navigate("/admin/blogs");
        }}
      />
    </div>
  );
}

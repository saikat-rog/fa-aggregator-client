import api from "../lib/api";
import adminApi from "../lib/adminApi";

export type BlogStatus = "draft" | "published";

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  tags?: string[];
  status: BlogStatus;
  seo?: BlogSeo;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminListBlogsParams {
  page: number;
  limit: number;
  status?: BlogStatus;
  search?: string;
}

export interface PublicListBlogsParams {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
}

export interface BlogPayload {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  tags?: string[] | string;
  status?: BlogStatus;
  seo?: BlogSeo;
}

export interface BlogUpdatePayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  tags?: string[] | string;
  seo?: BlogSeo;
}

const unwrap = (response: any) => response?.data?.data ?? response?.data;
const unwrapBlog = (response: any): Blog => {
  const payload = unwrap(response);
  return (payload?.blog ?? payload) as Blog;
};

export async function adminCreateBlog(payload: BlogPayload): Promise<Blog> {
  const res = await adminApi.post("/admin/blogs", payload);
  return unwrapBlog(res);
}

export async function adminListBlogs(params: AdminListBlogsParams): Promise<{ blogs: Blog[]; pagination: Pagination }> {
  const res = await adminApi.get("/admin/blogs", { params });
  return unwrap(res) as { blogs: Blog[]; pagination: Pagination };
}

export async function adminGetBlogById(id: string): Promise<Blog> {
  const res = await adminApi.get(`/admin/blogs/${id}`);
  return unwrapBlog(res);
}

export async function adminUpdateBlog(id: string, payload: BlogUpdatePayload): Promise<Blog> {
  const res = await adminApi.patch(`/admin/blogs/${id}`, payload);
  return unwrapBlog(res);
}

export async function adminPublishBlog(id: string): Promise<Blog> {
  const res = await adminApi.patch(`/admin/blogs/${id}/publish`, {});
  return unwrapBlog(res);
}

export async function adminUnpublishBlog(id: string): Promise<Blog> {
  const res = await adminApi.patch(`/admin/blogs/${id}/unpublish`, {});
  return unwrapBlog(res);
}

export async function adminDeleteBlog(id: string): Promise<void> {
  await adminApi.delete(`/admin/blogs/${id}`);
}

export async function publicListBlogs(params: PublicListBlogsParams): Promise<{ blogs: Blog[]; pagination: Pagination }> {
  const res = await api.get("/blog", { params });
  return unwrap(res) as { blogs: Blog[]; pagination: Pagination };
}

export async function publicGetBlogBySlug(slug: string): Promise<Blog> {
  const res = await api.get(`/blog/${slug}`);
  return unwrapBlog(res);
}

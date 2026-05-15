import { useMemo, useState } from "react";
import { FiAlignLeft, FiEdit3, FiGlobe, FiHash, FiImage, FiLink, FiSearch, FiTag } from "react-icons/fi";
import type { BlogPayload, BlogSeo, BlogStatus } from "../../services/blog.service";

export interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string;
  status: BlogStatus;
  seo: BlogSeo;
}

interface Props {
  initialValues?: Partial<BlogFormValues>;
  loading?: boolean;
  onSubmit: (payload: BlogPayload) => Promise<void> | void;
  submitLabel: string;
}

const defaultValues: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  tags: "",
  status: "draft",
  seo: {
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImageUrl: "",
    noIndex: false,
  },
};

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export function BlogForm({ initialValues, loading, onSubmit, submitLabel }: Props) {
  const [values, setValues] = useState<BlogFormValues>({
    ...defaultValues,
    ...initialValues,
    seo: { ...defaultValues.seo, ...initialValues?.seo },
  });
  const [error, setError] = useState<string | null>(null);

  const tagsPreview = useMemo(
    () => values.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    [values.tags],
  );

  const update = (key: keyof BlogFormValues, val: string | BlogStatus) => {
    setValues((prev) => ({ ...prev, [key]: val as never }));
  };

  const updateSeo = (key: keyof BlogSeo, val: string | boolean) => {
    setValues((prev) => ({ ...prev, seo: { ...prev.seo, [key]: val } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.title.trim()) return setError("Title is required.");
    if (values.title.trim().length > 150) return setError("Title max length is 150.");
    if (!values.content.trim()) return setError("Content is required.");
    if (!values.coverImageUrl.trim()) return setError("Cover image URL is required.");
    if (!isValidHttpUrl(values.coverImageUrl.trim())) return setError("Cover image URL must be valid http/https URL.");
    if (values.seo.metaTitle && values.seo.metaTitle.length > 60) return setError("SEO meta title max length is 60.");
    if (values.seo.metaDescription && values.seo.metaDescription.length > 160) return setError("SEO meta description max length is 160.");
    if (values.seo.canonicalUrl && !isValidHttpUrl(values.seo.canonicalUrl)) return setError("Canonical URL must be valid.");
    if (values.seo.ogImageUrl && !isValidHttpUrl(values.seo.ogImageUrl)) return setError("OG image URL must be valid.");

    await onSubmit({
      title: values.title.trim(),
      slug: values.slug.trim() || undefined,
      excerpt: values.excerpt.trim() || undefined,
      content: values.content,
      coverImageUrl: values.coverImageUrl.trim(),
      tags: tagsPreview,
      status: values.status,
      seo: {
        metaTitle: values.seo.metaTitle?.trim() || undefined,
        metaDescription: values.seo.metaDescription?.trim() || undefined,
        canonicalUrl: values.seo.canonicalUrl?.trim() || undefined,
        ogImageUrl: values.seo.ogImageUrl?.trim() || undefined,
        noIndex: !!values.seo.noIndex,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl">
      {error ? <p className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"><FiEdit3 /> Content</p>
        <div className="space-y-2">
          <div className="relative">
            <FiEdit3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Title" value={values.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="relative">
            <FiHash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Slug (optional)" value={values.slug} onChange={(e) => update("slug", e.target.value.toLowerCase())} />
          </div>
          <textarea className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Excerpt" value={values.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} />
          <div className="relative">
            <FiAlignLeft className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-700" />
            <textarea className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Write your blog content..." value={values.content} onChange={(e) => update("content", e.target.value)} rows={12} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"><FiImage /> Media & Tags</p>
        <div className="space-y-2">
          <div className="relative">
            <FiLink className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Cover Image URL" value={values.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} />
          </div>
          <div className="relative">
            <FiTag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Tags (comma-separated)" value={values.tags} onChange={(e) => update("tags", e.target.value)} />
          </div>
          <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={values.status} onChange={(e) => update("status", e.target.value as BlogStatus)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {tagsPreview.length ? <div className="flex flex-wrap gap-1">{tagsPreview.map((t) => <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{t}</span>)}</div> : null}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"><FiSearch /> SEO</p>
        <div className="space-y-2">
          <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Meta Title (max 60)" value={values.seo.metaTitle || ""} onChange={(e) => updateSeo("metaTitle", e.target.value)} />
          <textarea className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Meta Description (max 160)" value={values.seo.metaDescription || ""} onChange={(e) => updateSeo("metaDescription", e.target.value)} rows={2} />
          <div className="relative">
            <FiGlobe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Canonical URL" value={values.seo.canonicalUrl || ""} onChange={(e) => updateSeo("canonicalUrl", e.target.value)} />
          </div>
          <div className="relative">
            <FiImage className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="OG Image URL" value={values.seo.ogImageUrl || ""} onChange={(e) => updateSeo("ogImageUrl", e.target.value)} />
          </div>
        </div>
        <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={!!values.seo.noIndex} onChange={(e) => updateSeo("noIndex", e.target.checked)} />
          No Index
        </label>
      </div>

      <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-50">
        <FiEdit3 />
        {submitLabel}
      </button>
    </form>
  );
}

import { useMemo, useState } from "react";
import { FiAlignLeft, FiEdit3, FiHash, FiImage, FiLink, FiSearch, FiTag } from "react-icons/fi";
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
    if (values.coverImageUrl.trim() && !isValidHttpUrl(values.coverImageUrl.trim())) return setError("Cover image URL must be valid http/https URL.");
    if (values.seo.metaTitle && values.seo.metaTitle.length > 60) return setError("SEO meta title max length is 60.");
    if (values.seo.metaDescription && values.seo.metaDescription.length > 160) return setError("SEO meta description max length is 160.");
    if (values.seo.ogImageUrl && !isValidHttpUrl(values.seo.ogImageUrl)) return setError("OG image URL must be valid.");

    await onSubmit({
      title: values.title.trim(),
      slug: values.slug.trim() || undefined,
      excerpt: values.excerpt.trim() || undefined,
      content: values.content,
      coverImageUrl: values.coverImageUrl.trim() || undefined,
      tags: tagsPreview,
      status: values.status,
      seo: {
        metaTitle: values.seo.metaTitle?.trim() || undefined,
        metaDescription: values.seo.metaDescription?.trim() || undefined,
        ogImageUrl: values.seo.ogImageUrl?.trim() || undefined,
        noIndex: !!values.seo.noIndex,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</p> : null}
      <div className="rounded-2xl border border-[#E7E1D6] bg-white p-5 shadow-sm space-y-3">
        <p className="inline-flex items-center gap-1.5 font-mono-code text-xs font-bold uppercase tracking-wider text-[#FF5A36]"><FiEdit3 /> Content Details</p>
        <div className="space-y-3">
          <div className="relative">
            <FiEdit3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7286]" />
            <input className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Article Title" value={values.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="relative">
            <FiHash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7286]" />
            <input className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Custom Slug (optional)" value={values.slug} onChange={(e) => update("slug", e.target.value.toLowerCase())} />
          </div>
          <textarea className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Short Excerpt" value={values.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} />
          <div className="relative">
            <FiAlignLeft className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#7A7286]" />
            <textarea className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white font-body leading-relaxed" placeholder="Write your blog content..." value={values.content} onChange={(e) => update("content", e.target.value)} rows={12} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E7E1D6] bg-white p-5 shadow-sm space-y-3">
        <p className="inline-flex items-center gap-1.5 font-mono-code text-xs font-bold uppercase tracking-wider text-[#6C4BFF]"><FiImage /> Media & Tags</p>
        <div className="space-y-3">
          <div className="relative">
            <FiLink className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7286]" />
            <input className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Cover Image URL (optional)" value={values.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} />
          </div>
          <div className="relative">
            <FiTag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7286]" />
            <input className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Tags (comma-separated, e.g. marketing, playbook)" value={values.tags} onChange={(e) => update("tags", e.target.value)} />
          </div>
          <select className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] outline-none transition focus:border-[#FF5A36] focus:bg-white" value={values.status} onChange={(e) => update("status", e.target.value as BlogStatus)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {tagsPreview.length ? (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tagsPreview.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full border border-[#6C4BFF]/20 bg-[#F1ECFF] px-2.5 py-0.5 text-[11px] font-bold font-mono-code text-[#6C4BFF]">
                <FiTag className="h-2.5 w-2.5" />
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-[#E7E1D6] bg-white p-5 shadow-sm space-y-3">
        <p className="inline-flex items-center gap-1.5 font-mono-code text-xs font-bold uppercase tracking-wider text-[#1F9D6B]"><FiSearch /> Search Optimization (SEO)</p>
        <div className="space-y-3">
          <input className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Meta Title (max 60 chars)" value={values.seo.metaTitle || ""} onChange={(e) => updateSeo("metaTitle", e.target.value)} />
          <textarea className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="Meta Description (max 160 chars)" value={values.seo.metaDescription || ""} onChange={(e) => updateSeo("metaDescription", e.target.value)} rows={2} />

          <div className="relative">
            <FiImage className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7286]" />
            <input className="w-full rounded-xl border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-2.5 pl-10 text-xs font-semibold text-[#201A2B] placeholder:text-[#7A7286]/60 outline-none transition focus:border-[#FF5A36] focus:bg-white" placeholder="OG Social Image URL" value={values.seo.ogImageUrl || ""} onChange={(e) => updateSeo("ogImageUrl", e.target.value)} />
          </div>
        </div>
        <label className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#201A2B] cursor-pointer">
          <input type="checkbox" checked={!!values.seo.noIndex} onChange={(e) => updateSeo("noIndex", e.target.checked)} className="rounded text-[#FF5A36] focus:ring-[#FF5A36]" />
          No Index (Hide from search engines)
        </label>
      </div>

      <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A36] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#FF5A36]/90 disabled:opacity-50">
        <FiEdit3 />
        {submitLabel}
      </button>
    </form>
  );
}

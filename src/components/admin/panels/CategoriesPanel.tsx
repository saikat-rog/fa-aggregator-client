import { useEffect, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { createAdminCategory, getAdminCategories } from "../../../services/admin/admin.service";
import { inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

type CategoryItem = string | { _id?: string; name?: string; categoryCode?: string };

const getCategoryKey = (item: CategoryItem) =>
  typeof item === "string" ? item : item._id || item.categoryCode || item.name || JSON.stringify(item);

const getCategoryLabel = (item: CategoryItem) =>
  typeof item === "string" ? item : item.name || item.categoryCode || "Unnamed category";

export function CategoriesPanel() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const load = () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminCategories(ctrl.signal)
      .then((res) => setCategories(res.categories || []))
      .catch((err) => {
        if (err?.name === "AbortError" || err?.name === "CanceledError") return;
        setError("Failed to fetch categories.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  };

  useEffect(load, []);

  const onCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const shouldCreate = window.confirm(`Add new category "${trimmedName}"?`);
    if (!shouldCreate) return;
    await createAdminCategory(trimmedName);
    setName("");
    load();
  };

  return (
    <section className={panelClassName}>
      <h3 className="inline-flex items-center gap-2 text-lg font-semibold"><FiLayers className="text-blue-700" /> Categories</h3>
      <div className="mt-3 flex gap-2">
        <input className={`w-full ${inputClassName}`} placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800" onClick={onCreate}>Create</button>
      </div>
      {loading ? <p className={statusInfoClassName}>Loading categories...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && categories.length === 0 ? <p className={statusEmptyClassName}>No categories found.</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((item) => (
          <span
            key={getCategoryKey(item)}
            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
          >
            {getCategoryLabel(item)}
          </span>
        ))}
      </div>
    </section>
  );
}

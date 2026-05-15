import { useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import { createAdminIndustry, getAdminIndustries } from "../../../services/admin/admin.service";
import { inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

type IndustryItem = string | { _id?: string; name?: string; industryCode?: string };

const getIndustryKey = (item: IndustryItem) =>
  typeof item === "string" ? item : item._id || item.industryCode || item.name || JSON.stringify(item);

const getIndustryLabel = (item: IndustryItem) =>
  typeof item === "string" ? item : item.name || item.industryCode || "Unnamed industry";

export function IndustriesPanel() {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const load = () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminIndustries(ctrl.signal)
      .then((res) => setIndustries(res.industries || []))
      .catch((err) => {
        if (err?.name === "AbortError" || err?.name === "CanceledError") return;
        setError("Failed to fetch industries.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  };

  useEffect(load, []);

  const onCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const shouldCreate = window.confirm(`Add new industry "${trimmedName}"?`);
    if (!shouldCreate) return;
    await createAdminIndustry(trimmedName);
    setName("");
    load();
  };

  return (
    <section className={panelClassName}>
      <h3 className="inline-flex items-center gap-2 text-lg font-semibold"><FiTag className="text-blue-700" /> Industries</h3>
      <div className="mt-3 flex gap-2">
        <input className={`w-full ${inputClassName}`} placeholder="New industry name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800" onClick={onCreate}>Create</button>
      </div>
      {loading ? <p className={statusInfoClassName}>Loading industries...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && industries.length === 0 ? <p className={statusEmptyClassName}>No industries found.</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {industries.map((item) => (
          <span
            key={getIndustryKey(item)}
            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
          >
            {getIndustryLabel(item)}
          </span>
        ))}
      </div>
    </section>
  );
}

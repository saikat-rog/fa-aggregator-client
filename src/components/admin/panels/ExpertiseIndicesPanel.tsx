import { useEffect, useState } from "react";
import { FiActivity } from "react-icons/fi";
import { createAdminExpertiseIndex, getAdminExpertiseIndices, type ExpertiseIndexItem } from "../../../services/admin/admin.service";
import { inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

type RawIndexItem = string | ExpertiseIndexItem;

const getIndexKey = (item: RawIndexItem) =>
  typeof item === "string" ? item : item._id || item.indexCode || item.name || JSON.stringify(item);

const getIndexLabel = (item: RawIndexItem) =>
  typeof item === "string" ? item : item.name || item.indexCode || "Unnamed index";

const getIndexCountry = (item: RawIndexItem) =>
  typeof item === "string" ? null : item.country;

export function ExpertiseIndicesPanel() {
  const [indices, setIndices] = useState<RawIndexItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const load = () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminExpertiseIndices(ctrl.signal)
      .then((res) => setIndices(res.expertiseIndices || []))
      .catch((err) => {
        if (err?.name === "AbortError" || err?.name === "CanceledError") return;
        setError("Failed to fetch expertise indices.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  };

  useEffect(load, []);

  const onCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const shouldCreate = window.confirm(`Add new expertise index "${trimmedName}"?`);
    if (!shouldCreate) return;
    try {
      await createAdminExpertiseIndex(trimmedName, country.trim() || undefined);
      setName("");
      setCountry("");
      load();
    } catch {
      setError("Failed to create expertise index.");
    }
  };

  return (
    <section className={panelClassName}>
      <h3 className="inline-flex items-center gap-2 text-lg font-semibold"><FiActivity className="text-blue-700" /> Expertise Indices</h3>
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input className={`w-full ${inputClassName}`} placeholder="New index name (e.g. Nifty 50, S&P 500)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={`w-full sm:w-1/3 ${inputClassName}`} placeholder="Country (optional)" value={country} onChange={(e) => setCountry(e.target.value)} />
        <button className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800" onClick={onCreate}>Create</button>
      </div>
      {loading ? <p className={statusInfoClassName}>Loading expertise indices...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && indices.length === 0 ? <p className={statusEmptyClassName}>No expertise indices found.</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {indices.map((item) => {
          const c = getIndexCountry(item);
          return (
            <span
              key={getIndexKey(item)}
              className="inline-flex items-center gap-1 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800"
            >
              {getIndexLabel(item)}
              {c ? <span className="text-[10px] text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded-full">({c})</span> : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}

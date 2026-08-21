import { useEffect, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { createAdminMarket, getAdminMarkets, type MarketItem } from "../../../services/admin/admin.service";
import { inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

type RawMarketItem = string | MarketItem;

const getMarketKey = (item: RawMarketItem) =>
  typeof item === "string" ? item : item._id || item.marketCode || item.name || JSON.stringify(item);

const getMarketLabel = (item: RawMarketItem) =>
  typeof item === "string" ? item : item.name || item.marketCode || "Unnamed market";

export function MarketsPanel() {
  const [markets, setMarkets] = useState<RawMarketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const load = () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminMarkets(ctrl.signal)
      .then((res) => setMarkets(res.markets || []))
      .catch((err) => {
        if (err?.name === "AbortError" || err?.name === "CanceledError") return;
        setError("Failed to fetch markets.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  };

  useEffect(load, []);

  const onCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const shouldCreate = window.confirm(`Add new market focus "${trimmedName}"?`);
    if (!shouldCreate) return;
    try {
      await createAdminMarket(trimmedName);
      setName("");
      load();
    } catch {
      setError("Failed to create market focus.");
    }
  };

  return (
    <section className={panelClassName}>
      <h3 className="inline-flex items-center gap-2 text-lg font-semibold"><FiTrendingUp className="text-blue-700" /> Market Focus</h3>
      <div className="mt-3 flex gap-2">
        <input className={`w-full ${inputClassName}`} placeholder="New market focus name (e.g. NYSE, BSE, Crypto)" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800" onClick={onCreate}>Create</button>
      </div>
      {loading ? <p className={statusInfoClassName}>Loading markets...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && markets.length === 0 ? <p className={statusEmptyClassName}>No markets found.</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {markets.map((item) => (
          <span
            key={getMarketKey(item)}
            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
          >
            {getMarketLabel(item)}
          </span>
        ))}
      </div>
    </section>
  );
}

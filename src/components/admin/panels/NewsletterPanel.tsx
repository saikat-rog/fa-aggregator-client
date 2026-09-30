import { useEffect, useState } from "react";
import { FiMail, FiTrash2, FiSearch, FiCheckCircle } from "react-icons/fi";
import {
  getAdminNewsletterSubscribersApi,
  deleteAdminNewsletterSubscriberApi,
  type NewsletterSubscriber,
} from "../../../services/newsletter.service";
import { PaginationControls } from "../PaginationControls";
import {
  getNum,
  inputClassName,
  panelClassName,
  statusEmptyClassName,
  statusErrorClassName,
  statusInfoClassName,
} from "../adminPage.shared";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
  setManyParams?: (updates: Record<string, string | undefined>) => void;
}

export function NewsletterPanel({ params, setParam, setManyParams }: Props) {
  const page = getNum(params.get("nlPage"), 1);
  const limit = getNum(params.get("nlLimit"), 20);
  const search = params.get("nlSearch") ?? "";

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [pagination, setPagination] = useState<{ total: number; totalPages: number; page: number; limit: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    getAdminNewsletterSubscribersApi({ page, limit, search }, ctrl.signal)
      .then((res) => {
        if (!active) return;
        setSubscribers(res.subscribers || []);
        setPagination(res.pagination || null);
      })
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
          setError("Failed to fetch newsletter subscribers.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      ctrl.abort();
    };
  }, [page, limit, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setManyParams) {
      setManyParams({
        nlSearch: searchInput.trim() || undefined,
        nlPage: "1",
      });
    } else {
      setParam("nlSearch", searchInput.trim() || undefined);
      setParam("nlPage", "1");
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete ${email} from the subscribers list?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAdminNewsletterSubscriberApi(id);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      if (pagination) {
        setPagination({ ...pagination, total: Math.max(0, pagination.total - 1) });
      }
      setActionSuccess(`Removed ${email} successfully.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      alert("Failed to delete subscriber. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className={panelClassName}>
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <FiMail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Newsletter Subscribers</h3>
            <p className="text-xs text-slate-500">
              Users who submitted their email in the homepage newsletter section.
            </p>
          </div>
        </div>

        {pagination ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/60">
            <FiCheckCircle className="h-3.5 w-3.5" />
            {pagination.total} Total {pagination.total === 1 ? "Subscriber" : "Subscribers"}
          </span>
        ) : null}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className={`${inputClassName} pl-9 w-full`}
            placeholder="Search by email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2 transition cursor-pointer shadow-xs"
        >
          Search
        </button>
        {search ? (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              if (setManyParams) {
                setManyParams({ nlSearch: undefined, nlPage: "1" });
              } else {
                setParam("nlSearch", undefined);
                setParam("nlPage", "1");
              }
            }}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-2 font-medium transition cursor-pointer"
          >
            Clear
          </button>
        ) : null}
      </form>

      {actionSuccess ? (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-800 animate-in fade-in">
          {actionSuccess}
        </div>
      ) : null}

      {loading ? <p className={statusInfoClassName}>Loading subscribers...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}

      {!loading && !error && subscribers.length === 0 ? (
        <p className={statusEmptyClassName}>
          {search ? `No subscribers found matching "${search}".` : "No newsletter subscribers yet."}
        </p>
      ) : null}

      {!loading && !error && subscribers.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Subscribed At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((item, index) => {
                const rowNum = (page - 1) * limit + index + 1;
                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A";

                return (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-medium">
                      {rowNum}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`mailto:${item.email}`}
                        className="font-bold text-slate-900 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                      >
                        <FiMail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.email}</span>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {item.source === "homepage_newsletter" ? "Homepage Newsletter" : item.source || "Website"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {formattedDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={deletingId === item._id}
                        onClick={() => handleDelete(item._id, item.email)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50"
                        title="Delete subscriber"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        <span>{deletingId === item._id ? "Deleting..." : "Delete"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4">
        <PaginationControls
          pagination={pagination || undefined}
          onPageChange={(v) => {
            if (setManyParams) {
              setManyParams({ nlPage: String(v) });
            } else {
              setParam("nlPage", String(v));
            }
          }}
          onLimitChange={(v) => {
            if (setManyParams) {
              setManyParams({ nlLimit: String(v), nlPage: "1" });
            } else {
              setParam("nlLimit", String(v));
              setParam("nlPage", "1");
            }
          }}
        />
      </div>
    </section>
  );
}

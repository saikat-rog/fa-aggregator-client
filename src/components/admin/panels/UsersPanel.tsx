import { useEffect, useMemo, useState } from "react";
import { FiAtSign, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import type { AdminUser } from "../../../services/admin/admin.service";
import { getAdminUsers } from "../../../services/admin/admin.service";
import { advisorFormOptionsApi, type AdvisorFormOptionsResponseData } from "../../../services/advisor.service";
import { PaginationControls } from "../PaginationControls";
import { FiUsers } from "react-icons/fi";
import { getNum, inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
  setManyParams: (updates: Record<string, string | undefined>) => void;
}

export function UsersPanel({ params, setParam, setManyParams }: Props) {
  const page = getNum(params.get("usersPage"), 1);
  const limit = getNum(params.get("usersLimit"), 10);
  const country = params.get("usersCountry") ?? "";
  const state = params.get("usersState") ?? "";
  const approxLocation = params.get("usersApproxLocation") ?? "";
  const debouncedApproxLocation = useDebouncedValue(approxLocation, 300);

  const [data, setData] = useState<{ users: AdminUser[]; pagination: any } | null>(null);
  const [formOptions, setFormOptions] = useState<AdvisorFormOptionsResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    advisorFormOptionsApi().then(setFormOptions).catch(() => null);
  }, []);

  const availableCountries = useMemo(() => {
    if (!formOptions) return [];
    if (Array.isArray((formOptions as { countries?: string[] }).countries) && (formOptions as { countries?: string[] }).countries?.length) {
      return (formOptions as { countries?: string[] }).countries as string[];
    }
    return Object.keys(formOptions.locations ?? {});
  }, [formOptions]);

  const availableStates = country ? (formOptions?.locations?.[country]?.states ?? []) : [];

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminUsers({ page, limit, country: country || undefined, state: state || undefined, approxLocation: debouncedApproxLocation || undefined }, ctrl.signal)
      .then(setData)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") setError("Failed to fetch users.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [page, limit, country, state, debouncedApproxLocation]);

  return (
    <section className={panelClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><FiUsers className="text-blue-700" /> Users</h3>
          {/* <p className="text-sm text-blue-700">Directory from <code>/admin/users</code></p> */}
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{data?.pagination?.total ?? 0} total</div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <label className="relative">
          <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <select className={`${inputClassName} w-full pl-9`} value={country} onChange={(e) => setManyParams({ usersCountry: e.target.value || undefined, usersState: undefined })}>
            <option value="">All countries</option>
            {availableCountries.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="relative">
          <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <select className={`${inputClassName} w-full pl-9 disabled:cursor-not-allowed disabled:opacity-60`} value={state} onChange={(e) => setParam("usersState", e.target.value)} disabled={!country}>
            <option value="">All states</option>
            {availableStates.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="relative">
          <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" />
          <input className={`${inputClassName} w-full pl-9`} placeholder="Approx location (search)" value={approxLocation} onChange={(e) => setParam("usersApproxLocation", e.target.value)} />
        </label>
      </div>

      {loading ? <p className={statusInfoClassName}>Loading users...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && (data?.users?.length ?? 0) === 0 ? <p className={statusEmptyClassName}>No users found for this filter set.</p> : null}

      {!!data?.users?.length && (
        <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-blue-700">
                <th className="px-4 py-3"><span className="inline-flex items-center gap-1"><FiUser /> Name</span></th>
                <th className="px-4 py-3"><span className="inline-flex items-center gap-1"><FiAtSign /> Email</span></th>
                <th className="px-4 py-3"><span className="inline-flex items-center gap-1"><FiPhone /> Phone Number</span></th>
                <th className="px-4 py-3"><span className="inline-flex items-center gap-1"><FiMapPin /> Location</span></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id || user.id || user.email} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{user.name || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{user.phone || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{[user.country, user.state].filter(Boolean).join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PaginationControls pagination={data?.pagination} onPageChange={(v) => setParam("usersPage", String(v))} onLimitChange={(v) => { setParam("usersLimit", String(v)); setParam("usersPage", "1"); }} />
    </section>
  );
}

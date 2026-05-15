import { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { getAdminAdvisorEnquiries } from "../../../services/admin/admin.service";
import { PaginationControls } from "../PaginationControls";
import { getNum, inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
}

export function EnquiriesPanel({ params, setParam }: Props) {
  const advisorId = params.get("enquiryAdvisorId") ?? "";
  const page = getNum(params.get("enquiryPage"), 1);
  const limit = getNum(params.get("enquiryLimit"), 10);
  const [data, setData] = useState<{ enquiries: Record<string, unknown>[]; pagination?: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!advisorId) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdminAdvisorEnquiries(advisorId, { page, limit }, ctrl.signal)
      .then(setData)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") setError("Failed to fetch advisor enquiries.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [advisorId, page, limit]);

  return (
    <section className={panelClassName}>
      <h3 className="inline-flex items-center gap-2 text-lg font-semibold"><FiMessageCircle className="text-blue-700" /> Advisor Enquiries</h3>
      <input className={`mt-3 w-full ${inputClassName}`} placeholder="Advisor ID" value={advisorId} onChange={(e) => setParam("enquiryAdvisorId", e.target.value)} />
      {!advisorId ? <p className={statusEmptyClassName}>Enter advisorId to load enquiries.</p> : null}
      {loading ? <p className={statusInfoClassName}>Loading enquiries...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && advisorId && (data?.enquiries?.length ?? 0) === 0 ? <p className={statusEmptyClassName}>No enquiries found.</p> : null}
      {!!data?.enquiries?.length ? <pre className="mt-3 max-h-80 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(data.enquiries, null, 2)}</pre> : null}
      <PaginationControls pagination={data?.pagination} onPageChange={(v) => setParam("enquiryPage", String(v))} onLimitChange={(v) => { setParam("enquiryLimit", String(v)); setParam("enquiryPage", "1"); }} />
    </section>
  );
}

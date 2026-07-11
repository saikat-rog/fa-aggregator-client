import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiExternalLink } from "react-icons/fi";
import {
  getBusinessRequirementByIdAdmin,
  getBusinessRequirementsAdmin,
  approveBusinessRequirementAdmin,
  type BusinessRequirementItem,
} from "../../../services/businessRequirements.service";
import { PaginationControls } from "../PaginationControls";
import {
  getNum,
  panelClassName,
  statusEmptyClassName,
  statusErrorClassName,
  statusInfoClassName,
} from "../adminPage.shared";

type Props = {
  params: URLSearchParams;
  setParam: (key: string, value?: string) => void;
};

const formatSalesValue = (value: string) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(parsed);
  }
  return value;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    : "—";

export function BusinessRequirementsPanel({ params, setParam }: Props) {
  const page = getNum(params.get("requirementsPage"), 1);
  const limit = getNum(params.get("requirementsLimit"), 10);
  const selectedId = params.get("requirementsId") ?? "";
  const statusParam = params.get("requirementsStatus");
  const status = statusParam === "pending" || statusParam === "approved" ? statusParam : undefined;

  const [rows, setRows] = useState<BusinessRequirementItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState("");
  const [notice, setNotice] = useState("");

  const [detail, setDetail] = useState<BusinessRequirementItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await getBusinessRequirementsAdmin({ page, limit, status });
        setRows(payload.requirements ?? []);
        setPagination(payload.pagination ?? { page, limit, total: 0, totalPages: 1 });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load business requirements.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [page, limit, status]);

  const onApprove = async (id: string) => {
    if (approvingId) return;
    try {
      setApprovingId(id);
      setError("");
      setNotice("");
      const approved = await approveBusinessRequirementAdmin(id);
      setRows((current) => status === "pending" ? current.filter((item) => item._id !== id) : current.map((item) => item._id === id ? approved : item));
      setDetail((current) => current?._id === id ? approved : current);
      setNotice("Business requirement approved successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve business requirement.");
    } finally {
      setApprovingId("");
    }
  };

  useEffect(() => {
    if (!selectedId) return;

    const loadDetail = async () => {
      try {
        setDetailLoading(true);
        setDetailError("");
        const payload = await getBusinessRequirementByIdAdmin(selectedId);
        setDetail(payload);
      } catch (err: unknown) {
        setDetailError(err instanceof Error ? err.message : "Failed to load requirement details.");
      } finally {
        setDetailLoading(false);
      }
    };

    void loadDetail();
  }, [selectedId]);

  const csvData = useMemo(() => {
    const headers = [
      "Company Name",
      "Business Email",
      "Current Monthly Sales",
      "Goal Monthly Sales",
      "Desired Influencer Scope",
      "Campaign Objective",
      "Detailed Requirements",
      "Submitted At",
    ];

    const lines = rows.map((item) =>
      [
        item.companyName,
        item.businessEmail,
        String(item.currentMonthlySales),
        String(item.goalMonthlySales),
        item.desiredInfluencerScope,
        item.campaignObjective,
        item.detailedRequirements.replace(/\n/g, " "),
        formatDate(item.createdAt),
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );

    return [headers.join(","), ...lines].join("\n");
  }, [rows]);

  const onExportCsv = () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `business-requirements-page-${page}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className={panelClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
          <FiBriefcase className="text-blue-700" />
          Business Requirements
        </h3>
        <button
          type="button"
          onClick={onExportCsv}
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter business requirements by status">
        {(["all", "pending", "approved"] as const).map((value) => (
          <button key={value} type="button" onClick={() => { setParam("requirementsStatus", value === "all" ? undefined : value); setParam("requirementsPage", "1"); }} className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${((value === "all" && !status) || value === status) ? "bg-blue-700 text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
            {value}
          </button>
        ))}
      </div>

      {loading ? <p className={statusInfoClassName}>Loading submissions...</p> : null}
      {notice ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}

      {!loading && !error && rows.length === 0 ? (
        <p className={statusEmptyClassName}>No business requirements submitted yet.</p>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-blue-700">
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Business Email</th>
                <th className="px-4 py-3">Current Monthly Sales</th>
                <th className="px-4 py-3">Goal Monthly Sales</th>
                <th className="px-4 py-3">Desired Influencer Scope</th>
                <th className="px-4 py-3">Campaign Objective</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Approved At</th>
                <th className="px-4 py-3">Submitted At</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item._id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.companyName}</td>
                  <td className="px-4 py-3 text-slate-600">{item.businessEmail}</td>
                  <td className="px-4 py-3 text-slate-600">{formatSalesValue(item.currentMonthlySales)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatSalesValue(item.goalMonthlySales)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.desiredInfluencerScope}</td>
                  <td className="px-4 py-3 text-slate-600">{item.campaignObjective}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{item.status}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.approvedAt ?? undefined)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setParam("requirementsId", item._id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FiExternalLink className="h-3.5 w-3.5" />
                      View
                    </button>
                    {item.status === "pending" ? (
                      <button type="button" disabled={Boolean(approvingId)} onClick={() => void onApprove(item._id)} className="ml-2 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                        {approvingId === item._id ? "Approving..." : "Approve"}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <PaginationControls
        pagination={pagination}
        onPageChange={(v) => setParam("requirementsPage", String(v))}
        onLimitChange={(v) => {
          setParam("requirementsLimit", String(v));
          setParam("requirementsPage", "1");
        }}
      />

      {selectedId ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-base font-semibold text-slate-900">Requirement Details</h4>
            <button
              type="button"
              onClick={() => setParam("requirementsId", undefined)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              Close
            </button>
          </div>

          {detailLoading ? <p className={statusInfoClassName}>Loading details...</p> : null}
          {detailError ? <p className={statusErrorClassName}>{detailError}</p> : null}

          {detail && !detailLoading && !detailError ? (
            <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-semibold text-slate-900">Company Name:</span> {detail.companyName}</p>
              <p><span className="font-semibold text-slate-900">Business Email:</span> {detail.businessEmail}</p>
              <p><span className="font-semibold text-slate-900">URL:</span> {detail.url ? <a href={detail.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{detail.url}</a> : "—"}</p>
              <p><span className="font-semibold text-slate-900">Status:</span> <span className="capitalize">{detail.status}</span></p>
              <p><span className="font-semibold text-slate-900">Approved At:</span> {formatDate(detail.approvedAt ?? undefined)}</p>
              <p><span className="font-semibold text-slate-900">Current Monthly Sales:</span> {formatSalesValue(detail.currentMonthlySales)}</p>
              <p><span className="font-semibold text-slate-900">Goal Monthly Sales:</span> {formatSalesValue(detail.goalMonthlySales)}</p>
              <p><span className="font-semibold text-slate-900">Desired Influencer Scope:</span> {detail.desiredInfluencerScope}</p>
              <p><span className="font-semibold text-slate-900">Campaign Objective:</span> {detail.campaignObjective}</p>
              <p className="md:col-span-2"><span className="font-semibold text-slate-900">Detailed Requirements:</span></p>
              <p className="md:col-span-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 text-slate-700">
                {detail.detailedRequirements}
              </p>
              <p><span className="font-semibold text-slate-900">Created At:</span> {formatDate(detail.createdAt)}</p>
              <p><span className="font-semibold text-slate-900">Updated At:</span> {formatDate(detail.updatedAt)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

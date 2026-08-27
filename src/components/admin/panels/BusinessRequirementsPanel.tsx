import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiExternalLink, FiMousePointer } from "react-icons/fi";
import {
  getBusinessRequirementByIdAdmin,
  getBusinessRequirementsAdmin,
  getRequirementClicksAdmin,
  approveBusinessRequirementAdmin,
  approveRequirementEditAdmin,
  rejectRequirementEditAdmin,
  deleteBusinessRequirementAdmin,
  type BusinessRequirementItem,
  type RequirementClickItem,
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
  setManyParams?: (updates: Record<string, string | undefined>) => void;
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

export function BusinessRequirementsPanel({ params, setParam, setManyParams }: Props) {
  const updateMany = (updates: Record<string, string | undefined>) => {
    if (setManyParams) {
      setManyParams(updates);
    } else {
      for (const [key, value] of Object.entries(updates)) {
        setParam(key, value);
      }
    }
  };
  const activeTab = params.get("requirementsSubTab") === "clicks" ? "clicks" : "submissions";

  const page = getNum(params.get("requirementsPage"), 1);
  const limit = getNum(params.get("requirementsLimit"), 10);
  const selectedId = params.get("requirementsId") ?? "";
  const statusParam = params.get("requirementsStatus");
  const status = statusParam === "pending" || statusParam === "approved" || statusParam === "pending_edit" ? statusParam : undefined;

  const [rows, setRows] = useState<BusinessRequirementItem[]>([]);
  const [clickRows, setClickRows] = useState<RequirementClickItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [notice, setNotice] = useState("");

  const [detail, setDetail] = useState<BusinessRequirementItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        if (activeTab === "submissions") {
          const payload = await getBusinessRequirementsAdmin({ page, limit, status });
          setRows(payload.requirements ?? []);
          setPagination(payload.pagination ?? { page, limit, total: 0, totalPages: 1 });
        } else {
          const payload = await getRequirementClicksAdmin({ page, limit });
          setClickRows(payload.clicks ?? []);
          setPagination(payload.pagination ?? { page, limit, total: 0, totalPages: 1 });
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [activeTab, page, limit, status]);


  const onApproveEdit = async (id: string) => {
    if (actionLoadingId) return;
    try {
      setActionLoadingId(id);
      setError("");
      setNotice("");
      const updated = await approveRequirementEditAdmin(id);
      setRows((current) => current.map((item) => (item._id === id ? updated : item)));
      setDetail((current) => (current?._id === id ? updated : current));
      setNotice("Proposed requirement updates approved and applied live successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve requirement edit.");
    } finally {
      setActionLoadingId("");
    }
  };

  const onRejectEdit = async (id: string) => {
    if (actionLoadingId) return;
    try {
      setActionLoadingId(id);
      setError("");
      setNotice("");
      const updated = await rejectRequirementEditAdmin(id);
      setRows((current) => current.map((item) => (item._id === id ? updated : item)));
      setDetail((current) => (current?._id === id ? updated : current));
      setNotice("Proposed requirement updates rejected.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reject requirement edit.");
    } finally {
      setActionLoadingId("");
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this business requirement?")) return;
    if (actionLoadingId) return;
    try {
      setActionLoadingId(id);
      setError("");
      setNotice("");
      await deleteBusinessRequirementAdmin(id);
      setRows((current) => current.filter((item) => item._id !== id));
      if (selectedId === id) setParam("requirementsId", undefined);
      setNotice("Business requirement deleted successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete business requirement.");
    } finally {
      setActionLoadingId("");
    }
  };

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
    if (!selectedId || activeTab !== "submissions") {
      setDetail(null);
      setDetailError("");
      return;
    }

    const matchedRow = rows.find((r) => r._id === selectedId);
    if (matchedRow) {
      setDetail(matchedRow);
    }

    const loadDetail = async () => {
      try {
        setDetailLoading(!matchedRow);
        setDetailError("");
        const payload = await getBusinessRequirementByIdAdmin(selectedId);
        if (payload && payload._id) {
          setDetail(payload);
        }
      } catch (err: unknown) {
        if (!matchedRow) {
          setDetailError(err instanceof Error ? err.message : "Failed to load requirement details.");
        }
      } finally {
        setDetailLoading(false);
      }
    };

    void loadDetail();
  }, [selectedId, rows, activeTab]);

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
        item.detailedRequirements?.replace(/\n/g, " ") ?? "",
        formatDate(item.createdAt),
      ]
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
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
        {activeTab === "submissions" ? (
          <button
            type="button"
            onClick={onExportCsv}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Export CSV
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => {
            updateMany({ requirementsSubTab: undefined, requirementsPage: "1" });
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            activeTab === "submissions"
              ? "bg-blue-700 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FiBriefcase className="h-4 w-4" />
          Submissions
        </button>
        <button
          type="button"
          onClick={() => {
            updateMany({ requirementsSubTab: "clicks", requirementsPage: "1" });
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            activeTab === "clicks"
              ? "bg-blue-700 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FiMousePointer className="h-4 w-4" />
          Link Click Logs
        </button>
      </div>

      {activeTab === "submissions" ? (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Filter business requirements by status">
          {(["all", "pending", "pending_edit", "approved"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                updateMany({
                  requirementsStatus: value === "all" ? undefined : value,
                  requirementsPage: "1",
                });
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${((value === "all" && !status) || value === status) ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              {value}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? <p className={statusInfoClassName}>Loading...</p> : null}
      {notice ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}

      {!loading && !error && activeTab === "submissions" && rows.length === 0 ? (
        <p className={statusEmptyClassName}>No business requirements submitted yet.</p>
      ) : null}

      {!loading && !error && activeTab === "clicks" && clickRows.length === 0 ? (
        <p className={statusEmptyClassName}>No requirement link clicks logged yet.</p>
      ) : null}

      {!loading && !error && activeTab === "submissions" && rows.length > 0 ? (
        <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-blue-700">
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Business Email</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Posted By Advisor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted At</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item._id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.companyName || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{item.businessEmail || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                        Website Link
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.postedByAdvisorName || "—"} {item.postedByAdvisorUsername ? `(@${item.postedByAdvisorUsername})` : ""}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.editStatus === "pending" ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">Pending Edit</span>
                    ) : item.status === "approved" ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Approved</span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">Pending</span>
                    )}
                  </td>
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
                    {item.editStatus === "pending" ? (
                      <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => void onApproveEdit(item._id)} className="ml-2 rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                        Approve Edit
                      </button>
                    ) : null}
                    <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => void onDelete(item._id)} className="ml-2 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && !error && activeTab === "clicks" && clickRows.length > 0 ? (
        <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-blue-700">
                <th className="px-4 py-3">User (Who Clicked)</th>
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Requirement Company</th>
                <th className="px-4 py-3">Posted By Advisor</th>
                <th className="px-4 py-3">Resource Link</th>
                <th className="px-4 py-3">Clicked At</th>
              </tr>
            </thead>
            <tbody>
              {clickRows.map((click) => (
                <tr key={click._id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{click.userName || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{click.userEmail || "—"}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{click.companyName || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {click.advisorName || "—"} {click.advisorUsername ? `(@${click.advisorUsername})` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {click.url ? (
                      <a href={click.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline flex items-center gap-1">
                        <FiExternalLink className="h-3 w-3" />
                        {click.url.length > 40 ? `${click.url.slice(0, 37)}...` : click.url}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(click.clickedAt)}</td>
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
          updateMany({
            requirementsLimit: String(v),
            requirementsPage: "1",
          });
        }}
      />

      {selectedId && activeTab === "submissions" ? (
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

          {detail && !detailLoading ? (
            <div className="space-y-4">
              {detail.editStatus === "pending" && detail.pendingEdit ? (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-amber-900 text-sm">Proposed Edit Comparison (Review Required)</h5>
                    <div className="flex gap-2">
                      <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => void onApproveEdit(detail._id)} className="rounded-lg bg-amber-700 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-800">
                        Approve Edit
                      </button>
                      <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => void onRejectEdit(detail._id)} className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100">
                        Reject Edit
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 text-xs">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                      <p className="font-bold text-slate-800 uppercase border-b pb-1">Current Published Version</p>
                      <p><span className="font-semibold">Company:</span> {detail.companyName}</p>
                      <p><span className="font-semibold">Email:</span> {detail.businessEmail}</p>
                      <p><span className="font-semibold">URL:</span> {detail.url}</p>
                      <p className="font-semibold mt-1">Requirements:</p>
                      <p className="whitespace-pre-wrap text-slate-600">{detail.detailedRequirements}</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-100/50 p-3 space-y-2">
                      <p className="font-bold text-amber-900 uppercase border-b border-amber-200 pb-1">Proposed Updates</p>
                      <p><span className="font-semibold">Company:</span> <span className={detail.pendingEdit.companyName !== detail.companyName ? "bg-amber-200 px-1 rounded font-bold" : ""}>{detail.pendingEdit.companyName || "—"}</span></p>
                      <p><span className="font-semibold">Email:</span> <span className={detail.pendingEdit.businessEmail !== detail.businessEmail ? "bg-amber-200 px-1 rounded font-bold" : ""}>{detail.pendingEdit.businessEmail || "—"}</span></p>
                      <p><span className="font-semibold">URL:</span> <span className={detail.pendingEdit.url !== detail.url ? "bg-amber-200 px-1 rounded font-bold" : ""}>{detail.pendingEdit.url || "—"}</span></p>
                      <p className="font-semibold mt-1">Requirements:</p>
                      <p className={`whitespace-pre-wrap text-slate-800 ${detail.pendingEdit.detailedRequirements !== detail.detailedRequirements ? "bg-amber-200 p-1 rounded font-medium" : ""}`}>{detail.pendingEdit.detailedRequirements || "—"}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                <p><span className="font-semibold text-slate-900">Company Name:</span> {detail.companyName || "—"}</p>
                <p><span className="font-semibold text-slate-900">Business Email:</span> {detail.businessEmail || "—"}</p>
                <p><span className="font-semibold text-slate-900">URL:</span> {detail.url ? <a href={detail.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{detail.url}</a> : "—"}</p>
                <p><span className="font-semibold text-slate-900">Status:</span> <span className="capitalize">{detail.status || "—"}</span></p>
                <p><span className="font-semibold text-slate-900">Approved At:</span> {formatDate(detail.approvedAt ?? undefined)}</p>
                <p><span className="font-semibold text-slate-900">Posted By Advisor:</span> {detail.postedByAdvisorName || "—"} {detail.postedByAdvisorUsername ? `(@${detail.postedByAdvisorUsername})` : ""}</p>
                <p className="md:col-span-2"><span className="font-semibold text-slate-900">Detailed Requirements:</span></p>
                <p className="md:col-span-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 text-slate-700">
                  {detail.detailedRequirements || "—"}
                </p>
                <p><span className="font-semibold text-slate-900">Created At:</span> {formatDate(detail.createdAt)}</p>
                <p><span className="font-semibold text-slate-900">Updated At:</span> {formatDate(detail.updatedAt)}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => void onDelete(detail._id)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100">
                  Delete Requirement
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

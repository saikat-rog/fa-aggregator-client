import { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import {
  getAdminCampaignApplicationsApi,
  type CampaignApplicationItem,
  type CampaignApplicationPagination,
} from "../../../services/campaignApplications.service";
import { PaginationControls } from "../PaginationControls";
import {
  getNum,
  panelClassName,
  statusEmptyClassName,
  statusErrorClassName,
  statusInfoClassName,
} from "../adminPage.shared";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
}

export function CampaignApplicationsPanel({ params, setParam }: Props) {
  const page = getNum(params.get("campAppPage"), 1);
  const limit = getNum(params.get("campAppLimit"), 10);
  const status = params.get("campAppStatus") ?? "";

  const [applications, setApplications] = useState<CampaignApplicationItem[]>([]);
  const [pagination, setPagination] = useState<CampaignApplicationPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getAdminCampaignApplicationsApi({ page, limit, status: status || undefined })
      .then((res) => {
        if (!active) return;
        setApplications(res.applications || []);
        setPagination(res.pagination || null);
      })
      .catch(() => {
        if (active) setError("Failed to fetch campaign applications.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit, status]);

  return (
    <section className={panelClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
          <FiSend className="text-blue-700" /> Campaign Applications & Proposals
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-bold text-slate-600">Status Filter:</label>
          <select
            value={status}
            onChange={(e) => {
              setParam("campAppStatus", e.target.value);
              setParam("campAppPage", "1");
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 outline-none focus:border-blue-600"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? <p className={statusInfoClassName}>Loading campaign applications...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}

      {!loading && !error && applications.length === 0 ? (
        <p className={statusEmptyClassName}>No campaign applications found.</p>
      ) : null}

      {!loading && !error && applications.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs mb-4">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3">Campaign</th>
                <th className="px-3 py-3">Applicant (Advisor)</th>
                <th className="px-3 py-3">Proposal Message</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app._id} className="align-top hover:bg-slate-50/60 transition">
                  <td className="px-3 py-3">
                    <div className="font-bold text-slate-900">{app.campaign?.companyName || "—"}</div>
                    {app.campaign?.storeUsername ? (
                      <a
                        href={`/campaign/${app.campaign.storeUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-700 hover:underline"
                      >
                        @{app.campaign.storeUsername}
                      </a>
                    ) : null}
                    {app.campaign?.category ? (
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">🏷️ {app.campaign.category}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-bold text-slate-900">{app.applicantName}</div>
                    <div className="text-[11px] font-medium text-slate-500">{app.applicantEmail}</div>
                    {app.applicant?.advisorProfile?.username ? (
                      <a
                        href={`/${app.applicant.advisorProfile.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-700 hover:underline"
                      >
                        @{app.applicant.advisorProfile.username}
                      </a>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 max-w-xs whitespace-pre-wrap font-medium text-slate-800 leading-relaxed">
                    {app.message}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        app.status === "approved" || app.status === "responded"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : app.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <PaginationControls
        pagination={pagination ?? undefined}
        onPageChange={(v) => setParam("campAppPage", String(v))}
        onLimitChange={(v) => {
          setParam("campAppLimit", String(v));
          setParam("campAppPage", "1");
        }}
      />
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiAtSign, FiBarChart2, FiCheckCircle, FiEdit3, FiFileText, FiGlobe, FiList, FiMapPin, FiTag, FiTrendingUp, FiUser, FiXCircle } from "react-icons/fi";
import { advisorFormOptionsApi, type AdvisorFormOptionsResponseData } from "../../../services/advisor.service";
import { approveAdvisorApplication, getAdvisorApplications, rejectAdvisorApplication, updateAdvisorApplication, type AdvisorApplication, type UpdateAdvisorApplicationPayload } from "../../../services/admin/admin.service";
import { PaginationControls } from "../PaginationControls";
import { getNum, inputClassName, panelClassName, statusEmptyClassName, statusErrorClassName, statusInfoClassName } from "../adminPage.shared";

interface Props {
  params: URLSearchParams;
  setParam: (k: string, v?: string) => void;
}

type EditFormState = {
  username: string;
  industries: string[];
  country: string;
  state: string;
  about: string;
  marketFocus: string[];
  expertiseIndeces: string[];
  emailForContact: string;
  personalWebsite: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  youtube: string;
};

const normalizeHandle = (value: string) => value.trim().replace(/^@+/, "") || undefined;
const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "—";

const createFormState = (app: AdvisorApplication): EditFormState => ({
  username: app.username ?? "",
  industries: app.industries ?? [],
  country: app.country ?? "",
  state: app.state ?? "",
  about: app.about ?? "",
  marketFocus: app.marketFocus ?? [],
  expertiseIndeces: app.expertiseIndeces ?? [],
  emailForContact: app.emailForContact ?? "",
  personalWebsite: app.personalWebsite ?? "",
  instagram: app.socialLinks?.instagram ?? "",
  tiktok: app.socialLinks?.tiktok ?? "",
  linkedin: app.socialLinks?.linkedin ?? "",
  twitter: app.socialLinks?.twitter ?? "",
  facebook: app.socialLinks?.facebook ?? "",
  youtube: app.socialLinks?.youtube ?? "",
});

export function ApplicationsPanel({ params, setParam }: Props) {
  const page = getNum(params.get("applicationsPage"), 1);
  const limit = getNum(params.get("applicationsLimit"), 10);
  const status = params.get("applicationsStatus") ?? "pending";
  const selectedId = params.get("applicationId") ?? "";

  const [data, setData] = useState<{ applications: AdvisorApplication[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionInfo, setActionInfo] = useState<string | null>(null);
  const [rejectDraft, setRejectDraft] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [options, setOptions] = useState<AdvisorFormOptionsResponseData | null>(null);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [initialSerialized, setInitialSerialized] = useState("");

  const load = () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getAdvisorApplications({ page, limit, status: status || undefined }, ctrl.signal)
      .then(setData)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") setError("Failed to load applications.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  };

  useEffect(load, [page, limit, status]);

  useEffect(() => {
    advisorFormOptionsApi().then(setOptions).catch(() => null);
  }, []);

  const selectedApplication = useMemo(
    () => data?.applications?.find((app) => app._id === selectedId) ?? null,
    [data, selectedId],
  );

  useEffect(() => {
    if (!selectedApplication) {
      setForm(null);
      setInitialSerialized("");
      return;
    }
    const next = createFormState(selectedApplication);
    setForm(next);
    setInitialSerialized(JSON.stringify(next));
    setRejectDraft(selectedApplication.rejectionReason ?? "");
    setActionError(null);
    setActionInfo(null);
  }, [selectedApplication]);

  const stateOptions = useMemo(() => {
    if (!options || !form?.country) return [] as string[];
    return options.locations?.[form.country]?.states ?? [];
  }, [options, form?.country]);

  const marketOptions = useMemo(
    () => [...(options?.markets ?? [])].sort((a, b) => a.localeCompare(b)),
    [options],
  );

  const expertiseOptions = useMemo(() => {
    if (!options) return [] as string[];
    const indices = form?.country
      ? (options.marketIndicesByCountry?.[form.country] ?? [])
      : Object.values(options.marketIndicesByCountry ?? {}).flat();
    return [...new Set(indices)].sort((a, b) => a.localeCompare(b));
  }, [options, form?.country]);

  const industryOptions = useMemo(
    () => [...(options?.industries ?? [])].sort((a, b) => a.localeCompare(b)),
    [options],
  );

  const isPending = selectedApplication?.status === "pending";

  const setField = (key: keyof EditFormState, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const toggleIndustry = (industry: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const isSelected = prev.industries.includes(industry);
      return {
        ...prev,
        industries: isSelected
          ? prev.industries.filter((item) => item !== industry)
          : [...prev.industries, industry],
      };
    });
  };

  const toggleMarketFocus = (market: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const isSelected = prev.marketFocus.includes(market);
      return {
        ...prev,
        marketFocus: isSelected
          ? prev.marketFocus.filter((item) => item !== market)
          : [...prev.marketFocus, market],
      };
    });
  };

  const toggleExpertiseIndex = (index: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const isSelected = prev.expertiseIndeces.includes(index);
      return {
        ...prev,
        expertiseIndeces: isSelected
          ? prev.expertiseIndeces.filter((item) => item !== index)
          : [...prev.expertiseIndeces, index],
      };
    });
  };

  const submitSave = async () => {
    if (!selectedApplication || !form) return;
    setActionError(null);
    setActionInfo(null);

    if (JSON.stringify(form) === initialSerialized) {
      setActionError("No changes to save.");
      return;
    }

    const payload: UpdateAdvisorApplicationPayload = {
      username: form.username.trim() || undefined,
      industries: form.industries,
      country: form.country || undefined,
      state: form.state || undefined,
      socialLinks: {
        instagram: normalizeHandle(form.instagram),
        tiktok: normalizeHandle(form.tiktok),
        linkedin: normalizeHandle(form.linkedin),
        twitter: normalizeHandle(form.twitter),
        facebook: normalizeHandle(form.facebook),
        youtube: normalizeHandle(form.youtube),
      },
      about: form.about.trim() || undefined,
      marketFocus: form.marketFocus,
      expertiseIndeces: form.expertiseIndeces,
      emailForContact: form.emailForContact.trim() || undefined,
      personalWebsite: form.personalWebsite.trim() || undefined,
    };

    setIsMutating(true);
    try {
      const updated = await updateAdvisorApplication(selectedApplication._id, payload);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          applications: prev.applications.map((app) => (app._id === selectedApplication._id ? { ...app, ...updated } : app)),
        };
      });
      const nextForm = createFormState({ ...selectedApplication, ...updated });
      setForm(nextForm);
      setInitialSerialized(JSON.stringify(nextForm));
      setActionInfo("Application updated successfully.");
      load();
    } catch (err: any) {
      setActionError(err?.response?.data?.msg || "Failed to save changes.");
    } finally {
      setIsMutating(false);
    }
  };

  const onApprove = async () => {
    if (!selectedApplication) return;
    setActionError(null);
    setActionInfo(null);
    setIsMutating(true);
    try {
      const updated = await approveAdvisorApplication(selectedApplication._id);
      setData((prev) => prev ? ({ ...prev, applications: prev.applications.map((app) => app._id === selectedApplication._id ? { ...app, ...updated } : app) }) : prev);
      setActionInfo("Application approved.");
      load();
    } catch (err: any) {
      setActionError(err?.response?.data?.msg || "Failed to approve.");
    } finally {
      setIsMutating(false);
    }
  };

  const onReject = async () => {
    if (!selectedApplication) return;
    const reason = rejectDraft.trim();
    if (!reason) {
      setActionError("Rejection reason is required.");
      return;
    }
    setActionError(null);
    setActionInfo(null);
    setIsMutating(true);
    try {
      const updated = await rejectAdvisorApplication(selectedApplication._id, reason);
      setData((prev) => prev ? ({ ...prev, applications: prev.applications.map((app) => app._id === selectedApplication._id ? { ...app, ...updated } : app) }) : prev);
      setActionInfo("Application rejected.");
      load();
    } catch (err: any) {
      setActionError(err?.response?.data?.msg || "Failed to reject.");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <section className={panelClassName}>
      <h3 className="inline-flex items-center gap-2 text-lg font-semibold"><FiList className="text-blue-700" /> Advisor Applications</h3>
      <div className="mt-3 flex gap-2">
        {["pending", "approved", "rejected", ""].map((tab) => (
          <button key={tab || "all"} className={`rounded-full border px-3 py-1 text-sm font-medium transition ${status === tab ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"}`} onClick={() => setParam("applicationsStatus", tab || undefined)}>{tab || "all"}</button>
        ))}
      </div>

      {loading ? <p className={statusInfoClassName}>Loading applications...</p> : null}
      {error ? <p className={statusErrorClassName}>{error}</p> : null}
      {!loading && !error && (data?.applications?.length ?? 0) === 0 ? <p className={statusEmptyClassName}>No applications found.</p> : null}

      {!!data?.applications?.length && (
        <div className="mt-3 overflow-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-blue-700">
                <th className="px-3 py-2"><span className="inline-flex items-center gap-1"><FiList /> Sequence</span></th>
                <th className="px-3 py-2"><span className="inline-flex items-center gap-1"><FiUser /> Username</span></th>
                <th className="px-3 py-2"><span className="inline-flex items-center gap-1"><FiMapPin /> Location</span></th>
                <th className="px-3 py-2"><span className="inline-flex items-center gap-1"><FiTag /> Status</span></th>
                <th className="px-3 py-2"><span className="inline-flex items-center gap-1"><FiFileText /> Date</span></th>
                <th className="px-3 py-2"><span className="inline-flex items-center gap-1"><FiEdit3 /> Action</span></th>
              </tr>
            </thead>
            <tbody>
              {data.applications.map((app, index) => (
                <>
                  <tr key={app._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{app.username || "-"}</td>
                    <td className="px-3 py-2">{[app.country, app.state].filter(Boolean).join(", ") || "-"}</td>
                    <td className="px-3 py-2">{app.status}</td>
                    <td className="px-3 py-2">{formatDate(app.createdAt)}</td>
                    <td className="px-3 py-2"><button className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700" onClick={() => setParam("applicationId", selectedId === app._id ? undefined : app._id)}><FiEdit3 /> {selectedId === app._id ? "Close" : "Review"}</button></td>
                  </tr>

                  {selectedApplication && form && selectedId === app._id ? (
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <td colSpan={6} className="p-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <h4 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900"><FiEdit3 className="text-blue-700" /> Application Review</h4>
                            <span className="rounded-full bg-white px-2 py-1 text-xs">{selectedApplication.status}</span>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2">
                            <label className="relative"><FiAtSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><input className={`${inputClassName} w-full pl-9`} placeholder="Username" value={form.username} onChange={(e) => setField("username", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FiAtSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><input className={`${inputClassName} w-full pl-9`} placeholder="Email for contact" value={form.emailForContact} onChange={(e) => setField("emailForContact", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><select className={`${inputClassName} w-full pl-9`} value={form.country} onChange={(e) => { setField("country", e.target.value); setField("state", ""); }} disabled={!isPending || isMutating}><option value="">Country</option>{Object.keys(options?.locations ?? {}).map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
                            <label className="relative"><FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><select className={`${inputClassName} w-full pl-9`} value={form.state} onChange={(e) => setField("state", e.target.value)} disabled={!isPending || isMutating}><option value="">State</option>{stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
                            <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3"><p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"><FiTrendingUp /> Market Focus</p><div className="flex flex-wrap gap-2">{marketOptions.map((market) => { const isSelected = form.marketFocus.includes(market); return <button key={market} type="button" onClick={() => toggleMarketFocus(market)} disabled={!isPending || isMutating} className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${isSelected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-200 hover:text-blue-700"}`}>{market}</button>; })}</div></div>
                            <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3"><p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"><FiBarChart2 /> Expertise Indices</p><div className="flex flex-wrap gap-2">{expertiseOptions.map((indexItem) => { const isSelected = form.expertiseIndeces.includes(indexItem); return <button key={indexItem} type="button" onClick={() => toggleExpertiseIndex(indexItem)} disabled={!isPending || isMutating} className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${isSelected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-200 hover:text-blue-700"}`}>{indexItem}</button>; })}</div></div>
                            <label className="relative"><FiGlobe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><input className={`${inputClassName} w-full pl-9`} placeholder="Website" value={form.personalWebsite} onChange={(e) => setField("personalWebsite", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FaInstagram className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700">@</span><input className={`${inputClassName} w-full pl-14`} placeholder="instagram" value={form.instagram} onChange={(e) => setField("instagram", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FaTiktok className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700">@</span><input className={`${inputClassName} w-full pl-14`} placeholder="tiktok" value={form.tiktok} onChange={(e) => setField("tiktok", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FaLinkedin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700">@</span><input className={`${inputClassName} w-full pl-14`} placeholder="linkedin" value={form.linkedin} onChange={(e) => setField("linkedin", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FaXTwitter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700">@</span><input className={`${inputClassName} w-full pl-14`} placeholder="twitter" value={form.twitter} onChange={(e) => setField("twitter", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FaFacebook className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700">@</span><input className={`${inputClassName} w-full pl-14`} placeholder="facebook" value={form.facebook} onChange={(e) => setField("facebook", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative"><FaYoutube className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" /><span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700">@</span><input className={`${inputClassName} w-full pl-14`} placeholder="youtube" value={form.youtube} onChange={(e) => setField("youtube", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <label className="relative sm:col-span-2"><FiFileText className="pointer-events-none absolute left-3 top-3.5 text-blue-700" /><textarea className={`${inputClassName} w-full pl-9`} placeholder="About" value={form.about} onChange={(e) => setField("about", e.target.value)} disabled={!isPending || isMutating} /></label>
                            <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3"><p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"><FiTag /> Industries</p><div className="flex flex-wrap gap-2">{industryOptions.map((industry) => { const isSelected = form.industries.includes(industry); return <button key={industry} type="button" onClick={() => toggleIndustry(industry)} disabled={!isPending || isMutating} className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${isSelected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-200 hover:text-blue-700"}`}>{industry}</button>; })}</div></div>
                          </div>

                          <div className="mt-3 space-y-2">
                            <label className="relative block"><FiXCircle className="pointer-events-none absolute left-3 top-3.5 text-blue-700" /><textarea className={`w-full ${inputClassName} pl-9`} placeholder="Rejection reason" value={rejectDraft} onChange={(e) => setRejectDraft(e.target.value)} disabled={!isPending || isMutating} /></label>
                            {actionError ? <p className={statusErrorClassName}>{actionError}</p> : null}
                            {actionInfo ? <p className={statusInfoClassName}>{actionInfo}</p> : null}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button disabled={!isPending || isMutating} className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50" onClick={submitSave}>Save Changes</button>
                            <button disabled={!isPending || isMutating} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50" onClick={onApprove}><FiCheckCircle /> Approve</button>
                            <button disabled={!isPending || isMutating} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50" onClick={onReject}><FiXCircle /> Reject</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationControls pagination={data?.pagination} onPageChange={(v) => setParam("applicationsPage", String(v))} onLimitChange={(v) => { setParam("applicationsLimit", String(v)); setParam("applicationsPage", "1"); }} />
    </section>
  );
}

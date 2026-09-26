import { useEffect, useState } from "react";
import { FiCreditCard, FiPlus, FiTrash2, FiExternalLink, FiCheck, FiRefreshCw, FiInfo } from "react-icons/fi";
import {
  getPricingPlansAdminApi,
  updatePricingPlanAdminApi,
  createPricingPlanAdminApi,
  deletePricingPlanAdminApi,
  type PricingPlan,
} from "../../../services/pricing.service";
import {
  inputClassName,
  panelClassName,
  statusEmptyClassName,
  statusErrorClassName,
} from "../adminPage.shared";

export function PricingPanel() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [newFeatureText, setNewFeatureText] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPricingPlansAdminApi();
      setPlans(data);
      if (data.length > 0) {
        setEditingPlan((prev) => {
          if (!prev) return data[0];
          const updated = data.find((p) => p._id === prev._id);
          return updated || data[0];
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load pricing plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const isFreePlan = Boolean(
    editingPlan && (editingPlan.planId === "free" || editingPlan.name.toLowerCase().trim() === "free")
  );

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPlan) return;

    setSavingId(editingPlan._id);
    setError(null);
    setSuccessMsg(null);

    try {
      const updated = await updatePricingPlanAdminApi(editingPlan._id, {
        name: editingPlan.name,
        price: isFreePlan ? "₹0" : editingPlan.price,
        period: editingPlan.period,
        tag: editingPlan.tag,
        audience: editingPlan.audience,
        pitch: editingPlan.pitch,
        features: editingPlan.features,
        paymentLink: isFreePlan ? "" : editingPlan.paymentLink,
        buttonText: editingPlan.buttonText,
        isActive: editingPlan.isActive,
        order: editingPlan.order,
      });

      setSuccessMsg(`Plan "${updated.name}" updated successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update pricing plan.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateNew = async () => {
    const name = window.prompt("Enter plan name (e.g. Enterprise, Starter):");
    if (!name?.trim()) return;

    try {
      setLoading(true);
      await createPricingPlanAdminApi({
        name: name.trim(),
        price: "₹999",
        period: "month",
        tag: "violet",
        buttonText: "Choose Plan",
        features: ["Feature 1", "Feature 2"],
      });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create new plan.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" plan? This cannot be undone.`)) return;

    try {
      setLoading(true);
      await deletePricingPlanAdminApi(id);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete plan.");
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (!editingPlan || !newFeatureText.trim()) return;
    setEditingPlan({
      ...editingPlan,
      features: [...(editingPlan.features || []), newFeatureText.trim()],
    });
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return;
    const updated = [...editingPlan.features];
    updated.splice(index, 1);
    setEditingPlan({ ...editingPlan, features: updated });
  };

  const handleUpdateFeature = (index: number, val: string) => {
    if (!editingPlan) return;
    const updated = [...editingPlan.features];
    updated[index] = val;
    setEditingPlan({ ...editingPlan, features: updated });
  };

  return (
    <div className="space-y-6">
      <section className={panelClassName}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-800">
              <FiCreditCard className="text-blue-700 h-5 w-5" /> Pricing Plans & Payment Links
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure prices, recurring intervals, and custom payment links displayed on <code>/pricing</code>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              title="Refresh plans"
            >
              <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm transition"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add Plan
            </button>
          </div>
        </div>

        {error ? <p className={statusErrorClassName}>{error}</p> : null}
        {successMsg ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 flex items-center gap-2">
            <FiCheck className="h-4 w-4 text-emerald-600 shrink-0" /> {successMsg}
          </p>
        ) : null}

        {/* Plan Selector Pills */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {plans.map((p) => {
            const isSelected = editingPlan?._id === p._id;
            const isPlanFree = p.planId === "free" || p.name.toLowerCase().trim() === "free";
            return (
              <button
                key={p._id}
                onClick={() => setEditingPlan(p)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-left transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] font-semibold text-blue-700">
                    {p.price} <span className="text-slate-500 font-normal">/ {p.period}</span>
                  </div>
                </div>
                {isPlanFree ? (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">Free</span>
                ) : p.paymentLink ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Payment link configured" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" title="No payment link set" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Plan Details & Edit Form */}
      {editingPlan ? (
        <section className={panelClassName}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Editing Plan</span>
              <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {editingPlan.name}
                <span className="text-xs font-mono font-normal text-slate-400">({editingPlan.planId})</span>
                {isFreePlan && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Free Tier
                  </span>
                )}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {!isFreePlan && editingPlan.paymentLink ? (
                <a
                  href={editingPlan.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <FiExternalLink className="h-3.5 w-3.5" /> Test Link
                </a>
              ) : null}
              {plans.length > 1 && !isFreePlan && (
                <button
                  type="button"
                  onClick={() => handleDelete(editingPlan._id, editingPlan.name)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Top Grid: Name, Price, Period, Button Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  className={`w-full ${inputClassName}`}
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="e.g. Growth"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Price / Amount *{" "}
                  {isFreePlan ? (
                    <span className="text-slate-400 font-normal">(Fixed to ₹0)</span>
                  ) : (
                    <span className="text-slate-400 font-normal">(Display)</span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  disabled={isFreePlan}
                  className={`w-full ${inputClassName} font-semibold ${
                    isFreePlan ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-blue-700"
                  }`}
                  value={isFreePlan ? "₹0" : editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                  placeholder="e.g. ₹299 or From ₹50,000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Billing Period *
                </label>
                <input
                  type="text"
                  required
                  className={`w-full ${inputClassName}`}
                  value={editingPlan.period}
                  onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                  placeholder="e.g. month, 90-day sprint"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button Text *
                </label>
                <input
                  type="text"
                  required
                  className={`w-full ${inputClassName}`}
                  value={editingPlan.buttonText || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, buttonText: e.target.value })}
                  placeholder="e.g. Subscribe to Growth"
                />
              </div>
            </div>

            {/* Payment Link - For paid plans only */}
            {isFreePlan ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <FiInfo className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Free Plan — No Payment Link Needed</span>
                  <p className="mt-0.5 text-slate-500">
                    The Free plan does not accept payment links. On the pricing page, logged-in users see "Active", while visitors are prompted to sign up via the auth page.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-900">
                    Payment Link URL <span className="font-normal text-blue-700">(Razorpay, Stripe, WhatsApp, etc.)</span>
                  </label>
                  {editingPlan.paymentLink ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Active Link Set
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      No Link (Button disabled on page)
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  className={`w-full ${inputClassName} bg-white text-blue-900 placeholder:text-blue-300 font-mono text-xs`}
                  value={editingPlan.paymentLink || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, paymentLink: e.target.value })}
                  placeholder="https://rzp.io/l/your-plan-link or https://buy.stripe.com/..."
                />
                <p className="text-[11px] text-slate-500">
                  When a user clicks the button for this plan on <code>/pricing</code>, they will be redirected directly to this payment URL in a new tab.
                </p>
              </div>
            )}

            {/* Tag, Audience, Pitch */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Theme Tag</label>
                <select
                  className={`w-full ${inputClassName}`}
                  value={editingPlan.tag || "gray"}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tag: e.target.value })}
                >
                  <option value="gray">Gray (Neutral / Default)</option>
                  <option value="violet">Violet (Growth / Recommended)</option>
                  <option value="coral">Coral (Pro / Studio / Premium)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience Label</label>
                <input
                  type="text"
                  className={`w-full ${inputClassName}`}
                  value={editingPlan.audience || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, audience: e.target.value })}
                  placeholder="e.g. FOR BUSINESSES · RUN CAMPAIGNS ON REPEAT"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pitch / Summary Description</label>
              <textarea
                rows={2}
                className={`w-full ${inputClassName}`}
                value={editingPlan.pitch || ""}
                onChange={(e) => setEditingPlan({ ...editingPlan, pitch: e.target.value })}
                placeholder="Short value proposition summary for this plan..."
              />
            </div>

            {/* Features List */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700">Features Checklist</label>
              <div className="space-y-2">
                {editingPlan.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      className={`w-full ${inputClassName}`}
                      value={feat}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                      title="Remove feature"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className={`w-full ${inputClassName}`}
                  placeholder="Add a new feature bullet..."
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingPlan.isActive !== false}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700">Display this plan publicly</span>
              </label>

              <button
                type="submit"
                disabled={savingId === editingPlan._id}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition disabled:opacity-50"
              >
                {savingId === editingPlan._id ? (
                  <>
                    <FiRefreshCw className="h-4 w-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <FiCheck className="h-4 w-4" /> Save Plan Details
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      ) : (
        !loading && <p className={statusEmptyClassName}>No plan selected.</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiRefreshCw,
  FiLayers,
  FiDollarSign,
  FiEye,
  FiTag,
} from "react-icons/fi";
import {
  getPricingPlansAdminApi,
  updatePricingPlanAdminApi,
  createPricingPlanAdminApi,
  deletePricingPlanAdminApi,
  type PricingPlan,
  type PricingCategory,
  type PricingItem,
} from "../../../services/pricing.service";
import {
  inputClassName,
  panelClassName,
  statusEmptyClassName,
  statusErrorClassName,
} from "../adminPage.shared";

function calculateDiscount(price?: string, yearlyPrice?: string): number {
  if (!price || !yearlyPrice) return 0;
  const parseNum = (val: string) => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  };
  const m = parseNum(price);
  const y = parseNum(yearlyPrice);
  if (m > 0 && y > 0) {
    if (y < m) {
      return Math.round(((m - y) / m) * 100);
    }
    const annualM = m * 12;
    if (y < annualM) {
      return Math.round(((annualM - y) / annualM) * 100);
    }
  }
  return 0;
}

export function PricingPanel() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPlan) return;

    setSavingId(editingPlan._id);
    setError(null);
    setSuccessMsg(null);

    try {
      const updated = await updatePricingPlanAdminApi(editingPlan._id, {
        name: editingPlan.name,
        kicker: editingPlan.kicker,
        heading: editingPlan.heading,
        subheading: editingPlan.subheading,
        price: editingPlan.price,
        period: editingPlan.period,
        yearlyPrice: editingPlan.yearlyPrice,
        yearlyPeriod: editingPlan.yearlyPeriod,
        yearlyPaymentLink: editingPlan.yearlyPaymentLink,
        yearlyDiscountPercent: editingPlan.yearlyDiscountPercent,
        yearlyOriginalTotal: editingPlan.yearlyOriginalTotal,
        originalTotal: editingPlan.originalTotal,
        originalTotalLabel: editingPlan.originalTotalLabel,
        joinLabel: editingPlan.joinLabel,
        trialNote: editingPlan.trialNote,
        buttonText: editingPlan.buttonText,
        buttonLink: editingPlan.buttonLink,
        yearlyButtonText: editingPlan.yearlyButtonText,
        yearlyButtonLink: editingPlan.yearlyButtonLink,
        paymentLink: editingPlan.paymentLink,
        categories: editingPlan.categories,
        isActive: editingPlan.isActive,
        order: editingPlan.order,
      });

      setSuccessMsg(`Section / Plan "${updated.name}" updated successfully!`);
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
        kicker: "For Businesses",
        heading: "Custom Solutions for Teams",
        subheading: "Complete suite tailored to your scale.",
        price: "$49",
        period: "mo",
        yearlyPrice: "$39",
        yearlyPeriod: "mo",
        yearlyDiscountPercent: 20,
        originalTotal: "$299/mo",
        originalTotalLabel: "What you'd spend otherwise",
        joinLabel: `Join ${name.trim()} (Monthly)`,
        trialNote: "✨ 14-day free trial, cancel anytime",
        buttonText: "Start Monthly Trial →",
        buttonLink: "/auth",
        yearlyButtonText: "Get Yearly Plan (Save 20%) →",
        yearlyButtonLink: "/auth?billing=yearly",
        categories: [
          {
            title: "Core Features",
            items: [
              { emoji: "⚡", title: "Feature 1", description: "Description for feature 1", price: "$20" },
              { emoji: "🚀", title: "Feature 2", description: "Description for feature 2", price: "$30" },
            ],
          },
        ],
      });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create new plan.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    try {
      setLoading(true);
      await deletePricingPlanAdminApi(id);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete plan.");
      setLoading(false);
    }
  };

  // Category management
  const handleAddCategory = () => {
    if (!editingPlan) return;
    const newCategory: PricingCategory = {
      title: "New Category",
      items: [
        { emoji: "✨", title: "New Item", description: "Item description", price: "$10" },
      ],
    };
    setEditingPlan({
      ...editingPlan,
      categories: [...(editingPlan.categories || []), newCategory],
    });
  };

  const handleRemoveCategory = (catIdx: number) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.categories || [])];
    updated.splice(catIdx, 1);
    setEditingPlan({ ...editingPlan, categories: updated });
  };

  const handleUpdateCategoryTitle = (catIdx: number, title: string) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.categories || [])];
    updated[catIdx] = { ...updated[catIdx], title };
    setEditingPlan({ ...editingPlan, categories: updated });
  };

  // Item management inside categories
  const handleAddItem = (catIdx: number) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.categories || [])];
    const category = updated[catIdx];
    if (!category) return;
    const newItem: PricingItem = {
      emoji: "✨",
      title: "New Item",
      description: "Description of item",
      price: "$10",
    };
    updated[catIdx] = {
      ...category,
      items: [...(category.items || []), newItem],
    };
    setEditingPlan({ ...editingPlan, categories: updated });
  };

  const handleRemoveItem = (catIdx: number, itemIdx: number) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.categories || [])];
    const category = updated[catIdx];
    if (!category) return;
    const items = [...(category.items || [])];
    items.splice(itemIdx, 1);
    updated[catIdx] = { ...category, items };
    setEditingPlan({ ...editingPlan, categories: updated });
  };

  const handleUpdateItem = (
    catIdx: number,
    itemIdx: number,
    field: keyof PricingItem,
    val: string
  ) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.categories || [])];
    const category = updated[catIdx];
    if (!category) return;
    const items = [...(category.items || [])];
    items[itemIdx] = { ...items[itemIdx], [field]: val };
    updated[catIdx] = { ...category, items };
    setEditingPlan({ ...editingPlan, categories: updated });
  };

  const isDefaultSection =
    editingPlan?.planId === "business" ||
    editingPlan?.planId === "creators" ||
    editingPlan?.planId === "creator";

  const autoDiscount = editingPlan ? calculateDiscount(editingPlan.price, editingPlan.yearlyPrice) : 0;

  return (
    <div className="space-y-6">
      <section className={panelClassName}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="inline-flex items-center gap-2 text-lg font-bold text-slate-800">
              <FiCreditCard className="text-blue-700 h-5 w-5" /> Homepage Pricing Sections
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure monthly & yearly prices, discount percentages, dedicated monthly & yearly CTA buttons, itemized costs, and payment links.
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
              <FiPlus className="h-3.5 w-3.5" /> Add Section / Plan
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
            const discount = (typeof p.yearlyDiscountPercent === "number" && p.yearlyDiscountPercent > 0)
              ? p.yearlyDiscountPercent
              : calculateDiscount(p.price, p.yearlyPrice);

            return (
              <button
                key={p._id}
                onClick={() => setEditingPlan(p)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {p.name}
                    {discount > 0 ? (
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full">
                        {discount}% OFF
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
                    {p.price} <span className="text-slate-500 font-normal">/ {p.period || "mo"}</span>
                    {p.yearlyPrice ? (
                      <span className="text-emerald-700 font-normal"> · {p.yearlyPrice}/{p.yearlyPeriod || "mo"} (yr)</span>
                    ) : null}
                  </div>
                </div>
                {p.paymentLink || p.yearlyPaymentLink ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Custom payment link active" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" title="Default auth flow" />
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Editing Section</span>
              <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {editingPlan.name}
                <span className="text-xs font-mono font-normal text-slate-400">({editingPlan.planId})</span>
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/#${editingPlan.planId === "creators" ? "creators" : "business"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
              >
                <FiEye className="h-3.5 w-3.5" /> View on Homepage
              </a>
              {!isDefaultSection && (
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

          <form onSubmit={handleSave} className="space-y-6">
            {/* Section Header Controls */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FiLayers className="h-4 w-4 text-blue-700" /> Section Headings & Copy
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plan Display Name *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g. Folksmint Business"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kicker Tagline *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.kicker || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, kicker: e.target.value })}
                    placeholder="e.g. For local business"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Heading *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.heading || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, heading: e.target.value })}
                    placeholder="e.g. Everything AI marketing does"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Subheading / Lead Text</label>
                <textarea
                  rows={2}
                  className={`w-full ${inputClassName}`}
                  value={editingPlan.subheading || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, subheading: e.target.value })}
                  placeholder="e.g. One dashboard replaces your SEO tool, your social media manager..."
                />
              </div>
            </div>

            {/* Monthly Pricing, Totals & Monthly Button */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FiDollarSign className="h-4 w-4 text-blue-700" /> Monthly Plan & Button
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Plan Price *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName} font-bold text-blue-700`}
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                    placeholder="e.g. $19"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Billing Period *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.period || "mo"}
                    onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                    placeholder="e.g. mo or month"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Join Offer Text *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.joinLabel || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, joinLabel: e.target.value })}
                    placeholder="e.g. Join Folksmint Business"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">"Spend Otherwise" Price</label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.originalTotal || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, originalTotal: e.target.value })}
                    placeholder="e.g. $134/mo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trial Note Label</label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.trialNote || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, trialNote: e.target.value })}
                    placeholder="e.g. ✨ 14-day free trial, cancel anytime"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly CTA Button Text *</label>
                  <input
                    type="text"
                    required
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.buttonText || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, buttonText: e.target.value })}
                    placeholder="e.g. Start Monthly Trial →"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Link Route</label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName}`}
                    value={editingPlan.buttonLink || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, buttonLink: e.target.value })}
                    placeholder="e.g. /auth?role=user or /auth?role=advisor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Custom Payment Link URL <span className="font-normal text-slate-400">(Overrides button link if provided)</span>
                </label>
                <input
                  type="url"
                  className={`w-full ${inputClassName} font-mono text-xs`}
                  value={editingPlan.paymentLink || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, paymentLink: e.target.value })}
                  placeholder="https://rzp.io/l/your-monthly-link or https://buy.stripe.com/..."
                />
              </div>
            </div>

            {/* Yearly Pricing Configuration & Dedicated Button */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <FiTag className="h-4 w-4 text-emerald-700" /> Yearly Plan & Dedicated Button
                </div>
                {editingPlan.yearlyPrice ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Yearly Button Active
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Optional (Leave blank to hide yearly button on card)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Yearly Plan Price
                  </label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName} font-bold text-emerald-800 bg-white`}
                    value={editingPlan.yearlyPrice || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPrice: e.target.value })}
                    placeholder="e.g. $15 (or $180)"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">Yearly rate displayed on card</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Yearly Period Unit
                  </label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName} bg-white`}
                    value={editingPlan.yearlyPeriod || "mo"}
                    onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPeriod: e.target.value })}
                    placeholder="e.g. mo or yr"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">Unit after slash (e.g. /mo or /yr)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Discount % Badge
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className={`w-full ${inputClassName} bg-white font-semibold`}
                    value={editingPlan.yearlyDiscountPercent ?? ""}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        yearlyDiscountPercent: e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">
                    {autoDiscount > 0 ? `Auto-calculated: ${autoDiscount}% OFF` : "Leave 0 to auto-calculate"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Yearly "Spend Otherwise" Price
                  </label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName} bg-white`}
                    value={editingPlan.yearlyOriginalTotal || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, yearlyOriginalTotal: e.target.value })}
                    placeholder="e.g. $114/mo"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">Comparison price for yearly</p>
                </div>
              </div>

              {/* Yearly Dedicated Button Text & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Yearly Dedicated Button Text
                  </label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName} bg-white font-medium`}
                    value={editingPlan.yearlyButtonText || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, yearlyButtonText: e.target.value })}
                    placeholder="e.g. Get Yearly Plan (Save 21%) →"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Text for the dedicated yearly CTA button
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Yearly Default Route
                  </label>
                  <input
                    type="text"
                    className={`w-full ${inputClassName} bg-white`}
                    value={editingPlan.yearlyButtonLink || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, yearlyButtonLink: e.target.value })}
                    placeholder="e.g. /auth?role=user&billing=yearly"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">Internal redirect if no custom link is set</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Yearly Custom Payment Link URL <span className="font-normal text-emerald-700">(Razorpay, Stripe yearly checkout link)</span>
                </label>
                <input
                  type="url"
                  className={`w-full ${inputClassName} bg-white text-emerald-900 placeholder:text-emerald-300 font-mono text-xs`}
                  value={editingPlan.yearlyPaymentLink || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPaymentLink: e.target.value })}
                  placeholder="https://rzp.io/l/your-yearly-plan or https://buy.stripe.com/..."
                />
                <p className="text-[11px] text-emerald-600 mt-1">
                  When a user clicks the Yearly CTA button, they are redirected directly to this URL.
                </p>
              </div>
            </div>

            {/* Feature Categories & Itemized Row Prices */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Feature Categories & Comparison Items</h5>
                  <p className="text-xs text-slate-500">
                    Add or update every item, title, description, emoji icon, and comparative price.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  <FiPlus className="h-3.5 w-3.5" /> Add Category
                </button>
              </div>

              <div className="space-y-5">
                {(editingPlan.categories || []).map((cat, catIdx) => (
                  <div
                    key={catIdx}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Category Title {catIdx + 1}
                        </label>
                        <input
                          type="text"
                          className={`w-full font-bold text-slate-800 ${inputClassName}`}
                          value={cat.title}
                          onChange={(e) => handleUpdateCategoryTitle(catIdx, e.target.value)}
                          placeholder="e.g. 📈 Visibility & audits"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(catIdx)}
                        className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 mt-5"
                        title="Delete Category"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Category Items */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500">
                        Itemized Features & Prices
                      </label>

                      {(cat.items || []).map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs"
                        >
                          <input
                            type="text"
                            title="Emoji"
                            className="w-12 text-center rounded-lg border border-slate-300 bg-slate-50 px-1 py-1.5 text-base"
                            value={item.emoji || "✨"}
                            onChange={(e) =>
                              handleUpdateItem(catIdx, itemIdx, "emoji", e.target.value)
                            }
                            placeholder="🔍"
                          />
                          <input
                            type="text"
                            className={`flex-1 ${inputClassName}`}
                            value={item.title}
                            onChange={(e) =>
                              handleUpdateItem(catIdx, itemIdx, "title", e.target.value)
                            }
                            placeholder="Feature Title (e.g. SEO Keyword Analysis)"
                          />
                          <input
                            type="text"
                            className={`flex-1 ${inputClassName}`}
                            value={item.description || ""}
                            onChange={(e) =>
                              handleUpdateItem(catIdx, itemIdx, "description", e.target.value)
                            }
                            placeholder="Description / Subtitle"
                          />
                          <input
                            type="text"
                            className="w-24 font-bold text-blue-700 rounded-xl border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm"
                            value={item.price || ""}
                            onChange={(e) =>
                              handleUpdateItem(catIdx, itemIdx, "price", e.target.value)
                            }
                            placeholder="$20"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(catIdx, itemIdx)}
                            className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 shrink-0 self-center"
                            title="Remove Item"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddItem(catIdx)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 py-1.5 px-2 rounded-lg hover:bg-blue-50/80 transition"
                      >
                        <FiPlus className="h-3.5 w-3.5" /> Add Item to "{cat.title || "Category"}"
                      </button>
                    </div>
                  </div>
                ))}
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
                <span className="text-xs font-semibold text-slate-700">Display this section publicly on home</span>
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
                    <FiCheck className="h-4 w-4" /> Save Section & Pricing
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

import { FiActivity, FiBookOpen, FiBriefcase, FiGrid, FiLayers, FiList, FiTrendingUp, FiUser, FiUsers } from "react-icons/fi";

export const views = ["users", "advisors", "applications", "industries", "categories", "markets", "expertise-indices", "blogs", "requirements"] as const;
export type AdminView = (typeof views)[number];

export const viewIcons: Record<AdminView, React.ComponentType<{ className?: string }>> = {
  users: FiUsers,
  advisors: FiUser,
  applications: FiList,
  industries: FiGrid,
  categories: FiLayers,
  markets: FiTrendingUp,
  "expertise-indices": FiActivity,
  blogs: FiBookOpen,
  requirements: FiBriefcase,
};

export const getNum = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getInitials = (name?: string | null) => {
  const source = (name || "").trim();
  if (!source) return "NA";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

export const formatCompactCount = (value?: number) =>
  typeof value === "number" && value > 0
    ? new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    : null;

export const getSocialProfileUrl = (platform: string, handle: string) => {
  const clean = (handle || "").trim().replace(/^@/, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "youtube":
      return `https://youtube.com/${clean.startsWith("@") ? clean : `@${clean}`}`;
    case "telegram":
      return `https://t.me/${clean}`;
    default:
      return handle;
  }
};

export const panelClassName =
  "rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur";
export const inputClassName =
  "rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2";
export const statusInfoClassName = "mt-4 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700";
export const statusErrorClassName = "mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700";
export const statusEmptyClassName = "mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500";

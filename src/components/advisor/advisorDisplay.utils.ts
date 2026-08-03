export const getDisplayPpp = (ppp?: number | null): string =>
  typeof ppp === "number" ? String(ppp) : "N/A";

export const getDisplayCategory = (category?: string | null): string =>
  category?.trim() ? category : "N/A";

export const getDisplayFollowers = (followers?: number | null): string => {
  if (typeof followers === "number" && Number.isFinite(followers) && followers >= 0) {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(followers);
  }
  return "N/A";
};

export const getDisplayEngagementRate = (rate?: number | null): string => {
  if (typeof rate === "number" && Number.isFinite(rate) && rate >= 0) {
    const formatted = new Intl.NumberFormat("en", {
      maximumFractionDigits: 2,
    }).format(rate);
    return `${formatted}%`;
  }
  return "N/A";
};

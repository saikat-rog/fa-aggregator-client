export const getDisplayPpp = (ppp?: number | null): string =>
  typeof ppp === "number" ? String(ppp) : "N/A";

export const getDisplayCategory = (category?: string | null): string =>
  category?.trim() ? category : "N/A";

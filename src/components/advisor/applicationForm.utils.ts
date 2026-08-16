export const parsePpp = (value: string): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

export const normalizeCategory = (value: string): string => value.trim();

export const getAdvisorApplicationFieldErrors = (params: {
  pppValue: string;
  categoryValue: string;
}): { pppError: string; categoryError: string } => {
  const category = normalizeCategory(params.categoryValue);

  let pppError = "";
  if (params.pppValue.trim()) {
    const parsedPpp = parsePpp(params.pppValue);
    if (parsedPpp === null) {
      pppError = "PPP must be a non-negative number.";
    }
  }

  if (!category) {
    return { pppError, categoryError: "Category is required." };
  }
  return { pppError, categoryError: "" };
};

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
  const parsedPpp = parsePpp(params.pppValue);
  const category = normalizeCategory(params.categoryValue);

  if (!params.pppValue.trim()) {
    return { pppError: "PPP is required.", categoryError: "" };
  }
  if (parsedPpp === null) {
    return { pppError: "PPP must be a non-negative number.", categoryError: "" };
  }
  if (!category) {
    return { pppError: "", categoryError: "Category is required." };
  }
  return { pppError: "", categoryError: "" };
};

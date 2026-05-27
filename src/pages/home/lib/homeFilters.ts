import type { AdvisorListQueryParams } from "../../../services/advisor.service";
import { followerFields, initialFilters } from "../Home.constants";
import type { AdvisorFilters } from "../Home.types";

export function buildAdvisorQuery(filters: AdvisorFilters) {
  const params = new URLSearchParams();

  if (filters.page && filters.page !== 1) params.set("page", String(filters.page));
  if (filters.limit && filters.limit !== 20) params.set("limit", String(filters.limit));
  if (filters.country) params.set("country", filters.country);
  if (filters.state) params.set("state", filters.state);
  if (filters.category.trim()) params.set("category", filters.category.trim());
  if (filters.industries.length > 0) {
    filters.industries.forEach((industry) => params.append("industries", industry));
  }

  for (const field of followerFields) {
    for (const op of ["Gt", "Gte"] as const) {
      const key = `${field}${op}` as keyof AdvisorFilters;
      const val = filters[key];
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      }
    }
  }

  return params.toString();
}

export function filtersFromSearchParams(searchParams: URLSearchParams): AdvisorFilters {
  const parseNumberOr = (value: string | null, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const filters: AdvisorFilters = {
    ...initialFilters,
    page: parseNumberOr(searchParams.get("page"), 1),
    limit: 20,
    country: searchParams.get("country") || "",
    state: searchParams.get("state") || "",
    category: searchParams.get("category") || "",
    industries: [],
  };

  const industryParams = searchParams.getAll("industries");
  const parsedIndustries =
    industryParams.length > 0
      ? industryParams.flatMap((entry) =>
          entry
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        )
      : [];
  filters.industries = Array.from(new Set(parsedIndustries));

  for (const field of followerFields) {
    for (const op of ["Gt", "Gte"] as const) {
      const key = `${field}${op}` as keyof AdvisorFilters;
      (filters as Record<string, string | number | string[]>)[key] =
        searchParams.get(String(key)) || "";
    }
  }

  return filters;
}

export function queryParamsFromFilters(filters: AdvisorFilters): AdvisorListQueryParams {
  const parseOptionalNumber = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const params: AdvisorListQueryParams = {
    page: filters.page,
    limit: filters.limit,
    country: filters.country || undefined,
    state: filters.state || undefined,
    category: filters.category.trim() || undefined,
    industries: filters.industries.length ? filters.industries : undefined,
  };

  for (const field of followerFields) {
    for (const op of ["Gt", "Gte"] as const) {
      const key = `${field}${op}` as keyof AdvisorFilters;
      const parsed = parseOptionalNumber(String(filters[key]));
      if (parsed !== undefined) {
        (params as Record<string, number | string | undefined>)[key] = parsed;
      }
    }
  }

  return params;
}

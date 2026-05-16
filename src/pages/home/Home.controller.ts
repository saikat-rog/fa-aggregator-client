import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  advisorFormOptionsApi,
  getAllAdvisorsApi,
  type AdvisorFormOptionsResponseData,
} from "../../services/advisor.service";
import { followerFields, initialFilters } from "./Home.constants";
import type {
  AdvisorApiItem,
  AdvisorCardData,
  AdvisorFilters,
  AdvisorPagination,
  HomePageProps,
} from "./Home.types";
import {
  buildAdvisorQuery,
  filtersFromSearchParams,
  queryParamsFromFilters,
} from "./lib/homeFilters";
import { mapAdvisorApiItem } from "./lib/mapAdvisorApiItem";

export function useHomeController({
  initialFiltersOverride,
  disableUrlSync = false,
}: HomePageProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<AdvisorFilters>(() => {
    const urlFilters = filtersFromSearchParams(searchParams);
    return {
      ...urlFilters,
      ...(initialFiltersOverride ?? {}),
      page: initialFiltersOverride?.page ?? urlFilters.page,
      limit: initialFiltersOverride?.limit ?? urlFilters.limit,
    };
  });
  const [advisors, setAdvisors] = useState<AdvisorCardData[]>([]);
  const [formOptions, setFormOptions] =
    useState<AdvisorFormOptionsResponseData | null>(null);
  const [pagination, setPagination] = useState<AdvisorPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllFollowerFilters, setShowAllFollowerFilters] = useState(false);
  const latestRequestIdRef = useRef(0);

  const countries = useMemo(() => {
    if (!formOptions) return [];
    const fromArray = formOptions.countries ?? [];
    if (fromArray.length > 0) {
      return fromArray.slice().sort((a, b) => a.localeCompare(b));
    }
    return Object.keys(formOptions.locations ?? {}).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [formOptions]);

  const states = useMemo(
    () =>
      filters.country
        ? (formOptions?.locations[filters.country]?.states ?? [])
            .slice()
            .sort((a, b) => a.localeCompare(b))
        : [],
    [formOptions, filters.country],
  );

  const industryOptions = useMemo(
    () =>
      (formOptions?.industries ?? []).slice().sort((a, b) => a.localeCompare(b)),
    [formOptions],
  );

  const visibleFollowerFields = showAllFollowerFilters
    ? followerFields
    : followerFields.slice(0, 3);

  useEffect(() => {
    if (disableUrlSync) return;
    const current = filtersFromSearchParams(searchParams);
    setFilters((prev) => {
      const currentSerialized = buildAdvisorQuery(current);
      const localSerialized = buildAdvisorQuery(prev);
      return currentSerialized === localSerialized ? prev : current;
    });
  }, [searchParams, disableUrlSync]);

  useEffect(() => {
    if (disableUrlSync) return;
    const timeoutId = window.setTimeout(() => {
      const next = buildAdvisorQuery(filters);
      if (next !== searchParams.toString()) {
        setSearchParams(next);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters, searchParams, setSearchParams, disableUrlSync]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const optionsPayload = await advisorFormOptionsApi();
        setFormOptions(optionsPayload);
      } catch {
        // Non-blocking for listing; we keep filter UI usable with existing values.
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadAdvisors = async () => {
      const requestId = ++latestRequestIdRef.current;

      try {
        setIsLoading(true);
        setError("");

        const params = queryParamsFromFilters(filters);
        const payload = await getAllAdvisorsApi(params);

        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        if (!payload?.success) {
          setError(payload?.msg || "Unable to load advisors");
          setAdvisors([]);
          return;
        }

        const data = payload?.data;
        const mapped = ((data?.advisors as AdvisorApiItem[]) || []).map(
          mapAdvisorApiItem,
        );

        setAdvisors(mapped);
        setPagination({
          page: data?.pagination?.page ?? 1,
          limit: data?.pagination?.limit ?? filters.limit,
          total: data?.pagination?.total ?? mapped.length,
          totalPages: data?.pagination?.totalPages ?? 1,
        });
      } catch (err) {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }
        const apiMessage =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { data?: { msg?: string } } }).response?.data
            ?.msg === "string"
            ? (err as { response?: { data?: { msg?: string } } }).response?.data
                ?.msg
            : "Unable to load advisors";
        setError(apiMessage || "Unable to load advisors");
        setAdvisors([]);
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadAdvisors();
  }, [filters]);

  const setFilterValue = (key: keyof AdvisorFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    if (!disableUrlSync) {
      setSearchParams(buildAdvisorQuery(initialFilters));
    }
  };

  const goPreviousPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, prev.page - 1),
    }));
  };

  const goNextPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: Math.min(pagination.totalPages, prev.page + 1),
    }));
  };

  return {
    filters,
    countries,
    states,
    industryOptions,
    visibleFollowerFields,
    showAllFollowerFilters,
    isLoading,
    error,
    advisors,
    pagination,
    disableUrlSync,
    setFilters,
    setShowAllFollowerFilters,
    setFilterValue,
    resetFilters,
    setSearchParams,
    goPreviousPage,
    goNextPage,
  };
}

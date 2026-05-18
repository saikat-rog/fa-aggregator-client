import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSavedAdvisors } from "../../context/SavedAdvisorsContext";
// import { LoginMethodsCard } from "../auth/LoginMethodsCard";
import {
  getUserMyEnquiries,
  type EnquiryPagination,
  type UserEnquiry,
} from "../../services/advisor.service";
import { DailyGrowthSection } from "./dashboard/DailyGrowthSection";
import { MyEnquiriesSection } from "./dashboard/MyEnquiriesSection";
import { SavedAdvisorsSection } from "./dashboard/SavedAdvisorsSection";
import { UserStatsCards } from "./dashboard/UserStatsCards";
import { FiCompass, FiSearch } from "react-icons/fi";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    savedAdvisors,
    isSavedListLoading,
    savedListError,
    refreshSavedAdvisors,
  } = useSavedAdvisors();
  const [enquiries, setEnquiries] = useState<UserEnquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [enquiriesError, setEnquiriesError] = useState("");
  const [expandedEnquiryIds, setExpandedEnquiryIds] = useState<Set<string>>(
    new Set(),
  );
  const [enquiryPage, setEnquiryPage] = useState(
    Math.max(1, Number(searchParams.get("myEnquiriesPage") || "1") || 1),
  );
  const [enquiryLimit] = useState(
    Math.min(100, Math.max(1, Number(searchParams.get("myEnquiriesLimit") || "10") || 10)),
  );
  const [enquiryPagination, setEnquiryPagination] = useState<EnquiryPagination>({
    page: enquiryPage,
    limit: enquiryLimit,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("myEnquiriesPage", String(enquiryPage));
      next.set("myEnquiriesLimit", String(enquiryLimit));
      return next;
    });
  }, [enquiryPage, enquiryLimit, setSearchParams]);

  useEffect(() => {
    const loadMyEnquiries = async () => {
      try {
        setEnquiriesLoading(true);
        setEnquiriesError("");
        const payload = await getUserMyEnquiries({
          page: enquiryPage,
          limit: enquiryLimit,
        });
        const data = payload?.data ?? payload;
        const list = (data?.enquiries ?? []) as UserEnquiry[];
        const pagination = data?.pagination;
        setEnquiries(list);
        setEnquiryPagination({
          page: typeof pagination?.page === "number" ? pagination.page : enquiryPage,
          limit: typeof pagination?.limit === "number" ? pagination.limit : enquiryLimit,
          total: typeof pagination?.total === "number" ? pagination.total : list.length,
          totalPages:
            typeof pagination?.totalPages === "number" ? pagination.totalPages : 1,
        });
      } catch (error: unknown) {
        const status =
          typeof error === "object" &&
          error !== null &&
          "response" in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;
        const msg =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { msg?: string } } }).response?.data
            ?.msg === "string"
            ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
            : "Failed to load your enquiries.";

        if (status === 401 || status === 403) {
          navigate("/auth");
          return;
        }

        setEnquiriesError(msg ?? "Failed to load your enquiries.");
      } finally {
        setEnquiriesLoading(false);
      }
    };

    void loadMyEnquiries();
  }, [enquiryPage, enquiryLimit, navigate]);

  const formatDate = useMemo(
    () => (value: string | null) =>
      value
        ? new Date(value).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          })
        : "—",
    [],
  );

  const toggleExpanded = (enquiryId: string) => {
    setExpandedEnquiryIds((prev) => {
      const next = new Set(prev);
      if (next.has(enquiryId)) {
        next.delete(enquiryId);
      } else {
        next.add(enquiryId);
      }
      return next;
    });
  };
  const showFirstStepPanel =
    !isSavedListLoading &&
    !enquiriesLoading &&
    !savedListError &&
    !enquiriesError &&
    savedAdvisors.length === 0 &&
    enquiries.length === 0;

  return (
    <div className="space-y-6">
      <UserStatsCards
        enquiriesLoading={enquiriesLoading}
        totalEnquiries={enquiryPagination.total}
        savedLoading={isSavedListLoading}
        totalSavedAdvisors={savedAdvisors.length}
      />

      {showFirstStepPanel ? (
        <section className="rounded-3xl border border-blue-200 bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-md">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <FiCompass className="h-3.5 w-3.5" />
            Start Here
          </p>
          <h2 className="mt-3 text-2xl font-bold">Let’s build your advisor shortlist</h2>
          <p className="mt-1 text-sm text-blue-100">
            Explore verified advisors, save your favorites, and send your first enquiry to get matched faster.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            <FiSearch className="h-4 w-4" />
            Discover Advisors
          </button>
        </section>
      ) : null}

      <SavedAdvisorsSection
        isLoading={isSavedListLoading}
        error={savedListError}
        savedAdvisors={savedAdvisors}
        onRefresh={() => void refreshSavedAdvisors()}
      />

      <MyEnquiriesSection
        enquiriesLoading={enquiriesLoading}
        enquiriesError={enquiriesError}
        enquiries={enquiries}
        expandedEnquiryIds={expandedEnquiryIds}
        enquiryPagination={enquiryPagination}
        onToggleExpanded={toggleExpanded}
        onOpenAdvisor={(username) => {
          if (!username) return;
          navigate(`/${username}`);
        }}
        onPreviousPage={() => setEnquiryPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() =>
          setEnquiryPage((prev) => Math.min(enquiryPagination.totalPages, prev + 1))
        }
        formatDate={formatDate}
      />

      <DailyGrowthSection onReadNow={() => navigate("/blog")} />

      {/* <LoginMethodsCard /> */}
    </div>
  );
};

export default UserDashboard;

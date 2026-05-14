import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getSavedAdvisors,
  saveAdvisor,
  unsaveAdvisor,
  type SavedAdvisor,
} from "../services/advisor.service";

type SavedAdvisorsContextValue = {
  savedAdvisorIds: Set<string>;
  savedAdvisors: SavedAdvisor[];
  isSavedListLoading: boolean;
  savedListError: string;
  isSavingByAdvisorId: Record<string, boolean>;
  isUnsavingByAdvisorId: Record<string, boolean>;
  save: (advisorId: string) => Promise<void>;
  unsave: (advisorId: string) => Promise<void>;
  isSaved: (advisorId: string) => boolean;
  refreshSavedAdvisors: () => Promise<void>;
  setSavedLocally: (advisorId: string) => void;
  clearSavedError: () => void;
};

const SavedAdvisorsContext = createContext<SavedAdvisorsContextValue | null>(null);

const getAuthState = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, role: null as string | null };
  }

  return {
    isAuthenticated: Boolean(localStorage.getItem("token")),
    role: localStorage.getItem("role"),
  };
};

export function SavedAdvisorsProvider({ children }: { children: React.ReactNode }) {
  const [savedAdvisorIds, setSavedAdvisorIds] = useState<Set<string>>(new Set());
  const [savedAdvisors, setSavedAdvisors] = useState<SavedAdvisor[]>([]);
  const [isSavedListLoading, setIsSavedListLoading] = useState(false);
  const [savedListError, setSavedListError] = useState("");
  const [isSavingByAdvisorId, setIsSavingByAdvisorId] = useState<Record<string, boolean>>({});
  const [isUnsavingByAdvisorId, setIsUnsavingByAdvisorId] = useState<Record<string, boolean>>({});

  const refreshSavedAdvisors = useCallback(async () => {
    const auth = getAuthState();
    if (!auth.isAuthenticated || auth.role !== "user") {
      setSavedAdvisors([]);
      setSavedAdvisorIds(new Set());
      setSavedListError("");
      return;
    }

    try {
      setIsSavedListLoading(true);
      setSavedListError("");
      const list = await getSavedAdvisors();
      setSavedAdvisors(list);
      setSavedAdvisorIds(new Set(list.map((item) => item.id)));
    } catch (error: unknown) {
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Failed to load saved advisors.";
      setSavedListError(msg ?? "Failed to load saved advisors.");
    } finally {
      setIsSavedListLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSavedAdvisors();

    const handler = () => {
      void refreshSavedAdvisors();
    };

    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, [refreshSavedAdvisors]);

  const save = useCallback(async (advisorId: string) => {
    if (!advisorId) return;

    const wasSaved = savedAdvisorIds.has(advisorId);
    setSavedListError("");
    setSavedAdvisorIds((prev) => new Set(prev).add(advisorId));
    setIsSavingByAdvisorId((prev) => ({ ...prev, [advisorId]: true }));

    try {
      await saveAdvisor(advisorId);
    } catch (error: unknown) {
      if (!wasSaved) {
        setSavedAdvisorIds((prev) => {
          const next = new Set(prev);
          next.delete(advisorId);
          return next;
        });
      }
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Unable to save advisor.";
      setSavedListError(msg ?? "Unable to save advisor.");
      throw error;
    } finally {
      setIsSavingByAdvisorId((prev) => ({ ...prev, [advisorId]: false }));
    }
  }, [savedAdvisorIds]);

  const unsave = useCallback(async (advisorId: string) => {
    if (!advisorId) return;

    const wasSaved = savedAdvisorIds.has(advisorId);
    setSavedListError("");
    setSavedAdvisorIds((prev) => {
      const next = new Set(prev);
      next.delete(advisorId);
      return next;
    });
    setSavedAdvisors((prev) => prev.filter((item) => item.id !== advisorId));
    setIsUnsavingByAdvisorId((prev) => ({ ...prev, [advisorId]: true }));

    try {
      await unsaveAdvisor(advisorId);
    } catch (error: unknown) {
      if (wasSaved) {
        setSavedAdvisorIds((prev) => new Set(prev).add(advisorId));
      }
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response?.data
          ?.msg === "string"
          ? (error as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : "Unable to unsave advisor.";
      setSavedListError(msg ?? "Unable to unsave advisor.");
      throw error;
    } finally {
      setIsUnsavingByAdvisorId((prev) => ({ ...prev, [advisorId]: false }));
    }
  }, [savedAdvisorIds]);

  const setSavedLocally = useCallback((advisorId: string) => {
    if (!advisorId) return;
    setSavedAdvisorIds((prev) => new Set(prev).add(advisorId));
  }, []);

  const value = useMemo<SavedAdvisorsContextValue>(
    () => ({
      savedAdvisorIds,
      savedAdvisors,
      isSavedListLoading,
      savedListError,
      isSavingByAdvisorId,
      isUnsavingByAdvisorId,
      save,
      unsave,
      isSaved: (advisorId: string) => savedAdvisorIds.has(advisorId),
      refreshSavedAdvisors,
      setSavedLocally,
      clearSavedError: () => setSavedListError(""),
    }),
    [
      savedAdvisorIds,
      savedAdvisors,
      isSavedListLoading,
      savedListError,
      isSavingByAdvisorId,
      isUnsavingByAdvisorId,
      save,
      unsave,
      refreshSavedAdvisors,
      setSavedLocally,
    ],
  );

  return (
    <SavedAdvisorsContext.Provider value={value}>
      {children}
    </SavedAdvisorsContext.Provider>
  );
}

export function useSavedAdvisors() {
  const context = useContext(SavedAdvisorsContext);
  if (!context) {
    throw new Error("useSavedAdvisors must be used within SavedAdvisorsProvider");
  }
  return context;
}

import api from "../lib/axios";

export const ADVISOR_CLICK_TYPES = {
  PROFILE: "profile",
  SOCIAL: "social",
  EMAIL: "email",
  WEBSITE: "website",
  PROFILE_SHARE: "profile-share",
} as const;

export type AdvisorClickType =
  (typeof ADVISOR_CLICK_TYPES)[keyof typeof ADVISOR_CLICK_TYPES];

const recentAdvisorClicks = new Map<string, number>();
const ADVISOR_CLICK_DEDUPE_MS = 500;
const TRACKED_CLICKS_STORAGE_KEY = "trackedAdvisorClicksV1";

const getPersistedTrackedClicks = (): Record<string, true> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TRACKED_CLICKS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, true>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const markPersistedTrackedClick = (key: string) => {
  if (typeof window === "undefined") return;
  const tracked = getPersistedTrackedClicks();
  tracked[key] = true;
  try {
    window.localStorage.setItem(
      TRACKED_CLICKS_STORAGE_KEY,
      JSON.stringify(tracked),
    );
  } catch {
    // ignore storage write failures
  }
};

export interface AdvisorApplicationPayload {
  username: string;
  industry: string;
  country: string;
  state: string;
  about: string;
  marketFocus: string[];
  emailForContact: string;
  personalWebsite?: string;
  expertiseIndeces: string[];
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    instagramFollowers?: number;
    linkedinFollowers?: number;
    twitterFollowers?: number;
    facebookFollowers?: number;
    youtubeSubscribers?: number;
    tiktokFollowers?: number;
  };
}

export interface AdvisorListQueryParams {
  page?: number;
  limit?: number;
  country?: string;
  state?: string;
  industries?: string[];
  instagramFollowersGt?: number;
  instagramFollowersGte?: number;
  instagramFollowersLt?: number;
  instagramFollowersLte?: number;
  youtubeSubscribersGt?: number;
  youtubeSubscribersGte?: number;
  youtubeSubscribersLt?: number;
  youtubeSubscribersLte?: number;
  tiktokFollowersGt?: number;
  tiktokFollowersGte?: number;
  tiktokFollowersLt?: number;
  tiktokFollowersLte?: number;
  linkedinFollowersGt?: number;
  linkedinFollowersGte?: number;
  linkedinFollowersLt?: number;
  linkedinFollowersLte?: number;
  facebookFollowersGt?: number;
  facebookFollowersGte?: number;
  facebookFollowersLt?: number;
  facebookFollowersLte?: number;
  twitterFollowersGt?: number;
  twitterFollowersGte?: number;
  twitterFollowersLt?: number;
  twitterFollowersLte?: number;
}

export interface AdvisorFormOptionsResponseData {
  countries: string[];
  locations: Record<string, { states: string[] }>;
  industries: string[];
  markets: string[];
  marketIndicesByCountry: Record<string, string[]>;
}

export type EnquiryStatus = "pending" | "responded";

export interface EnquiryUser {
  _id: string;
  name: string;
  email: string;
}

export interface Enquiry {
  _id: string;
  advisor: string;
  submittedBy: EnquiryUser;
  category: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function submitAdvisorApplicationApi(
  params: AdvisorApplicationPayload,
) {
  const response = await api.post('/advisor/form-apply', params);
  return response.data;
}

export async function advisorFormOptionsApi(){
  const response = await api.get('/advisor/form-options');
  const payload = response.data;
  return (payload?.data ?? payload) as AdvisorFormOptionsResponseData;
}

export const advisorProfileAnalyticsApi = async () => {
  const response = await api.get('/advisor/profile-analytics');
  return response.data;
};

export const getAllAdvisorsApi = async (params?: AdvisorListQueryParams) => {
  const response = await api.get('/advisor', { params });
  return response.data;
};

export const getAdvisorByIdApi = async (advisorId: string) => {
  const response = await api.get(`/advisor/${advisorId}`);
  return response.data;
};

export const getAdvisorByUsernameApi = async (username: string) => {
  const response = await api.get(`/advisor/username/${username}`);
  return response.data;
};

export interface AdvisorQueryPayload {
  advisorId: string;
  subject: string;
  message: string;
  category?: string;
}

export const submitAdvisorQueryApi = async (payload: AdvisorQueryPayload) => {
  const response = await api.post(`/user/submit-enquiry/advisor/${payload.advisorId}`, payload);
  return response.data;
};

export const duplicateUsernameCheckApi = async (username: string) => {
  const response = await api.get(
    `/advisor/username-availability?username=${encodeURIComponent(username)}`,
  );
  return response.data;
};

export const getMyEnquiries = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get("/advisor/my-enquiries", { params });
  return response.data;
};

export const markEnquiryResponded = async (enquiryId: string) => {
  const response = await api.patch(`/advisor/my-enquiries/${enquiryId}/mark-responded`, {});
  return response.data;
};

export const trackAdvisorClick = async (
  advisorId: string,
  clickType: AdvisorClickType,
) => {
  if (!advisorId) return;

  const key = `${advisorId}:${clickType}`;
  const persistedTracked = getPersistedTrackedClicks();
  if (persistedTracked[key]) {
    return;
  }

  const now = Date.now();
  const lastClickAt = recentAdvisorClicks.get(key);
  if (lastClickAt && now - lastClickAt < ADVISOR_CLICK_DEDUPE_MS) {
    return;
  }
  recentAdvisorClicks.set(key, now);

  try {
    await api.post(`/advisor/${advisorId}/track-click`, { clickType });
    markPersistedTrackedClick(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Advisor click tracking failed", {
        advisorId,
        clickType,
        error,
      });
    }
  }
};

import api from "../lib/axios";

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
  phone: string;
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

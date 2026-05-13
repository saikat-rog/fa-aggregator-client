import api from "../lib/axios";

export interface AdvisorApplicationPayload {
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
    instagramFollowers?: number;
    linkedinFollowers?: number;
    twitterFollowers?: number;
    facebookFollowers?: number;
    youtubeSubscribers?: number;
  };
}

export interface AdvisorFormOptionsResponseData {
  countries: string[];
  locations: Record<string, { states: string[] }>;
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

export const getAllAdvisorsApi = async () => {
  const response = await api.get('/advisor');
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
  advisorUsername: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
}

export const submitAdvisorQueryApi = async (payload: AdvisorQueryPayload) => {
  const response = await api.post('/advisor/query', payload);
  return response.data;
};

import { adminApi, type Pagination } from "./admin.service";

export interface AdminAdvisorCard {
  id: string;
  name?: string;
  username?: string;
  profilePictureUrl?: string;
}

export interface AdvisorsQuery {
  page: number;
  limit: number;
  country?: string;
  state?: string;
  verificationStatus?: string;
  username?: string;
  emailForContact?: string;
  industries?: string[];
  marketFocus?: string[];
  expertiseIndeces?: string[];
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
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

export interface AdvisorsListResponse {
  advisors: AdminAdvisorCard[];
  pagination: Pagination;
}

export async function getAdminAdvisors(params: AdvisorsQuery, signal?: AbortSignal): Promise<AdvisorsListResponse> {
  const response = await adminApi.get("/admin/advisors", {
    params,
    signal,
    paramsSerializer: {
      indexes: null,
    },
  });
  return (response.data?.data ?? response.data) as AdvisorsListResponse;
}

export async function getAdminAdvisorDetails(userId: string, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const response = await adminApi.get(`/admin/advisors/${userId}`, { signal });
  const payload = response.data?.data ?? response.data;
  return (payload?.advisor ?? payload) as Record<string, unknown>;
}

export interface AdvisorEnquiriesResponse {
  enquiries: Array<Record<string, unknown>>;
  pagination?: Pagination;
}

export async function getAdminAdvisorEnquiries(advisorId: string, params: { page: number; limit: number }, signal?: AbortSignal) {
  const response = await adminApi.get(`/admin/advisors/${advisorId}/enquiries`, { params, signal });
  return (response.data?.data ?? response.data) as AdvisorEnquiriesResponse;
}

import adminApi from "../../lib/adminApi";
export { adminApi };

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  role: string;
}

export async function adminLoginApi(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
  const response = await adminApi.post("/admin/login", payload);
  const body = response.data?.data ?? response.data;
  return body as AdminLoginResponse;
}

export interface AdminUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  approxLocation?: {
    country?: string;
    state?: string;
    pincode?: string;
  };
  role?: string;
  createdAt?: string;
}

export interface UsersQuery {
  page: number;
  limit: number;
  country?: string;
  state?: string;
  approxLocation?: string;
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export async function getAdminUsers(params: UsersQuery, signal?: AbortSignal): Promise<UsersResponse> {
  const response = await adminApi.get("/admin/users", { params, signal });
  return (response.data?.data ?? response.data) as UsersResponse;
}

export interface AdminAdvisorCard {
  id: string;
  name?: string;
  phone?: string;
  username?: string;
  profilePictureUrl?: string;
  ppp?: number | null;
  category?: string | null;
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
  youtube?: string;
  telegram?: string;
  instagramFollowersGt?: number;
  instagramFollowersGte?: number;
  instagramFollowersLt?: number;
  instagramFollowersLte?: number;
  youtubeSubscribersGt?: number;
  youtubeSubscribersGte?: number;
  youtubeSubscribersLt?: number;
  youtubeSubscribersLte?: number;
  telegramFollowersGt?: number;
  telegramFollowersGte?: number;
  telegramFollowersLt?: number;
  telegramFollowersLte?: number;
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

export async function removeAdminAdvisorProfile(userId: string) {
  const response = await adminApi.delete(`/admin/advisors/${userId}/profile`);
  return response.data?.data ?? response.data;
}

export interface AdvisorEnquiriesResponse {
  enquiries: Array<Record<string, unknown>>;
  pagination?: Pagination;
}

export async function getAdminAdvisorEnquiries(advisorId: string, params: { page: number; limit: number }, signal?: AbortSignal) {
  const response = await adminApi.get(`/admin/advisors/${advisorId}/enquiries`, { params, signal });
  return (response.data?.data ?? response.data) as AdvisorEnquiriesResponse;
}

export interface AdvisorApplication {
  _id: string;
  phone?: string;
  pincode?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  country?: string;
  state?: string;
  industries?: string[];
  about?: string;
  marketFocus?: string[];
  expertiseIndeces?: string[];
  emailForContact?: string;
  personalWebsite?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  instagramFollowers?: number;
  youtubeSubscribers?: number;
  telegramFollowers?: number;
  tiktokFollowers?: number;
  linkedinFollowers?: number;
  facebookFollowers?: number;
  twitterFollowers?: number;
  ppp?: number | null;
  category?: string | null;
  user?: {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
  };
}

export interface ApplicationsResponse {
  applications: AdvisorApplication[];
  pagination: Pagination;
}

export async function getAdvisorApplications(params: { page: number; limit: number; status?: string }, signal?: AbortSignal) {
  const response = await adminApi.get("/admin/advisor-applications", { params, signal });
  return (response.data?.data ?? response.data) as ApplicationsResponse;
}

export async function approveAdvisorApplication(id: string) {
  const response = await adminApi.patch(`/admin/advisor-applications/${id}/approve`, {});
  return (response.data?.data?.application ?? response.data?.data ?? response.data) as AdvisorApplication;
}

export async function rejectAdvisorApplication(id: string, rejectionReason: string) {
  const response = await adminApi.patch(`/admin/advisor-applications/${id}/reject`, { rejectionReason });
  return (response.data?.data?.application ?? response.data?.data ?? response.data) as AdvisorApplication;
}

export interface UpdateAdvisorApplicationPayload {
  username?: string;
  pincode?: string;
  industries?: string[];
  country?: string;
  state?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  about?: string;
  marketFocus?: string[];
  expertiseIndeces?: string[];
  emailForContact?: string;
  personalWebsite?: string;
  instagramFollowers?: number;
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
  linkedinFollowers?: number;
  facebookFollowers?: number;
  twitterFollowers?: number;
  ppp?: number;
  category?: string;
}

export async function updateAdvisorApplication(id: string, payload: UpdateAdvisorApplicationPayload) {
  const response = await adminApi.patch(`/admin/advisor-applications/${id}`, payload);
  return (response.data?.data?.application ?? response.data?.data ?? response.data) as AdvisorApplication;
}

export interface IndustriesResponse {
  industries: string[];
}

export async function getAdminIndustries(signal?: AbortSignal): Promise<IndustriesResponse> {
  const response = await adminApi.get("/admin/industries", { signal });
  return (response.data?.data ?? response.data) as IndustriesResponse;
}

export async function createAdminIndustry(name: string) {
  const response = await adminApi.post("/admin/industries", { name });
  return response.data?.data ?? response.data;
}

export interface CategoriesResponse {
  categories: string[];
}

export async function getAdminCategories(signal?: AbortSignal): Promise<CategoriesResponse> {
  const response = await adminApi.get("/admin/categories", { signal });
  return (response.data?.data ?? response.data) as CategoriesResponse;
}

export async function createAdminCategory(name: string) {
  const response = await adminApi.post("/admin/categories", { name });
  return response.data?.data ?? response.data;
}


export interface MarketItem {
  _id?: string;
  name: string;
  marketCode?: string;
}

export interface MarketsResponse {
  markets: Array<string | MarketItem>;
}

export async function getAdminMarkets(signal?: AbortSignal): Promise<MarketsResponse> {
  const response = await adminApi.get("/admin/markets", { signal });
  return (response.data?.data ?? response.data) as MarketsResponse;
}

export async function createAdminMarket(name: string) {
  const response = await adminApi.post("/admin/markets", { name });
  return response.data?.data ?? response.data;
}

export interface ExpertiseIndexItem {
  _id?: string;
  name: string;
  indexCode?: string;
  country?: string;
}

export interface ExpertiseIndicesResponse {
  expertiseIndices: Array<string | ExpertiseIndexItem>;
}

export async function getAdminExpertiseIndices(signal?: AbortSignal): Promise<ExpertiseIndicesResponse> {
  const response = await adminApi.get("/admin/expertise-indices", { signal });
  return (response.data?.data ?? response.data) as ExpertiseIndicesResponse;
}

export async function createAdminExpertiseIndex(name: string, country?: string) {
  const response = await adminApi.post("/admin/expertise-indices", { name, country });
  return response.data?.data ?? response.data;
}

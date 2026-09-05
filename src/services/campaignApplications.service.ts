import api from "../lib/api";
import adminApi from "../lib/adminApi";

export interface CampaignApplicationItem {
  _id: string;
  campaign: {
    _id: string;
    companyName: string;
    storeUsername?: string;
    category?: string;
    campaignGoal?: string;
    rewardType?: string;
    budget?: string;
  };
  campaignOwner: string;
  applicant: {
    _id: string;
    name?: string;
    email?: string;
    advisorProfile?: {
      username?: string;
      instagramProfilePictureUrl?: string | null;
    };
  };
  applicantName: string;
  applicantEmail: string;
  message: string;
  status: "pending" | "responded";
  respondedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CampaignApplicationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyReceivedCampaignApplicationsResponse {
  applications: CampaignApplicationItem[];
  pagination: CampaignApplicationPagination;
}

export async function submitCampaignApplicationApi(campaignId: string, message: string) {
  const response = await api.post(`/campaign-applications/${campaignId}/apply`, { message });
  return response.data;
}

export async function getMyReceivedCampaignApplicationsApi(params?: {
  page?: number;
  limit?: number;
  campaignId?: string;
  status?: string;
}) {
  const response = await api.get("/campaign-applications/my-received", { params });
  const payload = response.data?.data ?? response.data;
  return payload as MyReceivedCampaignApplicationsResponse;
}

export async function markCampaignApplicationRespondedApi(applicationId: string) {
  const response = await api.patch(`/campaign-applications/${applicationId}/mark-responded`, {});
  return response.data;
}

export async function getAdminCampaignApplicationsApi(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const response = await adminApi.get("/admin/campaign-applications", { params });
  const payload = response.data?.data ?? response.data;
  return payload as MyReceivedCampaignApplicationsResponse;
}

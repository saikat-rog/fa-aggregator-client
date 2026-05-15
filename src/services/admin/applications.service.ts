import { adminApi, type Pagination } from "./admin.service";

export interface AdvisorApplication {
  _id: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    _id?: string;
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
  return response.data?.data ?? response.data;
}

export async function rejectAdvisorApplication(id: string, rejectionReason: string) {
  const response = await adminApi.patch(`/admin/advisor-applications/${id}/reject`, { rejectionReason });
  return response.data?.data ?? response.data;
}

import api from "../lib/api";
import adminApi from "../lib/adminApi";

export type BusinessRequirementPayload = {
  companyName: string;
  businessEmail: string;
  url: string;
  currentMonthlySales: string;
  goalMonthlySales: string;
  desiredInfluencerScope: string;
  campaignObjective: string;
  detailedRequirements: string;
};

export type BusinessRequirementItem = BusinessRequirementPayload & {
  _id: string;
  status: "pending" | "approved";
  approvedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BusinessRequirementsAdminList = {
  requirements: BusinessRequirementItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApprovedBusinessRequirementItem = Omit<BusinessRequirementItem, "businessEmail">;
export type ApprovedBusinessRequirementsList = Omit<BusinessRequirementsAdminList, "requirements"> & {
  requirements: ApprovedBusinessRequirementItem[];
};

type NormalizedResponse<T> = {
  success: boolean;
  msg: string;
  data: T;
};

const unwrapOrThrow = <T,>(payload: NormalizedResponse<T>): T => {
  if (!payload?.success) {
    throw new Error(payload?.msg || "Request failed");
  }
  return payload.data;
};

export async function submitBusinessRequirement(payload: BusinessRequirementPayload) {
  const response = await api.post("/business-requirements", payload);
  const body = response.data as NormalizedResponse<BusinessRequirementItem>;
  return {
    data: unwrapOrThrow(body),
    msg: body?.msg || "Business requirements submitted successfully.",
  };
}

export async function getBusinessRequirementsAdmin(params: {
  page: number;
  limit: number;
  status?: "pending" | "approved";
}) {
  const response = await adminApi.get("/admin/business-requirements", { params });
  const body = response.data as NormalizedResponse<BusinessRequirementsAdminList>;
  return unwrapOrThrow(body);
}

export async function approveBusinessRequirementAdmin(id: string) {
  const response = await adminApi.patch(`/admin/business-requirements/${id}/approve`);
  const body = response.data as NormalizedResponse<BusinessRequirementItem>;
  return unwrapOrThrow(body);
}

export async function getApprovedBusinessRequirements(params: { page: number; limit: number }) {
  const response = await api.get("/business-requirements/approved", { params });
  const body = response.data as NormalizedResponse<ApprovedBusinessRequirementsList>;
  return unwrapOrThrow(body);
}

export async function getBusinessRequirementByIdAdmin(id: string) {
  const response = await adminApi.get(`/admin/business-requirements/${id}`);
  const body = response.data as NormalizedResponse<BusinessRequirementItem>;
  return unwrapOrThrow(body);
}

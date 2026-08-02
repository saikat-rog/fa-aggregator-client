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

const unwrapData = <T>(resData: unknown): T => {
  if (!resData || typeof resData !== "object") return resData as T;
  const obj = resData as Record<string, unknown>;

  if ("success" in obj && obj.success === false) {
    throw new Error(String(obj.msg || "Request failed"));
  }

  const inner = ("data" in obj && obj.data && typeof obj.data === "object")
    ? (obj.data as Record<string, unknown>)
    : obj;

  return inner as T;
};

const unwrapRequirement = (resData: unknown): BusinessRequirementItem => {
  if (!resData || typeof resData !== "object") return resData as BusinessRequirementItem;
  const obj = resData as Record<string, unknown>;

  if ("success" in obj && obj.success === false) {
    throw new Error(String(obj.msg || "Request failed"));
  }

  const inner = ("data" in obj && obj.data && typeof obj.data === "object")
    ? (obj.data as Record<string, unknown>)
    : obj;

  if ("requirement" in inner && inner.requirement && typeof inner.requirement === "object") {
    return inner.requirement as BusinessRequirementItem;
  }

  return inner as BusinessRequirementItem;
};

export async function submitBusinessRequirement(payload: BusinessRequirementPayload) {
  const response = await api.post("/business-requirements", payload);
  const data = unwrapRequirement(response.data);
  const msg = (response.data as { msg?: string })?.msg || "Business requirements submitted successfully.";
  return { data, msg };
}

export async function getBusinessRequirementsAdmin(params: {
  page: number;
  limit: number;
  status?: "pending" | "approved";
}) {
  const response = await adminApi.get("/admin/business-requirements", { params });
  return unwrapData<BusinessRequirementsAdminList>(response.data);
}

export async function approveBusinessRequirementAdmin(id: string) {
  const response = await adminApi.patch(`/admin/business-requirements/${id}/approve`);
  return unwrapRequirement(response.data);
}

export async function getApprovedBusinessRequirements(params: { page: number; limit: number }) {
  const response = await api.get("/business-requirements/approved", { params });
  return unwrapData<ApprovedBusinessRequirementsList>(response.data);
}

export async function getBusinessRequirementByIdAdmin(id: string) {
  const response = await adminApi.get(`/admin/business-requirements/${id}`);
  return unwrapRequirement(response.data);
}

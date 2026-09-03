import api from "../lib/api";
import adminApi from "../lib/adminApi";

export type BusinessRequirementPayload = {
  companyName: string;
  storeUsername: string;
  businessEmail: string;
  url: string;
  campaignGoal?: string;
  budget?: string;
  rewardType?: string;
  currentMonthlySales?: string;
  goalMonthlySales?: string;
  desiredInfluencerScope?: string;
  campaignObjective?: string;
  detailedRequirements: string;
};

export type PendingEditData = Partial<BusinessRequirementPayload> & {
  submittedAt?: string;
};

export type BusinessRequirementItem = Omit<BusinessRequirementPayload, "url"> & {
  _id: string;
  storeUsername?: string;
  url?: string;
  isUrlProtected?: boolean;
  advisorId?: string;
  postedByAdvisorName?: string;
  postedByAdvisorUsername?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  instagramProfilePictureUrl?: string | null;
  type?: "store" | "campaign";
  status: "pending" | "approved";
  approvedAt: string | null;
  editStatus?: "none" | "pending" | "approved" | "rejected";
  pendingEdit?: PendingEditData | null;
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

export type ApprovedBusinessRequirementItem = BusinessRequirementItem;
export type ApprovedBusinessRequirementsList = Omit<BusinessRequirementsAdminList, "requirements"> & {
  requirements: ApprovedBusinessRequirementItem[];
};

export type RequirementClickItem = {
  _id: string;
  requirementId: string;
  companyName?: string;
  url?: string;
  advisorId?: string;
  advisorName?: string;
  advisorUsername?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  clickedAt: string;
};

export type RequirementClicksAdminList = {
  clicks: RequirementClickItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export async function duplicateStoreUsernameCheckApi(storeUsername: string) {
  const response = await api.get(
    `/business-requirements/username-availability?storeUsername=${encodeURIComponent(storeUsername)}`,
  );
  return unwrapData<{ isTaken?: boolean; exists?: boolean; available?: boolean; isAvailable?: boolean }>(
    response.data,
  );
}

export async function submitBusinessRequirement(payload: BusinessRequirementPayload) {
  const response = await api.post("/business-requirements", payload);
  const data = unwrapRequirement(response.data);
  const msg = (response.data as { msg?: string })?.msg || "Business requirements submitted successfully.";
  return { data, msg };
}

export async function getBusinessRequirementsAdmin(params: {
  page: number;
  limit: number;
  status?: "pending" | "approved" | "pending_edit";
  type?: "store" | "campaign";
}) {
  const response = await adminApi.get("/admin/business-requirements", { params });
  return unwrapData<BusinessRequirementsAdminList>(response.data);
}

export async function approveBusinessRequirementAdmin(id: string) {
  const response = await adminApi.patch(`/admin/business-requirements/${id}/approve`);
  return unwrapRequirement(response.data);
}

export async function getApprovedBusinessRequirements(params: { page: number; limit: number; type?: "store" | "campaign" }) {
  const response = await api.get("/business-requirements/approved", { params });
  return unwrapData<ApprovedBusinessRequirementsList>(response.data);
}

export async function trackRequirementClickApi(id: string) {
  const response = await api.post(`/business-requirements/${id}/track-click`);
  return unwrapData<{ msg: string; url: string }>(response.data);
}

export async function getRequirementClicksAdmin(params: { page: number; limit: number }) {
  const response = await adminApi.get("/admin/business-requirements/clicks", { params });
  return unwrapData<RequirementClicksAdminList>(response.data);
}

export async function getMyRequirementClicks(params: { page: number; limit: number }) {
  const response = await api.get("/business-requirements/my-clicks", { params });
  return unwrapData<RequirementClicksAdminList>(response.data);
}

export async function getBusinessRequirementByIdAdmin(id: string) {
  const response = await adminApi.get(`/admin/business-requirements/${id}`);
  return unwrapRequirement(response.data);
}

export async function getApprovedBusinessRequirementByIdPublic(id: string) {
  const response = await api.get(`/business-requirements/approved/${id}`);
  return unwrapRequirement(response.data);
}


export async function getMyRequirementApi() {
  const response = await api.get("/business-requirements/my-requirement");
  const data = response.data?.data?.requirement ?? response.data?.requirement ?? null;
  return data ? (data as BusinessRequirementItem) : null;
}

export async function updateMyRequirementApi(payload: BusinessRequirementPayload) {
  const response = await api.put("/business-requirements/my-requirement", payload);
  const data = unwrapRequirement(response.data);
  const msg = (response.data as { msg?: string })?.msg || "Requirement updated successfully.";
  return { data, msg };
}

export async function approveRequirementEditAdmin(id: string) {
  const response = await adminApi.patch(`/admin/business-requirements/${id}/approve-edit`);
  return unwrapRequirement(response.data);
}

export async function rejectRequirementEditAdmin(id: string) {
  const response = await adminApi.patch(`/admin/business-requirements/${id}/reject-edit`);
  return unwrapRequirement(response.data);
}

export async function deleteBusinessRequirementAdmin(id: string) {
  const response = await adminApi.delete(`/admin/business-requirements/${id}`);
  return unwrapData<{ msg: string }>(response.data);
}

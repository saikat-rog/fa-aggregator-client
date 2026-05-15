import { adminApi } from "./admin.service";

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

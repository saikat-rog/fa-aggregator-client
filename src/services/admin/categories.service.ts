import { adminApi } from "./admin.service";

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

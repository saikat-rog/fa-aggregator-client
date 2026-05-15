import { adminApi, type Pagination } from "./admin.service";

export interface AdminUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  country?: string;
  state?: string;
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

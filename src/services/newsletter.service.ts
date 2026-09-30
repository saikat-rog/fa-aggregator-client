import api from "../lib/api";
import adminApi from "../lib/adminApi";
import type { Pagination } from "./admin/admin.service";

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  source: string;
  status: "active" | "unsubscribed";
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeNewsletterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    createdAt: string;
  };
}

export interface ListSubscribersResponse {
  subscribers: NewsletterSubscriber[];
  pagination: Pagination;
}

export async function subscribeNewsletterApi(
  email: string,
  source = "homepage_newsletter"
): Promise<SubscribeNewsletterResponse> {
  const response = await api.post("/newsletter/subscribe", { email, source });
  return response.data;
}

export async function getAdminNewsletterSubscribersApi(
  params: { page?: number; limit?: number; search?: string; status?: string } = {},
  signal?: AbortSignal
): Promise<ListSubscribersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  const response = await adminApi.get(`/newsletter/subscribers?${query.toString()}`, { signal });
  const payload = response.data?.data ?? response.data;
  return payload as ListSubscribersResponse;
}

export async function deleteAdminNewsletterSubscriberApi(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await adminApi.delete(`/newsletter/subscribers/${id}`);
  return response.data;
}

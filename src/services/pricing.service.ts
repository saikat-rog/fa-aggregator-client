import api from "../lib/api";
import adminApi from "../lib/adminApi";

export interface PricingPlan {
  _id: string;
  planId: string;
  name: string;
  price: string;
  period: string;
  tag?: string;
  audience?: string;
  pitch?: string;
  features: string[];
  paymentLink?: string;
  buttonText?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingPlanInput {
  name?: string;
  planId?: string;
  price?: string;
  period?: string;
  tag?: string;
  audience?: string;
  pitch?: string;
  features?: string[];
  paymentLink?: string;
  buttonText?: string;
  isActive?: boolean;
  order?: number;
}

const unwrap = (response: any) => response?.data?.data ?? response?.data;

export async function getPricingPlansApi(): Promise<PricingPlan[]> {
  const res = await api.get("/pricing-plans");
  const data = unwrap(res);
  return data?.plans || [];
}

export async function getPricingPlansAdminApi(): Promise<PricingPlan[]> {
  const res = await adminApi.get("/pricing-plans/admin/all");
  const data = unwrap(res);
  return data?.plans || [];
}

export async function updatePricingPlanAdminApi(id: string, payload: PricingPlanInput): Promise<PricingPlan> {
  const res = await adminApi.put(`/pricing-plans/admin/${id}`, payload);
  const data = unwrap(res);
  return data?.plan || data;
}

export async function createPricingPlanAdminApi(payload: PricingPlanInput): Promise<PricingPlan> {
  const res = await adminApi.post("/pricing-plans/admin", payload);
  const data = unwrap(res);
  return data?.plan || data;
}

export async function deletePricingPlanAdminApi(id: string): Promise<void> {
  await adminApi.delete(`/pricing-plans/admin/${id}`);
}

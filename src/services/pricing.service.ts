import api from "../lib/api";
import adminApi from "../lib/adminApi";

export interface PricingItem {
  emoji?: string;
  title: string;
  description?: string;
  price?: string;
}

export interface PricingCategory {
  title: string;
  items: PricingItem[];
}

export interface PricingPlan {
  _id: string;
  planId: string;
  name: string;
  kicker?: string;
  heading?: string;
  subheading?: string;
  price: string;
  period?: string;
  originalTotal?: string;
  originalTotalLabel?: string;
  joinLabel?: string;
  trialNote?: string;
  buttonText?: string;
  buttonLink?: string;
  paymentLink?: string;
  categories: PricingCategory[];
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingPlanInput {
  name?: string;
  planId?: string;
  kicker?: string;
  heading?: string;
  subheading?: string;
  price?: string;
  period?: string;
  originalTotal?: string;
  originalTotalLabel?: string;
  joinLabel?: string;
  trialNote?: string;
  buttonText?: string;
  buttonLink?: string;
  paymentLink?: string;
  categories?: PricingCategory[];
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

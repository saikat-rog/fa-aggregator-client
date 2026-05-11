import api from "../lib/axios";

export async function registerApi(email: string, password: string, name: string, phone: string, role: string) {
  const response = await api.post("/auth/register", { email, password, name, phone, role });
  return response.data;
}

export async function loginApi(email: string, password: string, role: string) {
  const response = await api.post("/auth/login", { email, password, role }, { withCredentials: true });
  const payload = response.data;
  return payload?.data ?? payload;
}

export async function logoutApi() {
  await api.post("/auth/logout", {}, { withCredentials: true });
  localStorage.removeItem("token");
}

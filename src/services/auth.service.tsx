import api from "../lib/api";

export type AuthRole = "user" | "advisor";

export type AuthSuccessPayload = {
  accessToken: string;
  role: AuthRole;
  roles?: AuthRole[];
};

export async function registerApi(
  email: string,
  password: string,
  name: string,
  phone: string | undefined,
  role: AuthRole,
) {
  const response = await api.post("/auth/register", { email, password, name, phone, role });
  return response.data;
}

export async function verifyEmailApi(email: string, otp: string) {
  const response = await api.post("/auth/verify-otp", { email, otp }, { withCredentials: true });
  return response.data;
}

export async function reVerifyEmailApi(email: string, role: AuthRole) {
  const response = await api.post("/auth/resend-otp", { email, role }, { withCredentials: true });
  return response.data;
}

export async function loginApi(email: string, password: string, role: AuthRole) {
  const response = await api.post("/auth/login", { email, password, role }, { withCredentials: true });
  const payload = response.data;
  return (payload?.data ?? payload) as AuthSuccessPayload;
}

export async function googleAuthApi(params: {
  idToken: string;
  role: AuthRole;
  name?: string;
  phone?: string;
}) {
  const response = await api.post("/auth/google", params, { withCredentials: true });
  const payload = response.data;
  return (payload?.data ?? payload) as AuthSuccessPayload;
}

export async function forgotPasswordApi(email: string, role: AuthRole) {
  const response = await api.post("/auth/password/forgot", { email, role }, { withCredentials: true });
  return response.data;
}

export async function resetPasswordApi(params: {
  email: string;
  role: AuthRole;
  otp: string;
  newPassword: string;
}) {
  const response = await api.post("/auth/password/reset", params, { withCredentials: true });
  return response.data;
}

export async function createPasswordApi(params: {
  role: AuthRole;
  password: string;
}) {
  const response = await api.post("/auth/password/create", params, { withCredentials: true });
  return response.data;
}

export async function logoutApi() {
  await api.post("/auth/logout", {}, { withCredentials: true });
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("roles");
  localStorage.removeItem("googleLinked");
}

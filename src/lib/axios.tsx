import axios from "axios";

const BASE_URL = import.meta.env.VITE_PRODUCTION_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const notifyConnectionError = (open: boolean) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("app:connection-error", { detail: { open } }),
  );
};

const isConnectionRefused = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;
  if (error.response) return false;
  const message = String(error.message ?? "");
  const code = String((error as { code?: string }).code ?? "");
  return (
    code === "ERR_NETWORK" ||
    message.includes("ERR_CONNECTION_REFUSED") ||
    message.toLowerCase().includes("network error")
  );
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    notifyConnectionError(false);
    return response;
  },
  async (error) => {
    if (isConnectionRefused(error)) {
      notifyConnectionError(true);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken =
          res.data?.accessToken ||
          res.data?.data?.accessToken ||
          res.data?.data?.token;
        if (!newToken) {
          throw new Error("Refresh succeeded but no access token returned");
        }

        localStorage.setItem("token", newToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

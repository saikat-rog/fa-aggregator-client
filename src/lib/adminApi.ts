import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const adminApi = axios.create({
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

const isAdminAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return url.includes("/admin/login") || url.includes("/auth/refresh");
};

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.debug("[adminApi][request]", {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    });
  }

  return config;
});

adminApi.interceptors.response.use(
  (response) => {
    notifyConnectionError(false);
    if (import.meta.env.DEV) {
      console.debug("[adminApi][response]", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    if (isConnectionRefused(error)) {
      notifyConnectionError(true);
    }

    if (import.meta.env.DEV) {
      console.debug("[adminApi][error]", {
        status: error?.response?.status,
        url: error?.config?.url,
        data: error?.response?.data,
      });
    }

    const originalRequest = error.config;
    const isTokenExpired =
      error.response?.status === 401 &&
      String(error?.response?.data?.msg ?? "").toLowerCase().includes("token expired");

    if (
      isTokenExpired &&
      originalRequest &&
      !originalRequest._retry &&
      !isAdminAuthEndpoint(originalRequest.url)
    ) {
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

        return adminApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/admin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default adminApi;

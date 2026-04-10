import axios, { type InternalAxiosRequestConfig } from "axios";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as {
      config?: RetryConfig;
      response?: { status?: number };
    };
    const originalRequest = axiosError.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    const url = typeof originalRequest.url === "string" ? originalRequest.url : "";
    const skipRefresh =
      url.includes("/auth/refresh") || url.includes("/auth/login");
    if (
      axiosError.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

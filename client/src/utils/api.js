import axios from "axios";
import {store }from "../store/store.js";
import { logoutSuccess, refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true // IMPORTANT for refresh token cookie
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

/* ===== RESPONSE INTERCEPTOR ===== */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const url = originalRequest.url;

    // Don't retry token refresh for auth endpoints
    const isAuthEndpoint = url?.includes("/auth/login") || 
                          url?.includes("/auth/signup") || 
                          url?.includes("/auth/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      store.dispatch(refreshTokenRequest());

      try {
        await api.post("/auth/refresh-token");
        processQueue(null);
        store.dispatch(refreshTokenSuccess());
        // Wait a tick to ensure state update
        await new Promise(resolve => setTimeout(resolve, 0));
        return api(originalRequest);
      } catch (err) {
        store.dispatch(refreshTokenFailure(err.response?.data?.message || "Token refresh failed"));
        processQueue(err);
        store.dispatch(logoutSuccess());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

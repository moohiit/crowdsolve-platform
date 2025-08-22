// src/api/axiosInstance.js
import axios from "axios";
import store from "../store/store";
import { logout, setUser } from "../store/slices/authSlice";

// Create axios instance
const api = axios.create({
  baseURL: "/api", // Vite proxy will map this to your backend
  withCredentials: true, // send cookies if backend uses them
});

// Request interceptor → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // OPTIONAL: refresh token flow if your backend supports it
        const res = await api.post("/auth/refresh");
        const newToken = res.data.token;

        localStorage.setItem("token", newToken);
        store.dispatch(setUser(res.data.user));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("token");
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

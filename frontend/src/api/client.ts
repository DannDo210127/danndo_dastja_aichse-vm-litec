// lib/apiClient.ts
import { useAuthStore } from "@/store/token-store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // backend
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  console.log("Using access token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = useAuthStore.getState().refreshToken;
      if (refresh) {
        try {
          const { data } = await axios.post("http://localhost:4000/auth/token", { refreshToken: refresh });
          useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api.request(error.config);
        } catch {
          useAuthStore.getState().clearTokens();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

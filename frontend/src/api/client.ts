// lib/apiClient.ts
import { useAuthStore } from "@/store/token-store";
import { useSnackbarStore } from "@/store/snackbar-store";
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
        try {
          const { data } = await axios.post("http://localhost:4000/auth/token", { }, { withCredentials: true });
          useAuthStore.getState().setTokens(data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api.request(error.config);
        } catch {
          useAuthStore.getState().clearTokens();
        }
    }

    return Promise.reject(error);
  },
);

// Additional interceptor: separate and independent from the above.
// It also inspects successful responses for an `error` field and shows
// the snackbar via `useErrorStore`. Kept separate per request.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    try {

      const err = error?.response?.data?.error;
      if (err && !err.silent) {
        // showError acts as the snackbar trigger
        useSnackbarStore.getState().showError(
          err.message
        );
      }
    } catch (e) {
      // ignore
    }

    return Promise.reject(error);
  },
);

// Success interceptor: checks for 200 status and success item in response data
api.interceptors.response.use(
  (res) => {
    try {
      if (res.status === 200 && res.data?.success && !res.data.success.silent) {
        useSnackbarStore.getState().showSuccess(
          res.data.success.message
        );
      }
    } catch (e) {
      alert("FATAL ERROR WHILE PROCESSING SNACKBAR");
    }
    return res;
  },
);



export default api;

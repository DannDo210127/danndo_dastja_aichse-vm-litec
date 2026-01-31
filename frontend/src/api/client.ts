// lib/apiClient.ts
import { useAuthStore } from "@/store/token-store";
import { useSnackbarStore } from "@/store/snackbar-store";
import { useOperationModalStore } from "@/store/operation-modal-store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // backend
  withCredentials: true,
});


// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh interceptor
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

// Error interceptor: checks for error item in response data
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    try {

      const err = error?.response?.data?.error;
      if (err && !err.silent) {
        useSnackbarStore.getState().showError(
          err.message
        );
      }
    } catch (e) {
      alert("Fatal error while processing error snackbar");
    }

    return Promise.reject(error);
  },
);

// Success interceptor: success item in response data
api.interceptors.response.use(
  (res) => {
    try {
      if (res.data?.success && !res.data.success.silent) {
        useSnackbarStore.getState().showSuccess(
          res.data.success.message
        );
      }
    } catch (e) {
      alert("Fatal error while processing success snackbar");
    }
    return res;
  },
);

// Interceptor to detect Incus ASYNC Operations
api.interceptors.response.use(
  (res) => {
    const operationModal = useOperationModalStore.getState();

    try {
      if (res.data?.type === "async" && res.data?.operation) {

        // Get Operation ID from URL
        const operationId = res.data.operation.split('/').pop();
        if (operationId) {
          operationModal.open(operationId);
        }
      }
    } catch (e) {
      console.warn("Error processing async operation:", e);
    }
    return res;
  },
);


export default api;

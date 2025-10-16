// store/authStore.ts (Zustand)
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setTokens: (access, refresh) => {
    console.log("Setting tokens", { access, refresh });
    localStorage.setItem("refreshToken", refresh);
    set({ accessToken: access });
  },
  clearTokens: () => {
    localStorage.removeItem("refreshToken");
    set({ accessToken: null });
  },
}));

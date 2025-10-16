// store/authStore.ts (Zustand)
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setTokens: (access: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setTokens: (access) => {
    set({ accessToken: access });
  },
  clearTokens: () => {
    set({ accessToken: null });
  },
}));

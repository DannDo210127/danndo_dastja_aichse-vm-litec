import { create } from 'zustand';

interface SnackbarState {
    message: string | null;
    type: 'error' | 'success' | 'info';
    isVisible: boolean;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
    hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
    message: null,
    type: 'error',
    isVisible: false,
    showError: (message: string) =>
        set({ message, type: 'error', isVisible: true }),
    showSuccess: (message: string) =>
        set({ message, type: 'success', isVisible: true }),
    showInfo: (message: string) =>
        set({ message, type: 'info', isVisible: true }),
    hideSnackbar: () =>
        set({ isVisible: false, message: null }),
}));

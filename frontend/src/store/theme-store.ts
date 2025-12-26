// store/theme-store.ts (Zustand)
import { create } from "zustand";

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;  
  toggleTheme: () => void;
  setTheme: (newTheme: Theme) => void;
  getTheme: () => Theme;
}

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored || 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
    theme: getInitialTheme(),
    toggleTheme: () => set((state) => {
        const storageTheme = localStorage.getItem('theme') as Theme | null;
        if(storageTheme == null){
            localStorage.setItem('theme', state.theme);
        }
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        return { theme: newTheme };
    }),
    setTheme: (newTheme: Theme) => set({ theme: newTheme }),
    getTheme: () => {
        const storageTheme = localStorage.getItem('theme') as Theme || null;
        if(storageTheme == null){
            localStorage.setItem('theme', 'light');
            return 'light';
        }
        return storageTheme;
    }
}));


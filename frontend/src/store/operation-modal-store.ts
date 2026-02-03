import { create } from "zustand";

interface OperationModalState {
    operationId: string | null;
    isOpen: boolean;
    open: (operationId: string) => void;
    close: () => void;
}

export const useOperationModalStore = create<OperationModalState>((set) => ({
    operationId: null,
    isOpen: false,
    open: (operationId: string) => set({ operationId, isOpen: true }),
    close: () => set({ operationId: null, isOpen: false }),
}));

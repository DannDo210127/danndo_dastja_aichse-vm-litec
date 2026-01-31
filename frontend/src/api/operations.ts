import api from "./client"

export const getOperations = async () => {
    return await api.get(`/incus/operations/`, { withCredentials: true });
}

interface IncusOperation {
    id: string;
    type: string;
    status: string;
    status_code: number;
    created_at: string;
    updated_at: string;
    metadata?: Record<string, any>;
    err: string | null;
}

export const getOperationStatus = async (operationId: string): Promise<IncusOperation> => {
    const response = await api.get(`incus/operations/${operationId}`, { withCredentials: true });
    return response.data;
};
import api from "./client";

export const getAssignedMachines = async () => {
    const response = await api.get(`/incus/machines/`, {
        withCredentials: true,
    });
    return response.data;
};

export const getAllImages = async () => {
    const response = await api.get(`/incus/images/`, { withCredentials: true });
    return response.data;
};

interface CreateMachinePayload {
    type: string;
    hostname: string;
    source: {
        type: string;
        fingerprint?: string;
        alias?: string;
    };
}

export const createMachine = async (payload: CreateMachinePayload) => {
    return await api.post(`/incus/machines/new`, payload, {
        withCredentials: true,
    });
};

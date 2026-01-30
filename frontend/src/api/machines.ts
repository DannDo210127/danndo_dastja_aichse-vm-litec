import api from "./client";

export const getMachine = async (name: string) => {
    const response = await api.get(`/incus/machine/${name}`, { withCredentials: true });
    return response.data;
}

export const getAssignedMachines = async () => {
    const response = await api.get(`/incus/machines/`, { withCredentials: true });
    return response.data;
}

export const getAllImages = async () => {
    const response = await api.get(`/incus/images/`, { withCredentials: true });
    return response.data;
}

interface CreateMachinePayload {
    hostname: string;
    source: {
        type: string;
        fingerprint: string;
    }
}

export const createMachine = async (payload: CreateMachinePayload) => {
    const response = await api.post(`/incus/machines/new`, payload,{ withCredentials: true });
    return response.data;
}
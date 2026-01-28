import api from "./client";

export const getMachine = async (name: string) => {
    const response = await api.get(`/incus/machine/${name}`, { withCredentials: true });
    return response.data;
}

export const getAssignedMachines = async () => {
    const response = await api.get(`/incus/machines/`, { withCredentials: true });
    return response.data;
}
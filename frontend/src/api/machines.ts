import api from "./client";

export const getAssignedMachines = async () => {
    const response = await api.get(`/incus/machines/`, { withCredentials: true });
    return response.data;
}
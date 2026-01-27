import api from "./client";

export const getAllMachines = async () => {
    const response = await api.get(`/incus/machines`, { withCredentials: true });
    return response.data;
}
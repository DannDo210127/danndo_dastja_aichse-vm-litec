import api from "./client"

export const getClusters = async () => {
    return (await api.get(`/incus/clusters`, { withCredentials: true })).data;
}
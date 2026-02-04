import { Incus } from "./client";

export const Cluster = {
    getClusters: async () => {
        return (await Incus.get(`/cluster/members`)).data;
    }
}
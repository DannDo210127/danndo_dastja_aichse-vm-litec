import { Incus } from "./client";

export const Machines = {

    getMachine: async (hostname: string) => {
        return (await Incus.get(`/instances/${hostname}`)).data.metadata;
    },
}



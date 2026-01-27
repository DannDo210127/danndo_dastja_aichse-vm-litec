import { Incus } from "./client";

export const getMachine = async (name: string) => {
    return (await Incus.get(`/instances/${name}`)).data.metadata;
}

export const getAllMachines = async () => {
    return (await Incus.get(`/instances`)).data.metadata;
}
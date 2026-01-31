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

export const startMachine = async (
    hostname: String,
    force: boolean = false,
) => {
    return await api.put(
        `/incus/machines/${hostname}/start`,
        {
            force,
        },
        {
            withCredentials: true,
        },
    );
};

export const stopMachine = async (hostname: String, force: boolean = false) => {
    return await api.put(
        `/incus/machines/${hostname}/stop`,
        {
            force,
        },
        {
            withCredentials: true,
        },
    );
};

export const getMachineState = async (hostname: String) => {
    return (
        await api.get(`/incus/machines/${hostname}/state`, {
            withCredentials: true,
        })
    ).data;
};

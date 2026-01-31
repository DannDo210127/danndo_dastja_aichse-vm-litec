import { Incus } from "./client";

export const Machines = {
	getMachine: async (hostname: string) => {
		return (await Incus.get(`/instances/${hostname}`)).data.metadata;
	},

	getAllImages: async () => {
		return (await Incus.get(`/images`)).data.metadata;
	},

	getImage: async (fingerprint: string) => {
		return (await Incus.get(`/images/${fingerprint}`)).data.metadata;
	},

	createMachine: async (config: any) => {
		return (await Incus.post(`/instances`, config)).data;
	}
};

import { Incus } from "./client";

export const Machines = {
	getMachine: async (hostname: string) => {
		return (await Incus.get(`/instances/${hostname}`)).data.metadata;
	},

	getAllImages: async () => {
		return (await Incus.get(`/images?recursion=1`)).data.metadata;
	},

	getImage: async (fingerprint: string) => {
		return (await Incus.get(`/images/${fingerprint}`)).data.metadata;
	},

	createMachine: async (config: any) => {
		return (await Incus.post(`/instances?target=${config.target}`, config)).data;
	},

	startMachine: async (hostname: String, force: boolean = false) => {
		return await Incus.put(`/instances/${hostname}/state`, {
			action: "start",
			timeout: -1,
			force: force
		});
	},

	stopMachine: async (hostname: String, force: boolean = false) => {
		return await Incus.put(`/instances/${hostname}/state`, {
			action: "stop",
			timeout: 5,
			force: force
		});
	},

	deleteMachine: async (hostname: String) => {
		return (await Incus.delete(`/instances/${hostname}`)).data;
	},

	getMachineState: async (hostname: String) => {
		return (await Incus.get(`/instances/${hostname}/state`)).data;
	}
};

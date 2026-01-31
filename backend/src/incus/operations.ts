import { Incus } from "./client";

export const Operations = {
	getOperations: async () => {
		return (await Incus.get(`/operations`)).data;
	},

	getOperation: async (operationId: string) => {
		return (await Incus.get(`/operations/${operationId}`)).data;
	}
};

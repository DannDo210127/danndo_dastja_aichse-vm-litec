import { Incus } from "./client";

// Return every task with recrusion level 1
export const Operations = {
	getOperations: async () => {
		return (await Incus.get(`/operations?recursion=1`)).data;
	},

	getOperation: async (operationId: string) => {
		return (await Incus.get(`/operations/${operationId}`)).data;
	}
};

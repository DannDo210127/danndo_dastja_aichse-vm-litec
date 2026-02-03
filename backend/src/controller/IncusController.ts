import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { Machines } from "../incus/machines";
import { successMessage } from "../util/Success";
import { Operations } from "../incus/operations";
import { Cluster } from "../incus/cluster";

const prisma = DatabaseClient.getInstance().prisma;

/**
 * MACHINE routes implementation
 */

const getAssignedVirtualMachines: RequestHandler = async (req, res) => {
	try {
		const vms = await prisma.virtualMachine.findMany({
			where: {
				userId: req.user?.id
			}
		});

		const machines = await Promise.all(
			vms.map(async (vm) => {
				try {
					return await Machines.getMachine(vm.hostname);
				} catch (error) {
					throw new Error(
						"Failed to retrieve machine from incus: " + vm.hostname
					);
				}
			})
		);

		res.status(200).json(machines);
	} catch (error) {
		return res
			.status(500)
			.json(
				errorMessage(
					500,
					"Failed to retrieve vms: " + (error as Error).message
				)
			);
	}
};

const createVirtualMachine: RequestHandler = async (req, res) => {
	const user = req.user;

	const hostname = req.body.hostname;
	const source = req.body.source;
	const target = req.body.target

	// @TODO Validate config

	const payload: any = {
		type: "virtual-machine",
		name: hostname,
		target: target,
		source,
		config: {
			"limits.cpu": "1",
			"limits.memory": "2GiB",
		}
	};

	try {
		const response = await Machines.createMachine(payload);


		// If Incus returned an operation reference, poll it until finished
		let operationId: string | null = null;
		if (response && response.operation) {
			if (typeof response.operation === "string") {
				const parts = response.operation.split("/");
				operationId = parts[parts.length - 1];
			} else if (response.operation.id) {
				operationId = response.operation.id;
			}
		}

		if (operationId) {
			const maxOpAttempts = 20;
			let opFinished = false;
			for (let i = 0; i < maxOpAttempts; i++) {
				try {
					const op = await Operations.getOperation(operationId);
					const status = (op && (op.status || op.metadata?.status)) as string | undefined;
					const err = op && (op.err || op.metadata?.err || op.metadata?.error_message);

					if (status && status.toLowerCase() !== "running") {
						// Operation finished; if it has an error, bail out
						if (err) {
							return res.status(500).json(errorMessage(500, "Incus operation failed: " + err));
						}
						opFinished = true;
						break;
					}
				} catch (err) {
					// ignore transient errors while polling
				}
				await new Promise((r) => setTimeout(r, 500));
			}

			if (!opFinished) {
				return res.status(500).json(errorMessage(500, "Incus operation did not finish successfully"));
			}
		}

		await prisma.virtualMachine.create({
			data: {
				hostname: hostname,
				userId: user?.id!,
				classroomId: 1
			}
		});

		res.status(200).json(response);
	} catch (error) {
		return res
			.status(500)
			.json(
				errorMessage(500, "Failed to create virtual machine: " + error)
			);
	}
};

export const startVirtualMachine: RequestHandler = async (req, res) => {
	const hostname = req.params.hostname;
	const force = req.body.force;

	const response = await Machines.startMachine(hostname, force);
	return res.status(200).json(response.data);
};

export const stopVirtualMachine: RequestHandler = async (req, res) => {
	const hostname = req.params.hostname;
	const force = req.body.force;

	const response = await Machines.stopMachine(hostname, force);
	return res.status(200).json(response.data);
};

export const deleteVirtualMachine: RequestHandler = async (req, res) => {
	const hostname = req.params.hostname;

	try {
		await Machines.deleteMachine(hostname);

		await prisma.virtualMachine.delete({
			where: {
				hostname: hostname
			}
		});

		return res.status(200).json(successMessage(200, "Virtual machine deleted successfully"));
	} catch (error: any) {
		return res.status(500).json(errorMessage(500, "Failed to delete virtual machine: Machine might be running"));
	}
}

export const getVirtualMachineState: RequestHandler = async (req, res) => {
	const hostname = req.params.hostname;

	const response = await Machines.getMachineState(hostname);
	return res.status(200).json(response);
};

/**
 * IMAGE routes implementation
 */

export const getImages: RequestHandler = async (req, res) => {
	try {
		const images: any = await Machines.getAllImages();
		res.status(200).json(images);
	} catch (error) {
		return res
			.status(500)
			.json(
				errorMessage(
					500,
					"Failed to retrieve images: " + (error as Error).message
				)
			);
	}
};

/**
 * OPERATION routes implementation
 */

const getCurrentOperations: RequestHandler = async (req, res) => {
	try {
		const operations = await Operations.getOperations();
		res.status(200).json(operations);
	} catch (error) {
		return res
			.status(500)
			.json(
				errorMessage(
					500,
					"Failed to retrieve operations: " + (error as Error).message
				)
			);
	}
};

const getOperationStatus: RequestHandler = async (req, res) => {
	const operationId = req.params.id;

	try {
		const operation = await Operations.getOperation(operationId);
		res.status(200).json(operation);
	} catch (error) {
		return res
			.status(500)
			.json(
				errorMessage(
					500,
					"Failed to retrieve operation: " + (error as Error).message
				)
			);
	}
};

export const getClusters: RequestHandler = async (req, res) => {
	try {
		const clusters = await Cluster.getClusters();
		return res.status(200).json(clusters);
	} catch (error) {
		return res
			.status(500)
			.json(
				errorMessage(
					500,
					"Failed to retrieve clusters: " + (error as Error).message
				)
			);
	}
}

export {
	getAssignedVirtualMachines,
	getCurrentOperations,
	getOperationStatus,
	createVirtualMachine
};

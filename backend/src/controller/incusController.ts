import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { Machines } from "../incus/machines";
import { successMessage } from "../util/Success";
import { Operations } from "../incus/operations";

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

	// @TODO Validate config

	const payload: any = {
		type: "virtual-machine",
		name: hostname,
        start: true,
		source
	};
	try {
		const response = await Machines.createMachine(payload);

		if (response.status == "Failure") {
			return res
				.status(500)
				.json(
					errorMessage(
						500,
						"Incus returned an error while creating the virtual machine: " +
							response.error_code +
							" - " +
							response.error_message
					)
				);
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

export const startVirtualMachine: RequestHandler = async(req, res) => {
    const hostname = req.params.hostname;
    const force = req.body.force;

    const response = await Machines.startMachine(hostname, force)
    return res.status(200).json(response.data)
}

export const stopVirtualMachine: RequestHandler = async(req, res) => {
    const hostname = req.params.hostname;
    const force = req.body.force;

    const response = await Machines.stopMachine(hostname, force)
    return res.status(200).json(response.data)
}

export const getVirtualMachineState: RequestHandler = async (req, res) =>{
    const hostname = req.params.hostname;

    const response = await Machines.getMachineState(hostname);
    return res.status(200).json(response)
}

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

export {
	getAssignedVirtualMachines,
	getCurrentOperations,
	getOperationStatus,
	createVirtualMachine
};

import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { Machines } from "../incus/machines";
import { successMessage } from "../util/Success";
import { Operations } from "../incus/operations";

const prisma = DatabaseClient.getInstance().prisma;

const getAssignedVirtualMachines: RequestHandler = async (req, res) => {
    try {
        const vms = await prisma.virtualMachine.findMany({
            where: {
                userId: req.user?.id,
            }
        });

        const machines = await Promise.all(vms.map(async vm => {
            try {
                return await Machines.getMachine(vm.hostname)
            } catch (error) {
                throw new Error('Failed to retrieve machine from incus: ' + vm.hostname); 
            }
        }));

        res.status(200).json(machines);
    } catch (error) {
        return res.status(500).json(errorMessage(500, 'Failed to retrieve vms: ' + (error as Error).message));
    }
}

export const getImages: RequestHandler = async (req, res) => {
    try {
        const images: String[] = await Machines.getAllImages();

        const fingerprints = images.flatMap((image) => {
            return image.split("/")[3]
        });
        res.status(200).json(fingerprints);
    } catch (error) {
        return res.status(500).json(errorMessage(500, 'Failed to retrieve images: ' + (error as Error).message));
    }
}

const createVirtualMachine: RequestHandler = async (req, res) => {
    const user = req.user

    const hostname = req.body.hostname;
    const source = req.body.source;

    // @TODO Validate config

    const payload: any = {
        type: "virtual-machine",
        name: hostname,
        source,
    };
    try {
        const response = await Machines.createMachine(payload);

        if(response.status == "Failure") {
            return res.status(500).json(errorMessage(500, 'Incus returned an error while creating the virtual machine: ' + response.error_code + ' - ' + response.error_message));
        }

        await prisma.virtualMachine.create({
            data: {
                hostname: hostname,
                userId: user?.id!,
                classroomId: 1,
            }
        });

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(errorMessage(500, 'Failed to create virtual machine: ' + error));
    }

}   

const getCurrentOperations: RequestHandler = async (req, res) => {
    try {
        const operations = await Operations.getOperations();
        res.status(200).json(operations);
    } catch (error) {
        return res.status(500).json(errorMessage(500, 'Failed to retrieve operations: ' + (error as Error).message));
    }
}

const getOperationStatus: RequestHandler = async (req, res) => {
    const operationId = req.params.id;

    try {
        const operation = await Operations.getOperation(operationId);
        res.status(200).json(operation);
    } catch (error) {
        return res.status(500).json(errorMessage(500, 'Failed to retrieve operation: ' + (error as Error).message));
    }
}

export { getAssignedVirtualMachines, getCurrentOperations, getOperationStatus, createVirtualMachine };
import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { Machines } from "../incus/machines";
import { successMessage } from "../util/Success";

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

export const createVirtualMachine: RequestHandler = async (req, res) => {
    const user = req.user

    const hostname = req.body.hostname;
    const source = req.body.source;

    // @TODO Validate config

    const payload: any = {
        name: hostname,
        source,
    };

    try {
        await Machines.createMachine(payload);

        await prisma.virtualMachine.create({
            data: {
                hostname: hostname,
                userId: user?.id!,
                classroomId: 1,
            }
        });
    } catch (error) {
        return res.status(500).json(errorMessage(500, 'Failed to create virtual machine: ' + (error as Error).message));
    }


    res.status(200).json(successMessage(101, 'Virtual machine created successfully'));
}   

export { getAssignedVirtualMachines};
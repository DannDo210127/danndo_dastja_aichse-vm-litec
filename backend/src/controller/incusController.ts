import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { Machines } from "../incus/machines";

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

export { getAssignedVirtualMachines};
import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { getAllMachines, getMachine } from "../incus/machines";

const getVirtualMachine: RequestHandler = async (req, res) => {
    const machines = await getMachine(req.params.name);

    res.status(200).json(machines);
}

const getAllVirtualMachines: RequestHandler = async (req, res) => {
    const machines = await getAllMachines();

    res.status(200).json(machines);
}

export { getAllVirtualMachines, getVirtualMachine};
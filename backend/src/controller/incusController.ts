import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { getAllMachines } from "../incus/machines";

const getAllVirtualMachines: RequestHandler = async (req, res) => {
    const machines = await getAllMachines();

    res.status(200).json(machines);
}

export { getAllVirtualMachines};
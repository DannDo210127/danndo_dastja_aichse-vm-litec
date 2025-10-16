import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import DatabaseClient from "../db/client";

const prisma = DatabaseClient.getInstance().prisma;

const getUser: RequestHandler = async (req, res) => {
    res.send(req.user);
}

const getUserRole: RequestHandler = async (req, res) => {
    const role = await prisma.role.findUnique({
        where: {
            id: req.user?.roleId
        },
        relationLoadStrategy: 'join',
        include: {
            flags: true,
        }
    })

    if(!role) return res.status(404).json({ message: 'Role not found' });

    res.status(200).json(role);
};

export {
    getUser,
    getUserRole
};

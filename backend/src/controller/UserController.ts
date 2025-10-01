import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import DatabaseClient from "../db/client";

const prisma = DatabaseClient.getInstance().prisma;

const getUserRole: RequestHandler = async (req, res) => {
    const logedinUser = req.user?.email
    res.send(`User ${logedinUser} requested role of user with id ${req.params.id}`);

};

export {
    getUserRole
};

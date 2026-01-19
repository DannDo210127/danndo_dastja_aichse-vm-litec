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

const findUserById: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
}

/** 
 * Find users by their first or last name.
 * The search is case insensitive and matches any part of the name.
 * Returns a maximum of 5 users ordered by first name ascending.
 * 
 * Route: GET /user/find?query=<search_query>
 */
const findUserByName: RequestHandler = async (req, res) => {
    const searchQuery = req.query.query;

    const queryData = await prisma.userSearchView.findMany({
        where: {
            fullName: {
                contains: searchQuery as string,
                mode: 'insensitive',
            },
        },
        take: 5,
        orderBy: {
            fullName: 'asc',
        }
    });

    res.status(200).json(queryData);

}

export {
    getUser,
    getUserRole,
    findUserById,
    findUserByName
};

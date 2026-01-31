import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";

const prisma = DatabaseClient.getInstance().prisma;

/**
 * Grabs user information from cookies and returns it.
 * Works like whoami
 *
 * Route: GET /user/
 */
const getUser: RequestHandler = async (req, res) => {
	res.send(req.user);
};

/**
 * Get the role of the authenticated user.
 *
 * Route: GET /user/role
 */
const getUserRole: RequestHandler = async (req, res) => {
	const role = await prisma.role.findUnique({
		where: {
			id: req.user?.roleId
		},
		relationLoadStrategy: "join",
		include: {
			flags: true
		}
	});

	if (!role) return res.status(404).json(errorMessage(5, "Role not found"));

	res.status(200).json(role);
};

/**
 * Find a user by their ID.
 *
 * Route: GET /user/:id
 */
const findUserById: RequestHandler = async (req, res) => {
	const id = parseInt(req.params.id);

	if (isNaN(id) || !id) {
		return res.status(400).json(errorMessage(3, "User ID is not valid"));
	}

	const user = await prisma.user.findUnique({
		where: {
			id
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			role: true
		}
	});

	if (!user) {
		return res.status(404).json(errorMessage(4, "User not found"));
	}

	res.status(200).json(user);
};

/**
 * Find users by their first or last name.
 * The search is case insensitive and matches any part of the name.
 * Returns a maximum of 5 users ordered by first name ascending.
 *
 * Route: GET /user/find?query=<search_query>
 */
const findUserByName: RequestHandler = async (req, res) => {
	const searchQuery = req.query.query;

	if (!searchQuery || typeof searchQuery !== "string") {
		return res
			.status(400)
			.json(errorMessage(1, "Query parameter is not valid", true));
	}

	const queryData = await prisma.userSearchView.findMany({
		where: {
			fullName: {
				contains: searchQuery as string,
				mode: "insensitive"
			}
		},
		orderBy: {
			fullName: "asc"
		},
		take: 5
	});

	if (queryData.length === 0 || !queryData) {
		return res.status(404).json(errorMessage(2, "No user found", true));
	}

	res.status(200).json(queryData);
};

export { getUser, getUserRole, findUserById, findUserByName };

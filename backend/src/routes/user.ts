import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import {
	findUserById,
	findUserByName,
	getUser,
	getUserRole
} from "../controller/UserController";

const UserRouter = Router();

UserRouter.get("/", isAuthenticated, getUser);
UserRouter.get("/role", isAuthenticated, getUserRole);
UserRouter.get("/find", findUserByName);
UserRouter.get("/:id", findUserById);

export default UserRouter;

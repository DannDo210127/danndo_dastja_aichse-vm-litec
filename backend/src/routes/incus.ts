import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import {
	createVirtualMachine,
	getAssignedVirtualMachines,
	getCurrentOperations,
	getImages,
	getOperationStatus
} from "../controller/incusController";

const router = Router();

// Get all assigned virtual machines for the authenticated user
router.get("/machines", isAuthenticated, getAssignedVirtualMachines);
router.get("/images", isAuthenticated, getImages);
router.get("/operations", getCurrentOperations);
router.get("/operations/:id", getOperationStatus);

router.post("/machines/new", isAuthenticated, createVirtualMachine);

export default router;

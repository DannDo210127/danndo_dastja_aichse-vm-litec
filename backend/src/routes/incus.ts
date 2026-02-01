import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import {
	createVirtualMachine,
	getAssignedVirtualMachines,
	getCurrentOperations,
	getImages,
	getOperationStatus,
	getVirtualMachineState,
	startVirtualMachine,
	stopVirtualMachine
} from "../controller/incusController";

const router = Router();

// Get all assigned virtual machines for the authenticated user
router.get("/machines", isAuthenticated, getAssignedVirtualMachines);
router.get(
	"/machines/:hostname/state",
	isAuthenticated,
	getVirtualMachineState
);

router.get("/images", isAuthenticated, getImages);

router.get("/operations", getCurrentOperations);
router.get("/operations/:id", getOperationStatus);

router.post("/machines/new", isAuthenticated, createVirtualMachine);

router.put("/machines/:hostname/start", startVirtualMachine);
router.put("/machines/:hostname/stop", stopVirtualMachine);

export default router;

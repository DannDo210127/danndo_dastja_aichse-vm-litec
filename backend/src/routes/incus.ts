import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import {
	createVirtualMachine,
	deleteVirtualMachine,
	getAssignedVirtualMachines,
	getClusters,
	getCurrentOperations,
	getImages,
	getOperationStatus,
	getVirtualMachineState,
	startVirtualMachine,
	stopVirtualMachine
} from "../controller/IncusController";

const router = Router();

// Get all assigned virtual machines for the authenticated user
router.get("/machines", isAuthenticated, getAssignedVirtualMachines);
router.get(
	"/machines/:hostname/state",
	isAuthenticated,
	getVirtualMachineState
);

router.get("/images", isAuthenticated, getImages);

router.get("/operations", isAuthenticated, getCurrentOperations);
router.get("/operations/:id", isAuthenticated, getOperationStatus);

router.get("/clusters", isAuthenticated, getClusters);

router.post("/machines/new", isAuthenticated, createVirtualMachine);

router.put("/machines/:hostname/start", isAuthenticated, startVirtualMachine);
router.put("/machines/:hostname/stop", isAuthenticated, stopVirtualMachine);

router.delete("/machines/:hostname", isAuthenticated, deleteVirtualMachine);

export default router;

import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { getAssignedVirtualMachines } from '../controller/incusController';
const router = Router();

// Get all assigned virtual machines for the authenticated user
router.get('/machines', isAuthenticated, getAssignedVirtualMachines);

export default router;
import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { getAllVirtualMachines, getVirtualMachine } from '../controller/incusController';
const router = Router();

router.get('/machine/:name', isAuthenticated, getVirtualMachine);
router.get('/machines', isAuthenticated, getAllVirtualMachines);

export default router;
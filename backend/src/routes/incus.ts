import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { getAllVirtualMachines } from '../controller/incusController';
const router = Router();

router.get('/machines', isAuthenticated, getAllVirtualMachines);

export default router;
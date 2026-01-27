import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { getAllVirtualMachines } from '../controller/IncusController';
const router = Router();

router.get('/machines', isAuthenticated, getAllVirtualMachines);

export default router;
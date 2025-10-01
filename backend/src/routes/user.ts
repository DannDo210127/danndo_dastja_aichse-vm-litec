import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { getUserRole } from '../controller/UserController';

const UserRouter = Router();

UserRouter.get('/:id/role', isAuthenticated, getUserRole);

export default UserRouter;
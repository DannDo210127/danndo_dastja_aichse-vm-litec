import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { getUser, getUserRole } from '../controller/UserController';

const UserRouter = Router();

UserRouter.get('/', isAuthenticated, getUser);
UserRouter.get('/role', isAuthenticated, getUserRole);

export default UserRouter;
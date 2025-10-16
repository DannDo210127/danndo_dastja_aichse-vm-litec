import { Router } from 'express';
import { login, logout, register, token } from '../controller/AuthentificationController';
import { isAuthenticated } from '../middleware/authentication';

const AuthentificationRouter = Router();

AuthentificationRouter.post('/login', login);
AuthentificationRouter.post('/register', register);
AuthentificationRouter.post('/token', token);
AuthentificationRouter.post('/logout', isAuthenticated,logout);

export default AuthentificationRouter;
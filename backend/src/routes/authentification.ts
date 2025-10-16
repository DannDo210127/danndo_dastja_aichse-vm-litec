import { Router } from 'express';
import { login, register, token } from '../controller/AuthentificationController';

const AuthentificationRouter = Router();

AuthentificationRouter.post('/login', login);
AuthentificationRouter.post('/register', register);
AuthentificationRouter.post('/token', token);

export default AuthentificationRouter;
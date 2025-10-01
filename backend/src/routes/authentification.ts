import { Router } from 'express';
import { login } from '../controller/AuthentificationController';

const AuthentificationRouter = Router();

AuthentificationRouter.get('/login', login);

export default AuthentificationRouter;
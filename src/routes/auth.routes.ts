import { Router } from 'express';
import * as AuthController from '../controller/auth.controller';

const authRouter = Router();

// Rotas de autenticação
authRouter.post('/login', AuthController.login);
authRouter.post('/registrar', AuthController.registrar);

export default authRouter;

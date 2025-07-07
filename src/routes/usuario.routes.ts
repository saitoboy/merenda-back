import { Router } from 'express';
import * as UsuarioController from '../controller/usuario.controller';
import { autenticar } from '../middleware/auth.middleware';

const usuarioRouter = Router();

// Endpoint de alteração de senha
usuarioRouter.put('/:id_usuario/senha', autenticar, UsuarioController.alterarSenhaUsuario);

export default usuarioRouter;

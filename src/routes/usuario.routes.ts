import { Router } from 'express';
import * as UsuarioController from '../controller/usuario.controller';
import { autenticar } from '../middleware/auth.middleware';
import { autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const usuarioRouter = Router();

// Listar todos os usuários (apenas ADMIN)
usuarioRouter.get('/', autenticar, autorizarPor([TipoUsuario.ADMIN]), UsuarioController.listarUsuarios);

// Endpoint de alteração de senha
usuarioRouter.put('/:id_usuario/senha', autenticar, UsuarioController.alterarSenhaUsuario);

export default usuarioRouter;

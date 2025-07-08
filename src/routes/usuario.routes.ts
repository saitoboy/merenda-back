import { Router } from 'express';
import * as UsuarioController from '../controller/usuario.controller';
import { autenticar } from '../middleware/auth.middleware';
import { autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const usuarioRouter = Router();

// Listar todos os usuários (apenas ADMIN)
usuarioRouter.get('/', autenticar, autorizarPor([TipoUsuario.ADMIN]), UsuarioController.listarUsuarios);

// Buscar usuário por ID (admin ou próprio usuário)
usuarioRouter.get('/:id_usuario', autenticar, UsuarioController.buscarUsuarioPorId);

// Criar usuário (apenas ADMIN)
usuarioRouter.post('/', autenticar, autorizarPor([TipoUsuario.ADMIN]), UsuarioController.criarUsuario);

// Atualizar usuário (admin ou próprio usuário)
usuarioRouter.patch('/:id_usuario', autenticar, UsuarioController.atualizarUsuario);

// Endpoint de alteração de senha
usuarioRouter.put('/:id_usuario/senha', autenticar, UsuarioController.alterarSenhaUsuario);

// Excluir usuário (apenas ADMIN)
usuarioRouter.delete('/:id_usuario', autenticar, autorizarPor([TipoUsuario.ADMIN]), UsuarioController.excluirUsuario);

export default usuarioRouter;

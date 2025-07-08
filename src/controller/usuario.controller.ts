import { Request, Response } from 'express';
// Verifique se o arquivo existe em ../services/usuario.service.ts
// Caso não exista, crie o arquivo ou ajuste o caminho de importação conforme necessário.
import * as UsuarioService from '../services/usuario.service';
import { logger } from '../utils';
import { TipoUsuario } from '../types';

// PUT /usuarios/:id_usuario/senha
export const alterarSenhaUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const { senha_atual, nova_senha } = req.body;
    const usuarioAuth = req.usuario;

    if (!nova_senha) {
      res.status(400).json({ status: 'erro', mensagem: 'Nova senha é obrigatória' });
      return;
    }

    if (!usuarioAuth) {
      res.status(401).json({ status: 'erro', mensagem: 'Não autenticado' });
      return;
    }

    const isAdmin = usuarioAuth.tipo === TipoUsuario.ADMIN;
    const isSelf = usuarioAuth.id === id_usuario;

    if (!isAdmin && !isSelf) {
      res.status(403).json({ status: 'erro', mensagem: 'Acesso negado' });
      return;
    }

    // Usuário comum precisa informar senha atual, admin não precisa
    if (!isAdmin && !senha_atual) {
      res.status(400).json({ status: 'erro', mensagem: 'Senha atual é obrigatória' });
      return;
    }

    await UsuarioService.alterarSenha({
      id_usuario,
      nova_senha,
      senha_atual: isAdmin ? undefined : senha_atual,
      isAdmin
    });

    res.status(200).json({ status: 'sucesso', mensagem: isAdmin ? 'Senha redefinida com sucesso' : 'Senha alterada com sucesso' });
  } catch (error) {
    logger.error(`Erro ao alterar senha: ${error instanceof Error ? error.message : error}`);
    if (error instanceof Error && error.message === 'Usuário não encontrado') {
      res.status(404).json({ status: 'erro', mensagem: error.message });
    } else if (error instanceof Error && error.message === 'Senha atual incorreta') {
      res.status(400).json({ status: 'erro', mensagem: error.message });
    } else {
      res.status(500).json({ status: 'erro', mensagem: 'Erro interno do servidor' });
    }
  }
};

// GET /usuarios (apenas ADMIN)
export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioAuth = req.usuario;
    if (!usuarioAuth || usuarioAuth.tipo !== TipoUsuario.ADMIN) {
      res.status(403).json({ status: 'erro', mensagem: 'Acesso negado' });
      return;
    }
    const usuarios = await UsuarioService.listarUsuarios();
    res.status(200).json({ status: 'sucesso', mensagem: 'Usuários listados com sucesso', dados: usuarios });
  } catch (error) {
    logger.error(`Erro ao listar usuários: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ status: 'erro', mensagem: 'Erro ao listar usuários' });
  }
};

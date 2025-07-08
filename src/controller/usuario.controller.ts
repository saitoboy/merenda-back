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

// GET /usuarios/:id_usuario (admin ou próprio usuário)
export const buscarUsuarioPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const usuarioAuth = req.usuario;
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
    const usuario = await UsuarioService.buscarUsuarioPorId(id_usuario);
    if (!usuario) {
      res.status(404).json({ status: 'erro', mensagem: 'Usuário não encontrado' });
      return;
    }
    res.status(200).json({ status: 'sucesso', dados: usuario });
  } catch (error) {
    logger.error(`Erro ao buscar usuário: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ status: 'erro', mensagem: 'Erro ao buscar usuário' });
  }
};

// POST /usuarios (apenas admin)
export const criarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioAuth = req.usuario;
    if (!usuarioAuth || usuarioAuth.tipo !== TipoUsuario.ADMIN) {
      res.status(403).json({ status: 'erro', mensagem: 'Acesso negado' });
      return;
    }
    const dados = req.body;
    if (!dados.nome_usuario || !dados.email_usuario || !dados.senha_usuario || !dados.tipo_usuario) {
      res.status(400).json({ status: 'erro', mensagem: 'Campos obrigatórios não informados' });
      return;
    }
    const usuario = await UsuarioService.criarUsuario(dados);
    res.status(201).json({ status: 'sucesso', mensagem: 'Usuário criado com sucesso', dados: usuario });
  } catch (error) {
    logger.error(`Erro ao criar usuário: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ status: 'erro', mensagem: 'Erro ao criar usuário' });
  }
};

// PUT /usuarios/:id_usuario (admin ou próprio usuário)
export const atualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const usuarioAuth = req.usuario;
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
    const dados = req.body;
    // Não permitir alteração de senha por aqui
    if ('senha_usuario' in dados) delete dados.senha_usuario;
    const usuario = await UsuarioService.atualizarUsuario(id_usuario, dados);
    if (!usuario) {
      res.status(404).json({ status: 'erro', mensagem: 'Usuário não encontrado' });
      return;
    }
    res.status(200).json({ status: 'sucesso', mensagem: 'Usuário atualizado com sucesso', dados: usuario });
  } catch (error) {
    logger.error(`Erro ao atualizar usuário: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ status: 'erro', mensagem: 'Erro ao atualizar usuário' });
  }
};

// DELETE /usuarios/:id_usuario (apenas admin)
export const excluirUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const usuarioAuth = req.usuario;
    if (!usuarioAuth || usuarioAuth.tipo !== TipoUsuario.ADMIN) {
      res.status(403).json({ status: 'erro', mensagem: 'Acesso negado' });
      return;
    }
    await UsuarioService.excluirUsuario(id_usuario);
    res.status(200).json({ status: 'sucesso', mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    logger.error(`Erro ao excluir usuário: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ status: 'erro', mensagem: 'Erro ao excluir usuário' });
  }
};

import * as UsuarioModel from '../model/usuario.model';
import { compararSenha, criptografarSenha, logger } from '../utils';
import { TipoUsuario, Usuario } from '../types';

interface AlterarSenhaParams {
  id_usuario: string;
  nova_senha: string;
  senha_atual?: string;
  isAdmin: boolean;
}

export const alterarSenha = async ({ id_usuario, nova_senha, senha_atual, isAdmin }: AlterarSenhaParams): Promise<void> => {
  const usuario = await UsuarioModel.buscarPorId(id_usuario);
  if (!usuario) throw new Error('Usuário não encontrado');

  if (!isAdmin) {
    if (!senha_atual) throw new Error('Senha atual é obrigatória');
    const senhaCorreta = await compararSenha(senha_atual, usuario.senha_usuario);
    if (!senhaCorreta) throw new Error('Senha atual incorreta');
  }

  const senhaCriptografada = await criptografarSenha(nova_senha);
  await UsuarioModel.alterarSenha(id_usuario, senhaCriptografada);
  logger.info(`Senha alterada para usuário ${id_usuario}`);
};

export const listarUsuarios = async (): Promise<Omit<Usuario, 'senha_usuario'>[]> => {
  const usuarios = await UsuarioModel.listarTodos();
  // Remove o campo senha_usuario de cada usuário
  return usuarios.map(({ senha_usuario, ...rest }) => rest);
};

export const buscarUsuarioPorId = async (id_usuario: string): Promise<Omit<Usuario, 'senha_usuario'> | null> => {
  const usuario = await UsuarioModel.buscarPorId(id_usuario);
  if (!usuario) return null;
  // Remove o campo senha_usuario
  const { senha_usuario, ...rest } = usuario;
  return rest;
};

export const criarUsuario = async (dados: Omit<Usuario, 'id_usuario'>): Promise<Omit<Usuario, 'senha_usuario'>> => {
  // Criptografa a senha antes de salvar
  const senhaCriptografada = await criptografarSenha(dados.senha_usuario);
  const usuarioParaCriar = { ...dados, senha_usuario: senhaCriptografada };
  const id_usuario = await UsuarioModel.criar(usuarioParaCriar);
  const usuarioCriado = await UsuarioModel.buscarPorId(id_usuario);
  if (!usuarioCriado) throw new Error('Erro ao criar usuário');
  const { senha_usuario, ...rest } = usuarioCriado;
  return rest;
};

export const atualizarUsuario = async (id_usuario: string, dados: Partial<Omit<Usuario, 'id_usuario' | 'senha_usuario'>>): Promise<Omit<Usuario, 'senha_usuario'> | null> => {
  await UsuarioModel.atualizar(id_usuario, dados);
  const usuarioAtualizado = await UsuarioModel.buscarPorId(id_usuario);
  if (!usuarioAtualizado) return null;
  const { senha_usuario, ...rest } = usuarioAtualizado;
  return rest;
};

export const excluirUsuario = async (id_usuario: string): Promise<void> => {
  await UsuarioModel.excluir(id_usuario);
};

import * as UsuarioModel from '../model/usuario.model';
import { compararSenha, criptografarSenha, logger } from '../utils';
import { TipoUsuario } from '../types';

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

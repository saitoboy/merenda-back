import connection from '../connection';
import { Usuario } from '../types';

const table = 'usuario';

// Buscar usuário por ID
export const buscarPorId = async (id_usuario: string): Promise<Usuario | undefined> => {
  const usuario = await connection(table)
    .where({ id_usuario })
    .first();

  return usuario;
};

// Buscar usuário por email
export const buscarPorEmail = async (email_usuario: string): Promise<Usuario | undefined> => {
  const usuario = await connection(table)
    .where({ email_usuario })
    .first();

  return usuario;
};

// Buscar usuários por escola
export const buscarPorEscola = async (id_escola: string): Promise<Usuario[]> => {
  const usuarios = await connection(table)
    .where({ id_escola })
    .select('*');

  return usuarios;
};

// Criar novo usuário
export const criar = async (usuario: Omit<Usuario, 'id_usuario'>): Promise<string> => {
  const [result] = await connection(table)
    .insert(usuario)
    .returning('id_usuario');

  // Verificar se o resultado é um objeto ou string
  if (typeof result === 'object' && result !== null) {
    return result.id_usuario || result;
  }

  return result;
};

// Criar usuários em lote
export const criarEmLote = async (usuarios: Array<Omit<any, 'id_usuario'>>): Promise<string[]> => {
  const results = await connection('usuario')
    .insert(usuarios)
    .returning('id_usuario');
  // Garante array de ids
  return results.map(r => r.id_usuario || r);
};

// Atualizar usuário
export const atualizar = async (id_usuario: string, dados: Partial<Usuario>): Promise<void> => {
  await connection(table)
    .where({ id_usuario })
    .update(dados);
};

// Excluir usuário
export const excluir = async (id_usuario: string): Promise<void> => {
  await connection(table)
    .where({ id_usuario })
    .delete();
};

// Alterar senha de um usuário
export const alterarSenha = async (id_usuario: string, nova_senha: string): Promise<void> => {
  await connection(table)
    .where({ id_usuario })
    .update({ senha_usuario: nova_senha });
};

// Listar todos os usuários
export const listarTodos = async (): Promise<Usuario[]> => {
  const usuarios = await connection(table)
    .select('*');

  return usuarios;
};

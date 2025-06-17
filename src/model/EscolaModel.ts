import connection from '../connection';
import { Escola } from '../types';

const table = 'escola';

// Buscar escola por ID
export const buscarPorId = async (id_escola: string): Promise<Escola | undefined> => {
  const escola = await connection(table)
    .where({ id_escola })
    .first();
  
  return escola;
};

// Buscar escola por email
export const buscarPorEmail = async (email_escola: string): Promise<Escola | undefined> => {
  const escola = await connection(table)
    .where({ email_escola })
    .first();
  
  return escola;
};

// Criar nova escola
export const criar = async (escola: Omit<Escola, 'id_escola'>): Promise<string> => {
  const [id] = await connection(table)
    .insert(escola)
    .returning('id_escola');
  
  return id;
};

// Atualizar escola
export const atualizar = async (id_escola: string, dados: Partial<Escola>): Promise<void> => {
  await connection(table)
    .where({ id_escola })
    .update(dados);
};

// Excluir escola
export const excluir = async (id_escola: string): Promise<void> => {
  await connection(table)
    .where({ id_escola })
    .delete();
};

// Listar todas as escolas
export const listarTodas = async (): Promise<Escola[]> => {
  const escolas = await connection(table)
    .select('*');
  
  return escolas;
};

// Buscar escolas por segmento
export const buscarPorSegmento = async (segmento_escola: string): Promise<Escola[]> => {
  const escolas = await connection(table)
    .where({ segmento_escola })
    .select('*');
  
  return escolas;
};

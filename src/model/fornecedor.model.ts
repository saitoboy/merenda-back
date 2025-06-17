import connection from '../connection';
import { Fornecedor } from '../types';

const table = 'fornecedor';

// Buscar fornecedor por ID
export const buscarPorId = async (id_fornecedor: string): Promise<Fornecedor | undefined> => {
  const fornecedor = await connection(table)
    .where({ id_fornecedor })
    .first();
  
  return fornecedor;
};

// Buscar fornecedor por email
export const buscarPorEmail = async (email_fornecedor: string): Promise<Fornecedor | undefined> => {
  const fornecedor = await connection(table)
    .where({ email_fornecedor })
    .first();
  
  return fornecedor;
};

// Buscar fornecedor por CNPJ
export const buscarPorCnpj = async (cnpj_fornecedor: string): Promise<Fornecedor | undefined> => {
  const fornecedor = await connection(table)
    .where({ cnpj_fornecedor })
    .first();
  
  return fornecedor;
};

// Criar novo fornecedor
export const criar = async (fornecedor: Omit<Fornecedor, 'id_fornecedor'>): Promise<string> => {
  const [id] = await connection(table)
    .insert(fornecedor)
    .returning('id_fornecedor');
  
  return id;
};

// Atualizar fornecedor
export const atualizar = async (id_fornecedor: string, dados: Partial<Fornecedor>): Promise<void> => {
  await connection(table)
    .where({ id_fornecedor })
    .update(dados);
};

// Excluir fornecedor
export const excluir = async (id_fornecedor: string): Promise<void> => {
  await connection(table)
    .where({ id_fornecedor })
    .delete();
};

// Listar todos os fornecedores
export const listarTodos = async (): Promise<Fornecedor[]> => {
  const fornecedores = await connection(table)
    .select('*');
  
  return fornecedores;
};

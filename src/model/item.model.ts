import connection from '../connection';
import { Item } from '../types';

const table = 'item';

// Buscar item por ID
export const buscarPorId = async (id_item: string): Promise<Item | undefined> => {
  const item = await connection(table)
    .where({ id_item })
    .first();
  
  return item;
};

// Buscar itens por fornecedor
export const buscarPorFornecedor = async (id_fornecedor: string): Promise<Item[]> => {
  const itens = await connection(table)
    .where({ id_fornecedor })
    .select('*');
  
  return itens;
};

// Buscar itens por sazonalidade
export const buscarPorSazonalidade = async (sazonalidade: string): Promise<Item[]> => {
  const itens = await connection(table)
    .where({ sazonalidade })
    .select('*');
  
  return itens;
};

// Criar novo item
export const criar = async (item: Omit<Item, 'id_item'>): Promise<string> => {
  const [id] = await connection(table)
    .insert(item)
    .returning('id_item');
  
  return id;
};

// Atualizar item
export const atualizar = async (id_item: string, dados: Partial<Item>): Promise<void> => {
  await connection(table)
    .where({ id_item })
    .update(dados);
};

// Excluir item
export const excluir = async (id_item: string): Promise<void> => {
  await connection(table)
    .where({ id_item })
    .delete();
};

// Listar todos os itens
export const listarTodos = async (): Promise<Item[]> => {
  const itens = await connection(table)
    .select('*');
  
  return itens;
};

// Buscar itens próximos da validade (em dias)
export const buscarProximosValidade = async (dias: number): Promise<Item[]> => {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + dias);
  
  const itens = await connection(table)
    .where('validade', '<=', dataLimite)
    .andWhere('validade', '>=', new Date())
    .select('*');
  
  return itens;
};

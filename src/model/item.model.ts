import connection from '../connection';
import { Item } from '../types';

const table = 'item';

// Listar todos os itens
export const listarTodos = async (): Promise<Item[]> => {
  const itens = await connection(table)
    .select('*')
    .orderBy('nome_item');
  
  return itens;
};

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

// Calcular preço médio de todos os itens
export const calcularPrecoMedio = async () => {
  const resultado = await connection(table)
    .avg('preco_item as preco_medio')
    .count('* as total_itens')
    .min('preco_item as preco_minimo')
    .max('preco_item as preco_maximo')
    .first();
  
  return {
    preco_medio: parseFloat(resultado?.preco_medio || '0'),
    total_itens: parseInt(resultado?.total_itens || '0'),
    preco_minimo: parseFloat(resultado?.preco_minimo || '0'),
    preco_maximo: parseFloat(resultado?.preco_maximo || '0')
  };
};

// Calcular preço médio por fornecedor
export const calcularPrecoMedioPorFornecedor = async () => {
  const resultados = await connection(table)
    .join('fornecedor', 'item.id_fornecedor', '=', 'fornecedor.id_fornecedor')
    .select(
      'fornecedor.id_fornecedor',
      'fornecedor.nome_fornecedor'
    )
    .avg('item.preco_item as preco_medio')
    .count('item.id_item as total_itens')
    .min('item.preco_item as preco_minimo')
    .max('item.preco_item as preco_maximo')
    .groupBy('fornecedor.id_fornecedor', 'fornecedor.nome_fornecedor')
    .orderBy('fornecedor.nome_fornecedor');
  
  return resultados.map(resultado => ({
    id_fornecedor: resultado.id_fornecedor,
    nome_fornecedor: resultado.nome_fornecedor,
    preco_medio: parseFloat(resultado.preco_medio || '0'),
    total_itens: parseInt(resultado.total_itens || '0'),
    preco_minimo: parseFloat(resultado.preco_minimo || '0'),
    preco_maximo: parseFloat(resultado.preco_maximo || '0')
  }));
};

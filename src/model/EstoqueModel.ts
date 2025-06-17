import connection from '../connection';
import { Estoque } from '../types';
import knex from 'knex';

const table = 'estoque';

// Buscar item de estoque por escola e item
export const buscar = async (id_escola: string, id_item: string): Promise<Estoque | undefined> => {
  const estoqueItem = await connection(table)
    .where({ id_escola, id_item })
    .first();
  
  return estoqueItem;
};

// Buscar itens de estoque por escola
export const buscarPorEscola = async (id_escola: string): Promise<Estoque[]> => {
  const estoqueItens = await connection(table)
    .where({ id_escola })
    .select('*');
  
  return estoqueItens;
};

// Buscar detalhes completos do estoque com informações do item
export const buscarDetalhesEstoquePorEscola = async (id_escola: string) => {
  const estoqueDetalhado = await connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .where('estoque.id_escola', id_escola)
    .select(
      'estoque.*',
      'item.nome_item',
      'item.unidade_medida',
      'item.validade',
      'item.preco_item'
    );
  
  return estoqueDetalhado;
};

// Buscar itens com estoque abaixo do ideal
export const buscarItensAbaixoIdeal = async (id_escola: string) => {
  const itensAbaixoIdeal = await connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .where('estoque.id_escola', id_escola)
    .andWhereRaw('estoque.quantidade_item < estoque.numero_ideal')
    .select(
      'estoque.*',
      'item.nome_item',
      'item.unidade_medida',
      'item.validade',
      'item.preco_item'
    );
  
  return itensAbaixoIdeal;
};

// Criar novo item de estoque
export const criar = async (estoque: Estoque): Promise<void> => {
  await connection(table).insert(estoque);
};

// Atualizar quantidade de um item no estoque
export const atualizarQuantidade = async (id_escola: string, id_item: string, quantidade_item: number): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item })
    .update({ quantidade_item });
};

// Atualizar número ideal de um item no estoque
export const atualizarNumeroIdeal = async (id_escola: string, id_item: string, numero_ideal: number): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item })
    .update({ numero_ideal });
};

// Atualizar item de estoque
export const atualizar = async (id_escola: string, id_item: string, dados: Partial<Estoque>): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item })
    .update(dados);
};

// Remover item de estoque
export const remover = async (id_escola: string, id_item: string): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item })
    .delete();
};

// Obter métricas de estoque para dashboard
export const obterMetricasEstoque = async (id_escola: string) => {
  const totalItens = await connection(table)
    .where({ id_escola })
    .count('* as total')
    .first();
  
  const abaixoIdeal = await connection(table)
    .where({ id_escola })
    .whereRaw('quantidade_item < numero_ideal')
    .count('* as total')
    .first();
    // Join para buscar itens próximos da validade
  const dataAtual = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + 7);
  
  const proximosValidade = await connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .where('estoque.id_escola', id_escola)
    .andWhere('item.validade', '<=', dataLimite)
    .andWhere('item.validade', '>=', dataAtual)
    .count('* as total')
    .first();
  
  return {
    total_itens: totalItens?.total || 0,
    itens_baixo_estoque: abaixoIdeal?.total || 0,
    itens_proximos_validade: proximosValidade?.total || 0
  };
};

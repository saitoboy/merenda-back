import connection from '../connection';
import { Estoque } from '../types';
import knex from 'knex';

const table = 'estoque';

// Buscar item de estoque por escola e item
export const buscar = async (id_escola: string, id_item: string, segmento_estoque: string = 'escola'): Promise<Estoque | undefined> => {
  const estoqueItem = await connection(table)
    .where({ id_escola, id_item, segmento_estoque })
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
export const buscarDetalhesEstoquePorEscola = async (id_escola: string, segmento?: string) => {
  const query = connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .where('estoque.id_escola', id_escola);
  
  // Filtrar por segmento se especificado
  if (segmento) {
    query.andWhere('estoque.segmento_estoque', segmento);
  }
  
  const estoqueDetalhado = await query.select(
    'estoque.*',
    'item.nome_item',
    'item.unidade_medida',
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
      'item.preco_item'
    );
  
  return itensAbaixoIdeal;
};

// Criar novo item de estoque
export const criar = async (estoque: Estoque): Promise<void> => {
  await connection(table).insert(estoque);
};

// Atualizar quantidade de um item no estoque
export const atualizarQuantidade = async (id_escola: string, id_item: string, quantidade_item: number, segmento_estoque: string = 'escola'): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item, segmento_estoque })
    .update({ quantidade_item });
};

// Atualizar número ideal de um item no estoque
export const atualizarNumeroIdeal = async (id_escola: string, id_item: string, numero_ideal: number, segmento_estoque: string = 'escola'): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item, segmento_estoque })
    .update({ numero_ideal });
};

// Atualizar item de estoque
export const atualizar = async (id_escola: string, id_item: string, dados: Partial<Estoque>, segmento_estoque: string = 'escola'): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item, segmento_estoque })
    .update(dados);
};

// Remover item de estoque
export const remover = async (id_escola: string, id_item: string, segmento_estoque: string = 'escola'): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_item, segmento_estoque })
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
    
  // Buscar itens próximos da validade (agora no estoque)
  const dataAtual = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + 7);
  
  const proximosValidade = await connection(table)
    .where('id_escola', id_escola)
    .andWhere('validade', '<=', dataLimite)
    .andWhere('validade', '>=', dataAtual)
    .whereNotNull('validade')
    .count('* as total')
    .first();
  
  return {
    total_itens: totalItens?.total || 0,
    itens_baixo_estoque: abaixoIdeal?.total || 0,
    itens_proximos_validade: proximosValidade?.total || 0
  };
};

// Definir valores ideais em lote
export const definirIdeaisEmLote = async (ideais: Array<{id_escola: string, id_item: string, segmento_estoque?: string, numero_ideal: number}>) => {
  // Usar transaction para garantir que todas as operações tenham sucesso
  return await connection.transaction(async (trx) => {
    const resultados = [];

    // Para cada item na lista de ideais
    for (const ideal of ideais) {
      const segmento = ideal.segmento_estoque || 'escola'; // Default para 'escola' se não for especificado
      
      // Verificar se o item já existe no estoque
      const itemExistente = await trx(table)
        .where({
          id_escola: ideal.id_escola,
          id_item: ideal.id_item,
          segmento_estoque: segmento
        })
        .first();

      if (itemExistente) {
        // Atualizar apenas o número ideal
        await trx(table)
          .where({
            id_escola: ideal.id_escola,
            id_item: ideal.id_item,
            segmento_estoque: segmento
          })
          .update({
            numero_ideal: ideal.numero_ideal
          });
          
        resultados.push({
          id_escola: ideal.id_escola,
          id_item: ideal.id_item,
          segmento_estoque: segmento,
          numero_ideal: ideal.numero_ideal,
          acao: 'atualizado'
        });
      } else {
        // Criar novo registro de estoque com quantidade inicial zero
        await trx(table).insert({
          id_escola: ideal.id_escola,
          id_item: ideal.id_item,
          segmento_estoque: segmento,
          quantidade_item: 0, // Inicia com quantidade zero
          numero_ideal: ideal.numero_ideal
        });
        
        resultados.push({
          id_escola: ideal.id_escola,
          id_item: ideal.id_item,
          segmento_estoque: segmento,
          numero_ideal: ideal.numero_ideal,
          acao: 'criado'
        });
      }
    }

    return resultados;
  });
};

// Buscar itens próximos da validade no estoque (em dias)
export const buscarProximosValidade = async (id_escola: string, dias: number) => {
  const dataAtual = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + dias);
  
  const itensProximos = await connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .where('estoque.id_escola', id_escola)
    .andWhere('estoque.validade', '<=', dataLimite)
    .andWhere('estoque.validade', '>=', dataAtual)
    .whereNotNull('estoque.validade')
    .select(
      'estoque.*',
      'item.nome_item',
      'item.unidade_medida',
      'item.preco_item',
      connection.raw('(estoque.validade - CURRENT_DATE) as dias_restantes')
    )
    .orderBy('estoque.validade', 'asc');
  
  return itensProximos;
};

// Buscar segmentos de estoque distintos de uma escola
export const buscarSegmentosPorEscola = async (id_escola: string) => {
  const segmentos = await connection(table)
    .where('id_escola', id_escola)
    .distinct('segmento_estoque')
    .select('segmento_estoque')
    .orderBy('segmento_estoque');
  
  return segmentos.map(s => s.segmento_estoque);
};

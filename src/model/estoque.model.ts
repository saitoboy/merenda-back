import connection from '../connection';
import { Estoque, CriarEstoque, AtualizarEstoque, EstoqueCompleto, FiltroEstoque } from '../types';

const table = 'estoque';

// Tipo para resultado da operação de definir ideais
type ResultadoIdeal = {
  id_estoque: string;
  acao: 'atualizado' | 'criado';
} & Pick<CriarEstoque, 'id_escola' | 'id_item' | 'id_segmento' | 'id_periodo' | 'numero_ideal'>;

// Buscar item de estoque por ID
export const buscarPorId = async (id_estoque: string): Promise<Estoque | undefined> => {
  const estoqueItem = await connection(table)
    .where({ id_estoque })
    .first();
  
  return estoqueItem;
};

// Buscar item de estoque por chaves compostas (escola, item, segmento, período)
export const buscar = async (id_escola: string, id_item: string, id_segmento: string, id_periodo: string): Promise<Estoque | undefined> => {
  const estoqueItem = await connection(table)
    .where({ id_escola, id_item, id_segmento, id_periodo })
    .first();
  
  return estoqueItem;
};

// Buscar itens de estoque por escola
export const buscarPorEscola = async (id_escola: string, filtros?: FiltroEstoque): Promise<Estoque[]> => {
  let query = connection(table)
    .where({ id_escola });
  
  // Aplicar filtros adicionais se fornecidos
  if (filtros?.id_segmento) {
    query = query.andWhere('id_segmento', filtros.id_segmento);
  }
  
  if (filtros?.id_periodo) {
    query = query.andWhere('id_periodo', filtros.id_periodo);
  }
  
  if (filtros?.id_item) {
    query = query.andWhere('id_item', filtros.id_item);
  }
  
  if (filtros?.quantidade_minima) {
    query = query.andWhere('quantidade_item', '>=', filtros.quantidade_minima);
  }
  
  if (filtros?.validade_proxima) {
    query = query.andWhere('validade', '<=', filtros.validade_proxima);
  }
  
  const estoqueItens = await query.select('*');
  
  return estoqueItens;
};

// Buscar detalhes completos do estoque com informações relacionadas
export const buscarDetalhesEstoquePorEscola = async (id_escola: string, filtros?: FiltroEstoque): Promise<EstoqueCompleto[]> => {
  let query = connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .join('escola', 'estoque.id_escola', '=', 'escola.id_escola')
    .join('segmento', 'estoque.id_segmento', '=', 'segmento.id_segmento')
    .join('periodo_lancamento', 'estoque.id_periodo', '=', 'periodo_lancamento.id_periodo')
    .where('estoque.id_escola', id_escola);
  
  // Aplicar filtros se fornecidos
  if (filtros?.id_segmento) {
    query = query.andWhere('estoque.id_segmento', filtros.id_segmento);
  }
  
  if (filtros?.id_periodo) {
    query = query.andWhere('estoque.id_periodo', filtros.id_periodo);
  }
  
  if (filtros?.id_item) {
    query = query.andWhere('estoque.id_item', filtros.id_item);
  }
  
  if (filtros?.quantidade_minima) {
    query = query.andWhere('estoque.quantidade_item', '>=', filtros.quantidade_minima);
  }
  
  if (filtros?.validade_proxima) {
    query = query.andWhere('estoque.validade', '<=', filtros.validade_proxima);
  }
  
  const estoqueDetalhado = await query.select(
    'estoque.*',
    'item.nome_item',
    'item.unidade_medida',
    'item.preco_item',
    'escola.nome_escola',
    'segmento.nome_segmento',
    'periodo_lancamento.mes',
    'periodo_lancamento.ano',
    'periodo_lancamento.data_referencia'
  );
  
  return estoqueDetalhado;
};

// Buscar itens com estoque abaixo do ideal
export const buscarItensAbaixoIdeal = async (id_escola: string, filtros?: FiltroEstoque): Promise<EstoqueCompleto[]> => {
  let query = connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .join('escola', 'estoque.id_escola', '=', 'escola.id_escola')
    .join('segmento', 'estoque.id_segmento', '=', 'segmento.id_segmento')
    .join('periodo_lancamento', 'estoque.id_periodo', '=', 'periodo_lancamento.id_periodo')
    .where('estoque.id_escola', id_escola)
    .andWhereRaw('estoque.quantidade_item < estoque.numero_ideal');
  
  // Aplicar filtros adicionais se fornecidos
  if (filtros?.id_segmento) {
    query = query.andWhere('estoque.id_segmento', filtros.id_segmento);
  }
  
  if (filtros?.id_periodo) {
    query = query.andWhere('estoque.id_periodo', filtros.id_periodo);
  }
  
  const itensAbaixoIdeal = await query.select(
    'estoque.*',
    'item.nome_item',
    'item.unidade_medida',
    'item.preco_item',
    'escola.nome_escola',
    'segmento.nome_segmento',
    'periodo_lancamento.mes',
    'periodo_lancamento.ano',
    'periodo_lancamento.data_referencia'
  );
  
  return itensAbaixoIdeal;
};

// Criar novo item de estoque
export const criar = async (estoque: CriarEstoque): Promise<string> => {
  const [result] = await connection(table)
    .insert(estoque)
    .returning('id_estoque');
  
  return result.id_estoque;
};

// Atualizar quantidade de um item no estoque por ID
export const atualizarQuantidade = async (id_estoque: string, quantidade_item: number): Promise<void> => {
  await connection(table)
    .where({ id_estoque })
    .update({ quantidade_item });
};

// Atualizar número ideal de um item no estoque por ID
export const atualizarNumeroIdeal = async (id_estoque: string, numero_ideal: number): Promise<void> => {
  await connection(table)
    .where({ id_estoque })
    .update({ numero_ideal });
};

// Atualizar item de estoque por ID
export const atualizar = async (id_estoque: string, dados: AtualizarEstoque): Promise<void> => {
  await connection(table)
    .where({ id_estoque })
    .update(dados);
};

// Atualizar data de validade de um item no estoque por ID
export const atualizarValidade = async (id_estoque: string, validade: Date): Promise<boolean> => {
  try {
    const updated = await connection(table)
      .where({ id_estoque })
      .update({ 
        validade: validade.toISOString().split('T')[0],
        atualizado_em: new Date()
      });
    
    return updated > 0;
  } catch (error) {
    console.error('Erro ao atualizar validade:', error);
    return false;
  }
};

// Remover item de estoque por ID
export const remover = async (id_estoque: string): Promise<void> => {
  await connection(table)
    .where({ id_estoque })
    .delete();
};

// Remover itens de estoque por filtros
export const removerPorFiltros = async (filtros: FiltroEstoque): Promise<void> => {
  let query = connection(table);
  
  if (filtros.id_escola) {
    query = query.where('id_escola', filtros.id_escola);
  }
  
  if (filtros.id_segmento) {
    query = query.andWhere('id_segmento', filtros.id_segmento);
  }
  
  if (filtros.id_periodo) {
    query = query.andWhere('id_periodo', filtros.id_periodo);
  }
  
  if (filtros.id_item) {
    query = query.andWhere('id_item', filtros.id_item);
  }
  
  await query.delete();
};

// Obter métricas de estoque para dashboard
export const obterMetricasEstoque = async (id_escola: string, filtros?: FiltroEstoque) => {
  let baseQuery = connection(table)
    .where('id_escola', id_escola);
  
  // Aplicar filtros se fornecidos
  if (filtros?.id_segmento) {
    baseQuery = baseQuery.andWhere('id_segmento', filtros.id_segmento);
  }
  
  if (filtros?.id_periodo) {
    baseQuery = baseQuery.andWhere('id_periodo', filtros.id_periodo);
  }
  
  const totalItens = await baseQuery.clone()
    .count('* as total')
    .first();
  
  const abaixoIdeal = await baseQuery.clone()
    .whereRaw('quantidade_item < numero_ideal')
    .count('* as total')
    .first();
    
  // Buscar itens próximos da validade (próximos 7 dias)
  const dataAtual = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + 7);
  
  const proximosValidade = await baseQuery.clone()
    .andWhere('validade', '<=', dataLimite)
    .andWhere('validade', '>=', dataAtual)
    .whereNotNull('validade')
    .count('* as total')
    .first();
  
  return {
    total_itens: Number(totalItens?.total || 0),
    itens_baixo_estoque: Number(abaixoIdeal?.total || 0),
    itens_proximos_validade: Number(proximosValidade?.total || 0)
  };
};

// Obter métricas detalhadas por segmento
export const obterMetricasPorSegmento = async (id_escola: string, id_periodo?: string) => {
  let query = connection(table)
    .join('segmento', 'estoque.id_segmento', '=', 'segmento.id_segmento')
    .where('estoque.id_escola', id_escola);
  
  if (id_periodo) {
    query = query.andWhere('estoque.id_periodo', id_periodo);
  }
  
  const metricas = await query
    .select(
      'segmento.id_segmento',
      'segmento.nome_segmento',
      connection.raw('COUNT(*) as total_itens'),
      connection.raw('SUM(CASE WHEN quantidade_item < numero_ideal THEN 1 ELSE 0 END) as itens_baixo_estoque'),
      connection.raw('SUM(CASE WHEN validade <= CURRENT_DATE + INTERVAL \'7 days\' AND validade >= CURRENT_DATE THEN 1 ELSE 0 END) as itens_proximos_validade')
    )
    .groupBy('segmento.id_segmento', 'segmento.nome_segmento')
    .orderBy('segmento.nome_segmento');
  
  return metricas.map(m => ({
    id_segmento: m.id_segmento,
    nome_segmento: m.nome_segmento,
    total_itens: Number(m.total_itens),
    itens_baixo_estoque: Number(m.itens_baixo_estoque),
    itens_proximos_validade: Number(m.itens_proximos_validade)
  }));
};

// Obter resumo geral para dashboard da escola
export const obterResumoDashboard = async (id_escola: string) => {
  // Métricas gerais
  const metricas = await obterMetricasEstoque(id_escola);
  
  // Contar segmentos ativos
  const segmentosAtivos = await connection('escola_segmento')
    .where('id_escola', id_escola)
    .count('* as total')
    .first();
  
  // Buscar período ativo
  const periodoAtivo = await connection('periodo_lancamento')
    .where('ativo', true)
    .select('mes', 'ano')
    .first();
  
  return {
    ...metricas,
    segmentos_ativos: Number(segmentosAtivos?.total || 0),
    periodo_ativo: periodoAtivo ? `${periodoAtivo.mes}/${periodoAtivo.ano}` : null
  };
};

// Definir valores ideais em lote
export const definirIdeaisEmLote = async (ideais: Array<{
  id_escola: string;
  id_item: string;
  id_segmento: string;
  id_periodo: string;
  numero_ideal: number;
}>) => {
  // Usar transaction para garantir que todas as operações tenham sucesso
  return await connection.transaction(async (trx) => {
    const resultados: ResultadoIdeal[] = [];

    // Para cada item na lista de ideais
    for (const ideal of ideais) {
      // Verificar se o item já existe no estoque
      const itemExistente = await trx(table)
        .where({
          id_escola: ideal.id_escola,
          id_item: ideal.id_item,
          id_segmento: ideal.id_segmento,
          id_periodo: ideal.id_periodo
        })
        .first();

      if (itemExistente) {
        // Atualizar apenas o número ideal
        await trx(table)
          .where({ id_estoque: itemExistente.id_estoque })
          .update({
            numero_ideal: ideal.numero_ideal
          });
          
        resultados.push({
          id_estoque: itemExistente.id_estoque,
          ...ideal,
          acao: 'atualizado'
        });
      } else {
        // Criar novo registro de estoque com quantidade inicial zero
        const [result] = await trx(table).insert({
          id_escola: ideal.id_escola,
          id_item: ideal.id_item,
          id_segmento: ideal.id_segmento,
          id_periodo: ideal.id_periodo,
          quantidade_item: 0, // Inicia com quantidade zero
          numero_ideal: ideal.numero_ideal
        }).returning('id_estoque');
        
        resultados.push({
          id_estoque: result.id_estoque,
          ...ideal,
          acao: 'criado'
        });
      }
    }

    return resultados;
  });
};

// Buscar itens próximos da validade no estoque (em dias)
export const buscarProximosValidade = async (id_escola: string, dias: number, filtros?: FiltroEstoque): Promise<EstoqueCompleto[]> => {
  const dataAtual = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + dias);
  
  let query = connection(table)
    .join('item', 'estoque.id_item', '=', 'item.id_item')
    .join('escola', 'estoque.id_escola', '=', 'escola.id_escola')
    .join('segmento', 'estoque.id_segmento', '=', 'segmento.id_segmento')
    .join('periodo_lancamento', 'estoque.id_periodo', '=', 'periodo_lancamento.id_periodo')
    .where('estoque.id_escola', id_escola)
    .andWhere('estoque.validade', '<=', dataLimite)
    .andWhere('estoque.validade', '>=', dataAtual)
    .whereNotNull('estoque.validade');
  
  // Aplicar filtros adicionais se fornecidos
  if (filtros?.id_segmento) {
    query = query.andWhere('estoque.id_segmento', filtros.id_segmento);
  }
  
  if (filtros?.id_periodo) {
    query = query.andWhere('estoque.id_periodo', filtros.id_periodo);
  }
  
  const itensProximos = await query.select(
    'estoque.*',
    'item.nome_item',
    'item.unidade_medida',
    'item.preco_item',
    'escola.nome_escola',
    'segmento.nome_segmento',
    'periodo_lancamento.mes',
    'periodo_lancamento.ano',
    'periodo_lancamento.data_referencia',
    connection.raw('(estoque.validade - CURRENT_DATE) as dias_restantes')
  ).orderBy('estoque.validade', 'asc');
  
  return itensProximos;
};

// Verificar se estoque existe
export const existe = async (id_estoque: string): Promise<boolean> => {
  const estoque = await connection(table)
    .where({ id_estoque })
    .count('* as total')
    .first();
  
  return Number(estoque?.total || 0) > 0;
};

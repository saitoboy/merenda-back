import * as EstoqueModel from '../model/estoque.model';
import * as EscolaModel from '../model/escola.model';
import * as ItemModel from '../model/item.model';
import * as SegmentoModel from '../model/segmento.model';
import * as PeriodoModel from '../model/periodo-lancamento.model';
import connection from '../connection';
import { logInfo, logError, logWarning } from '../utils/logger';
import { 
  Estoque, 
  CriarEstoque, 
  AtualizarEstoque, 
  FiltroEstoque,
  EstoqueCompleto 
} from '../types';

// =====================================
// DUPLICAR ESTOQUES PARA NOVO PERÍODO
// =====================================

export const duplicarEstoquesParaNovoPeriodo = async (
  idNovoPeriodo: string,
  idPeriodoOrigem?: string
): Promise<{
  mensagem: string;
  totalDuplicados: number;
  periodo_origem: string;
  periodo_destino: string;
}> => {
  const trx = await connection.transaction();
  
  try {
    logInfo(`Iniciando duplicação de estoques para período ${idNovoPeriodo}`, 'service');

    // 1. Verificar se o novo período existe
    const novoPeriodo = await PeriodoModel.buscarPorId(idNovoPeriodo);
    if (!novoPeriodo) {
      throw new Error(`Período de destino não encontrado: ${idNovoPeriodo}`);
    }

    // 2. Verificar se o novo período já tem estoques
    const estoquesExistentes = await trx('estoque')
      .where('id_periodo', idNovoPeriodo)
      .count('id_estoque as total')
      .first();

    if (estoquesExistentes && parseInt(estoquesExistentes.total as string) > 0) {
      logWarning(`Período ${idNovoPeriodo} já possui ${estoquesExistentes.total} itens de estoque. Duplicação cancelada.`, 'service');
      await trx.rollback();
      return {
        mensagem: 'Período já possui estoques. Duplicação não realizada.',
        totalDuplicados: 0,
        periodo_origem: idPeriodoOrigem || 'não identificado',
        periodo_destino: idNovoPeriodo
      };
    }

    // 3. Determinar período de origem (se não fornecido, usar o período ativo anterior)
    let periodoOrigemId = idPeriodoOrigem;
    if (!periodoOrigemId) {
      const periodoAtivoAnterior = await trx('periodo_lancamento')
        .where('ativo', true)
        .whereNot('id_periodo', idNovoPeriodo)
        .orderBy('data_referencia', 'desc')
        .first();

      if (!periodoAtivoAnterior) {
        logWarning('Nenhum período ativo anterior encontrado para duplicação', 'service');
        await trx.rollback();
        return {
          mensagem: 'Nenhum período anterior encontrado para duplicação.',
          totalDuplicados: 0,
          periodo_origem: 'não encontrado',
          periodo_destino: idNovoPeriodo
        };
      }
      periodoOrigemId = periodoAtivoAnterior.id_periodo;
    }

    // 4. Verificar se o período de origem existe e tem estoques
    const periodoOrigem = await PeriodoModel.buscarPorId(periodoOrigemId);
    if (!periodoOrigem) {
      throw new Error(`Período de origem não encontrado: ${periodoOrigemId}`);
    }

    // 5. Buscar estoques do período de origem
    const estoquesOrigem = await trx('estoque')
      .where('id_periodo', periodoOrigemId)
      .select([
        'id_escola',
        'id_item', 
        'id_segmento',
        'quantidade_item',
        'numero_ideal',
        'validade',
        'observacao'
      ]);

    if (estoquesOrigem.length === 0) {
      logWarning(`Período de origem ${periodoOrigemId} não possui estoques para duplicar`, 'service');
      await trx.rollback();
      return {
        mensagem: 'Período de origem não possui estoques para duplicar.',
        totalDuplicados: 0,
        periodo_origem: periodoOrigemId,
        periodo_destino: idNovoPeriodo
      };
    }

    logInfo(`Encontrados ${estoquesOrigem.length} itens para duplicar do período ${periodoOrigemId}`, 'service');

    // 6. Preparar dados para inserção em lote
    const novosEstoques = estoquesOrigem.map(estoque => ({
      id_escola: estoque.id_escola,
      id_item: estoque.id_item,
      id_segmento: estoque.id_segmento,
      id_periodo: idNovoPeriodo,
      quantidade_item: estoque.quantidade_item,
      numero_ideal: estoque.numero_ideal,
      validade: estoque.validade,
      observacao: estoque.observacao
    }));

    // 7. Inserir novos estoques em lote
    await trx('estoque').insert(novosEstoques);

    // 8. Commit da transação
    await trx.commit();

    const totalDuplicados = novosEstoques.length;
    logInfo(`Duplicação concluída: ${totalDuplicados} itens duplicados do período ${periodoOrigemId} para ${idNovoPeriodo}`, 'service');

    return {
      mensagem: `Estoques duplicados com sucesso: ${totalDuplicados} itens copiados.`,
      totalDuplicados,
      periodo_origem: periodoOrigemId,
      periodo_destino: idNovoPeriodo
    };

  } catch (error) {
    await trx.rollback();
    logError('Erro ao duplicar estoques para novo período', 'service', error);
    
    if (error instanceof Error) {
      throw new Error(`Erro ao duplicar estoques: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao duplicar estoques');
    }
  }
};

// =====================================
// BUSCAR E LISTAR ESTOQUE
// =====================================

export const buscarEstoquePorEscola = async (
  idEscola: string, 
  filtros?: {
    idSegmento?: string;
    idPeriodo?: string;
    idItem?: string;
    quantidadeMinima?: number;
    validadeProxima?: Date;
  }
) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Construir filtros para o model
    const filtroEstoque: FiltroEstoque = {
      id_escola: idEscola,
      ...(filtros?.idSegmento && { id_segmento: filtros.idSegmento }),
      ...(filtros?.idPeriodo && { id_periodo: filtros.idPeriodo }),
      ...(filtros?.idItem && { id_item: filtros.idItem }),
      ...(filtros?.quantidadeMinima && { quantidade_minima: filtros.quantidadeMinima }),
      ...(filtros?.validadeProxima && { validade_proxima: filtros.validadeProxima })
    };

    // Buscar estoque com dados relacionados
    const estoque = await EstoqueModel.buscarDetalhesEstoquePorEscola(idEscola, filtroEstoque);
    
    return estoque;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar estoque');
    }
  }
};

export const buscarEstoquePorId = async (idEstoque: string): Promise<Estoque> => {
  try {
    const estoque = await EstoqueModel.buscarPorId(idEstoque);
    
    if (!estoque) {
      throw new Error('Item de estoque não encontrado');
    }
    
    return estoque;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar estoque');
    }
  }
};

export const buscarItensAbaixoIdeal = async (
  idEscola: string,
  filtros?: { idSegmento?: string; idPeriodo?: string }
): Promise<EstoqueCompleto[]> => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Construir filtros
    const filtroEstoque: FiltroEstoque = {
      id_escola: idEscola,
      ...(filtros?.idSegmento && { id_segmento: filtros.idSegmento }),
      ...(filtros?.idPeriodo && { id_periodo: filtros.idPeriodo })
    };

    // Buscar itens abaixo do ideal
    const itensAbaixoIdeal = await EstoqueModel.buscarItensAbaixoIdeal(idEscola, filtroEstoque);
    
    return itensAbaixoIdeal;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar itens abaixo do ideal: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar itens abaixo do ideal');
    }
  }
};

export const buscarItensProximosValidade = async (
  idEscola: string,
  dias: number = 7,
  filtros?: { idSegmento?: string; idPeriodo?: string }
): Promise<EstoqueCompleto[]> => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Construir filtros
    const filtroEstoque: FiltroEstoque = {
      id_escola: idEscola,
      ...(filtros?.idSegmento && { id_segmento: filtros.idSegmento }),
      ...(filtros?.idPeriodo && { id_periodo: filtros.idPeriodo })
    };

    // Buscar itens próximos da validade
    const itensProximos = await EstoqueModel.buscarProximosValidade(idEscola, dias, filtroEstoque);
    
    return itensProximos;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar itens próximos da validade: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar itens próximos da validade');
    }
  }
};

// =====================================
// CRIAR E ATUALIZAR ESTOQUE
// =====================================

export const criarItemEstoque = async (dados: CriarEstoque): Promise<string> => {
  try {
    // Validar se escola existe
    const escola = await EscolaModel.buscarPorId(dados.id_escola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Validar se item existe
    const item = await ItemModel.buscarPorId(dados.id_item);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    // Validar se segmento existe
    const segmento = await SegmentoModel.buscarPorId(dados.id_segmento);
    if (!segmento) {
      throw new Error('Segmento não encontrado');
    }

    // Validar se período existe
    const periodo = await PeriodoModel.buscarPorId(dados.id_periodo);
    if (!periodo) {
      throw new Error('Período não encontrado');
    }

    // Verificar se já existe estoque para esta combinação
    const estoqueExistente = await EstoqueModel.buscar(
      dados.id_escola,
      dados.id_item,
      dados.id_segmento,
      dados.id_periodo
    );

    if (estoqueExistente) {
      throw new Error('Já existe estoque para esta combinação de escola, item, segmento e período');
    }

    // Criar o item de estoque
    const idEstoque = await EstoqueModel.criar(dados);
    
    return idEstoque;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar item no estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao criar item no estoque');
    }
  }
};

export const atualizarEstoque = async (idEstoque: string, dados: AtualizarEstoque) => {
  try {
    // Verificar se o estoque existe
    const estoque = await EstoqueModel.buscarPorId(idEstoque);
    if (!estoque) {
      throw new Error('Item de estoque não encontrado');
    }

    // Atualizar o estoque
    await EstoqueModel.atualizar(idEstoque, dados);

    return {
      mensagem: 'Estoque atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar estoque');
    }
  }
};

export const atualizarQuantidade = async (idEstoque: string, quantidade: number) => {
  try {
    // Verificar se o estoque existe
    const estoque = await EstoqueModel.buscarPorId(idEstoque);
    if (!estoque) {
      throw new Error('Item de estoque não encontrado');
    }

    if (quantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    // Atualizar a quantidade
    await EstoqueModel.atualizarQuantidade(idEstoque, quantidade);

    return {
      mensagem: 'Quantidade atualizada com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar quantidade: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar quantidade');
    }
  }
};

export const atualizarNumeroIdeal = async (idEstoque: string, numeroIdeal: number) => {
  try {
    // Verificar se o estoque existe
    const estoque = await EstoqueModel.buscarPorId(idEstoque);
    if (!estoque) {
      throw new Error('Item de estoque não encontrado');
    }

    if (numeroIdeal < 0) {
      throw new Error('Número ideal não pode ser negativo');
    }

    // Atualizar o número ideal
    await EstoqueModel.atualizarNumeroIdeal(idEstoque, numeroIdeal);

    return {
      mensagem: 'Número ideal atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar número ideal: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar número ideal');
    }
  }
};

// =====================================
// REMOVER ESTOQUE
// =====================================

export const removerItemEstoque = async (idEstoque: string) => {
  try {
    // Verificar se o estoque existe
    const estoque = await EstoqueModel.buscarPorId(idEstoque);
    if (!estoque) {
      throw new Error('Item de estoque não encontrado');
    }

    // Remover o item do estoque
    await EstoqueModel.remover(idEstoque);

    return {
      mensagem: 'Item removido do estoque com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao remover item do estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao remover item do estoque');
    }
  }
};

// =====================================
// OPERAÇÕES EM LOTE
// =====================================

export const definirIdeaisEmLote = async (
  idEscola: string,
  idPeriodo: string,
  ideais: Array<{
    idItem: string;
    idSegmento: string;
    numeroIdeal: number;
  }>
) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Verificar se o período existe
    const periodo = await PeriodoModel.buscarPorId(idPeriodo);
    if (!periodo) {
      throw new Error('Período não encontrado');
    }

    // Transformar os dados para o formato do model
    const ideaisProcessados = ideais.map(ideal => ({
      id_escola: idEscola,
      id_item: ideal.idItem,
      id_segmento: ideal.idSegmento,
      id_periodo: idPeriodo,
      numero_ideal: ideal.numeroIdeal
    }));

    // Definir valores ideais em lote
    const resultados = await EstoqueModel.definirIdeaisEmLote(ideaisProcessados);

    return {
      mensagem: 'Valores ideais definidos com sucesso',
      resultados
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao definir valores ideais em lote: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao definir valores ideais em lote');
    }
  }
};

// =====================================
// MÉTRICAS E RELATÓRIOS
// =====================================

export const obterMetricasEstoque = async (
  idEscola: string,
  filtros?: { idSegmento?: string; idPeriodo?: string }
) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Construir filtros
    const filtroEstoque: FiltroEstoque = {
      id_escola: idEscola,
      ...(filtros?.idSegmento && { id_segmento: filtros.idSegmento }),
      ...(filtros?.idPeriodo && { id_periodo: filtros.idPeriodo })
    };

    // Obter métricas básicas
    const metricas = await EstoqueModel.obterMetricasEstoque(idEscola, filtroEstoque);

    return metricas;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao obter métricas de estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao obter métricas de estoque');
    }
  }
};

export const obterMetricasPorSegmento = async (idEscola: string, idPeriodo?: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Se período foi especificado, verificar se existe
    if (idPeriodo) {
      const periodo = await PeriodoModel.buscarPorId(idPeriodo);
      if (!periodo) {
        throw new Error('Período não encontrado');
      }
    }

    // Obter métricas por segmento
    const metricas = await EstoqueModel.obterMetricasPorSegmento(idEscola, idPeriodo);

    return metricas;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao obter métricas por segmento: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao obter métricas por segmento');
    }
  }
};

export const obterResumoDashboard = async (idEscola: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // Obter resumo completo para dashboard
    const resumo = await EstoqueModel.obterResumoDashboard(idEscola);

    return resumo;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao obter resumo do dashboard: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao obter resumo do dashboard');
    }
  }
};

// =====================================
// ATUALIZAR DATA DE VALIDADE (ESCOLA)
// =====================================

export const atualizarDataValidade = async (idEstoque: string, validade: Date | string) => {
  try {
    logInfo(`Iniciando atualização de validade para estoque: ${idEstoque}`, 'service');
    
    // Verificar se o item de estoque existe
    const estoqueExistente = await EstoqueModel.buscarPorId(idEstoque);
    if (!estoqueExistente) {
      logError(`Item de estoque não encontrado: ${idEstoque}`, 'service');
      throw new Error('Item de estoque não encontrado');
    }

    logInfo(`Item encontrado. Validade atual: ${estoqueExistente.validade}`, 'service');

    // Normalizar horário para comparação de datas (zerar horas)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Criar data de validade segura para strings YYYY-MM-DD
    let dataValidade: Date;
    if (typeof validade === 'string' && validade.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Para strings YYYY-MM-DD, criar Date com construtor seguro
      const [ano, mes, dia] = validade.split('-').map(Number);
      dataValidade = new Date(ano, mes - 1, dia); // mes - 1 porque Date usa base 0
    } else {
      dataValidade = new Date(validade);
    }
    
    // Normalizar horário da data de validade
    dataValidade.setHours(0, 0, 0, 0);
    
    logInfo(`Data normalizada: ${dataValidade.toDateString()}, Hoje: ${hoje.toDateString()}`, 'service');
    
    // Validar se a data não é no passado
    if (dataValidade < hoje) {
      logWarning(`Data no passado rejeitada: ${dataValidade.toDateString()}`, 'service');
      throw new Error('Data de validade não pode ser no passado');
    }

    // Salvar validade anterior para auditoria
    const validadeAnterior = estoqueExistente.validade;

    // Atualizar a data de validade
    const sucesso = await EstoqueModel.atualizarValidade(idEstoque, dataValidade);
    
    if (!sucesso) {
      logError(`Falha ao atualizar data de validade no banco: ${idEstoque}`, 'service');
      throw new Error('Falha ao atualizar data de validade');
    }

    // Formatação consistente - sempre retornar YYYY-MM-DD
    const novaValidadeFormatada = dataValidade.getFullYear() + '-' + 
                                 String(dataValidade.getMonth() + 1).padStart(2, '0') + '-' + 
                                 String(dataValidade.getDate()).padStart(2, '0');

    logInfo(`Validade atualizada com sucesso: ${idEstoque} -> ${novaValidadeFormatada}`, 'service');

    return {
      mensagem: 'Data de validade atualizada com sucesso',
      id_estoque: idEstoque,
      nova_validade: novaValidadeFormatada,
      validade_anterior: validadeAnterior,
      atualizado_em: new Date().toISOString()
    };
  } catch (error) {
    logError('Erro ao atualizar validade', 'service', error);
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar data de validade: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar data de validade');
    }
  }
};

// Consolidar estoque por segmento e calcular porcentagens de atendimento do ideal (apenas do período ativo)
export const consolidarEstoquePorSegmento = async (idEscola: string) => {
  // Buscar período ativo
  const periodoAtivo = await PeriodoModel.buscarAtivo();
  if (!periodoAtivo) {
    throw new Error('Nenhum período ativo encontrado');
  }
  // Busca todos os itens detalhados do estoque da escola, filtrando pelo período ativo
  const estoque = await EstoqueModel.buscarDetalhesEstoquePorEscola(idEscola, { id_periodo: periodoAtivo.id_periodo });

  // Agrupa por segmento e item
  const consolidado: Record<string, { segmento: string, itens: Record<string, { nome_item: string, quantidade: number, numero_ideal: number }> }> = {};
  let totalGeral = 0;
  let totalIdealGeral = 0;

  estoque.forEach(item => {
    const segmento = item.nome_segmento || item.id_segmento;
    const nome_item = item.nome_item || item.id_item;
    if (!consolidado[segmento]) {
      consolidado[segmento] = { segmento, itens: {} };
    }
    if (!consolidado[segmento].itens[nome_item]) {
      consolidado[segmento].itens[nome_item] = { nome_item, quantidade: 0, numero_ideal: 0 };
    }
    consolidado[segmento].itens[nome_item].quantidade += item.quantidade_item;
    consolidado[segmento].itens[nome_item].numero_ideal += item.numero_ideal || 0;
    totalGeral += item.quantidade_item;
    totalIdealGeral += item.numero_ideal || 0;
  });

  // Calcula porcentagem de atendimento do ideal por item e segmento
  const resultado = Object.values(consolidado).map(seg => {
    const totalSegmento = Object.values(seg.itens).reduce((acc, i) => acc + i.quantidade, 0);
    const totalIdealSegmento = Object.values(seg.itens).reduce((acc, i) => acc + i.numero_ideal, 0);
    return {
      segmento: seg.segmento,
      totalSegmento,
      totalIdealSegmento,
      porcentagemAtendimentoSegmento: totalIdealSegmento > 0 ? (totalSegmento / totalIdealSegmento) * 100 : 0,
      itens: Object.values(seg.itens).map(i => ({
        nome_item: i.nome_item,
        quantidade: i.quantidade,
        numero_ideal: i.numero_ideal,
        porcentagem_atendimento_ideal: i.numero_ideal > 0 ? (i.quantidade / i.numero_ideal) * 100 : 0
      }))
    };
  });

  return {
    totalGeral,
    totalIdealGeral,
    porcentagemAtendimentoGeral: totalIdealGeral > 0 ? (totalGeral / totalIdealGeral) * 100 : 0,
    segmentos: resultado,
    periodo_ativo: periodoAtivo
  };
};



// Consolidar estoque geral por escola e calcular porcentagens
export const consolidarEstoquePorEscola = async () => {
  // Busca todos os itens detalhados do estoque de todas as escolas
  const estoque = await connection('estoque')
    .join('escola', 'estoque.id_escola', '=', 'escola.id_escola')
    .select('estoque.id_escola', 'escola.nome_escola')
    .sum('estoque.quantidade_item as total')
    .groupBy('estoque.id_escola', 'escola.nome_escola');

  const totalGeral = estoque.reduce((acc, escola) => acc + Number(escola.total), 0);

  const escolas = estoque.map(e => ({
    id_escola: e.id_escola,
    nome_escola: e.nome_escola,
    total: Number(e.total),
    porcentagem: totalGeral > 0 ? (Number(e.total) / totalGeral) * 100 : 0
  }));

  return {
    totalGeral,
    escolas
  };
};

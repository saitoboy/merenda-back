import * as EstoqueModel from '../model/estoque.model';
import * as EscolaModel from '../model/escola.model';
import * as ItemModel from '../model/item.model';
import * as SegmentoModel from '../model/segmento.model';
import * as PeriodoModel from '../model/periodo-lancamento.model';
import { 
  Estoque, 
  CriarEstoque, 
  AtualizarEstoque, 
  FiltroEstoque,
  EstoqueCompleto 
} from '../types';

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

export const atualizarDataValidade = async (idEstoque: string, validade: Date) => {
  try {
    // Verificar se o item de estoque existe
    const estoqueExistente = await EstoqueModel.buscarPorId(idEstoque);
    if (!estoqueExistente) {
      throw new Error('Item de estoque não encontrado');
    }

    // Validar se a data não é no passado
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    validade.setHours(0, 0, 0, 0);
    
    if (validade < hoje) {
      throw new Error('Data de validade não pode ser no passado');
    }

    // Atualizar a data de validade
    const sucesso = await EstoqueModel.atualizarValidade(idEstoque, validade);
    
    if (!sucesso) {
      throw new Error('Falha ao atualizar data de validade');
    }

    return {
      mensagem: 'Data de validade atualizada com sucesso',
      id_estoque: idEstoque,
      nova_validade: validade.toISOString().split('T')[0]
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar data de validade: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar data de validade');
    }
  }
};

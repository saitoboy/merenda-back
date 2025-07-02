import { Request, Response } from 'express';
import {
  buscarEstoquePorEscola,
  buscarItensAbaixoIdeal,
  buscarItensProximosValidade,
  criarItemEstoque,
  atualizarQuantidade as atualizarQuantidadeService,
  atualizarNumeroIdeal as atualizarNumeroIdealService,
  removerItemEstoque,
  obterMetricasEstoque,
  definirIdeaisEmLote,
  atualizarDataValidade as atualizarDataValidadeService
} from '../services/estoque.service';
import { buscarSegmentosPorEscola } from '../model/escola-segmento.model';
import { logInfo, logError, logWarning } from '../utils/logger';

export const listarEstoquePorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    const { id_segmento, id_periodo, id_item, quantidade_minima } = req.query;

    const filtros = {
      ...(id_segmento && { idSegmento: id_segmento as string }),
      ...(id_periodo && { idPeriodo: id_periodo as string }),
      ...(id_item && { idItem: id_item as string }),
      ...(quantidade_minima && { quantidadeMinima: parseInt(quantidade_minima as string) })
    };

    const estoque = await buscarEstoquePorEscola(id_escola, filtros);

    res.status(200).json({
      status: 'sucesso',
      mensagem: id_segmento
        ? `Estoque filtrado por segmento listado com sucesso`
        : 'Estoque listado com sucesso',
      dados: estoque
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const listarItensAbaixoIdeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;

    const itensAbaixoIdeal = await buscarItensAbaixoIdeal(id_escola);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Itens abaixo do ideal listados com sucesso',
      dados: itensAbaixoIdeal
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarQuantidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const { quantidade } = req.body;

    if (!quantidade && quantidade !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Quantidade é obrigatória'
      });
      return;
    }

    const resultado = await atualizarQuantidadeService(id_estoque, quantidade);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Quantidade atualizada com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarNumeroIdeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const { numero_ideal } = req.body;

    if (!numero_ideal && numero_ideal !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Número ideal é obrigatório'
      });
      return;
    }

    const resultado = await atualizarNumeroIdealService(id_estoque, numero_ideal);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Número ideal atualizado com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const adicionarItemAoEstoque = async (req: Request, res: Response): Promise<void> => {
  try {
    const dadosEstoque = req.body;

    // Validações básicas
    if (!dadosEstoque.id_escola || !dadosEstoque.id_item || !dadosEstoque.quantidade_item || !dadosEstoque.numero_ideal) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Escola, item, quantidade e número ideal são obrigatórios'
      });
      return;
    }

    const resultado = await criarItemEstoque(dadosEstoque);

    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Item adicionado ao estoque com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const removerItemDoEstoque = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;

    const resultado = await removerItemEstoque(id_estoque);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Item removido do estoque com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const obterMetricas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;

    const metricas = await obterMetricasEstoque(id_escola);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Métricas obtidas com sucesso',
      dados: metricas
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// Definir valores ideais em lote
export const definirValoresIdeaisEmLote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola, id_periodo, ideais } = req.body;

    // Validação básica
    if (!id_escola || !id_periodo || !ideais || !Array.isArray(ideais) || ideais.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'id_escola, id_periodo e array de ideais são obrigatórios'
      });
      return;
    }

    // Verificação de cada item do array
    for (const item of ideais) {
      if (!item.idItem || !item.idSegmento || (item.numeroIdeal === undefined)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Cada item deve conter idItem, idSegmento e numeroIdeal'
        });
        return;
      }
    }

    const resultado = await definirIdeaisEmLote(id_escola, id_periodo, ideais);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Valores ideais definidos em lote com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// Definir valores ideais para uma escola específica
export const definirIdeaisPorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    const { id_periodo, itens_ideais } = req.body;

    // Validação básica
    if (!id_periodo || !itens_ideais || !Array.isArray(itens_ideais) || itens_ideais.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'id_periodo e array de itens_ideais são obrigatórios'
      });
      return;
    }

    // Verificação de cada item do array
    for (const item of itens_ideais) {
      if (!item.idItem || !item.idSegmento || (item.numeroIdeal === undefined)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Cada item deve conter idItem, idSegmento e numeroIdeal'
        });
        return;
      }
    }

    const resultado = await definirIdeaisEmLote(id_escola, id_periodo, itens_ideais);

    res.status(200).json({
      status: 'sucesso',
      mensagem: `Valores ideais definidos com sucesso para a escola ${id_escola}`,
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const listarItensProximosValidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola, dias } = req.params;
    const diasNumero = parseInt(dias) || 7; // Default 7 dias se não especificado

    const itensProximos = await buscarItensProximosValidade(id_escola, diasNumero);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Itens próximos da validade listados com sucesso',
      dados: itensProximos
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const listarSegmentosPorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;

    const segmentos = await buscarSegmentosPorEscola(id_escola);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Segmentos de estoque listados com sucesso',
      dados: segmentos
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// =====================================
// ATUALIZAR DATA DE VALIDADE (ESCOLA)
// =====================================

export const atualizarDataValidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const { data_validade } = req.body;

    logInfo(`Iniciando atualização de validade - Estoque ID: ${id_estoque}`, 'controller', {
      data_recebida: data_validade,
      tipo: typeof data_validade
    });

    // Validar se a data foi fornecida
    if (!data_validade) {
      logWarning('Data de validade não fornecida', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data de validade é obrigatória'
      });
      return;
    }

    // Validar formato de string para YYYY-MM-DD
    if (typeof data_validade === 'string') {
      const formatoDataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!formatoDataRegex.test(data_validade)) {
        logWarning(`Formato de data inválido: ${data_validade}`, 'controller');
        res.status(400).json({
          status: 'erro',
          mensagem: 'Formato de data inválido. Use YYYY-MM-DD (ex: 2025-07-03)'
        });
        return;
      }
    }

    let dataParaProcessar: Date | string;

    // Se for string, fazer parse seguro sem UTC
    if (typeof data_validade === 'string') {
      const partes = data_validade.split('-');
      if (partes.length === 3) {
        const ano = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Mês é 0-indexado
        const dia = parseInt(partes[2]);

        // Criar Date com timezone local para evitar problemas de UTC
        dataParaProcessar = new Date(ano, mes, dia);
        logInfo(`Data parseada localmente: ${dataParaProcessar.toLocaleDateString('pt-BR')}`, 'controller');
      } else {
        logError('Não foi possível parsear a data - Formato inválido', 'controller');
        res.status(400).json({
          status: 'erro',
          mensagem: 'Formato de data inválido. Use YYYY-MM-DD'
        });
        return;
      }
    } else if (data_validade instanceof Date) {
      dataParaProcessar = data_validade;
      logInfo(`Data já é objeto Date: ${dataParaProcessar.toLocaleDateString('pt-BR')}`, 'controller');
    } else {
      logError(`Tipo de data não suportado: ${typeof data_validade}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Tipo de data inválido. Envie string YYYY-MM-DD ou objeto Date'
      });
      return;
    }

    // Verificar se a data é válida
    if (dataParaProcessar instanceof Date && isNaN(dataParaProcessar.getTime())) {
      logError('Data inválida após parsing', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data inválida'
      });
      return;
    }

    // Chamar o service que já trata todos os aspectos de timezone e validação
    const resultado = await atualizarDataValidadeService(id_estoque, dataParaProcessar);

    logInfo('Validade atualizada com sucesso', 'controller', {
      id_estoque: resultado.id_estoque,
      nova_validade: resultado.nova_validade,
      validade_anterior: resultado.validade_anterior
    });

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Data de validade atualizada com sucesso',
      dados: resultado
    });
  } catch (error) {
    logError(`Erro ao atualizar validade - Estoque ID: ${req.params.id_estoque}`, 'controller', error);

    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

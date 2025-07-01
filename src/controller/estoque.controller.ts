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

export const listarEstoquePorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    const { idSegmento, idPeriodo, idItem, quantidadeMinima } = req.query;
    
    const filtros = {
      ...(idSegmento && { idSegmento: idSegmento as string }),
      ...(idPeriodo && { idPeriodo: idPeriodo as string }),
      ...(idItem && { idItem: idItem as string }),
      ...(quantidadeMinima && { quantidadeMinima: parseInt(quantidadeMinima as string) })
    };
    
    const estoque = await buscarEstoquePorEscola(id_escola, filtros);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Estoque listado com sucesso',
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

    // Validar se a data foi fornecida
    if (!data_validade) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data de validade é obrigatória'
      });
      return;
    }

    // Converter string para Date
    const novaValidade = new Date(data_validade);
    if (isNaN(novaValidade.getTime())) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Formato de data inválido. Use YYYY-MM-DD'
      });
      return;
    }

    const resultado = await atualizarDataValidadeService(id_estoque, novaValidade);
    
    res.status(200).json({
      status: 'sucesso',
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

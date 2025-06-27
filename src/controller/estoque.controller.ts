import { Request, Response } from 'express';
import * as EstoqueService from '../services/estoque.service';

export const listarEstoquePorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    
    const estoque = await EstoqueService.buscarEstoquePorEscola(id_escola);
    
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
    
    const itensAbaixoIdeal = await EstoqueService.buscarItensAbaixoIdeal(id_escola);
    
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
    const { id_escola, id_item } = req.params;
    const { quantidade_item, segmento } = req.body;
    
    if (!quantidade_item && quantidade_item !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Quantidade é obrigatória'
      });
      return;
    }
    
    const resultado = await EstoqueService.atualizarQuantidade(id_escola, id_item, quantidade_item, segmento || 'escola');
    
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
    const { id_escola, id_item } = req.params;
    const { numero_ideal, segmento } = req.body;
    
    if (!numero_ideal && numero_ideal !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Número ideal é obrigatório'
      });
      return;
    }
    
    const resultado = await EstoqueService.atualizarNumeroIdeal(id_escola, id_item, numero_ideal, segmento || 'escola');
    
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
    }
    
    const resultado = await EstoqueService.adicionarItemAoEstoque(dadosEstoque);
    
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
    }
    
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const removerItemDoEstoque = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola, id_item } = req.params;
    const { segmento } = req.query;
    
    const resultado = await EstoqueService.removerItemDoEstoque(
      id_escola, 
      id_item, 
      typeof segmento === 'string' ? segmento : 'escola'
    );
    
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
    
    const metricas = await EstoqueService.obterMetricas(id_escola);
    
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
    const { ideais } = req.body;
    
    // Validação básica
    if (!ideais || !Array.isArray(ideais) || ideais.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Formato inválido. Esperado um array de itens com id_escola, id_item e numero_ideal'
      });
      return;
    }
    
    // Verificação de cada item do array
    for (const item of ideais) {
      if (!item.id_escola || !item.id_item || (item.numero_ideal === undefined)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Cada item deve conter id_escola, id_item e numero_ideal'
        });
        return;
      }
      
      // Segmento é opcional, mas se estiver presente não pode ser vazio
      if (item.segmento !== undefined && item.segmento.trim() === '') {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Segmento não pode ser uma string vazia'
        });
        return;
      }
    }
    
    const resultado = await EstoqueService.definirValoresIdeaisEmLote(ideais);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Valores ideais definidos com sucesso',
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
    const { itens_ideais } = req.body;
    
    // Validação básica
    if (!itens_ideais || !Array.isArray(itens_ideais) || itens_ideais.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Formato inválido. Esperado um array de itens com id_item e numero_ideal'
      });
      return;
    }
    
    // Verificação de cada item do array
    for (const item of itens_ideais) {
      if (!item.id_item || (item.numero_ideal === undefined)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Cada item deve conter id_item e numero_ideal'
        });
        return;
      }
      
      // Segmento é opcional, mas se estiver presente não pode ser vazio
      if (item.segmento !== undefined && item.segmento.trim() === '') {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Segmento não pode ser uma string vazia'
        });
        return;
      }
    }
    
    const resultado = await EstoqueService.definirIdeaisPorEscola(id_escola, itens_ideais);
    
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
    
    const itensProximos = await EstoqueService.buscarItensProximosValidade(id_escola, diasNumero);
    
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

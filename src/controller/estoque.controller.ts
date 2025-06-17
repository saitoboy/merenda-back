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
    const { quantidade_item } = req.body;
    
    if (!quantidade_item && quantidade_item !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Quantidade é obrigatória'
      });
    }
    
    const resultado = await EstoqueService.atualizarQuantidade(id_escola, id_item, quantidade_item);
    
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
    const { numero_ideal } = req.body;
    
    if (!numero_ideal && numero_ideal !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Número ideal é obrigatório'
      });
    }
    
    const resultado = await EstoqueService.atualizarNumeroIdeal(id_escola, id_item, numero_ideal);
    
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
    
    const resultado = await EstoqueService.removerItemDoEstoque(id_escola, id_item);
    
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

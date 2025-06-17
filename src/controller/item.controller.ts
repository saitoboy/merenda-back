import { Request, Response } from 'express';
import * as ItemService from '../services/item.service';
import { logger } from '../utils';

export const listarItens = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Recebendo solicitação para listar todos os itens', 'controller');
    const itens = await ItemService.buscarTodosItens();
    
    logger.success(`${itens.length} itens encontrados`, 'controller');
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Itens listados com sucesso',
      dados: itens
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao listar itens: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao listar itens', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const buscarItemPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_item } = req.params;
    logger.info(`Recebendo solicitação para buscar item com ID: ${id_item}`, 'controller');
    
    const item = await ItemService.buscarItemPorId(id_item);
    
    logger.success(`Item ${item.nome_item} encontrado`, 'controller');
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Item encontrado com sucesso',
      dados: item
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar item: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao buscar item', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const buscarItensPorFornecedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_fornecedor } = req.params;
    logger.info(`Recebendo solicitação para buscar itens do fornecedor ID: ${id_fornecedor}`, 'controller');
    
    const itens = await ItemService.buscarItensPorFornecedor(id_fornecedor);
    
    logger.success(`${itens.length} itens encontrados para o fornecedor`, 'controller');
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Itens encontrados com sucesso',
      dados: itens
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar itens por fornecedor: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao buscar itens por fornecedor', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const criarItem = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Recebendo solicitação para criar novo item', 'controller');
    const dadosItem = req.body;
    
    // Validações básicas
    if (!dadosItem.nome_item || !dadosItem.unidade_medida || !dadosItem.id_fornecedor || !dadosItem.preco_item) {
      logger.warning('Tentativa de criar item com dados incompletos', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, unidade de medida, fornecedor e preço são obrigatórios'
      });
      return;
    }
    
    // Validação da sazonalidade
    if (!dadosItem.sazonalidade) {
      logger.warning('Tentativa de criar item sem sazonalidade', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Sazonalidade é obrigatória'
      });
      return;
    }
    
    logger.debug(`Processando criação do item: ${dadosItem.nome_item}`, 'controller');
    const resultado = await ItemService.criarItem(dadosItem);
    
    logger.success(`Item ${dadosItem.nome_item} criado com sucesso via API`, 'controller');
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Item criado com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar item: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao criar item', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_item } = req.params;
    logger.info(`Recebendo solicitação para atualizar item com ID: ${id_item}`, 'controller');
    
    const dadosItem = req.body;
    const resultado = await ItemService.atualizarItem(id_item, dadosItem);
    
    logger.success(`Item ${id_item} atualizado com sucesso`, 'controller');
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem,
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar item: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao atualizar item', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const excluirItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_item } = req.params;
    logger.info(`Recebendo solicitação para excluir item com ID: ${id_item}`, 'controller');
    
    const resultado = await ItemService.excluirItem(id_item);
    
    logger.success(`Item ${id_item} excluído com sucesso`, 'controller');
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao excluir item: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao excluir item', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const importarItens = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Recebendo solicitação para importação em massa de itens', 'controller');
    const dados = req.body;
    
    // Validar se os dados estão em formato de array
    if (!Array.isArray(dados)) {
      logger.warning('Dados para importação não estão em formato de array', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'O formato dos dados deve ser um array de itens'
      });
      return;
    }
    
    logger.debug(`Iniciando processamento de ${dados.length} itens`, 'controller');
    
    // Chamar o serviço para importar os itens
    const resultado = await ItemService.importarItens(dados);
    
    logger.success(`Importação concluída: ${resultado.sucesso} itens importados com sucesso, ${resultado.falhas} falhas`, 'controller');
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: `Importação concluída: ${resultado.sucesso} itens importados com sucesso, ${resultado.falhas} falhas`,
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro durante a importação: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor durante a importação', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor durante a importação'
    });
  }
};

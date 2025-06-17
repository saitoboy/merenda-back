import { Request, Response } from 'express';
import * as FornecedorService from '../services/fornecedor.service';
import { logger } from '../utils';

export const listarFornecedores = async (req: Request, res: Response): Promise<void> => {
  try {
    const fornecedores = await FornecedorService.buscarTodosFornecedores();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Fornecedores listados com sucesso',
      dados: fornecedores
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const buscarFornecedorPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_fornecedor } = req.params;
    
    const fornecedor = await FornecedorService.buscarFornecedorPorId(id_fornecedor);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Fornecedor encontrado com sucesso',
      dados: fornecedor
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

export const criarFornecedor = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Iniciando criação de novo fornecedor através da API', 'controller');
    const dadosFornecedor = req.body;
    
    // Validações básicas
    if (!dadosFornecedor.nome_fornecedor || !dadosFornecedor.email_fornecedor || !dadosFornecedor.cnpj_fornecedor || !dadosFornecedor.senha_fornecedor) {
      logger.warning('Tentativa de criar fornecedor com dados incompletos', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, email, CNPJ e senha são obrigatórios'
      });
      return;
    }
    
    // Validação de WhatsApp
    if (!dadosFornecedor.whatsapp_fornecedor) {
      logger.warning('Tentativa de criar fornecedor sem WhatsApp', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Número de WhatsApp é obrigatório'
      });
      return;
    }
    
    logger.debug(`Processando criação do fornecedor: ${dadosFornecedor.nome_fornecedor}`, 'controller');
    const resultado = await FornecedorService.criarFornecedor(dadosFornecedor);
    
    logger.success(`Fornecedor ${dadosFornecedor.nome_fornecedor} criado com sucesso via API`, 'controller');
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Fornecedor criado com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar fornecedor: ${error.message}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    logger.error('Erro interno do servidor ao criar fornecedor', 'controller');
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarFornecedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_fornecedor } = req.params;
    const dadosFornecedor = req.body;
    
    const resultado = await FornecedorService.atualizarFornecedor(id_fornecedor, dadosFornecedor);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Fornecedor atualizado com sucesso',
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

export const excluirFornecedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_fornecedor } = req.params;
    
    const resultado = await FornecedorService.excluirFornecedor(id_fornecedor);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Fornecedor excluído com sucesso',
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

export const loginFornecedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Email e senha são obrigatórios'
      });
    }
    
    const resultado = await FornecedorService.loginFornecedor(email, senha);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Login realizado com sucesso',
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

// Método para importação em lote de fornecedores
export const importarFornecedores = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Recebendo solicitação para importação em massa de fornecedores', 'controller');
    const dados = req.body;
    
    // Validar se os dados estão em formato de array
    if (!Array.isArray(dados)) {
      logger.warning('Dados para importação não estão em formato de array', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'O formato dos dados deve ser um array de fornecedores'
      });
      return;
    }
    
    logger.debug(`Iniciando processamento de ${dados.length} fornecedores`, 'controller');
    
    // Chamar o serviço para importar os fornecedores
    const resultado = await FornecedorService.importarFornecedores(dados);
    
    logger.success(`Importação concluída: ${resultado.sucesso} fornecedores importados com sucesso, ${resultado.falhas} falhas`, 'controller');
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: `Importação concluída: ${resultado.sucesso} fornecedores importados com sucesso, ${resultado.falhas} falhas`,
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

// As funções já estão sendo exportadas individualmente

import { Request, Response } from 'express';
import * as FornecedorService from '../services/fornecedor.service';

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
    const dadosFornecedor = req.body;
    
    // Validações básicas
    if (!dadosFornecedor.nome_fornecedor || !dadosFornecedor.email_fornecedor || !dadosFornecedor.cnpj_fornecedor || !dadosFornecedor.senha_fornecedor) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, email, CNPJ e senha são obrigatórios'
      });
    }
    
    const resultado = await FornecedorService.criarFornecedor(dadosFornecedor);
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Fornecedor criado com sucesso',
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

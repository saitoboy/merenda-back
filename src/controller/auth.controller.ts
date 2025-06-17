import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      res.status(400).json({ 
        status: 'erro', 
        mensagem: 'Email e senha são obrigatórios'
      });
      return;
    }
    
    const resultado = await AuthService.login(email, senha);
    
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
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    const dadosUsuario = req.body;
    
    // Validações básicas
    if (!dadosUsuario.nome_usuario || !dadosUsuario.email_usuario || !dadosUsuario.senha_usuario) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, email e senha são obrigatórios'
      });
      return;
    }
    
    const resultado = await AuthService.registrar(dadosUsuario);
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Usuário registrado com sucesso',
      dados: resultado
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

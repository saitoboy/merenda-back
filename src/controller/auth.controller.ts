import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { logger } from '../utils';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info(`Tentativa de login: ${req.body.email}`, 'auth');
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      logger.warning('Tentativa de login sem email ou senha', 'auth');
      res.status(400).json({ 
        status: 'erro', 
        mensagem: 'Email e senha são obrigatórios'
      });
      return;
    }
    
    logger.debug(`Processando login para usuário: ${email}`, 'auth');
    const resultado = await AuthService.login(email, senha);
    
    logger.success(`Login bem-sucedido: ${email}`, 'auth');
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Login realizado com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Falha no login: ${error.message}`, 'auth');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      logger.error('Erro interno durante autenticação', 'auth');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Iniciando processo de registro de novo usuário', 'auth');
    const dadosUsuario = req.body;
    
    // Validações básicas
    if (!dadosUsuario.nome_usuario || !dadosUsuario.email_usuario || !dadosUsuario.senha_usuario) {
      logger.warning('Tentativa de registro com dados incompletos', 'auth');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, email e senha são obrigatórios'
      });
      return;
    }
    
    // Validação do tipo de usuário
    if (!dadosUsuario.tipo_usuario) {
      logger.warning('Tentativa de registro sem tipo de usuário', 'auth');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Tipo de usuário é obrigatório'
      });
      return;
    }
    
    logger.debug(`Processando registro para: ${dadosUsuario.email_usuario} (${dadosUsuario.tipo_usuario})`, 'auth');
    const resultado = await AuthService.registrar(dadosUsuario);
    
    logger.success(`Usuário registrado com sucesso: ${dadosUsuario.email_usuario}`, 'auth');
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Usuário registrado com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro no registro: ${error.message}`, 'auth');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      logger.error('Erro interno durante o registro', 'auth');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

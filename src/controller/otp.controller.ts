import { Request, Response } from 'express';
import * as OTPService from '../services/otp.service';
import { logInfo, logWarning, logError } from '../utils/logger';
import { EmailSimulator } from './diagnostico.controller';

/**
 * Controller para gerenciamento de OTP (One Time Password)
 * Handles endpoints para redefinição de senha via código de verificação
 */

/**
 * Enviar código OTP para email
 * POST /auth/enviar-otp
 */
export const enviarOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    logInfo('Recebendo solicitação de envio de OTP', 'otp-controller');
    
    const { email } = req.body;
    
    // Validação básica
    if (!email) {
      logWarning('Tentativa de envio de OTP sem email', 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Email é obrigatório'
      });
      return;
    }

    logInfo(`Processando envio de OTP para: ${email}`, 'otp-controller');
    
    try {
      // Chamar serviço normal (com email)
      const resultado = await OTPService.enviarOTP({ email });
      
      logInfo(`OTP enviado com sucesso para: ${email}`, 'otp-controller');
      
      res.status(200).json({
        status: 'sucesso',
        mensagem: resultado.mensagem,
        dados: resultado.dados_depuracao // Código incluso em desenvolvimento
      });
      
    } catch (emailError) {
      // Fallback para desenvolvimento quando email não funciona
      if (process.env.NODE_ENV === 'development') {
        logWarning('Serviço de email indisponível, usando modo desenvolvimento', 'otp-controller');
        
        // Implementar lógica simples sem email (como era no otp-dev)
        const UsuarioModel = require('../model/usuario.model');
        const PasswordResetOTPModel = require('../model/password-reset-otp.model');
        
        const usuario = await UsuarioModel.buscarPorEmail(email.trim().toLowerCase());
        if (!usuario) {
          res.status(400).json({
            status: 'erro',
            mensagem: 'Email não encontrado no sistema'
          });
          return;
        }

        // Invalidar OTPs anteriores
        await PasswordResetOTPModel.invalidarOTPsAtivos(usuario.id_usuario);

        // Gerar código OTP
        const codigoOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const dataExpiracao = new Date();
        dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 15);

        // Salvar OTP no banco
        await PasswordResetOTPModel.criar({
          id_usuario: usuario.id_usuario,
          email_usuario: email.trim().toLowerCase(),
          codigo_otp: codigoOTP,
          tentativas: 0,
          usado: false,
          data_criacao: new Date(),
          data_expiracao: dataExpiracao
        });

        // Simular envio de email para desenvolvimento
        const emailResult = await EmailSimulator.sendOTP(email.trim().toLowerCase(), codigoOTP);

        logInfo(`OTP gerado para desenvolvimento: ${codigoOTP}`, 'otp-controller');
        
        res.status(200).json({
          status: 'sucesso',
          mensagem: 'Código OTP gerado (modo desenvolvimento - email indisponível)',
          dados: {
            codigo_otp: codigoOTP, // Retorna o código para teste
            tempo_expiracao: '15 minutos',
            modo: 'desenvolvimento_sem_email',
            preview_email: emailResult.preview_url // Link para ver o email simulado
          }
        });
      } else {
        // Em produção, propagar o erro
        throw emailError;
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao enviar OTP: ${error.message}`, 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      logError('Erro interno ao enviar OTP', 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

/**
 * Verificar código OTP e redefinir senha
 * POST /auth/verificar-otp
 */
export const verificarOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    logInfo('Recebendo solicitação de verificação de OTP', 'otp-controller');
    
    const { email, codigo_otp, nova_senha } = req.body;
    
    // Validações básicas
    if (!email || !codigo_otp || !nova_senha) {
      logWarning('Tentativa de verificação de OTP com dados incompletos', 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Email, código OTP e nova senha são obrigatórios'
      });
      return;
    }

    if (codigo_otp.length !== 6) {
      logWarning(`Código OTP com formato inválido: ${codigo_otp.length} caracteres`, 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Código OTP deve ter exatamente 6 dígitos'
      });
      return;
    }

    logInfo(`Processando verificação de OTP para: ${email}`, 'otp-controller');
    
    // Chamar serviço
    const mensagem = await OTPService.verificarOTPERedefinirSenha({
      email,
      codigo_otp,
      nova_senha
    });
    
    logInfo(`Redefinição de senha concluída para: ${email}`, 'otp-controller');
    
    res.status(200).json({
      status: 'sucesso',
      mensagem
    });

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao verificar OTP: ${error.message}`, 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      logError('Erro interno ao verificar OTP', 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

/**
 * Endpoint alternativo para compatibilidade
 * POST /auth/esqueci-senha (alias para enviar-otp)
 */
export const esqueciSenha = async (req: Request, res: Response): Promise<void> => {
  // Redireciona para a função de enviar OTP
  await enviarOTP(req, res);
};

/**
 * Endpoint alternativo para compatibilidade
 * POST /auth/redefinir-senha (alias para verificar-otp)
 */
export const redefinirSenha = async (req: Request, res: Response): Promise<void> => {
  // Redireciona para a função de verificar OTP
  await verificarOTP(req, res);
};

/**
 * Obter estatísticas do sistema OTP (apenas para desenvolvimento/admin)
 * GET /auth/otp/stats
 */
export const obterEstatisticasOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    logInfo('Solicitando estatísticas do sistema OTP', 'otp-controller');
    
    const estatisticas = await OTPService.obterEstatisticasOTP();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Estatísticas obtidas com sucesso',
      dados: estatisticas
    });

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao obter estatísticas OTP: ${error.message}`, 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      logError('Erro interno ao obter estatísticas OTP', 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

/**
 * Executar limpeza de OTPs expirados (para rotinas de manutenção)
 * POST /auth/otp/limpar-expirados
 */
export const limparOTPsExpirados = async (req: Request, res: Response): Promise<void> => {
  try {
    logInfo('Executando limpeza de OTPs expirados', 'otp-controller');
    
    const deletedCount = await OTPService.limparOTPsExpirados();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: `${deletedCount} OTPs expirados removidos com sucesso`,
      dados: { removidos: deletedCount }
    });

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao limpar OTPs expirados: ${error.message}`, 'otp-controller');
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      logError('Erro interno ao limpar OTPs expirados', 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

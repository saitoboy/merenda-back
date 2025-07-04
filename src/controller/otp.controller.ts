import { Request, Response } from 'express';
import * as OTPService from '../services/otp.service';
import { logInfo, logWarning, logError } from '../utils/logger';

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
    
    // Chamar serviço
    const resultado = await OTPService.enviarOTP({ email });
    
    logInfo(`OTP enviado com sucesso para: ${email}`, 'otp-controller');
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem,
      dados: resultado.dados_depuracao // Apenas em desenvolvimento
    });

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

/**
 * Testar configuração de email (apenas para desenvolvimento/admin)
 * POST /auth/otp/testar-email
 */
export const testarEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    logInfo('Testando configuração de email', 'otp-controller');
    
    const { email } = req.body;
    
    // Validação básica
    if (!email) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Email é obrigatório para teste'
      });
      return;
    }

    // Importar o serviço de email
    const { sendEmail, isEmailServiceReady, isEmailServiceDev } = require('../utils/email-service');
    
    if (!isEmailServiceReady()) {
      res.status(503).json({
        status: 'erro',
        mensagem: 'Serviço de email não está configurado'
      });
      return;
    }

    // Enviar email de teste
    const resultado = await sendEmail({
      to: email,
      subject: 'Teste de Configuração - Merenda Smart Flow',
      text: 'Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.',
      html: `
        <h2>🧪 Teste de Email</h2>
        <p>Se você está recebendo este email, significa que a configuração SMTP do Merenda Smart Flow está funcionando corretamente!</p>
        <p><strong>Modo:</strong> ${isEmailServiceDev() ? 'Desenvolvimento' : 'Produção'}</p>
        <p><strong>Enviado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <hr>
        <small>Este é um email de teste gerado automaticamente.</small>
      `
    });

    if (resultado.success) {
      logInfo(`Email de teste enviado com sucesso para: ${email}`, 'otp-controller');
      
      const resposta: any = {
        status: 'sucesso',
        mensagem: 'Email de teste enviado com sucesso',
        dados: {
          messageId: resultado.messageId,
          modo: isEmailServiceDev() ? 'desenvolvimento' : 'producao'
        }
      };

      // Se estiver em desenvolvimento, incluir URL de preview
      if (resultado.previewUrl) {
        resposta.dados.previewUrl = resultado.previewUrl;
      }

      res.status(200).json(resposta);
    } else {
      logError(`Falha ao enviar email de teste: ${resultado.error}`, 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Falha ao enviar email de teste',
        detalhes: resultado.error
      });
    }

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao testar email: ${error.message}`, 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno ao testar email',
        detalhes: error.message
      });
    } else {
      logError('Erro interno ao testar email', 'otp-controller');
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

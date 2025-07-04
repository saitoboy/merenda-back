import nodemailer from 'nodemailer';
import { HttpsProxyAgent } from 'https-proxy-agent';
import tunnel from 'tunnel';
import { logInfo, logWarning, logError, logDebug } from './logger';

/**
     this.transporter = nodemailer.createTransporter(config);
    
    logDebug('Configuração SMTP carregada', 'email', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user,
      from: process.env.SMTP_FROM || 'naoresponda@tec.edu.mg.gov.br'
    });uração do serviço de email para envio de OTP
 * Suporta SMTP e modo de desenvolvimento (ethereal email)
 */

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string; // Para modo desenvolvimento
  error?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;
  private isDevelopment = false;

  /**
   * Inicializa o serviço de email
   */
  async initialize(): Promise<void> {
    try {
      logInfo('Inicializando serviço de email...', 'email');

      // Verificar se estamos em desenvolvimento
      this.isDevelopment = process.env.NODE_ENV === 'development' || 
                          !process.env.SMTP_HOST || 
                          process.env.FORCE_DEV_EMAIL === 'true';

      if (this.isDevelopment) {
        await this.setupDevelopmentEmail();
      } else {
        await this.setupProductionEmail();
      }

      // Testar a conexão
      await this.testConnection();
      
      this.isConfigured = true;
      logInfo('Serviço de email configurado com sucesso', 'email');
    } catch (error) {
      logError('Erro ao inicializar serviço de email', 'email', error);
      throw new Error('Falha ao configurar serviço de email');
    }
  }

  /**
   * Configura email para desenvolvimento (modo simplificado sem SMTP)
   */
  private async setupDevelopmentEmail(): Promise<void> {
    if (process.env.FORCE_DEV_EMAIL === 'true') {
      logWarning('🔧 Modo desenvolvimento FORÇADO devido a problemas de proxy/SMTP', 'email');
      logInfo('📧 Emails serão simulados e códigos OTP aparecerão nos logs', 'email');
      
      // Criar transporter fake que não faz conexão real
      this.transporter = {
        sendMail: async (mailOptions: any) => {
          logInfo(`📧 EMAIL SIMULADO para: ${mailOptions.to}`, 'email');
          logInfo(`📧 Assunto: ${mailOptions.subject}`, 'email');
          if (mailOptions.text && mailOptions.text.includes('código de verificação é:')) {
            const codigo = mailOptions.text.match(/código de verificação é: (\w+)/)?.[1];
            if (codigo) {
              logInfo(`🔑 CÓDIGO OTP GERADO: ${codigo}`, 'email');
              logInfo(`🔑 Use este código para testar a verificação!`, 'email');
            }
          }
          return { messageId: `fake-${Date.now()}@dev.local` };
        },
        verify: async () => true
      } as any;
      
      logDebug('Modo desenvolvimento configurado (sem SMTP real)', 'email');
      return;
    }
    
    logInfo('Configurando email para desenvolvimento (Ethereal Email)', 'email');
    
    try {
      // Criar conta de teste do Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      logDebug('Conta de desenvolvimento criada', 'email', {
        user: testAccount.user,
        smtp: 'smtp.ethereal.email:587'
      });
    } catch (error) {
      logWarning('Falha ao criar conta Ethereal, usando modo simulado', 'email', error);
      // Fallback para modo simulado
      process.env.FORCE_DEV_EMAIL = 'true';
      await this.setupDevelopmentEmail();
    }
  }

  /**
   * Configura email para produção
   */
  private async setupProductionEmail(): Promise<void> {
    logInfo('Configurando email para produção', 'email');

    // Verificar se deve forçar modo desenvolvimento
    if (process.env.FORCE_DEV_EMAIL === 'true') {
      logWarning('🔧 Modo desenvolvimento FORÇADO devido a problemas de proxy/SMTP', 'email');
      logInfo('📧 Emails serão simulados e códigos OTP aparecerão nos logs', 'email');
      this.isDevelopment = true;
      await this.setupDevelopmentEmail();
      return;
    }

    const port = parseInt(process.env.SMTP_PORT || '587');
    const isGmail = (process.env.SMTP_HOST || '').includes('gmail.com');
    
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || '',
      port: port,
      secure: isGmail ? port === 465 : process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    };

    // Validar configuração
    if (!config.host || !config.auth.user || !config.auth.pass) {
      const missing = [];
      if (!config.host) missing.push('SMTP_HOST');
      if (!config.auth.user) missing.push('SMTP_USER');  
      if (!config.auth.pass) missing.push('SMTP_PASSWORD');
      
      throw new Error(`Configuração SMTP incompleta. Variáveis faltando: ${missing.join(', ')}`);
    }

    // Configuração simples para Gmail (sem proxy)
    const transportConfig = {
      host: config.host,
      port: config.port,
      secure: config.secure, // false para 587, true para 465
      auth: config.auth,
      
      // Configurações TLS para Gmail
      tls: {
        rejectUnauthorized: false
      },

      // Timeouts padrão
      connectionTimeout: 30000, // 30 segundos
      greetingTimeout: 15000,   // 15 segundos
      socketTimeout: 30000,     // 30 segundos
    };

    this.transporter = nodemailer.createTransport(transportConfig);
    
    logDebug('Configuração SMTP carregada (sem proxy)', 'email', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user,
      isGmail: isGmail
    });
  }

  /**
   * Testa a conexão com o servidor de email
   */
  private async testConnection(): Promise<void> {
    if (!this.transporter) {
      throw new Error('Transporter não configurado');
    }

    try {
      logInfo('Verificando conexão com servidor de email...', 'email');
      await this.transporter.verify();
      logInfo('✅ Conexão com servidor de email verificada com sucesso!', 'email');
    } catch (error) {
      logError('Falha ao verificar conexão com servidor de email', 'email', error);
      throw error;
    }
  }

  /**
   * Envia um email
   */
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.isConfigured || !this.transporter) {
      logError('Serviço de email não configurado', 'email');
      return {
        success: false,
        error: 'Serviço de email não configurado'
      };
    }

    try {
      logInfo(`Enviando email para ${emailData.to}`, 'email');
      
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Merenda Smart Flow" <naoresponda@tec.edu.mg.gov.br>',
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      logInfo(`Email enviado com sucesso: ${info.messageId}`, 'email');

      const result: EmailResult = {
        success: true,
        messageId: info.messageId,
      };

      // Se estiver em desenvolvimento, adicionar URL de preview
      if (this.isDevelopment) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          result.previewUrl = previewUrl;
          logInfo(`Preview do email (desenvolvimento): ${result.previewUrl}`, 'email');
        }
      }

      return result;

    } catch (error) {
      logError('Erro ao enviar email', 'email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Envia email com código OTP
   */
  async sendOTPEmail(email: string, codigo: string, tempoExpiracao: number): Promise<EmailResult> {
    const subject = 'Código de Verificação - Merenda Smart Flow';
    
    const text = `
Olá!

Você solicitou a redefinição de sua senha no sistema Merenda Smart Flow.

Seu código de verificação é: ${codigo}

Este código é válido por ${tempoExpiracao} minutos.

Se você não solicitou esta redefinição, ignore este email.

Atenciosamente,
Equipe Merenda Smart Flow
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .code { background: #e74c3c; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍎 Merenda Smart Flow</h1>
            <p>Redefinição de Senha</p>
        </div>
        
        <div class="content">
            <h2>Código de Verificação</h2>
            <p>Olá!</p>
            <p>Você solicitou a redefinição de sua senha no sistema Merenda Smart Flow.</p>
            
            <div class="code">${codigo}</div>
            
            <p><strong>Importante:</strong></p>
            <ul>
                <li>Este código é válido por <strong>${tempoExpiracao} minutos</strong></li>
                <li>Use este código apenas no site oficial do Merenda Smart Flow</li>
                <li>Não compartilhe este código com ninguém</li>
            </ul>
            
            <div class="warning">
                <strong>⚠️ Atenção:</strong> Se você não solicitou esta redefinição, ignore este email e sua conta permanecerá segura.
            </div>
        </div>
        
        <div class="footer">
            <p>Este é um email automático, não responda.</p>
            <p>© 2025 Merenda Smart Flow - Sistema de Gestão de Merenda Escolar</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    return await this.sendEmail({
      to: email,
      subject,
      text,
      html
    });
  }

  /**
   * Verifica se o serviço está configurado
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Retorna se está em modo de desenvolvimento
   */
  isDev(): boolean {
    return this.isDevelopment;
  }
}

// Instância singleton do serviço de email
const emailService = new EmailService();

export default emailService;

// Funções helper para uso direto
export const initializeEmailService = () => emailService.initialize();
export const sendEmail = (emailData: EmailData) => emailService.sendEmail(emailData);
export const sendOTPEmail = (email: string, codigo: string, tempoExpiracao: number) => 
  emailService.sendOTPEmail(email, codigo, tempoExpiracao);
export const isEmailServiceReady = () => emailService.isReady();
export const isEmailServiceDev = () => emailService.isDev();

import nodemailer from 'nodemailer';
import { logInfo, logWarning, logError, logDebug } from './logger';

/**
 * Configuração do serviço de email para envio de OTP
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

      // Verificar se devemos usar SMTP real ou modo desenvolvimento
      // Se temos configuração SMTP, usar sempre ela, mesmo em development
      const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
      this.isDevelopment = !hasSmtpConfig;

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
   * Configura email para desenvolvimento (ethereal email)
   */
  private async setupDevelopmentEmail(): Promise<void> {
    logInfo('Configurando email para desenvolvimento (Ethereal Email)', 'email');

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
  }

  /**
   * Configura email para produção
   */
  private async setupProductionEmail(): Promise<void> {
    logInfo('Configurando email para produção', 'email');

    const config: EmailConfig = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    };

    // Validar configuração
    if (!config.host || !config.auth.user || !config.auth.pass) {
      throw new Error('Configuração SMTP incompleta. Verifique as variáveis de ambiente.');
    }

    this.transporter = nodemailer.createTransport(config);

    logDebug('Configuração SMTP carregada', 'email', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user
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
      await this.transporter.verify();
      logInfo('Conexão com servidor de email verificada', 'email');
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
        from: process.env.SMTP_FROM || '"Merenda Smart Flow" <noreply@merenda.gov.br>',
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
  async sendOTPEmail(email: string, codigo: string, tempoExpiracao: number, nome?: string): Promise<EmailResult> {
    const subject = 'Código de Verificação - Caminho da Merenda';

    // Se não passar nome, usa só "Olá"
    const saudacao = nome ? `Olá, ${nome}!` : 'Olá!';

    const text = `
${saudacao}

Você solicitou a redefinição de sua senha no sistema Caminho da Merenda.

Seu código de verificação é: ${codigo}

Este código é válido por ${tempoExpiracao} minutos.

Se você não solicitou esta redefinição, ignore este email.

Atenciosamente,
Equipe Caminho da Merenda
  `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2e4e37; color: white; padding: 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; margin-bottom: 10px; }
        .content { padding: 20px; background: #f8f9fa; }
        .code { background: #9b1222; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; border-radius: 8px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://digiescola.muriae.mg.gov.br/wp-content/uploads/2025/06/logo-04.png" alt="Caminho da Merenda" class="logo">
            <p>Redefinição de Senha</p>
        </div>
        
        <div class="content">
            <h2>Código de Verificação</h2>
            <p>${saudacao}</p>
            <p>Você solicitou a redefinição de sua senha no sistema Caminho da Merenda.</p>
            
            <div class="code">${codigo}</div>
            
            <p><strong>Importante:</strong></p>
            <ul>
                <li>Este código é válido por <strong>${tempoExpiracao} minutos</strong></li>
                <li>Use este código apenas no site oficial do Caminho da Merenda</li>
                <li>Não compartilhe este código com ninguém</li>
            </ul>
            
            <div class="warning">
                <strong>⚠️ Atenção:</strong> Se você não solicitou esta redefinição, ignore este email e sua conta permanecerá segura.
            </div>
        </div>
        
        <div class="footer">
            <p>Este é um email automático, não responda.</p>
            <p>© 2025 Caminho da Merenda - Sistema de Gestão de Merenda Escolar</p>
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
export const sendOTPEmail = (email: string, codigo: string, tempoExpiracao: number, nome?: string) =>
  emailService.sendOTPEmail(email, codigo, tempoExpiracao, nome);
export const isEmailServiceReady = () => emailService.isReady();
export const isEmailServiceDev = () => emailService.isDev();

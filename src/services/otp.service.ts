import * as PasswordResetOTPModel from '../model/password-reset-otp.model';
import * as UsuarioModel from '../model/usuario.model';
import { validateInstitutionalEmail } from '../utils/email-validator';
import { sendOTPEmail, isEmailServiceReady } from '../utils/email-service';
import { criptografarSenha } from '../utils';
import { logInfo, logWarning, logError, logDebug } from '../utils/logger';
import { 
  EnviarOTPRequest, 
  VerificarOTPRequest, 
  EnviarOTPResponse 
} from '../types';

/**
 * Serviço para gerenciamento de OTP (One Time Password) para redefinição de senhas
 * Integra validação de email institucional com envio de códigos temporários
 */

// Configurações do OTP
const OTP_CONFIG = {
  CODIGO_LENGTH: 6,
  EXPIRACAO_MINUTOS: 15,
  MAX_TENTATIVAS: 3,
  RATE_LIMIT_HORAS: 1,
  MAX_OTPS_POR_HORA: 3
};

/**
 * Gera um código OTP de 6 dígitos
 */
function gerarCodigoOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calcula data de expiração do OTP
 */
function calcularDataExpiracao(): Date {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() + OTP_CONFIG.EXPIRACAO_MINUTOS);
  return agora;
}

/**
 * Envia código OTP para redefinição de senha
 */
export const enviarOTP = async (request: EnviarOTPRequest): Promise<EnviarOTPResponse> => {
  try {
    logInfo(`Iniciando processo de envio de OTP para: ${request.email}`, 'otp');

    // 1. Validar email institucional
    const emailValidation = validateInstitutionalEmail(request.email);
    if (!emailValidation.isValid) {
      logWarning(`Tentativa de OTP com email inválido: ${request.email}`, 'otp');
      throw new Error(emailValidation.message || 'Email inválido');
    }

    const emailNormalizado = request.email.trim().toLowerCase();

    // 2. Verificar se o usuário existe no sistema
    const usuario = await UsuarioModel.buscarPorEmail(emailNormalizado);
    if (!usuario) {
      logWarning(`Tentativa de OTP para email não cadastrado: ${emailNormalizado}`, 'otp');
      throw new Error('Email não encontrado no sistema. Apenas usuários cadastrados podem redefinir a senha.');
    }

    // 3. Verificar rate limiting
    const tentativasRecentes = await PasswordResetOTPModel.contarTentativasRecentes(
      usuario.id_usuario, 
      OTP_CONFIG.RATE_LIMIT_HORAS
    );

    if (tentativasRecentes >= OTP_CONFIG.MAX_OTPS_POR_HORA) {
      logWarning(`Rate limit excedido para usuário ${usuario.id_usuario}: ${tentativasRecentes} tentativas`, 'otp');
      throw new Error(`Muitas tentativas. Aguarde ${OTP_CONFIG.RATE_LIMIT_HORAS} hora(s) antes de tentar novamente.`);
    }

    // 4. Verificar se serviço de email está disponível
    if (!isEmailServiceReady()) {
      logError('Serviço de email não está disponível', 'otp');
      throw new Error('Serviço de email temporariamente indisponível. Tente novamente em alguns minutos.');
    }

    // 5. Invalidar OTPs ativos anteriores
    await PasswordResetOTPModel.invalidarOTPsAtivos(usuario.id_usuario);
    logDebug(`OTPs anteriores invalidados para usuário ${usuario.id_usuario}`, 'otp');

    // 6. Gerar novo código OTP
    const codigoOTP = gerarCodigoOTP();
    const dataExpiracao = calcularDataExpiracao();

    // 7. Salvar OTP no banco
    const otpId = await PasswordResetOTPModel.criar({
      id_usuario: usuario.id_usuario,
      email_usuario: emailNormalizado,
      codigo_otp: codigoOTP,
      tentativas: 0,
      usado: false,
      data_criacao: new Date(),
      data_expiracao: dataExpiracao
    });

    logDebug(`OTP criado com ID: ${otpId}`, 'otp');

    // 8. Enviar email com o código
    const emailResult = await sendOTPEmail(
      emailNormalizado, 
      codigoOTP, 
      OTP_CONFIG.EXPIRACAO_MINUTOS
    );

    if (!emailResult.success) {
      logError(`Falha ao enviar email OTP para ${emailNormalizado}`, 'otp', emailResult.error);
      throw new Error('Erro ao enviar email. Tente novamente em alguns minutos.');
    }

    logInfo(`OTP enviado com sucesso para ${emailNormalizado}`, 'otp');

    // 9. Preparar resposta
    const response: EnviarOTPResponse = {
      mensagem: `Código de verificação enviado para ${emailNormalizado}. Verifique sua caixa de entrada.`
    };

    // Em modo de desenvolvimento, incluir dados extras para facilitar testes
    if (process.env.NODE_ENV === 'development') {
      response.dados_depuracao = {
        codigo_gerado: codigoOTP,
        tempo_expiracao: `${OTP_CONFIG.EXPIRACAO_MINUTOS} minutos`,
        email_valido: true
      };

      if (emailResult.previewUrl) {
        logInfo(`Preview do email: ${emailResult.previewUrl}`, 'otp');
      }
    }

    return response;

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao enviar OTP: ${error.message}`, 'otp');
      throw error;
    } else {
      logError('Erro desconhecido ao enviar OTP', 'otp');
      throw new Error('Erro interno do servidor');
    }
  }
};

/**
 * Verifica código OTP e redefine a senha
 */
export const verificarOTPERedefinirSenha = async (request: VerificarOTPRequest): Promise<string> => {
  try {
    logInfo(`Iniciando verificação de OTP para: ${request.email}`, 'otp');

    // 1. Validar dados de entrada
    if (!request.email || !request.codigo_otp || !request.nova_senha) {
      throw new Error('Email, código OTP e nova senha são obrigatórios');
    }

    if (request.codigo_otp.length !== OTP_CONFIG.CODIGO_LENGTH) {
      throw new Error('Código OTP deve ter exatamente 6 dígitos');
    }

    if (request.nova_senha.length < 6) {
      throw new Error('Nova senha deve ter pelo menos 6 caracteres');
    }

    const emailNormalizado = request.email.trim().toLowerCase();

    // 2. Verificar se usuário existe
    const usuarioVerificacao = await UsuarioModel.buscarPorEmail(emailNormalizado);
    if (!usuarioVerificacao) {
      logWarning(`Tentativa de verificação OTP para email não cadastrado: ${emailNormalizado}`, 'otp');
      throw new Error('Usuário não encontrado');
    }

    // 3. Buscar OTP válido
    const otp = await PasswordResetOTPModel.buscarPorUsuarioECodigo(
      usuarioVerificacao.id_usuario, 
      request.codigo_otp
    );

    if (!otp) {
      logWarning(`Código OTP inválido ou expirado para ${emailNormalizado}`, 'otp');
      throw new Error('Código inválido ou expirado');
    }

    // 3. Verificar tentativas
    if (otp.tentativas >= OTP_CONFIG.MAX_TENTATIVAS) {
      logWarning(`Número máximo de tentativas excedido para OTP ${otp.id_otp}`, 'otp');
      await PasswordResetOTPModel.marcarComoUsado(otp.id_otp);
      throw new Error('Código bloqueado por excesso de tentativas. Solicite um novo código.');
    }

    // 4. Incrementar tentativas
    await PasswordResetOTPModel.incrementarTentativas(otp.id_otp);

    // 5. Verificar se usuário ainda existe
    const usuario = await UsuarioModel.buscarPorEmail(emailNormalizado);
    if (!usuario) {
      logError(`Usuário não encontrado durante redefinição de senha: ${emailNormalizado}`, 'otp');
      throw new Error('Usuário não encontrado');
    }

    // 6. Criptografar nova senha
    const novaSenhaCriptografada = await criptografarSenha(request.nova_senha);

    // 7. Atualizar senha do usuário
    await UsuarioModel.alterarSenha(usuario.id_usuario, novaSenhaCriptografada);
    logInfo(`Senha alterada com sucesso para usuário ${usuario.id_usuario}`, 'otp');

    // 8. Marcar OTP como usado
    await PasswordResetOTPModel.marcarComoUsado(otp.id_otp);

    // 9. Invalidar outros OTPs do usuário
    await PasswordResetOTPModel.invalidarOTPsAtivos(usuario.id_usuario);

    logInfo(`Redefinição de senha concluída com sucesso para ${emailNormalizado}`, 'otp');
    
    return 'Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.';

  } catch (error) {
    if (error instanceof Error) {
      logError(`Erro ao verificar OTP: ${error.message}`, 'otp');
      throw error;
    } else {
      logError('Erro desconhecido ao verificar OTP', 'otp');
      throw new Error('Erro interno do servidor');
    }
  }
};

/**
 * Limpa OTPs expirados (para execução em rotina de limpeza)
 */
export const limparOTPsExpirados = async (): Promise<number> => {
  try {
    logInfo('Iniciando limpeza de OTPs expirados', 'otp');
    const deletedCount = await PasswordResetOTPModel.limparExpirados();
    logInfo(`${deletedCount} OTPs expirados removidos`, 'otp');
    return deletedCount;
  } catch (error) {
    logError('Erro ao limpar OTPs expirados', 'otp', error);
    throw error;
  }
};

/**
 * Retorna estatísticas do sistema OTP
 */
export const obterEstatisticasOTP = async () => {
  try {
    // Implementar estatísticas se necessário no futuro
    return {
      configuracao: OTP_CONFIG,
      servico_email_ativo: isEmailServiceReady()
    };
  } catch (error) {
    logError('Erro ao obter estatísticas OTP', 'otp', error);
    throw error;
  }
};

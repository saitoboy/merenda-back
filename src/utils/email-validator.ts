import { logInfo, logWarning, logError } from './logger';

/**
 * Utilitário para validação de emails institucionais
 * Permite apenas emails dos domínios:
 * - @edu.muriae.mg.gov.br
 * - @tec.edu.muriae.mg.gov.br  
 * - @prof.edu.muriae.mg.gov.br
 */

export interface EmailValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Regex para validação de emails institucionais
 * ^[a-zA-Z0-9._%+-]+ = parte do usuário (permite letras, números, pontos, underscores, %, +, -)
 * @ = arroba obrigatória
 * (edu|tec\.edu|prof\.edu) = prefixos permitidos (edu, tec.edu, prof.edu)
 * \.muriae\.mg\.gov\.br = domínio fixo (pontos escapados)
 * $ = fim da string
 */
const INSTITUTIONAL_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(edu|tec\.edu|prof\.edu)\.muriae\.mg\.gov\.br$/;

/**
 * Domínios autorizados para acesso ao sistema
 */
const AUTHORIZED_DOMAINS = [
  '@edu.muriae.mg.gov.br',
  '@tec.edu.muriae.mg.gov.br', 
  '@prof.edu.muriae.mg.gov.br'
];

/**
 * Valida se o email possui domínio institucional autorizado
 * @param email Email a ser validado
 * @returns Resultado da validação com mensagem explicativa
 */
export const validateInstitutionalEmail = (email: string): EmailValidationResult => {
  // Verificar se email está presente
  if (!email || typeof email !== 'string') {
    logWarning('Tentativa de validação com email vazio ou inválido', 'auth');
    return {
      isValid: false,
      message: 'Email é obrigatório'
    };
  }

  // Normalizar email (remover espaços e converter para minúsculo)
  const normalizedEmail = email.trim().toLowerCase();

  // Validar formato básico de email
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(normalizedEmail)) {
    logWarning(`Email com formato inválido: ${normalizedEmail}`, 'auth');
    return {
      isValid: false,
      message: 'Formato de email inválido'
    };
  }

  // Validar domínio institucional
  if (!INSTITUTIONAL_EMAIL_REGEX.test(normalizedEmail)) {
    logWarning(`Tentativa de acesso com email não autorizado: ${normalizedEmail}`, 'auth');
    return {
      isValid: false,
      message: `Email não autorizado. Apenas emails institucionais são permitidos: ${AUTHORIZED_DOMAINS.join(', ')}`
    };
  }

  // Email válido
  logInfo(`Email institucional validado com sucesso: ${normalizedEmail}`, 'auth');
  return {
    isValid: true
  };
};

/**
 * Verifica se email é válido (função simplificada)
 * @param email Email a ser validado
 * @returns true se válido, false se inválido
 */
export const isValidInstitutionalEmail = (email: string): boolean => {
  const result = validateInstitutionalEmail(email);
  return result.isValid;
};

/**
 * Lista dos domínios autorizados
 * @returns Array com domínios permitidos
 */
export const getAuthorizedDomains = (): string[] => {
  return [...AUTHORIZED_DOMAINS];
};

/**
 * Extrai o domínio do email
 * @param email Email completo
 * @returns Domínio extraído ou null se inválido
 */
export const extractEmailDomain = (email: string): string | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 ? `@${parts[1]}` : null;
};

/**
 * Verifica se um domínio específico é autorizado
 * @param domain Domínio a ser verificado (ex: @edu.muriae.mg.gov.br)
 * @returns true se autorizado, false caso contrário
 */
export const isAuthorizedDomain = (domain: string): boolean => {
  return AUTHORIZED_DOMAINS.includes(domain.toLowerCase());
};

/**
 * Retorna estatísticas de tentativas de validação
 * Útil para monitoramento e auditoria
 */
class EmailValidationStats {
  private static validAttempts = 0;
  private static invalidAttempts = 0;
  private static unauthorizedDomains = new Map<string, number>();

  static recordValidAttempt(): void {
    this.validAttempts++;
  }

  static recordInvalidAttempt(domain?: string): void {
    this.invalidAttempts++;
    if (domain) {
      const count = this.unauthorizedDomains.get(domain) || 0;
      this.unauthorizedDomains.set(domain, count + 1);
    }
  }

  static getStats() {
    const totalAttempts = this.validAttempts + this.invalidAttempts;
    return {
      validAttempts: this.validAttempts,
      invalidAttempts: this.invalidAttempts,
      totalAttempts: totalAttempts,
      unauthorizedDomains: Object.fromEntries(this.unauthorizedDomains),
      successRate: totalAttempts > 0 ? 
        (this.validAttempts / totalAttempts * 100).toFixed(2) + '%' : '0%'
    };
  }

  static resetStats(): void {
    this.validAttempts = 0;
    this.invalidAttempts = 0;
    this.unauthorizedDomains.clear();
    logInfo('Estatísticas de validação de email resetadas', 'auth');
  }
}

/**
 * Valida email e registra estatísticas
 * @param email Email a ser validado
 * @returns Resultado da validação
 */
export const validateEmailWithStats = (email: string): EmailValidationResult => {
  const result = validateInstitutionalEmail(email);
  
  if (result.isValid) {
    EmailValidationStats.recordValidAttempt();
  } else {
    const domain = extractEmailDomain(email);
    EmailValidationStats.recordInvalidAttempt(domain || undefined);
  }

  return result;
};

/**
 * Obtém estatísticas de validação
 */
export const getEmailValidationStats = () => {
  return EmailValidationStats.getStats();
};

/**
 * Reseta estatísticas de validação
 */
export const resetEmailValidationStats = () => {
  EmailValidationStats.resetStats();
};

// Logs de inicialização do módulo
logInfo('Módulo de validação de email institucional carregado', 'auth', {
  dominiosAutorizados: AUTHORIZED_DOMAINS,
  regexPattern: INSTITUTIONAL_EMAIL_REGEX.source
});

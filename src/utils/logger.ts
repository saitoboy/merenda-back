/**
 * Utilitário para logs amigáveis com emojis
 */

// Tipos de log
type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

// Emojis para cada tipo de log
const emojis = {
  info: '💡',
  success: '✅',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  server: '🚀',
  database: '🗄️',
  user: '👤',
  auth: '🔐',
  escola: '🏫',
  pedido: '📦',
  estoque: '📊',
  fornecedor: '🏭',
  route: '🛣️',
  controller: '🎮',
  service: '⚙️',
  model: '💾',
};

// Cores ANSI para o terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Função principal de log
export const log = (
  level: LogLevel,
  message: string,
  context?: string,
  data?: any
): void => {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const emoji = context ? (emojis[context as keyof typeof emojis] || '📝') : emojis[level];
  let colorCode = '';

  // Seleciona a cor com base no nível do log
  switch (level) {
    case 'info':
      colorCode = colors.blue;
      break;
    case 'success':
      colorCode = colors.green;
      break;
    case 'warn':
      colorCode = colors.yellow;
      break;
    case 'error':
      colorCode = colors.red;
      break;
    case 'debug':
      colorCode = colors.magenta;
      break;
    default:
      colorCode = colors.white;
  }

  // Formata a mensagem
  const contextStr = context ? ` [${context.toUpperCase()}]` : '';
  let logMessage = `${colorCode}${timestamp} ${emoji}${contextStr} ${message}${colors.reset}`;

  console.log(logMessage);

  // Se houver dados extras, exibe-os formatados
  if (data) {
    const dataStr = typeof data === 'object'
      ? JSON.stringify(data, null, 2)
      : data.toString();
    console.log(`${colors.dim}${dataStr}${colors.reset}`);
  }
};

// Funções específicas para cada nível de log
export const logInfo = (message: string, context?: string, data?: any): void =>
  log('info', message, context, data);

export const logSuccess = (message: string, context?: string, data?: any): void =>
  log('success', message, context, data);

export const logWarning = (message: string, context?: string, data?: any): void =>
  log('warn', message, context, data);

export const logError = (message: string, context?: string, data?: any): void =>
  log('error', message, context, data);

export const logDebug = (message: string, context?: string, data?: any): void =>
  log('debug', message, context, data);

// ==========================================
// CLASSES DE ERRO CUSTOMIZADAS PARA INTEGRIDADE
// ==========================================

/**
 * Erro base para validações de integridade
 */
export abstract class IntegrityError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    
    // Garantir que o stack trace aponte para onde o erro foi lançado
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Erro quando entidade não é encontrada
 */
export class NotFoundError extends IntegrityError {
  constructor(message: string = 'Entidade não encontrada') {
    super(message, 'NOT_FOUND');
  }
}

/**
 * Erro quando há violação de constraint/integridade referencial
 */
export class ConstraintViolationError extends IntegrityError {
  public readonly details: {
    entidade: string;
    id: string;
    dependencias: Record<string, number>;
  };
  
  constructor(
    message: string, 
    details: {
      entidade: string;
      id: string;
      dependencias: Record<string, number>;
    }
  ) {
    super(message, 'CONSTRAINT_VIOLATION');
    this.details = details;
  }
}

/**
 * Erro quando usuário não tem autorização para a operação
 */
export class ForbiddenError extends IntegrityError {
  public readonly requiredRole: string[];
  public readonly userRole: string;
  
  constructor(
    message: string = 'Operação não permitida para este perfil de usuário',
    requiredRole: string[],
    userRole: string
  ) {
    super(message, 'FORBIDDEN');
    this.requiredRole = requiredRole;
    this.userRole = userRole;
  }
}

/**
 * Erro quando entidade está em estado que impede a operação
 */
export class InvalidStateError extends IntegrityError {
  public readonly currentState: string;
  public readonly requiredState: string;
  
  constructor(
    message: string,
    currentState: string,
    requiredState: string
  ) {
    super(message, 'INVALID_STATE');
    this.currentState = currentState;
    this.requiredState = requiredState;
  }
}

/**
 * Função helper para verificar se erro é de integridade
 */
export const isIntegrityError = (error: unknown): error is IntegrityError => {
  return error instanceof IntegrityError;
};

/**
 * Função para mapear erro para response HTTP
 */
export const mapErrorToHttpResponse = (error: IntegrityError) => {
  switch (error.code) {
    case 'NOT_FOUND':
      return {
        status: 404,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          timestamp: error.timestamp
        }
      };
      
    case 'CONSTRAINT_VIOLATION':
      const constraintError = error as ConstraintViolationError;
      return {
        status: 400,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          detalhes: constraintError.details,
          timestamp: error.timestamp
        }
      };
      
    case 'FORBIDDEN':
      const forbiddenError = error as ForbiddenError;
      return {
        status: 403,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          detalhes: {
            perfil_usuario: forbiddenError.userRole,
            perfis_requeridos: forbiddenError.requiredRole
          },
          timestamp: error.timestamp
        }
      };
      
    case 'INVALID_STATE':
      const stateError = error as InvalidStateError;
      return {
        status: 400,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          detalhes: {
            estado_atual: stateError.currentState,
            estado_requerido: stateError.requiredState
          },
          timestamp: error.timestamp
        }
      };
      
    default:
      return {
        status: 500,
        response: {
          status: 'erro',
          mensagem: 'Erro interno do servidor',
          codigo: 'INTERNAL_ERROR',
          timestamp: new Date()
        }
      };
  }
};

// Exportação por padrão
export default {
  log,
  info: logInfo,
  success: logSuccess,
  warning: logWarning,
  error: logError,
  debug: logDebug,
};

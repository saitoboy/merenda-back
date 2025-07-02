/**
 * Classes de erro customizadas para validações de integridade referencial
 * Sistema Merenda Smart Flow
 */

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

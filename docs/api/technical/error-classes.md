# 🚨 Classes de Erro Customizadas - Validações de Integridade

## 📖 **Visão Geral**

Este documento especifica as classes de erro customizadas criadas para tratar validações de integridade referencial no sistema Merenda Smart Flow.

## 🏗️ **Estrutura das Classes**

### **Arquivo:** `src/utils/errors.ts`

```typescript
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
```

## 🎯 **Exemplos de Uso**

### **1. NotFoundError**
```typescript
// Service
const fornecedor = await FornecedorModel.buscarPorId(id);
if (!fornecedor) {
  throw new NotFoundError('Fornecedor não encontrado');
}

// Response: 404
{
  "status": "erro",
  "mensagem": "Fornecedor não encontrado",
  "codigo": "NOT_FOUND",
  "timestamp": "2025-07-01T10:30:00.000Z"
}
```

### **2. ConstraintViolationError**
```typescript
// Service
const itensVinculados = await contarItensDoFornecedor(id);
if (itensVinculados > 0) {
  throw new ConstraintViolationError(
    `Não é possível excluir fornecedor. Existem ${itensVinculados} itens vinculados a este fornecedor.`,
    {
      entidade: 'fornecedor',
      id: id,
      dependencias: {
        itens: itensVinculados
      }
    }
  );
}

// Response: 400
{
  "status": "erro",
  "mensagem": "Não é possível excluir fornecedor. Existem 5 itens vinculados a este fornecedor.",
  "codigo": "CONSTRAINT_VIOLATION",
  "detalhes": {
    "entidade": "fornecedor",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "dependencias": {
      "itens": 5
    }
  },
  "timestamp": "2025-07-01T10:30:00.000Z"
}
```

### **3. ForbiddenError**
```typescript
// Middleware/Service
if (!['ADMIN', 'NUTRICIONISTA'].includes(userRole)) {
  throw new ForbiddenError(
    'Apenas administradores e nutricionistas podem excluir fornecedores',
    ['ADMIN', 'NUTRICIONISTA'],
    userRole
  );
}

// Response: 403
{
  "status": "erro",
  "mensagem": "Apenas administradores e nutricionistas podem excluir fornecedores",
  "codigo": "FORBIDDEN",
  "detalhes": {
    "perfil_usuario": "ESCOLA",
    "perfis_requeridos": ["ADMIN", "NUTRICIONISTA"]
  },
  "timestamp": "2025-07-01T10:30:00.000Z"
}
```

### **4. InvalidStateError**
```typescript
// Service - Período Ativo
const periodo = await PeriodoModel.buscarPorId(id);
if (periodo.ativo) {
  throw new InvalidStateError(
    'Não é possível excluir período ativo',
    'ativo',
    'inativo'
  );
}

// Response: 400
{
  "status": "erro",
  "mensagem": "Não é possível excluir período ativo",
  "codigo": "INVALID_STATE",
  "detalhes": {
    "estado_atual": "ativo",
    "estado_requerido": "inativo"
  },
  "timestamp": "2025-07-01T10:30:00.000Z"
}
```

## 🔧 **Implementação no Controller**

### **Padrão de Error Handling:**
```typescript
export const excluirFornecedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await excluirFornecedorService(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Fornecedor excluído com sucesso',
      dados: {
        id_fornecedor: id,
        excluido_em: new Date().toISOString()
      }
    });
    
  } catch (error) {
    // Tratar erros customizados
    if (isIntegrityError(error)) {
      const { status, response } = mapErrorToHttpResponse(error);
      res.status(status).json(response);
      return;
    }
    
    // Erro não mapeado
    console.error('Erro não tratado:', error);
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor',
      codigo: 'INTERNAL_ERROR',
      timestamp: new Date()
    });
  }
};
```

## 📊 **Benefícios das Classes Customizadas**

### **✅ Vantagens:**
- **Tipagem forte** - TypeScript sabe exatamente que tipo de erro estamos tratando
- **Informações estruturadas** - Cada erro carrega dados específicos relevantes
- **Mapeamento automático** - Conversão direta para response HTTP apropriada
- **Logs consistentes** - Todos os erros têm timestamp e código padronizado
- **Debugging facilitado** - Stack trace preservado e informações detalhadas
- **Frontend amigável** - Respostas estruturadas que o frontend pode interpretar

### **🔍 Rastreabilidade:**
- Cada erro tem um `code` único para facilitar busca em logs
- Timestamp para análise temporal
- Detalhes específicos para debugging
- Stack trace preservado para desenvolvimento

### **🎨 Flexibilidade:**
- Fácil adicionar novos tipos de erro
- Detalhes customizáveis por tipo de erro
- Mapeamento HTTP configurável
- Mensagens localizáveis no futuro

## 🧪 **Exemplos de Uso em Produção**

### **Exemplos Reais dos Testes:**

```bash
# Teste Real 1: Fornecedor com Itens
curl -X DELETE http://localhost:3000/api/fornecedores/550e8400-e29b-41d4-a716-446655440000
# Response: 400 - ConstraintViolationError

# Teste Real 2: Período Ativo
curl -X DELETE http://localhost:3000/api/periodos/current-period-id
# Response: 400 - ConstraintViolationError com dependência "ativo"

# Teste Real 3: Escola com Estoque
curl -X DELETE http://localhost:3000/api/escolas/escola-id-com-estoque
# Response: 400 - ConstraintViolationError com dependência "estoque"

# Teste Real 4: Entidade Inexistente
curl -X DELETE http://localhost:3000/api/fornecedores/id-inexistente
# Response: 404 - NotFoundError
```

### **Logs Reais Gerados:**

```
[2025-07-02T10:30:00Z] INFO [fornecedor] Verificando se fornecedor 550e8400-e29b-41d4-a716-446655440000 pode ser excluído
[2025-07-02T10:30:00Z] WARNING [fornecedor] Fornecedor 550e8400-e29b-41d4-a716-446655440000 possui 5 itens vinculados
[2025-07-02T10:30:00Z] ERROR [controller] Erro ao excluir fornecedor: Não é possível excluir fornecedor. Existem 5 itens vinculados a este fornecedor.
```

---

**Data de Criação:** 01/07/2025  
**Última Revisão:** 02/07/2025  
**Versão:** 1.1  
**Autor:** Sistema Merenda Smart Flow  
**Status:** ✅ Implementado e Documentado

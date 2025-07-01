# 🔧 API: Validações de Integridade - Endpoints de Exclusão

## 📖 **Visão Geral**

Este documento especifica os endpoints de exclusão com validações de integridade referencial implementadas no sistema Merenda Smart Flow.

## 🛡️ **Endpoints com Validação**

### **1. DELETE /api/fornecedores/:id**

**Descrição:** Excluir fornecedor com validação de integridade

**Autorização:** `ADMIN`, `NUTRICIONISTA`

**Validações:**
- ✅ Verificar se existem itens vinculados ao fornecedor
- ✅ Verificar se o fornecedor existe

**Request:**
```bash
DELETE /api/fornecedores/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Fornecedor excluído com sucesso",
  "dados": {
    "id_fornecedor": "550e8400-e29b-41d4-a716-446655440000",
    "excluido_em": "2025-07-01T10:30:00Z"
  }
}
```

**Response Error (400) - Com Dependências:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir fornecedor. Existem 5 itens vinculados a este fornecedor.",
  "detalhes": {
    "entidade": "fornecedor",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "dependencias": {
      "itens": 5
    }
  }
}
```

**Response Error (404) - Não Encontrado:**
```json
{
  "status": "erro",
  "mensagem": "Fornecedor não encontrado"
}
```

---

### **2. DELETE /api/itens/:id**

**Descrição:** Excluir item com validação de integridade

**Autorização:** `ADMIN`, `NUTRICIONISTA`, `ESCOLA`

**Validações:**
- ✅ Verificar se existem registros de estoque para o item
- ✅ Verificar se o item existe

**Request:**
```bash
DELETE /api/itens/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Item excluído com sucesso",
  "dados": {
    "id_item": "550e8400-e29b-41d4-a716-446655440001",
    "excluido_em": "2025-07-01T10:30:00Z"
  }
}
```

**Response Error (400) - Com Dependências:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir item. Existem 3 registros de estoque para este item.",
  "detalhes": {
    "entidade": "item",
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "dependencias": {
      "estoque": 3
    }
  }
}
```

---

### **3. DELETE /api/escolas/:id**

**Descrição:** Excluir escola com validação de integridade

**Autorização:** `ADMIN`

**Validações:**
- ✅ Verificar se existem registros de estoque para a escola
- ✅ Verificar se existem segmentos vinculados à escola
- ✅ Verificar se a escola existe

**Request:**
```bash
DELETE /api/escolas/550e8400-e29b-41d4-a716-446655440002
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Escola excluída com sucesso",
  "dados": {
    "id_escola": "550e8400-e29b-41d4-a716-446655440002",
    "excluido_em": "2025-07-01T10:30:00Z"
  }
}
```

**Response Error (400) - Com Múltiplas Dependências:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir escola. Existem 15 registros de estoque para esta escola.",
  "detalhes": {
    "entidade": "escola",
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "dependencias": {
      "estoque": 15,
      "segmentos": 3
    }
  }
}
```

---

### **4. DELETE /api/segmentos/:id**

**Descrição:** Excluir segmento com validação de integridade

**Autorização:** `ADMIN`, `NUTRICIONISTA`

**Validações:**
- ✅ Verificar se existem escolas vinculadas ao segmento
- ✅ Verificar se existem registros de estoque para o segmento
- ✅ Verificar se o segmento existe

**Request:**
```bash
DELETE /api/segmentos/550e8400-e29b-41d4-a716-446655440003
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Segmento excluído com sucesso",
  "dados": {
    "id_segmento": "550e8400-e29b-41d4-a716-446655440003",
    "excluido_em": "2025-07-01T10:30:00Z"
  }
}
```

**Response Error (400) - Com Dependências:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir segmento. Existem 8 escolas vinculadas a este segmento.",
  "detalhes": {
    "entidade": "segmento",
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "dependencias": {
      "escolas": 8,
      "estoque": 25
    }
  }
}
```

---

### **5. DELETE /api/periodos/:id**

**Descrição:** Excluir período de lançamento com validação de integridade

**Autorização:** `ADMIN`

**Validações:**
- ✅ Verificar se o período não está ativo
- ✅ Verificar se existem registros de estoque para o período
- ✅ Verificar se o período existe

**Request:**
```bash
DELETE /api/periodos/550e8400-e29b-41d4-a716-446655440004
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Período excluído com sucesso",
  "dados": {
    "id_periodo": "550e8400-e29b-41d4-a716-446655440004",
    "excluido_em": "2025-07-01T10:30:00Z"
  }
}
```

**Response Error (400) - Período Ativo:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir período ativo.",
  "detalhes": {
    "entidade": "periodo",
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "razao": "periodo_ativo"
  }
}
```

**Response Error (400) - Com Dependências:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir período. Existem 50 registros de estoque para este período.",
  "detalhes": {
    "entidade": "periodo",
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "dependencias": {
      "estoque": 50
    }
  }
}
```

## 🧪 **Exemplos de Teste via cURL**

### **Teste 1: Fornecedor com Itens (Deve Falhar)**
```bash
curl -X DELETE http://localhost:3000/api/fornecedores/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### **Teste 2: Item sem Estoque (Deve Suceder)**
```bash
curl -X DELETE http://localhost:3000/api/itens/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### **Teste 3: Escola com Estoque (Deve Falhar)**
```bash
curl -X DELETE http://localhost:3000/api/escolas/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### **Teste 4: Segmento com Escolas (Deve Falhar)**
```bash
curl -X DELETE http://localhost:3000/api/segmentos/550e8400-e29b-41d4-a716-446655440003 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### **Teste 5: Período Ativo (Deve Falhar)**
```bash
curl -X DELETE http://localhost:3000/api/periodos/550e8400-e29b-41d4-a716-446655440004 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

## 📊 **Códigos de Status HTTP**

| Status | Significado | Quando Usar |
|--------|-------------|-------------|
| `200` | ✅ Success | Exclusão realizada com sucesso |
| `400` | ❌ Bad Request | Constraint violation, entidade tem dependências |
| `401` | 🔒 Unauthorized | Token inválido ou ausente |
| `403` | 🚫 Forbidden | Usuário não tem permissão para excluir |
| `404` | 🔍 Not Found | Entidade não existe |
| `500` | 💥 Internal Error | Erro interno do servidor |

## 🔄 **Fluxo de Validação**

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth
    participant Service
    participant Database

    Client->>API: DELETE /api/entidade/:id
    API->>Auth: Verificar token e permissões
    Auth-->>API: Token válido + permissões OK
    API->>Service: excluirEntidade(id)
    Service->>Database: SELECT COUNT(*) FROM dependencias WHERE id_entidade = ?
    Database-->>Service: count > 0
    Service-->>API: Error: "Existem X dependências"
    API-->>Client: 400 - Constraint Violation
```

## 📝 **Implementação Técnica**

### **Service Pattern:**
```typescript
export const excluirEntidade = async (id: string): Promise<void> => {
  try {
    // 1. Verificar dependências
    const dependencias = await verificarDependencias(id);
    if (dependencias.total > 0) {
      throw new ConstraintViolationError(
        `Não é possível excluir entidade. Existem ${dependencias.total} dependências.`,
        dependencias
      );
    }
    
    // 2. Excluir se não há dependências
    const resultado = await EntidadeModel.excluir(id);
    if (!resultado) {
      throw new NotFoundError('Entidade não encontrada');
    }
    
  } catch (error) {
    logger.error(`Erro ao excluir entidade: ${error.message}`);
    throw error;
  }
};
```

### **Controller Pattern:**
```typescript
export const excluirEntidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await excluirEntidadeService(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Entidade excluída com sucesso',
      dados: {
        id,
        excluido_em: new Date().toISOString()
      }
    });
    
  } catch (error) {
    if (error instanceof ConstraintViolationError) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message,
        detalhes: error.details
      });
      return;
    }
    
    if (error instanceof NotFoundError) {
      res.status(404).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};
```

---

**Data de Criação:** 01/07/2025  
**Versão:** 1.0  
**Autor:** Sistema Merenda Smart Flow  
**Status:** 📋 Documentado - Pronto para Implementação

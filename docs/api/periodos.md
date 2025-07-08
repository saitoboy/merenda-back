# 📅 Períodos de Lançamento

Esta seção contém as rotas relacionadas à gestão de períodos de lançamento no sistema Merenda Smart Flow.

## 📋 CRUD Básico

### Listar Períodos

Retorna todos os períodos cadastrados no sistema.

**URL**: `/periodos`

**Método**: `GET`

**Autenticação**: Não requerida

#### Parâmetros da Query

- `ativos` (opcional): Se `true`, retorna apenas períodos ativos

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Períodos listados com sucesso",
  "dados": [
    {
      "id_periodo": "uuid-periodo-1",
      "mes": 1,
      "ano": 2024,
      "data_inicio": "2024-01-01",
      "data_fim": "2024-01-31",
      "data_referencia": "2024-01-15",
      "ativo": true,
      "criado_por": "uuid-usuario-1",
      "created_at": "2023-12-01T00:00:00Z",
      "updated_at": "2023-12-01T00:00:00Z"
    },
    {
      "id_periodo": "uuid-periodo-2",
      "mes": 2,
      "ano": 2024,
      "data_inicio": "2024-02-01",
      "data_fim": "2024-02-29",
      "data_referencia": "2024-02-15",
      "ativo": false,
      "criado_por": "uuid-usuario-1",
      "created_at": "2024-01-15T00:00:00Z",
      "updated_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

### Buscar Período Atual

Retorna o período atualmente ativo.

**URL**: `/periodos/atual`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período atual encontrado com sucesso",
  "dados": {
    "id_periodo": "uuid-periodo-1",
    "mes": 1,
    "ano": 2024,
    "data_inicio": "2024-01-01",
    "data_fim": "2024-01-31",
    "data_referencia": "2024-01-15",
    "ativo": true,
    "criado_por": "uuid-usuario-1",
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z"
  }
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Nenhum período ativo encontrado"
}
```

---

### Buscar Período por Mês/Ano

Busca período específico por mês e ano.

**URL**: `/periodos/buscar`

**Método**: `GET`

**Autenticação**: Não requerida

#### Parâmetros da Query

- `mes` (obrigatório): Mês do período (1-12)
- `ano` (obrigatório): Ano do período

#### Exemplo de Uso

```
GET /periodos/buscar?mes=1&ano=2024
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período encontrado com sucesso",
  "dados": {
    "id_periodo": "uuid-periodo-1",
    "mes": 1,
    "ano": 2024,
    "data_inicio": "2024-01-01",
    "data_fim": "2024-01-31",
    "data_referencia": "2024-01-15",
    "ativo": true,
    "criado_por": "uuid-usuario-1",
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z"
  }
}
```

---

### Buscar Períodos por Intervalo

Busca períodos que se sobrepõem com um intervalo de datas.

**URL**: `/periodos/intervalo`

**Método**: `GET`

**Autenticação**: Não requerida

#### Parâmetros da Query

- `data_inicio` (obrigatório): Data de início no formato YYYY-MM-DD
- `data_fim` (obrigatório): Data de fim no formato YYYY-MM-DD

#### Exemplo de Uso

```
GET /periodos/intervalo?data_inicio=2023-01-01&data_fim=2023-06-30
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Períodos no intervalo encontrados com sucesso",
  "dados": [
    {
      "id_periodo": "uuid-periodo-1",
      "nome_periodo": "1º Semestre 2023",
      "data_inicio": "2023-01-01",
      "data_fim": "2023-06-30",
      "ativo": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```

---

### Buscar Período por ID

Retorna os dados detalhados de um período específico.

**URL**: `/periodos/:id`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período encontrado com sucesso",
  "dados": {
    "id_periodo": "uuid-periodo-1",
    "nome_periodo": "1º Semestre 2023",
    "data_inicio": "2023-01-01",
    "data_fim": "2023-06-30",
    "ativo": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Período não encontrado"
}
```

---

### Criar Período

Adiciona um novo período ao sistema.

**URL**: `/periodos`

**Método**: `POST`

**Autenticação**: Sim (Admin, Nutricionista)

#### Corpo da Requisição

```json
{
  "mes": 8,
  "ano": 2025,
  "data_inicio": "2025-08-01",
  "data_fim": "2025-08-31",
  "data_referencia": "2025-08-15",
  "ativo": false
}
```

#### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Período criado com sucesso",
  "dados": {
    "id_periodo": "uuid-novo-periodo"
  }
}
```

#### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Mês, ano, data de início e data de fim são obrigatórios"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Data de fim deve ser posterior à data de início"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Já existe um período com este nome"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

### Atualizar Período

Atualiza os dados de um período existente.

**URL**: `/periodos/:id`

**Método**: `PUT`

**Autenticação**: Sim (Admin, Nutricionista)

#### Corpo da Requisição

```json
{
  "nome_periodo": "1º Semestre 2023 - Atualizado",
  "data_inicio": "2023-01-15",
  "data_fim": "2023-06-15",
  "ativo": true
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período atualizado com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Período não encontrado"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Data de fim deve ser posterior à data de início"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

### Excluir Período

Remove um período do sistema.

**URL**: `/periodos/:id`

**Método**: `DELETE`

**Autenticação**: Sim (Admin, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período excluído com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Período não encontrado"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir período com estoque associado"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

## ⚡ Gestão de Status

### Ativar Período

Ativa um período e desativa todos os outros automaticamente. **Duplica estoques automaticamente** do período anterior se o período de destino estiver vazio.

**URL**: `/periodos/:id/ativar`

**Método**: `POST`

**Autenticação**: Sim (Admin, Nutricionista)

#### Funcionalidades Automáticas

- ✅ **Desativação automática** de outros períodos
- ✅ **Duplicação inteligente** de estoques (apenas se necessário)
- ✅ **Prevenção de duplicações** em reativações
- ✅ **Transações seguras** com rollback automático

#### Resposta de Sucesso - Primeira Ativação (com duplicação)

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período 8/2025 ativado com sucesso",
  "dados": {
    "periodo": {
      "id": "uuid-periodo",
      "mes": 8,
      "ano": 2025,
      "ativo": true
    },
    "duplicacao_estoques": {
      "realizada": true,
      "total_itens": 2690,
      "periodo_origem": "uuid-periodo-anterior",
      "mensagem": "Estoques duplicados com sucesso: 2690 itens copiados."
    }
  }
}
```

#### Resposta de Sucesso - Reativação (sem duplicação)

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período 6/2025 ativado com sucesso",
  "dados": {
    "periodo": {
      "id": "uuid-periodo",
      "mes": 6,
      "ano": 2025,
      "ativo": true
    },
    "duplicacao_estoques": {
      "realizada": false,
      "total_itens": 0,
      "periodo_origem": "uuid-periodo-anterior",
      "mensagem": "Período já possui estoques. Duplicação não realizada."
    }
  }
}
```

#### Resposta de Sucesso - Primeiro período do sistema

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período 1/2025 ativado com sucesso",
  "dados": {
    "periodo": {
      "id": "uuid-periodo",
      "mes": 1,
      "ano": 2025,
      "ativo": true
    },
    "duplicacao_estoques": {
      "realizada": false,
      "motivo": "Nenhum período ativo anterior ou erro na duplicação"
    }
  }
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Período não encontrado"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

### Desativar Período

Desativa um período específico.

**URL**: `/periodos/:id/desativar`

**Método**: `POST`

**Autenticação**: Sim (Admin, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Período desativado com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Período não encontrado"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

## 📊 Estatísticas

### Obter Estatísticas do Período

Retorna estatísticas detalhadas de um período.

**URL**: `/periodos/:id/estatisticas`

**Método**: `GET`

**Autenticação**: Sim (Admin, Nutricionista, Escola)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estatísticas do período obtidas com sucesso",
  "dados": {
    "total_escolas_ativas": 25,
    "total_itens_estoque": 1250,
    "valor_total_estoque": 345678.90,
    "total_pedidos": 89,
    "pedidos_por_status": {
      "pendentes": 12,
      "em_andamento": 15,
      "concluidos": 62
    },
    "escolas_com_estoque_baixo": 8,
    "itens_proximos_validade": 23,
    "periodo_info": {
      "nome_periodo": "1º Semestre 2023",
      "data_inicio": "2023-01-01",
      "data_fim": "2023-06-30",
      "dias_restantes": 45,
      "progresso_periodo": 75.5
    }
  }
}
```

---

## 🔒 Permissões

### Níveis de Acesso

| Endpoint | Método | Admin | Nutricionista | Gestor Escolar |
|----------|--------|:-----:|:-------------:|:--------------:|
| `/periodos` | GET | ✅ | ✅ | ✅ |
| `/periodos/atual` | GET | ✅ | ✅ | ✅ |
| `/periodos/buscar` | GET | ✅ | ✅ | ✅ |
| `/periodos/intervalo` | GET | ✅ | ✅ | ✅ |
| `/periodos/:id` | GET | ✅ | ✅ | ✅ |
| `/periodos` | POST | ✅ | ✅ | ❌ |
| `/periodos/:id` | PUT | ✅ | ✅ | ❌ |
| `/periodos/:id` | DELETE | ✅ | ✅ | ❌ |
| `/periodos/:id/ativar` | POST | ✅ | ✅ | ❌ |
| `/periodos/:id/desativar` | POST | ✅ | ✅ | ❌ |
| `/periodos/:id/estatisticas` | GET | ✅ | ✅ | ✅ |

> **Legenda:**
> - ✅ = Acesso permitido
> - ❌ = Acesso negado

---

## 📝 Exemplos de Uso

### 1. Buscar Período Atual

```bash
GET /periodos/atual
```

### 2. Criar um Novo Período

```bash
POST /periodos
Content-Type: application/json
Authorization: Bearer token

{
  "nome_periodo": "1º Trimestre 2024",
  "data_inicio": "2024-01-01",
  "data_fim": "2024-03-31",
  "ativo": false
}
```

### 3. Ativar um Período

```bash
POST /periodos/uuid-periodo-1/ativar
Authorization: Bearer token
```

### 4. Obter Estatísticas de um Período

```bash
GET /periodos/uuid-periodo-1/estatisticas
Authorization: Bearer token
```

---

## 🚨 Notas Importantes

1. **Período Único Ativo**: Apenas um período pode estar ativo por vez
2. **Validação de Datas**: Data de fim deve ser posterior à data de início
3. **Nome Único**: O nome do período deve ser único no sistema
4. **Exclusão Condicional**: Períodos com estoque associado não podem ser excluídos
5. **Ativação Automática**: Ao ativar um período, todos os outros são desativados automaticamente
6. **Auditoria**: Todas as operações são logadas para auditoria

---

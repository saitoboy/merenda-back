# 🏷️ Segmentos

Esta seção contém as rotas relacionadas à gestão de segmentos educacionais no sistema Merenda Smart Flow.

## 📋 CRUD Básico

### Listar Segmentos

Retorna todos os segmentos cadastrados no sistema.

**URL**: `/segmentos`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmentos listados com sucesso",
  "dados": [
    {
      "id_segmento": "uuid-segmento-1",
      "nome_segmento": "Ensino Fundamental",
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-06-20T14:15:00Z"
    },
    {
      "id_segmento": "uuid-segmento-2",
      "nome_segmento": "Educação Infantil",
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-06-20T14:15:00Z"
    }
  ]
}
```

---

### Buscar Segmento por Nome

Busca segmentos por nome (busca parcial).

**URL**: `/segmentos/buscar`

**Método**: `GET`

**Autenticação**: Não requerida

#### Parâmetros da Query

- `nome` (obrigatório): Nome ou parte do nome do segmento

#### Exemplo de Uso

```
GET /segmentos/buscar?nome=fundamental
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmentos encontrados com sucesso",
  "dados": [
    {
      "id_segmento": "uuid-segmento-1",
      "nome_segmento": "Ensino Fundamental",
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-06-20T14:15:00Z"
    }
  ]
}
```

---

### Buscar Segmento por ID

Retorna os dados detalhados de um segmento específico.

**URL**: `/segmentos/:id`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmento encontrado com sucesso",
  "dados": {
    "id_segmento": "uuid-segmento-1",
    "nome_segmento": "Ensino Fundamental",
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2023-06-20T14:15:00Z"
  }
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Segmento não encontrado"
}
```

---

### Criar Segmento

Adiciona um novo segmento ao sistema.

**URL**: `/segmentos`

**Método**: `POST`

**Autenticação**: Sim (Admin, Nutricionista)

#### Corpo da Requisição

```json
{
  "nome_segmento": "Ensino Médio",
  "descricao_segmento": "1º ao 3º ano do ensino médio"
}
```

#### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Segmento criado com sucesso",
  "dados": {
    "id_segmento": "uuid-novo-segmento"
  }
}
```

#### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Nome do segmento é obrigatório"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Já existe um segmento com este nome"
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

### Atualizar Segmento

Atualiza os dados de um segmento existente.

**URL**: `/segmentos/:id`

**Método**: `PUT`

**Autenticação**: Sim (Admin, Nutricionista)

#### Corpo da Requisição

```json
{
  "nome_segmento": "Ensino Fundamental - Atualizado",
  "descricao_segmento": "1º ao 9º ano do ensino fundamental - Anos iniciais e finais"
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmento atualizado com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Segmento não encontrado"
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

### Excluir Segmento

Remove um segmento do sistema.

**URL**: `/segmentos/:id`

**Método**: `DELETE`

**Autenticação**: Sim (Admin, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmento excluído com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Segmento não encontrado"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir segmento associado a escolas"
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

## 📊 Relacionamentos e Estatísticas

### Listar Escolas do Segmento

Retorna todas as escolas associadas a um segmento.

**URL**: `/segmentos/:id/escolas`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escolas do segmento listadas com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "nome_escola": "Escola Municipal João da Silva",
      "endereco_escola": "Rua das Flores, 123",
      "email_escola": "joaodasilva@edu.exemplo.com",
      "data_associacao": "2023-01-15T10:30:00Z"
    }
  ]
}
```

---

### Obter Estatísticas do Segmento

Retorna estatísticas detalhadas de um segmento.

**URL**: `/segmentos/:id/estatisticas`

**Método**: `GET`

**Autenticação**: Sim (Admin, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estatísticas do segmento obtidas com sucesso",
  "dados": {
    "total_escolas": 15,
    "total_itens_estoque": 450,
    "valor_total_estoque": 125340.75,
    "itens_abaixo_ideal": 23,
    "escolas_com_alertas": 4,
    "periodo_analise": {
      "inicio": "2023-01-01",
      "fim": "2023-06-30"
    },
    "distribuicao_escolas": {
      "pequenas": 8,
      "medias": 5,
      "grandes": 2
    }
  }
}
```

---

## 📦 Importação em Massa

### Importar Segmentos

Permite importar múltiplos segmentos de uma vez.

**URL**: `/segmentos/importar`

**Método**: `POST`

**Autenticação**: Sim (Admin)

#### Corpo da Requisição

```json
{
  "segmentos": [
    {
      "nome_segmento": "EJA - Educação de Jovens e Adultos",
      "descricao_segmento": "Modalidade de ensino destinada aos jovens e adultos"
    },
    {
      "nome_segmento": "Ensino Técnico",
      "descricao_segmento": "Cursos técnicos profissionalizantes"
    }
  ]
}
```

#### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Segmentos importados com sucesso",
  "dados": {
    "total_processados": 2,
    "total_criados": 2,
    "total_erros": 0,
    "erros": []
  }
}
```

#### Resposta com Erros Parciais

**Código**: `207 MULTI-STATUS`

```json
{
  "status": "parcial",
  "mensagem": "Importação concluída com alguns erros",
  "dados": {
    "total_processados": 2,
    "total_criados": 1,
    "total_erros": 1,
    "erros": [
      {
        "indice": 1,
        "erro": "Nome do segmento já existe"
      }
    ]
  }
}
```

---

## 🔒 Permissões

### Níveis de Acesso

| Endpoint | Método | Admin | Nutricionista | Gestor Escolar |
|----------|--------|:-----:|:-------------:|:--------------:|
| `/segmentos` | GET | ✅ | ✅ | ✅ |
| `/segmentos/buscar` | GET | ✅ | ✅ | ✅ |
| `/segmentos/:id` | GET | ✅ | ✅ | ✅ |
| `/segmentos` | POST | ✅ | ✅ | ❌ |
| `/segmentos/:id` | PUT | ✅ | ✅ | ❌ |
| `/segmentos/:id` | DELETE | ✅ | ✅ | ❌ |
| `/segmentos/:id/escolas` | GET | ✅ | ✅ | ✅ |
| `/segmentos/:id/estatisticas` | GET | ✅ | ✅ | ❌ |
| `/segmentos/importar` | POST | ✅ | ❌ | ❌ |

> **Legenda:**
> - ✅ = Acesso permitido
> - ❌ = Acesso negado

---

## 📝 Exemplos de Uso

### 1. Buscar Segmentos por Nome

```bash
GET /segmentos/buscar?nome=fundamental
```

### 2. Criar um Novo Segmento

```bash
POST /segmentos
Content-Type: application/json
Authorization: Bearer token

{
  "nome_segmento": "Ensino Técnico",
  "descricao_segmento": "Cursos técnicos profissionalizantes"
}
```

### 3. Obter Estatísticas de um Segmento

```bash
GET /segmentos/uuid-segmento-1/estatisticas
Authorization: Bearer token
```

---

## 🚨 Notas Importantes

1. **Nome Único**: O nome do segmento deve ser único no sistema
2. **Descrição Opcional**: A descrição é opcional mas recomendada
3. **Exclusão Condicional**: Segmentos associados a escolas não podem ser excluídos
4. **Auditoria**: Todas as operações são logadas para auditoria
5. **Relacionamentos**: Antes de excluir, verifique se não há escolas associadas

---

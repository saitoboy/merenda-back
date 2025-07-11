# 🏫 Escolas

Esta seção contém as rotas relacionadas à gestão de escolas no sistema Merenda Smart Flow.

## 📋 CRUD Básico

### Listar Escolas

Retorna todas as escolas cadastradas no sistema com filtros avançados.

**URL**: `/escolas`

**Método**: `GET`

**Autenticação**: Não requerida

#### Parâmetros da Query

- `segmento` (opcional): Filtra escolas por ID do segmento
- `nome` (opcional): Filtra escolas por nome (busca parcial)
- `email` (opcional): Filtra escolas por email (busca parcial)
- `endereco` (opcional): Filtra escolas por endereço (busca parcial)
- `com_segmentos` (opcional): Se `true`, inclui lista de segmentos da escola

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escolas listadas com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "nome_escola": "Escola Municipal João da Silva",
      "endereco_escola": "Rua das Flores, 123",
      "email_escola": "joaodasilva@edu.exemplo.com",
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-06-20T14:15:00Z",
      "segmentos": [
        {
          "id_segmento": "uuid-segmento-1",
          "nome_segmento": "Ensino Fundamental",
          "descricao_segmento": "1º ao 9º ano"
        }
      ]
    }
  ]
}
```

---

### Buscar Escola por ID

Retorna os dados detalhados de uma escola específica.

**URL**: `/escolas/:id`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escola encontrada com sucesso",
  "dados": {
    "id_escola": "uuid-escola-1",
    "nome_escola": "Escola Municipal João da Silva",
    "endereco_escola": "Rua das Flores, 123",
    "email_escola": "joaodasilva@edu.exemplo.com",
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2023-06-20T14:15:00Z",
    "segmentos": [
      {
        "id_segmento": "uuid-segmento-1",
        "nome_segmento": "Ensino Fundamental",
        "descricao_segmento": "1º ao 9º ano"
      }
    ]
  }
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

---

### Criar Escola

Adiciona uma nova escola ao sistema. Agora é obrigatório criar a escola já vinculando ao menos um segmento, enviando o campo `ids_segmentos` (array de UUIDs) no corpo da requisição.

**URL**: `/escolas`

**Método**: `POST`

**Autenticação**: Sim (Admin, Nutricionista)

#### Corpo da Requisição

```json
{
  "nome_escola": "Escola Municipal Monteiro Lobato",
  "endereco_escola": "Rua das Letras, 789",
  "email_escola": "monteirolobato@edu.exemplo.com",
  "ids_segmentos": [
    "uuid-segmento-1",
    "uuid-segmento-2"
  ]
}
```

- O campo `ids_segmentos` é **obrigatório** e deve conter pelo menos um segmento.
- Cada segmento informado será vinculado à nova escola.

#### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Escola criada com sucesso",
  "dados": {
    "id_escola": "uuid-nova-escola"
  }
}
```

#### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Nome, endereço e email são obrigatórios"
}
```

```json
{
  "status": "erro",
  "mensagem": "É obrigatório informar ao menos um segmento para a escola (ids_segmentos)"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Já existe uma escola com este email"
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

### Atualizar Escola

Atualiza os dados de uma escola existente.

**URL**: `/escolas/:id`

**Método**: `PUT`

**Autenticação**: Sim (Admin, Escola, Nutricionista)

#### Corpo da Requisição

```json
{
  "nome_escola": "Escola Municipal João da Silva - Atualizada",
  "endereco_escola": "Rua das Flores, 123 - Novo Endereço",
  "email_escola": "novo.email@edu.exemplo.com"
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escola atualizada com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
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

### Excluir Escola

Remove uma escola do sistema.

**URL**: `/escolas/:id`

**Método**: `DELETE`

**Autenticação**: Sim (Admin, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escola excluída com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
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

## 🏷️ Gestão de Segmentos

### Adicionar Segmento à Escola

Associa um segmento a uma escola.

**URL**: `/escolas/:id/segmentos`

**Método**: `POST`

**Autenticação**: Sim (Admin, Nutricionista)

#### Corpo da Requisição

```json
{
  "id_segmento": "uuid-segmento-1"
}
```

#### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Segmento adicionado à escola com sucesso"
}
```

#### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Escola já possui este segmento"
}
```

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola ou segmento não encontrado"
}
```

---

### Remover Segmento da Escola

Remove a associação de um segmento com uma escola.

**URL**: `/escolas/:id/segmentos/:id_segmento`

**Método**: `DELETE`

**Autenticação**: Sim (Admin, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmento removido da escola com sucesso"
}
```

#### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Associação não encontrada"
}
```

---

### Listar Segmentos da Escola

Retorna todos os segmentos associados a uma escola.

**URL**: `/escolas/:id/segmentos`

**Método**: `GET`

**Autenticação**: Não requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Segmentos da escola listados com sucesso",
  "dados": [
    {
      "id_segmento": "uuid-segmento-1",
      "nome_segmento": "Ensino Fundamental",
      "descricao_segmento": "1º ao 9º ano",
      "data_associacao": "2023-01-15T10:30:00Z"
    }
  ]
}
```

---

## 📊 Métricas e Dashboard

### Obter Métricas da Escola

Retorna métricas estatísticas de uma escola.

**URL**: `/escolas/:id/metricas`

**Método**: `GET`

**Autenticação**: Sim (Admin, Escola, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Métricas da escola obtidas com sucesso",
  "dados": {
    "total_itens_estoque": 45,
    "itens_abaixo_ideal": 8,
    "itens_proximos_validade": 3,
    "total_pedidos_mes": 12,
    "valor_total_estoque": 15420.50,
    "segmentos_ativos": 2,
    "ultima_atualizacao": "2023-06-20T14:15:00Z"
  }
}
```

---

### Obter Dashboard da Escola

Retorna dados consolidados para dashboard da escola.

**URL**: `/escolas/:id/dashboard`

**Método**: `GET`

**Autenticação**: Sim (Admin, Escola, Nutricionista)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Dashboard da escola obtido com sucesso",
  "dados": {
    "resumo_estoque": {
      "total_itens": 45,
      "abaixo_ideal": 8,
      "proximos_validade": 3,
      "valor_total": 15420.50
    },
    "resumo_pedidos": {
      "pendentes": 2,
      "em_andamento": 3,
      "concluidos": 7
    },
    "segmentos": [
      {
        "id_segmento": "uuid-segmento-1",
        "nome_segmento": "Ensino Fundamental",
        "total_itens": 30
      }
    ],
    "alertas": [
      {
        "tipo": "estoque_baixo",
        "mensagem": "8 itens estão abaixo do ideal",
        "severidade": "warning"
      }
    ]
  }
}
```

---

## 📦 Importação em Massa

### Importar Escolas

Permite importar múltiplas escolas de uma vez.

**URL**: `/escolas/importar`

**Método**: `POST`

**Autenticação**: Sim (Admin)

#### Corpo da Requisição

```json
{
  "escolas": [
    {
      "nome_escola": "Escola Municipal 1",
      "endereco_escola": "Endereço 1",
      "email_escola": "escola1@edu.exemplo.com"
    },
    {
      "nome_escola": "Escola Municipal 2",
      "endereco_escola": "Endereço 2",
      "email_escola": "escola2@edu.exemplo.com"
    }
  ]
}
```

#### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Escolas importadas com sucesso",
  "dados": {
    "total_processadas": 2,
    "total_criadas": 2,
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
    "total_processadas": 2,
    "total_criadas": 1,
    "total_erros": 1,
    "erros": [
      {
        "indice": 1,
        "erro": "Email já cadastrado no sistema"
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
| `/escolas` | GET | ✅ | ✅ | ✅ |
| `/escolas/:id` | GET | ✅ | ✅ | ✅ |
| `/escolas` | POST | ✅ | ✅ | ❌ |
| `/escolas/:id` | PUT | ✅ | ✅ | ✅ (própria escola) |
| `/escolas/:id` | DELETE | ✅ | ✅ | ❌ |
| `/escolas/:id/segmentos` | GET | ✅ | ✅ | ✅ |
| `/escolas/:id/segmentos` | POST | ✅ | ✅ | ❌ |
| `/escolas/:id/segmentos/:id_segmento` | DELETE | ✅ | ✅ | ❌ |
| `/escolas/:id/metricas` | GET | ✅ | ✅ | ✅ (própria escola) |
| `/escolas/:id/dashboard` | GET | ✅ | ✅ | ✅ (própria escola) |
| `/escolas/importar` | POST | ✅ | ❌ | ❌ |

> **Legenda:**
> - ✅ = Acesso permitido
> - ❌ = Acesso negado
> - "Própria escola" = Apenas acesso aos recursos da própria escola

---

## 📝 Exemplos de Uso

### 1. Buscar Escolas com Filtros

```bash
GET /escolas?nome=Municipal&com_segmentos=true
```

### 2. Adicionar Segmento a uma Escola

```bash
POST /escolas/uuid-escola-1/segmentos
Content-Type: application/json
Authorization: Bearer token

{
  "id_segmento": "uuid-segmento-fundamental"
}
```

### 3. Obter Dashboard de uma Escola

```bash
GET /escolas/uuid-escola-1/dashboard
Authorization: Bearer token
```

---

## 🚨 Notas Importantes

1. **Validações**: Todos os campos obrigatórios devem ser fornecidos
2. **Email Único**: O email da escola deve ser único no sistema
3. **Segmentos**: Uma escola pode ter múltiplos segmentos
4. **Autorização**: Gestores escolares só podem acessar dados da própria escola
5. **Auditoria**: Todas as operações são logadas para auditoria

---

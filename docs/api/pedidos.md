# Pedidos

Esta seção contém as rotas relacionadas à gestão de pedidos no sistema Merenda Smart Flow.

## Listar Pedidos

Retorna todos os pedidos cadastrados no sistema.

**URL**: `/pedidos`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos listados com sucesso",
  "dados": [
    {
      "id_pedido": "uuid-pedido-1",
      "quantidade_pedido": 20,
      "id_item": "uuid-item-1",
      "id_escola": "uuid-escola-1",
      "data_pedido": "2023-09-15T10:30:00Z",
      "nome_escola": "E.M. Maria da Silva",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "preco_item": 7.50,
      "nome_fornecedor": "Distribuidora Alimentos Saudáveis"
    },
    {
      "id_pedido": "uuid-pedido-2",
      "quantidade_pedido": 15,
      "id_item": "uuid-item-2",
      "id_escola": "uuid-escola-2",
      "data_pedido": "2023-09-14T14:20:00Z",
      "nome_escola": "E.M. João Pedro",
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "preco_item": 9.20,
      "nome_fornecedor": "Distribuidor Central"
    }
  ]
}
```

---

## Buscar Pedido

Retorna os detalhes de um pedido específico pelo seu ID.

**URL**: `/pedidos/:id_pedido`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido encontrado com sucesso",
  "dados": {
    "id_pedido": "uuid-pedido-1",
    "quantidade_pedido": 20,
    "id_item": "uuid-item-1",
    "id_escola": "uuid-escola-1",
    "data_pedido": "2023-09-15T10:30:00Z",
    "nome_escola": "E.M. Maria da Silva",
    "nome_item": "Arroz Integral",
    "unidade_medida": "Kg",
    "preco_item": 7.50,
    "nome_fornecedor": "Distribuidora Alimentos Saudáveis"
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Pedido não encontrado"
}
```

---

## Buscar Pedidos por Escola

Retorna todos os pedidos associados a uma escola específica.

**URL**: `/pedidos/escola/:id_escola`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos da escola listados com sucesso",
  "dados": [
    {
      "id_pedido": "uuid-pedido-1",
      "quantidade_pedido": 20,
      "id_item": "uuid-item-1",
      "id_escola": "uuid-escola-1",
      "data_pedido": "2023-09-15T10:30:00Z",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "preco_item": 7.50,
      "nome_fornecedor": "Distribuidora Alimentos Saudáveis"
    },
    {
      "id_pedido": "uuid-pedido-3",
      "quantidade_pedido": 10,
      "id_item": "uuid-item-3",
      "id_escola": "uuid-escola-1",
      "data_pedido": "2023-09-10T09:15:00Z",
      "nome_item": "Macarrão Integral",
      "unidade_medida": "Kg",
      "preco_item": 5.30,
      "nome_fornecedor": "Distribuidora Alimentos Saudáveis"
    }
  ]
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

---

## Criar Pedido

Cria um novo pedido no sistema.

**URL**: `/pedidos`

**Método**: `POST`

**Autenticação**: Sim (Gestor Escolar, Nutricionista ou Admin)

**Corpo da Requisição**:

```json
{
  "quantidade_pedido": 25,
  "id_item": "uuid-item-4",
  "id_escola": "uuid-escola-3"
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido criado com sucesso",
  "dados": {
    "id_pedido": "uuid-novo-pedido"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Dados inválidos para criação do pedido"
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

## Atualizar Pedido

Atualiza os dados de um pedido existente.

**URL**: `/pedidos/:id_pedido`

**Método**: `PUT`

**Autenticação**: Sim (Gestor Escolar da mesma escola, Nutricionista ou Admin)

**Corpo da Requisição**:

```json
{
  "quantidade_pedido": 30
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido atualizado com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Pedido não encontrado"
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

## Excluir Pedido

Remove um pedido do sistema.

**URL**: `/pedidos/:id_pedido`

**Método**: `DELETE`

**Autenticação**: Sim (Admin ou Nutricionista)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido excluído com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Pedido não encontrado"
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

## Pedidos por Período

Retorna todos os pedidos dentro de um período específico de datas.

**URL**: `/pedidos/periodo`

**Método**: `GET`

**Autenticação**: Sim

**Parâmetros de Query**:

- `dataInicial`: Data inicial no formato YYYY-MM-DD
- `dataFinal`: Data final no formato YYYY-MM-DD

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos do período listados com sucesso",
  "dados": [
    {
      "id_pedido": "uuid-pedido-1",
      "quantidade_pedido": 20,
      "id_item": "uuid-item-1",
      "id_escola": "uuid-escola-1",
      "data_pedido": "2023-09-15T10:30:00Z",
      "nome_escola": "E.M. Maria da Silva",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "preco_item": 7.50,
      "nome_fornecedor": "Distribuidora Alimentos Saudáveis"
    },
    {
      "id_pedido": "uuid-pedido-2",
      "quantidade_pedido": 15,
      "id_item": "uuid-item-2",
      "id_escola": "uuid-escola-2",
      "data_pedido": "2023-09-14T14:20:00Z",
      "nome_escola": "E.M. João Pedro",
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "preco_item": 9.20,
      "nome_fornecedor": "Distribuidor Central"
    }
  ]
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Período de datas inválido"
}
```

---

## Métricas de Pedidos

Retorna métricas sobre os pedidos, incluindo quantidade total, valor total e estatísticas por escola.

**URL**: `/pedidos/metricas`

**Método**: `GET`

**Autenticação**: Sim (Admin ou Nutricionista)

**Parâmetros de Query**:

- `dataInicial`: (opcional) Data inicial no formato YYYY-MM-DD
- `dataFinal`: (opcional) Data final no formato YYYY-MM-DD

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Métricas de pedidos calculadas com sucesso",
  "dados": {
    "total_pedidos": 35,
    "valor_total": 12350.75,
    "por_escola": [
      {
        "id_escola": "uuid-escola-1",
        "nome_escola": "E.M. Maria da Silva",
        "total_pedidos": 12,
        "valor_total": 4200.50
      },
      {
        "id_escola": "uuid-escola-2",
        "nome_escola": "E.M. João Pedro",
        "total_pedidos": 8,
        "valor_total": 3150.25
      }
    ],
    "por_item": [
      {
        "id_item": "uuid-item-1",
        "nome_item": "Arroz Integral",
        "total_pedidos": 15,
        "quantidade_total": 300
      },
      {
        "id_item": "uuid-item-2",
        "nome_item": "Feijão Carioca",
        "total_pedidos": 10,
        "quantidade_total": 150
      }
    ]
  }
}
```

### Respostas de Erro

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

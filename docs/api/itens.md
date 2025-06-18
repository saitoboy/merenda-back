# Itens

Esta seção contém as rotas relacionadas à gestão de itens no sistema Merenda Smart Flow.

## Listar Itens

Retorna todos os itens cadastrados no sistema.

**URL**: `/itens`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Itens listados com sucesso",
  "dados": [
    {
      "id_item": "uuid-item-1",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
      "validade": "2023-12-31",
      "observacao": "Orgânico",
      "id_fornecedor": "uuid-fornecedor-1",
      "preco_item": 7.50
    },
    {
      "id_item": "uuid-item-2",
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
      "validade": "2023-10-15",
      "observacao": null,
      "id_fornecedor": "uuid-fornecedor-2",
      "preco_item": 9.20
    }
  ]
}
```

---

## Buscar Item

Retorna os detalhes de um item específico pelo seu ID.

**URL**: `/itens/:id_item`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Item encontrado com sucesso",
  "dados": {
    "id_item": "uuid-item-1",
    "nome_item": "Arroz Integral",
    "unidade_medida": "Kg",
    "sazonalidade": "Ano todo",
    "validade": "2023-12-31",
    "observacao": "Orgânico",
    "id_fornecedor": "uuid-fornecedor-1",
    "preco_item": 7.50
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado"
}
```

---

## Buscar Itens por Fornecedor

Retorna todos os itens associados a um fornecedor específico.

**URL**: `/itens/fornecedor/:id_fornecedor`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Itens do fornecedor listados com sucesso",
  "dados": [
    {
      "id_item": "uuid-item-1",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
      "validade": "2023-12-31",
      "observacao": "Orgânico",
      "id_fornecedor": "uuid-fornecedor-1",
      "preco_item": 7.50
    },
    {
      "id_item": "uuid-item-3",
      "nome_item": "Macarrão Integral",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
      "validade": "2023-11-20",
      "observacao": null,
      "id_fornecedor": "uuid-fornecedor-1",
      "preco_item": 5.30
    }
  ]
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Fornecedor não encontrado"
}
```

---

## Criar Item

Cria um novo item no sistema.

**URL**: `/itens`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin ou Nutricionista)

**Corpo da Requisição**:

```json
{
  "nome_item": "Azeite de Oliva Extra Virgem",
  "unidade_medida": "L",
  "sazonalidade": "Ano todo",
  "validade": "2024-06-30",
  "observacao": "Importado",
  "id_fornecedor": "uuid-fornecedor-3",
  "preco_item": 28.90
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Item criado com sucesso",
  "dados": {
    "id_item": "uuid-novo-item"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Dados inválidos para criação do item"
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

## Atualizar Item

Atualiza os dados de um item existente.

**URL**: `/itens/:id_item`

**Método**: `PUT`

**Autenticação**: Sim (apenas Admin ou Nutricionista)

**Corpo da Requisição**:

```json
{
  "nome_item": "Azeite de Oliva Extra Virgem Orgânico",
  "preco_item": 32.50,
  "observacao": "Importado da Espanha"
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Item atualizado com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado"
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

## Excluir Item

Remove um item do sistema.

**URL**: `/itens/:id_item`

**Método**: `DELETE`

**Autenticação**: Sim (apenas Admin)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Item excluído com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado"
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

## Importar Itens

Importa múltiplos itens de uma vez através de um arquivo CSV ou JSON.

**URL**: `/itens/importar`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin ou Nutricionista)

**Corpo da Requisição**: Form-data com arquivo CSV/JSON

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "15 itens importados com sucesso"
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato de arquivo inválido ou dados inconsistentes"
}
```

---

## Itens Próximos da Validade

Retorna itens que estão próximos da data de validade dentro do período especificado em dias.

**URL**: `/itens/validade/:dias`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Itens próximos da validade listados com sucesso",
  "dados": [
    {
      "id_item": "uuid-item-2",
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
      "validade": "2023-10-15",
      "observacao": null,
      "id_fornecedor": "uuid-fornecedor-2",
      "preco_item": 9.20,
      "dias_restantes": 12
    },
    {
      "id_item": "uuid-item-5",
      "nome_item": "Leite em Pó",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
      "validade": "2023-10-20",
      "observacao": "Integral",
      "id_fornecedor": "uuid-fornecedor-1",
      "preco_item": 22.50,
      "dias_restantes": 17
    }
  ]
}
```

---

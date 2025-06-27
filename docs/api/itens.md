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
      "id_fornecedor": "uuid-fornecedor-1",
      "preco_item": 7.50
    },
    {
      "id_item": "uuid-item-2",
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
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
      "id_fornecedor": "uuid-fornecedor-1",
      "preco_item": 7.50
    },
    {
      "id_item": "uuid-item-3",
      "nome_item": "Macarrão Integral",
      "unidade_medida": "Kg",
      "sazonalidade": "Ano todo",
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
  "preco_item": 32.50
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

## Obter Estatísticas de Preços

Retorna estatísticas gerais de preços de todos os itens cadastrados no sistema.

**URL**: `/itens/estatisticas/precos`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estatísticas de preços obtidas com sucesso",
  "dados": {
    "preco_medio": 15.75,
    "total_itens": 120,
    "preco_minimo": 2.50,
    "preco_maximo": 45.00
  }
}
```

---

## Obter Estatísticas de Preços por Fornecedor

Retorna estatísticas de preços agrupadas por fornecedor.

**URL**: `/itens/estatisticas/precos-por-fornecedor`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estatísticas de preços por fornecedor obtidas com sucesso",
  "dados": [
    {
      "id_fornecedor": "uuid-fornecedor-1",
      "nome_fornecedor": "Distribuidora Alimentos Frescos",
      "preco_medio": 12.35,
      "total_itens": 45,
      "preco_minimo": 3.50,
      "preco_maximo": 25.00
    },
    {
      "id_fornecedor": "uuid-fornecedor-2",
      "nome_fornecedor": "Cooperativa Agrícola Regional",
      "preco_medio": 18.90,
      "total_itens": 38,
      "preco_minimo": 5.00,
      "preco_maximo": 45.00
    }
  ]
}
```

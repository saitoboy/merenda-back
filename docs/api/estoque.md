# Estoque

Esta seção contém as rotas relacionadas à gestão de estoque no sistema Merenda Smart Flow.

## Listar Estoque por Escola

Retorna todos os itens em estoque de uma determinada escola.

**URL**: `/estoque/escola/:id_escola`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estoque listado com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "quantidade_item": 15,
      "numero_ideal": 20,
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "validade": "2023-12-31",
      "preco_item": 7.50
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "quantidade_item": 8,
      "numero_ideal": 10,
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "validade": "2023-10-15",
      "preco_item": 9.20
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

## Listar Itens Abaixo do Ideal

Retorna todos os itens cujo estoque está abaixo do número ideal definido.

**URL**: `/estoque/escola/:id_escola/abaixo-ideal`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Itens abaixo do ideal listados com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "quantidade_item": 15,
      "numero_ideal": 20,
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "validade": "2023-12-31",
      "preco_item": 7.50
    }
  ]
}
```

---

## Obter Métricas de Estoque

Retorna métricas e estatísticas sobre o estoque de uma escola.

**URL**: `/estoque/escola/:id_escola/metricas`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Métricas obtidas com sucesso",
  "dados": {
    "total_itens": 12,
    "itens_abaixo_ideal": 3,
    "itens_zerados": 1,
    "itens_proximos_validade": 2,
    "valor_total_estoque": 1250.75
  }
}
```

---

## Atualizar Quantidade de Item

Atualiza a quantidade em estoque de um item em uma escola.

**URL**: `/estoque/quantidade/:id_escola/:id_item`

**Método**: `PUT`

**Autenticação**: Requerida (Admin, Gestor Escolar, Nutricionista)

### Corpo da Requisição

```json
{
  "quantidade_item": 25
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Quantidade atualizada com sucesso",
  "dados": {
    "mensagem": "Quantidade atualizada com sucesso"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Quantidade é obrigatória"
}
```

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado no estoque desta escola"
}
```

---

## Atualizar Número Ideal de Item

Atualiza o número ideal de um item em uma escola.

**URL**: `/estoque/numero-ideal/:id_escola/:id_item`

**Método**: `PUT`

**Autenticação**: Requerida (Admin, Gestor Escolar, Nutricionista)

### Corpo da Requisição

```json
{
  "numero_ideal": 30
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Número ideal atualizado com sucesso",
  "dados": {
    "mensagem": "Número ideal atualizado com sucesso"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Número ideal é obrigatório"
}
```

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado no estoque desta escola"
}
```

---

## Definir Valores Ideais em Lote

Define valores ideais para múltiplas combinações de escola e item de uma vez.

**URL**: `/estoque/ideais`

**Método**: `POST`

**Autenticação**: Requerida (Admin, Nutricionista)

### Corpo da Requisição

```json
{
  "ideais": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "numero_ideal": 25
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "numero_ideal": 15
    },
    {
      "id_escola": "uuid-escola-2",
      "id_item": "uuid-item-1",
      "numero_ideal": 20
    }
  ]
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Valores ideais definidos com sucesso",
  "dados": {
    "mensagem": "3 valores ideais processados com sucesso",
    "detalhes": [
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-1",
        "numero_ideal": 25,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-2",
        "numero_ideal": 15,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-2",
        "id_item": "uuid-item-1",
        "numero_ideal": 20,
        "acao": "criado"
      }
    ]
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato inválido. Esperado um array de itens com id_escola, id_item e numero_ideal"
}
```

---

## Definir Valores Ideais por Escola

Define valores ideais para múltiplos itens de uma mesma escola.

**URL**: `/estoque/ideais/:id_escola`

**Método**: `POST`

**Autenticação**: Requerida (Admin, Nutricionista)

### Corpo da Requisição

```json
{
  "itens_ideais": [
    { "id_item": "uuid-item-1", "numero_ideal": 30 },
    { "id_item": "uuid-item-2", "numero_ideal": 20 },
    { "id_item": "uuid-item-3", "numero_ideal": 15 },
    { "id_item": "uuid-item-4", "numero_ideal": 25 }
  ]
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Valores ideais definidos com sucesso para a escola uuid-escola-1",
  "dados": {
    "mensagem": "4 valores ideais processados com sucesso",
    "detalhes": [
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-1",
        "numero_ideal": 30,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-2",
        "numero_ideal": 20,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-3",
        "numero_ideal": 15,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-4",
        "numero_ideal": 25,
        "acao": "criado"
      }
    ]
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato inválido. Esperado um array de itens com id_item e numero_ideal"
}
```

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

---

## Adicionar Item ao Estoque

Adiciona um novo item ao estoque de uma escola.

**URL**: `/estoque/adicionar`

**Método**: `POST`

**Autenticação**: Requerida (Admin, Gestor Escolar)

### Corpo da Requisição

```json
{
  "id_escola": "uuid-escola-1",
  "id_item": "uuid-item-5",
  "quantidade_item": 10,
  "numero_ideal": 15
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Item adicionado ao estoque com sucesso",
  "dados": {
    "mensagem": "Item adicionado ao estoque com sucesso"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Escola, item, quantidade e número ideal são obrigatórios"
}
```

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Este item já existe no estoque desta escola"
}
```

---

## Remover Item do Estoque

Remove um item do estoque de uma escola.

**URL**: `/estoque/:id_escola/:id_item`

**Método**: `DELETE`

**Autenticação**: Requerida (Admin, Gestor Escolar)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Item removido do estoque com sucesso",
  "dados": {
    "mensagem": "Item removido do estoque com sucesso"
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Item não encontrado no estoque desta escola"
}
```

## Notas de Implementação

- O sistema diferencia entre `quantidade_item` (quantidade atual) e `numero_ideal` (quantidade que deveria ter)
- Quando novos itens são adicionados apenas via gestão de valores ideais, sua quantidade é inicializada como zero
- Ao definir valores ideais em lote, o sistema cria automaticamente registros de estoque para combinações de escola-item que não existiam
- O valor `numero_ideal` é usado para identificar quando o estoque está baixo e pode gerar alertas ou sugestões de pedidos

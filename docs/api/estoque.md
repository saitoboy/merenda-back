# Estoque

Esta seção contém as rotas relacionadas à gestão de estoque no sistema Merenda Smart Flow.

## Conceito de Segmentos de Estoque

O sistema permite gerenciar estoques separados por segmento escolar dentro de uma mesma escola. Isso possibilita que uma escola mantenha controle de estoques distintos para diferentes segmentos, como "infantil", "fundamental" e o estoque geral da "escola".

- Cada item no estoque de uma escola pode existir em múltiplos segmentos, cada um com sua própria quantidade e valor ideal
- O segmento padrão é "escola", usado quando nenhum segmento específico é informado
- Os segmentos válidos para uma escola são definidos no seu cadastro, no campo `segmento_escola`
- As rotas de API aceitam o parâmetro `segmento` para especificar o segmento de estoque a ser manipulado

## Listar Estoque por Escola

Retorna todos os itens em estoque de uma determinada escola.

**URL**: `/estoque/escola/:id_escola?segmento=segmento_valor`

**Método**: `GET`

**Autenticação**: Opcional

**Parâmetros de Consulta**:
- `segmento` (opcional) - Filtra os resultados por segmento específico. Se não for fornecido, retorna todos os segmentos.

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
      "segmento_estoque": "escola",
      "quantidade_item": 15,
      "numero_ideal": 20,
      "validade": "2023-12-31",
      "observacao": "Lote recente",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "preco_item": 7.50
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "segmento_estoque": "infantil",
      "quantidade_item": 8,
      "numero_ideal": 10,
      "validade": "2023-10-15",
      "observacao": null,
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
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

**URL**: `/estoque/escola/:id_escola/abaixo-ideal?segmento=segmento_valor`

**Método**: `GET`

**Autenticação**: Opcional

**Parâmetros de Consulta**:
- `segmento` (opcional) - Filtra os resultados por segmento específico. Se não for fornecido, retorna todos os segmentos.

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
      "segmento_estoque": "escola",
      "quantidade_item": 15,
      "numero_ideal": 20,
      "validade": "2023-12-31",
      "observacao": "Lote antigo",
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "preco_item": 7.50
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-3",
      "segmento_estoque": "infantil",
      "quantidade_item": 5,
      "numero_ideal": 12,
      "validade": "2023-11-30",
      "observacao": null,
      "nome_item": "Leite em Pó",
      "unidade_medida": "Kg",
      "preco_item": 22.90
    }
  ]
}
```

---

## Obter Métricas de Estoque

Retorna métricas e estatísticas sobre o estoque de uma escola.

**URL**: `/estoque/escola/:id_escola/metricas?segmento=segmento_valor`

**Método**: `GET`

**Autenticação**: Opcional

**Parâmetros de Consulta**:
- `segmento` (opcional) - Filtra as métricas por segmento específico. Se não for fornecido, considera todos os segmentos.

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
  "quantidade_item": 25,
  "segmento": "escola"  /* opcional, padrão é "escola" */
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
  "numero_ideal": 30,
  "segmento": "escola"  /* opcional, padrão é "escola" */
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
      "numero_ideal": 25,
      "segmento": "escola"
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "numero_ideal": 15,
      "segmento": "infantil"
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
        "segmento_estoque": "escola",
        "numero_ideal": 25,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-2",
        "segmento_estoque": "infantil",
        "numero_ideal": 15,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-2",
        "id_item": "uuid-item-1",
        "segmento_estoque": "escola",
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
    { "id_item": "uuid-item-1", "numero_ideal": 30, "segmento": "escola" },
    { "id_item": "uuid-item-2", "numero_ideal": 20, "segmento": "infantil" },
    { "id_item": "uuid-item-3", "numero_ideal": 15 },
    { "id_item": "uuid-item-4", "numero_ideal": 25, "segmento": "fundamental" }
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
        "segmento_estoque": "escola",
        "numero_ideal": 30,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-2",
        "segmento_estoque": "infantil",
        "numero_ideal": 20,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-3",
        "segmento_estoque": "escola",
        "numero_ideal": 15,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-4",
        "segmento_estoque": "fundamental",
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
  "numero_ideal": 15,
  "segmento_estoque": "infantil"
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Item adicionado ao estoque com sucesso",
  "dados": {
    "mensagem": "Item adicionado ao estoque com sucesso",
    "item": {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-5",
      "segmento_estoque": "infantil",
      "quantidade_item": 10,
      "numero_ideal": 15
    }
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

**URL**: `/estoque/:id_escola/:id_item?segmento=segmento_valor`

**Método**: `DELETE`

**Autenticação**: Requerida (Admin, Gestor Escolar)

**Parâmetros de Consulta**:
- `segmento` (opcional) - Define o segmento do estoque. Se não for fornecido, usa o valor padrão "escola".

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
- O campo `segmento_estoque` permite controlar estoques separados por segmento (ex: "infantil", "fundamental", "escola")
- Quando o `segmento_estoque` não é especificado nas requisições, o sistema usa o valor padrão "escola"
- Os segmentos válidos para uma escola são definidos no campo `segmento_escola` no cadastro da escola
- A chave primária do estoque agora é composta por (id_escola, id_item, segmento_estoque)

## Exemplos de Uso com Segmentos

### Consultando o estoque de um segmento específico

```
GET /estoque/escola/uuid-escola-1?segmento=infantil
```

### Atualizando a quantidade de um item em um segmento específico

```
PUT /estoque/quantidade/uuid-escola-1/uuid-item-1
```
```json
{
  "quantidade_item": 25,
  "segmento": "fundamental"
}
```

### Definindo valores ideais para diferentes segmentos em uma mesma escola

```
POST /estoque/ideais/uuid-escola-1
```
```json
{
  "itens_ideais": [
    { "id_item": "uuid-item-1", "numero_ideal": 30, "segmento": "escola" },
    { "id_item": "uuid-item-1", "numero_ideal": 15, "segmento": "infantil" },
    { "id_item": "uuid-item-1", "numero_ideal": 20, "segmento": "fundamental" }
  ]
}
```

### Removendo um item de um segmento específico

```
DELETE /estoque/uuid-escola-1/uuid-item-1?segmento=infantil
```

---

## Listar Itens Próximos da Validade

Retorna todos os itens em estoque que estão próximos da data de validade dentro do período especificado em dias.

**URL**: `/estoque/escola/:id_escola/proximos-validade/:dias`

**Método**: `GET`

**Autenticação**: Opcional

**Parâmetros**:
- `id_escola` - ID da escola
- `dias` - Número de dias para considerar como "próximo da validade" (ex: 7 para 7 dias)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Itens próximos da validade listados com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "segmento_estoque": "escola",
      "quantidade_item": 8,
      "numero_ideal": 10,
      "validade": "2023-10-15",
      "observacao": "Lote especial",
      "nome_item": "Feijão Carioca",
      "unidade_medida": "Kg",
      "preco_item": 9.20,
      "dias_restantes": 5
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-5",
      "segmento_estoque": "infantil",
      "quantidade_item": 3,
      "numero_ideal": 8,
      "validade": "2023-10-20",
      "observacao": null,
      "nome_item": "Leite em Pó",
      "unidade_medida": "Kg",
      "preco_item": 22.50,
      "dias_restantes": 10
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

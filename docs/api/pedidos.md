# 📋 Pedidos

Esta seção contém as rotas relacionadas à gestão de pedidos no sistema Merenda Smart Flow.

## 📋 CRUD Básico

### Listar Pedidos

Retorna todos os pedidos cadastrados no sistema com filtros avançados.

**URL**: `/pedidos`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da Query

- `id_escola` (opcional): Filtra pedidos por escola específica
- `id_item` (opcional): Filtra pedidos por item específico
- `data_inicio` (opcional): Data inicial para filtro (formato: YYYY-MM-DD)
- `data_fim` (opcional): Data final para filtro (formato: YYYY-MM-DD)
- `status` (opcional): Filtra por status do pedido
- `com_detalhes` (opcional): Se `true`, inclui dados relacionados (escola, item, fornecedor)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos listados com sucesso",
  "dados": [
    {
      "id_pedido": "uuid-pedido-1",
      "quantidade_pedido": 50,
      "id_item": "uuid-item-1",
      "id_escola": "uuid-escola-1",
      "data_pedido": "2024-01-15T10:30:00Z",
      "status_pedido": "pendente",
      "observacoes": "Urgente - estoque baixo",
      "nome_escola": "Escola Municipal João da Silva",
      "nome_item": "Arroz Integral 1kg",
      "unidade_medida": "kg",
      "preco_item": 7.50,
      "valor_total": 375.00,
      "nome_fornecedor": "Alimentos Naturais LTDA"
    }
  ]
}
```

#### Códigos de Erro

- `401`: Token de autenticação inválido
- `403`: Usuário sem permissão para visualizar pedidos
- `500`: Erro interno do servidor

---

### Buscar Pedido por ID

Retorna informações detalhadas de um pedido específico.

**URL**: `/pedidos/:id`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da URL

- `id`: ID do pedido (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido encontrado",
  "dados": {
    "id_pedido": "uuid-pedido-1",
    "quantidade_pedido": 50,
    "id_item": "uuid-item-1",
    "id_escola": "uuid-escola-1",
    "data_pedido": "2024-01-15T10:30:00Z",
    "status_pedido": "pendente",
    "observacoes": "Urgente - estoque baixo",
    "nome_escola": "Escola Municipal João da Silva",
    "endereco_escola": "Rua das Flores, 123",
    "email_escola": "joaodasilva@edu.exemplo.com",
    "nome_item": "Arroz Integral 1kg",
    "unidade_medida": "kg",
    "sazonalidade": "Ano todo",
    "preco_item": 7.50,
    "valor_total": 375.00,
    "fornecedor": {
      "id_fornecedor": "uuid-fornecedor-1",
      "nome_fornecedor": "Alimentos Naturais LTDA",
      "cnpj_fornecedor": "12.345.678/0001-90",
      "whatsapp_fornecedor": "(11) 98765-4321",
      "email_fornecedor": "contato@alimentosnaturais.com.br"
    }
  }
}
```

#### Códigos de Erro

- `404`: Pedido não encontrado
- `401`: Token de autenticação inválido
- `403`: Usuário sem permissão para visualizar este pedido

---

### Criar Novo Pedido

Cria um novo pedido no sistema.

**URL**: `/pedidos`

**Método**: `POST`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Corpo da Requisição

```json
{
  "quantidade_pedido": 100,
  "id_item": "uuid-item-1",
  "id_escola": "uuid-escola-1",
  "observacoes": "Entrega urgente necessária",
  "data_entrega_desejada": "2024-02-01"
}
```

#### Resposta de Sucesso

**Código**: `201 Created`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido criado com sucesso",
  "dados": {
    "id_pedido": "uuid-pedido-novo",
    "quantidade_pedido": 100,
    "id_item": "uuid-item-1",
    "id_escola": "uuid-escola-1",
    "data_pedido": "2024-01-20T15:45:00Z",
    "status_pedido": "pendente",
    "observacoes": "Entrega urgente necessária",
    "data_entrega_desejada": "2024-02-01",
    "valor_total": 750.00
  }
}
```

#### Códigos de Erro

- `400`: Dados inválidos ou incompletos
- `403`: Usuário sem permissão para criar pedido
- `404`: Escola ou item não encontrado

---

### Atualizar Pedido

Atualiza informações de um pedido específico.

**URL**: `/pedidos/:id`

**Método**: `PUT`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Parâmetros da URL

- `id`: ID do pedido (UUID)

#### Corpo da Requisição

```json
{
  "quantidade_pedido": 80,
  "observacoes": "Quantidade ajustada conforme disponibilidade",
  "status_pedido": "aprovado"
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido atualizado com sucesso",
  "dados": {
    "id_pedido": "uuid-pedido-1",
    "quantidade_pedido": 80,
    "id_item": "uuid-item-1",
    "id_escola": "uuid-escola-1",
    "data_pedido": "2024-01-15T10:30:00Z",
    "status_pedido": "aprovado",
    "observacoes": "Quantidade ajustada conforme disponibilidade",
    "valor_total": 600.00
  }
}
```

#### Códigos de Erro

- `404`: Pedido não encontrado
- `400`: Dados inválidos
- `403`: Usuário sem permissão para atualizar este pedido

---

### Excluir Pedido

Remove um pedido específico do sistema.

**URL**: `/pedidos/:id`

**Método**: `DELETE`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Parâmetros da URL

- `id`: ID do pedido (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedido removido com sucesso"
}
```

#### Códigos de Erro

- `404`: Pedido não encontrado
- `403`: Usuário sem permissão para excluir pedido

---

## 📊 Consultas Avançadas

### Pedidos por Escola

Consulta todos os pedidos de uma escola específica.

**URL**: `/pedidos/escola/:id_escola`

**Método**: `GET`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Parâmetros da URL

- `id_escola`: ID da escola (UUID)

#### Parâmetros da Query

- `status` (opcional): Filtra por status específico
- `data_inicio` (opcional): Data inicial (formato: YYYY-MM-DD)
- `data_fim` (opcional): Data final (formato: YYYY-MM-DD)
- `resumo` (opcional): Se `true`, retorna apenas resumo estatístico

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos da escola listados com sucesso",
  "dados": {
    "escola": {
      "id_escola": "uuid-escola-1",
      "nome_escola": "Escola Municipal João da Silva"
    },
    "periodo": {
      "data_inicio": "2024-01-01",
      "data_fim": "2024-01-31"
    },
    "pedidos": [
      {
        "id_pedido": "uuid-pedido-1",
        "nome_item": "Arroz Integral 1kg",
        "quantidade_pedido": 50,
        "data_pedido": "2024-01-15T10:30:00Z",
        "status_pedido": "pendente",
        "valor_total": 375.00
      }
    ],
    "resumo": {
      "total_pedidos": 15,
      "valor_total": 4250.80,
      "por_status": {
        "pendente": 8,
        "aprovado": 5,
        "entregue": 2
      },
      "item_mais_pedido": "Arroz Integral 1kg"
    }
  }
}
```

---

### Pedidos por Período

Consulta pedidos dentro de um intervalo de datas com estatísticas.

**URL**: `/pedidos/periodo`

**Método**: `GET`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Parâmetros da Query

- `data_inicio`: Data inicial (formato: YYYY-MM-DD) - **obrigatório**
- `data_fim`: Data final (formato: YYYY-MM-DD) - **obrigatório**
- `agrupar_por` (opcional): `escola`, `item`, `fornecedor`, `status`

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Relatório de pedidos por período gerado",
  "dados": {
    "periodo": {
      "data_inicio": "2024-01-01",
      "data_fim": "2024-01-31"
    },
    "resumo_geral": {
      "total_pedidos": 125,
      "valor_total": 45750.50,
      "escolas_atendidas": 15,
      "itens_diferentes": 35,
      "ticket_medio": 366.00
    },
    "por_escola": [
      {
        "id_escola": "uuid-escola-1",
        "nome_escola": "Escola Municipal João da Silva",
        "total_pedidos": 18,
        "valor_total": 6250.80,
        "ticket_medio": 347.27
      }
    ],
    "por_item": [
      {
        "id_item": "uuid-item-1",
        "nome_item": "Arroz Integral 1kg",
        "total_pedidos": 45,
        "quantidade_total": 2250,
        "valor_total": 16875.00
      }
    ],
    "por_status": {
      "pendente": 65,
      "aprovado": 35,
      "entregue": 20,
      "cancelado": 5
    }
  }
}
```

---

### Pedidos por Fornecedor

Consulta pedidos relacionados a um fornecedor específico.

**URL**: `/pedidos/fornecedor/:id_fornecedor`

**Método**: `GET`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Fornecedor (apenas próprios pedidos)

#### Parâmetros da URL

- `id_fornecedor`: ID do fornecedor (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos do fornecedor listados com sucesso",
  "dados": {
    "fornecedor": {
      "id_fornecedor": "uuid-fornecedor-1",
      "nome_fornecedor": "Alimentos Naturais LTDA"
    },
    "pedidos": [
      {
        "id_pedido": "uuid-pedido-1",
        "nome_escola": "Escola Municipal João da Silva",
        "nome_item": "Arroz Integral 1kg",
        "quantidade_pedido": 50,
        "data_pedido": "2024-01-15T10:30:00Z",
        "status_pedido": "pendente",
        "valor_total": 375.00,
        "observacoes": "Urgente - estoque baixo"
      }
    ],
    "resumo": {
      "total_pedidos": 25,
      "valor_total": 8750.00,
      "escolas_atendidas": 8,
      "itens_fornecidos": 12
    }
  }
}
```

---

## 📈 Relatórios e Estatísticas

### Relatório de Desempenho de Pedidos

Gera relatório detalhado sobre desempenho dos pedidos.

**URL**: `/pedidos/relatorio/desempenho`

**Método**: `GET`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Parâmetros da Query

- `periodo_meses` (opcional): Número de meses para análise (padrão: 3)
- `incluir_detalhes` (opcional): Se `true`, inclui detalhes por escola

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Relatório de desempenho gerado com sucesso",
  "dados": {
    "periodo_analise": {
      "meses": 3,
      "data_inicio": "2023-11-01",
      "data_fim": "2024-01-31"
    },
    "metricas_gerais": {
      "total_pedidos": 450,
      "valor_total": 125750.50,
      "crescimento_mensal": 15.2,
      "tempo_medio_aprovacao": "2.5 dias",
      "taxa_cancelamento": 3.2
    },
    "tendencias": {
      "itens_em_alta": [
        {
          "nome_item": "Arroz Integral 1kg",
          "crescimento": 25.5,
          "total_pedidos": 95
        }
      ],
      "escolas_mais_ativas": [
        {
          "nome_escola": "Escola Municipal João da Silva",
          "total_pedidos": 65,
          "valor_total": 18750.00
        }
      ]
    },
    "alertas": [
      {
        "tipo": "item_sem_pedidos",
        "descricao": "3 itens não foram pedidos nos últimos 30 dias",
        "recomendacao": "Revisar cardápio ou disponibilidade"
      }
    ]
  }
}
```

---

## 🔄 Operações em Lote

### Importação de Pedidos

Importa múltiplos pedidos via JSON ou CSV.

**URL**: `/pedidos/importar`

**Método**: `POST`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Corpo da Requisição (JSON)

```json
{
  "pedidos": [
    {
      "quantidade_pedido": 50,
      "id_item": "uuid-item-1",
      "id_escola": "uuid-escola-1",
      "observacoes": "Pedido automatizado"
    },
    {
      "quantidade_pedido": 30,
      "id_item": "uuid-item-2",
      "id_escola": "uuid-escola-1"
    }
  ]
}
```

#### Resposta de Sucesso

**Código**: `201 Created` ou `207 Multi-Status` (sucesso parcial)

```json
{
  "status": "sucesso",
  "mensagem": "Importação de pedidos concluída",
  "dados": {
    "total_processados": 2,
    "sucessos": 2,
    "erros": 0,
    "pedidos_criados": [
      {
        "id_pedido": "uuid-pedido-novo-1",
        "linha": 1,
        "status": "criado",
        "valor_total": 375.00
      },
      {
        "id_pedido": "uuid-pedido-novo-2",
        "linha": 2,
        "status": "criado",
        "valor_total": 276.00
      }
    ],
    "erros_detalhados": []
  }
}
```

---

### Atualização em Lote de Status

Atualiza status de múltiplos pedidos simultaneamente.

**URL**: `/pedidos/atualizar-status`

**Método**: `PUT`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Corpo da Requisição

```json
{
  "pedidos": [
    "uuid-pedido-1",
    "uuid-pedido-2",
    "uuid-pedido-3"
  ],
  "novo_status": "aprovado",
  "observacoes": "Aprovação em lote - orçamento confirmado"
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Status dos pedidos atualizados com sucesso",
  "dados": {
    "atualizados": 3,
    "nao_encontrados": 0,
    "detalhes": [
      {
        "id_pedido": "uuid-pedido-1",
        "status_anterior": "pendente",
        "status_novo": "aprovado",
        "valor_total": 375.00
      }
    ],
    "valor_total_aprovado": 1125.50
  }
}
```

---

## 🚀 Automações

### Pedidos Automáticos por Estoque Baixo

Gera pedidos automaticamente baseado em alertas de estoque baixo.

**URL**: `/pedidos/automaticos/estoque-baixo`

**Método**: `POST`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Parâmetros da Query

- `id_escola` (opcional): Gera apenas para escola específica
- `percentual_minimo` (opcional): Percentual mínimo do ideal para considerar (padrão: 20)
- `simular` (opcional): Se `true`, apenas simula sem criar pedidos

#### Resposta de Sucesso

**Código**: `201 Created`

```json
{
  "status": "sucesso",
  "mensagem": "Pedidos automáticos gerados com sucesso",
  "dados": {
    "total_analisados": 150,
    "itens_baixo_estoque": 25,
    "pedidos_criados": 18,
    "pedidos_simulados": 0,
    "valor_total": 8750.50,
    "detalhes": [
      {
        "id_pedido": "uuid-pedido-auto-1",
        "nome_escola": "Escola Municipal João da Silva",
        "nome_item": "Arroz Integral 1kg",
        "quantidade_atual": 15,
        "quantidade_ideal": 100,
        "quantidade_pedida": 85,
        "valor_total": 637.50
      }
    ],
    "nao_processados": [
      {
        "nome_escola": "Escola Estadual Maria Santos",
        "nome_item": "Feijão Carioca 1kg",
        "motivo": "Item sem fornecedor ativo"
      }
    ]
  }
}
```

---

## 📋 Tabela de Permissões

| Rota | Admin | Nutricionista | Gestor Escolar | Fornecedor |
|------|-------|---------------|----------------|------------|
| `GET /pedidos` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `GET /pedidos/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `POST /pedidos` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `PUT /pedidos/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `DELETE /pedidos/:id` | ✅ | ✅ | ❌ | ❌ |
| `GET /pedidos/escola/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `GET /pedidos/periodo` | ✅ | ✅ | ❌ | ❌ |
| `GET /pedidos/fornecedor/:id` | ✅ | ✅ | ❌ | ✅ (próprios) |
| `GET /pedidos/relatorio/desempenho` | ✅ | ✅ | ❌ | ❌ |
| `POST /pedidos/importar` | ✅ | ✅ | ❌ | ❌ |
| `PUT /pedidos/atualizar-status` | ✅ | ✅ | ❌ | ❌ |
| `POST /pedidos/automaticos/estoque-baixo` | ✅ | ✅ | ❌ | ❌ |

## 🔍 Códigos de Status

- **200**: Operação realizada com sucesso
- **201**: Recurso criado com sucesso
- **207**: Multi-status (importação com erros parciais)
- **400**: Erro de validação ou dados inválidos
- **401**: Token de autenticação inválido ou ausente
- **403**: Usuário sem permissão para a operação
- **404**: Recurso não encontrado
- **409**: Conflito (registro duplicado)
- **500**: Erro interno do servidor

## 📝 Status de Pedidos

O sistema reconhece os seguintes status para pedidos:

- **pendente**: Pedido criado, aguardando aprovação
- **aprovado**: Pedido aprovado, aguardando processamento
- **em_processamento**: Pedido sendo preparado pelo fornecedor
- **enviado**: Pedido enviado para entrega
- **entregue**: Pedido entregue com sucesso
- **cancelado**: Pedido cancelado por algum motivo
- **devolvido**: Pedido devolvido (problemas na entrega)

## 📊 Métricas Importantes

### Cálculos Automáticos

- **Valor Total**: `quantidade_pedido × preco_item`
- **Ticket Médio**: `valor_total ÷ quantidade_pedidos`
- **Taxa de Crescimento**: Comparação entre períodos
- **Tempo Médio de Aprovação**: Média entre criação e aprovação

### Alertas Inteligentes

- **Estoque Crítico**: Quantidade < 20% do ideal
- **Itens Sem Pedidos**: Sem movimentação há 30+ dias
- **Fornecedor Inativo**: Sem pedidos há 60+ dias
- **Valores Discrepantes**: Preços muito acima/abaixo da média

---

## 📧 Suporte

Para dúvidas sobre pedidos ou problemas na integração, consulte:
- [Documentação de Troubleshooting](./troubleshooting.md)
- [Guia de Importação](./importacao.md)
- [Configuração de Fornecedores](./fornecedores.md)

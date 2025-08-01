# 📦 Estoque

Esta seção contém as rotas relacionadas à gestão de estoque no sistema Merenda Smart Flow com modelo normalizado (escola + segmento + período).

## 📋 CRUD Básico

### Listar Estoque

Retorna o estoque com filtros avançados baseados no modelo normalizado.

**URL**: `/estoque`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da Query

- `id_escola` (opcional): Filtra por escola específica
- `id_segmento` (opcional): Filtra por segmento específico
- `id_periodo` (opcional): Filtra por período específico
- `id_item` (opcional): Filtra por item específico
- `quantidade_minima` (opcional): Filtra itens com quantidade menor que o especificado
- `validade_proxima` (opcional): Filtra itens com validade próxima (formato: YYYY-MM-DD)
- `com_detalhes` (opcional): Se `true`, inclui dados relacionados (escola, item, segmento, período)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estoque listado com sucesso",
  "dados": [
    {
      "id_estoque": "uuid-estoque-1",
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "id_segmento": "uuid-segmento-1",
      "id_periodo": "uuid-periodo-1",
      "quantidade_item": 50,
      "numero_ideal": 100,
      "validade": "2024-12-31",
      "observacao": "Lote recebido em bom estado",
      "nome_escola": "Escola Municipal João da Silva",
      "nome_item": "Arroz Integral 1kg",
      "unidade_medida": "kg",
      "nome_segmento": "Ensino Fundamental",
      "nome_periodo": "1º Semestre 2024"
    }
  ]
}
```

#### Códigos de Erro

- `401`: Token de autenticação inválido
- `403`: Usuário sem permissão para visualizar estoque
- `500`: Erro interno do servidor

---

### Buscar Estoque por ID

Retorna informações detalhadas de um item específico do estoque.

**URL**: `/estoque/:id`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da URL

- `id`: ID do estoque (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estoque encontrado",
  "dados": {
    "id_estoque": "uuid-estoque-1",
    "id_escola": "uuid-escola-1",
    "id_item": "uuid-item-1",
    "id_segmento": "uuid-segmento-1",
    "id_periodo": "uuid-periodo-1",
    "quantidade_item": 50,
    "numero_ideal": 100,
    "validade": "2024-12-31",
    "observacao": "Lote recebido em bom estado",
    "nome_escola": "Escola Municipal João da Silva",
    "nome_item": "Arroz Integral 1kg",
    "unidade_medida": "kg",
    "nome_segmento": "Ensino Fundamental",
    "nome_periodo": "1º Semestre 2024"
  }
}
```

#### Códigos de Erro

- `404`: Estoque não encontrado
- `401`: Token de autenticação inválido
- `403`: Usuário sem permissão para visualizar este estoque

---

### Criar Novo Item no Estoque

Adiciona um novo item ao estoque de uma escola específica para um segmento e período.

**URL**: `/estoque`

**Método**: `POST`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Corpo da Requisição

```json
{
  "id_escola": "uuid-escola-1",
  "id_item": "uuid-item-1",
  "id_segmento": "uuid-segmento-1",
  "id_periodo": "uuid-periodo-1",
  "quantidade_item": 50,
  "numero_ideal": 100,
  "validade": "2024-12-31",
  "observacao": "Lote recebido em bom estado"
}
```

#### Resposta de Sucesso

**Código**: `201 Created`

```json
{
  "status": "sucesso",
  "mensagem": "Item adicionado ao estoque com sucesso",
  "dados": {
    "id_estoque": "uuid-estoque-novo",
    "id_escola": "uuid-escola-1",
    "id_item": "uuid-item-1",
    "id_segmento": "uuid-segmento-1",
    "id_periodo": "uuid-periodo-1",
    "quantidade_item": 50,
    "numero_ideal": 100,
    "validade": "2024-12-31",
    "observacao": "Lote recebido em bom estado"
  }
}
```

#### Códigos de Erro

- `400`: Dados inválidos ou incompletos
- `409`: Combinação escola+item+segmento+período já existe
- `403`: Usuário sem permissão para adicionar estoque
- `404`: Escola, item, segmento ou período não encontrado

---

### Atualizar Item do Estoque

Atualiza informações de um item específico do estoque.

**URL**: `/estoque/:id`

**Método**: `PUT`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Parâmetros da URL

- `id`: ID do estoque (UUID)

#### Corpo da Requisição

```json
{
  "quantidade_item": 75,
  "numero_ideal": 120,
  "validade": "2024-11-30",
  "observacao": "Quantidade atualizada após inventário"
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estoque atualizado com sucesso",
  "dados": {
    "id_estoque": "uuid-estoque-1",
    "id_escola": "uuid-escola-1",
    "id_item": "uuid-item-1",
    "id_segmento": "uuid-segmento-1",
    "id_periodo": "uuid-periodo-1",
    "quantidade_item": 75,
    "numero_ideal": 120,
    "validade": "2024-11-30",
    "observacao": "Quantidade atualizada após inventário"
  }
}
```

#### Códigos de Erro

- `404`: Estoque não encontrado
- `400`: Dados inválidos
- `403`: Usuário sem permissão para atualizar este estoque

---

### Excluir Item do Estoque

Remove um item específico do estoque.

**URL**: `/estoque/:id`

**Método**: `DELETE`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Parâmetros da URL

- `id`: ID do estoque (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Item removido do estoque com sucesso"
}
```

#### Códigos de Erro

- `404`: Estoque não encontrado
- `403`: Usuário sem permissão para excluir estoque

---

### Atualizar Data de Validade

Atualiza especificamente a data de validade de um item do estoque.

**URL**: `/estoque/:id/validade`

**Método**: `PUT`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Parâmetros da URL

- `id`: ID do estoque (UUID)

#### Corpo da Requisição

```json
{
  "validade": "2025-12-31"
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Data de validade atualizada com sucesso",
  "dados": {
    "id_estoque": "uuid-estoque-1",
    "nova_validade": "2025-12-31",
    "validade_anterior": "2024-12-31",
    "atualizado_em": "2025-07-02T10:30:00.000Z"
  }
}
```

#### Validações Aplicadas

- ✅ **Item existe**: Verifica se o item de estoque existe
- ✅ **Data válida**: Impede datas no passado
- ✅ **Formato de data**: Aceita formato `YYYY-MM-DD` ou ISO string
- ✅ **Normalização de fuso horário**: Corrige automaticamente problemas de timezone
- ✅ **Persistência exata**: Data salva exatamente como enviada na requisição

#### Tratamento de Fuso Horário

⚠️ **Problema Corrigido**: Versões anteriores podiam salvar datas com um dia de diferença devido à conversão automática de fuso horário.

✅ **Solução Implementada**: 
- Normalização automática da data para formato local
- Formatação manual evitando conversões UTC
- Data persistida exatamente como enviada na requisição

#### Códigos de Erro

- `400`: Data de validade inválida ou no passado
- `404`: Item de estoque não encontrado
- `403`: Usuário sem permissão para atualizar validade deste estoque

#### Exemplo de Erro - Data no Passado

```json
{
  "status": "erro",
  "mensagem": "Data de validade não pode ser no passado",
  "codigo": "INVALID_DATE",
  "detalhes": {
    "data_informada": "2024-01-01",
    "data_atual": "2025-07-02"
  }
}
```

#### Exemplo de Erro - Item Não Encontrado

```json
{
  "status": "erro",
  "mensagem": "Item de estoque não encontrado",
  "codigo": "NOT_FOUND"
}
```

#### Teste de Validação - Fuso Horário

```bash
# Teste: Enviar data específica e verificar se é salva corretamente
curl -X PUT "http://localhost:3000/estoque/uuid-item/validade" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{"validade": "2025-07-03"}'

# Resultado esperado: Data salva como "2025-07-03" (não "2025-07-02")
```

---

## 📊 Consultas Avançadas

### Estoque por Escola e Segmento

Consulta otimizada para visualizar estoque específico de uma escola e segmento.

**URL**: `/estoque/escola/:id_escola/segmento/:id_segmento`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da URL

- `id_escola`: ID da escola (UUID)
- `id_segmento`: ID do segmento (UUID)

#### Parâmetros da Query

- `id_periodo` (opcional): Filtra por período específico
- `apenas_baixo_estoque` (opcional): Se `true`, retorna apenas itens com quantidade abaixo do ideal

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estoque da escola e segmento listado com sucesso",
  "dados": {
    "escola": {
      "id_escola": "uuid-escola-1",
      "nome_escola": "Escola Municipal João da Silva"
    },
    "segmento": {
      "id_segmento": "uuid-segmento-1",
      "nome_segmento": "Ensino Fundamental"
    },
    "periodo_ativo": {
      "id_periodo": "uuid-periodo-1",
      "nome_periodo": "1º Semestre 2024"
    },
    "itens": [
      {
        "id_estoque": "uuid-estoque-1",
        "id_item": "uuid-item-1",
        "nome_item": "Arroz Integral 1kg",
        "quantidade_item": 30,
        "numero_ideal": 100,
        "percentual_ideal": 30,
        "status_estoque": "baixo",
        "validade": "2024-12-31",
        "dias_para_vencer": 180
      }
    ],
    "resumo": {
      "total_itens": 25,
      "itens_baixo_estoque": 8,
      "itens_estoque_adequado": 17,
      "itens_proximos_validade": 3
    }
  }
}
```

---

### Estoque com Alertas

Consulta itens do estoque que precisam de atenção (baixo estoque ou validade próxima).

**URL**: `/estoque/alertas`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da Query

- `id_escola` (opcional): Filtra por escola específica
- `id_segmento` (opcional): Filtra por segmento específico
- `dias_validade` (opcional): Número de dias para considerar validade próxima (padrão: 30)
- `percentual_minimo` (opcional): Percentual mínimo do ideal para considerar baixo estoque (padrão: 20)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Alertas de estoque gerados com sucesso",
  "dados": {
    "baixo_estoque": [
      {
        "id_estoque": "uuid-estoque-1",
        "nome_escola": "Escola Municipal João da Silva",
        "nome_segmento": "Ensino Fundamental",
        "nome_item": "Arroz Integral 1kg",
        "quantidade_item": 15,
        "numero_ideal": 100,
        "percentual_ideal": 15,
        "urgencia": "alta"
      }
    ],
    "validade_proxima": [
      {
        "id_estoque": "uuid-estoque-2",
        "nome_escola": "Escola Municipal Maria Santos",
        "nome_segmento": "Educação Infantil",
        "nome_item": "Leite em Pó 1kg",
        "quantidade_item": 50,
        "validade": "2024-02-15",
        "dias_para_vencer": 10,
        "urgencia": "critica"
      }
    ],
    "resumo": {
      "total_alertas": 12,
      "baixo_estoque": 8,
      "validade_proxima": 4,
      "urgencia_critica": 2,
      "urgencia_alta": 6,
      "urgencia_media": 4
    }
  }
}
```

---

### Estatísticas de Estoque por Período

Consulta estatísticas consolidadas de estoque para um período específico.

**URL**: `/estoque/estatisticas/periodo/:id_periodo`

**Método**: `GET`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Parâmetros da URL

- `id_periodo`: ID do período (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Estatísticas de estoque geradas com sucesso",
  "dados": {
    "periodo": {
      "id_periodo": "uuid-periodo-1",
      "nome_periodo": "1º Semestre 2024"
    },
    "por_escola": [
      {
        "id_escola": "uuid-escola-1",
        "nome_escola": "Escola Municipal João da Silva",
        "total_itens": 150,
        "itens_adequados": 120,
        "itens_baixo_estoque": 25,
        "itens_sem_estoque": 5,
        "percentual_adequacao": 80
      }
    ],
    "por_segmento": [
      {
        "id_segmento": "uuid-segmento-1",
        "nome_segmento": "Ensino Fundamental",
        "escolas_atendidas": 15,
        "total_itens": 1250,
        "media_adequacao": 75.5
      }
    ],
    "resumo_geral": {
      "total_escolas": 25,
      "total_segmentos": 4,
      "total_itens_estoque": 3750,
      "percentual_adequacao_geral": 72.8,
      "itens_criticos": 45,
      "valor_total_estoque": 125750.80
    }
  }
}
```

---

## 🔄 Operações em Lote

### Importação de Estoque

Importa múltiplos itens de estoque via CSV ou JSON.

**URL**: `/estoque/importar`

**Método**: `POST`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Corpo da Requisição (JSON)

```json
{
  "itens": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "id_segmento": "uuid-segmento-1",
      "id_periodo": "uuid-periodo-1",
      "quantidade_item": 50,
      "numero_ideal": 100,
      "validade": "2024-12-31"
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "id_segmento": "uuid-segmento-1",
      "id_periodo": "uuid-periodo-1",
      "quantidade_item": 30,
      "numero_ideal": 80
    }
  ]
}
```

#### Resposta de Sucesso

**Código**: `201 Created` ou `207 Multi-Status` (sucesso parcial)

```json
{
  "status": "sucesso",
  "mensagem": "Importação de estoque concluída",
  "dados": {
    "total_processados": 2,
    "sucessos": 2,
    "erros": 0,
    "itens_criados": [
      {
        "id_estoque": "uuid-estoque-novo-1",
        "linha": 1,
        "status": "criado"
      },
      {
        "id_estoque": "uuid-estoque-novo-2",
        "linha": 2,
        "status": "criado"
      }
    ],
    "erros_detalhados": []
  }
}
```

---

### Atualização em Lote de Valores Ideais

Atualiza valores ideais para múltiplos itens de uma escola/segmento.

**URL**: `/estoque/valores-ideais`

**Método**: `PUT`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista

#### Corpo da Requisição

```json
{
  "id_escola": "uuid-escola-1",
  "id_segmento": "uuid-segmento-1",
  "id_periodo": "uuid-periodo-1",
  "valores": [
    {
      "id_item": "uuid-item-1",
      "numero_ideal": 120
    },
    {
      "id_item": "uuid-item-2",
      "numero_ideal": 90
    }
  ]
}
```

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Valores ideais atualizados com sucesso",
  "dados": {
    "atualizados": 2,
    "nao_encontrados": 0,
    "detalhes": [
      {
        "id_item": "uuid-item-1",
        "nome_item": "Arroz Integral 1kg",
        "valor_anterior": 100,
        "valor_novo": 120,
        "status": "atualizado"
      }
    ]
  }
}
```

---

## 🎯 Dashboard de Estoque

### Resumo do Dashboard por Escola

Retorna métricas consolidadas para dashboard de uma escola específica.

**URL**: `/estoque/dashboard/escola/:id_escola`

**Método**: `GET`

**Autenticação**: Requerida

**Permissões**: Admin, Nutricionista, Gestor Escolar (apenas da própria escola)

#### Parâmetros da URL

- `id_escola`: ID da escola (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Dashboard de estoque gerado com sucesso",
  "dados": {
    "escola": {
      "id_escola": "uuid-escola-1",
      "nome_escola": "Escola Municipal João da Silva"
    },
    "periodo_ativo": {
      "id_periodo": "uuid-periodo-1",
      "nome_periodo": "1º Semestre 2024"
    },
    "metricas": {
      "total_itens": 45,
      "itens_baixo_estoque": 12,
      "itens_proximos_validade": 5,
      "segmentos_ativos": 2,
      "percentual_adequacao": 73.3,
      "valor_total_estoque": 8750.50
    },
    "por_segmento": [
      {
        "id_segmento": "uuid-segmento-1",
        "nome_segmento": "Ensino Fundamental",
        "total_itens": 30,
        "itens_adequados": 22,
        "itens_baixo_estoque": 8,
        "percentual_adequacao": 73.3
      },
      {
        "id_segmento": "uuid-segmento-2",
        "nome_segmento": "Educação Infantil",
        "total_itens": 15,
        "itens_adequados": 11,
        "itens_baixo_estoque": 4,
        "percentual_adequacao": 73.3
      }
    ],
    "alertas_urgentes": [
      {
        "tipo": "estoque_critico",
        "item": "Arroz Integral 1kg",
        "segmento": "Ensino Fundamental",
        "quantidade": 5,
        "ideal": 100,
        "percentual": 5
      }
    ]
  }
}
```

---

## 📋 Tabela de Permissões

| Rota | Admin | Nutricionista | Gestor Escolar | Fornecedor |
|------|-------|---------------|----------------|------------|
| `GET /estoque` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `GET /estoque/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `POST /estoque` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `PUT /estoque/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `PUT /estoque/:id/validade` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `DELETE /estoque/:id` | ✅ | ✅ | ❌ | ❌ |
| `GET /estoque/escola/:id/segmento/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `GET /estoque/alertas` | ✅ | ✅ | ✅ (própria escola) | ❌ |
| `GET /estoque/estatisticas/periodo/:id` | ✅ | ✅ | ❌ | ❌ |
| `POST /estoque/importar` | ✅ | ✅ | ❌ | ❌ |
| `PUT /estoque/valores-ideais` | ✅ | ✅ | ❌ | ❌ |
| `GET /estoque/dashboard/escola/:id` | ✅ | ✅ | ✅ (própria escola) | ❌ |

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

---

## 📝 Observações

### Modelo Normalizado

O estoque agora utiliza um modelo completamente normalizado com:
- **Escola**: Entidade principal de organização
- **Segmento**: Subdivisão educacional dentro da escola
- **Período**: Controle temporal de lançamentos
- **Item**: Produto/alimento gerenciado

### Chave Composta

Cada entrada de estoque é única pela combinação: `escola + item + segmento + período`

### Alertas Inteligentes

O sistema gera alertas automáticos baseados em:
- Percentual do valor ideal (padrão: < 20% = crítico)
- Dias para vencimento (padrão: < 30 dias = atenção)
- Configurações personalizáveis por escola/segmento

### Atualização de Validade

A funcionalidade de atualização de validade permite:
- **Atualização específica**: Altera apenas a data de validade sem afetar outros campos
- **Validação rigorosa**: Impede datas no passado para manter integridade
- **Correção de fuso horário**: Resolve automaticamente problemas de timezone
- **Persistência exata**: Data salva exatamente como enviada (ex: "2025-07-03" → "2025-07-03")
- **Auditoria**: Registra validade anterior e nova para rastreabilidade
- **Permissões granulares**: Gestores escolares podem atualizar apenas da própria escola

#### Problema de Fuso Horário Resolvido

**Issue anterior**: Datas enviadas como `"2025-07-03"` eram salvas como `"2025-07-02"` devido à conversão UTC.

**Correção aplicada**:
- Formatação manual da data evitando `toISOString()`
- Normalização de horário para comparação local
- Criação segura de objetos Date para strings YYYY-MM-DD

#### Exemplos Práticos de Uso

```bash
# Atualizar validade de um item de estoque
curl -X PUT http://localhost:3000/estoque/uuid-estoque-1/validade \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"validade": "2025-12-31"}'

# Resultado: Data salva exatamente como "2025-12-31"
```

**Casos de Uso Comuns:**
- ✅ Correção de erro de digitação na validade
- ✅ Atualização após reembalagem de produtos
- ✅ Extensão de prazo por análise técnica
- ✅ Ajuste após verificação física do estoque
- ✅ Correção de problemas de fuso horário em dados migrados

### Auditoria

Todas as operações de estoque são registradas para fins de auditoria e rastreabilidade.

---

### Consolidado de Estoque por Segmento

Retorna o consolidado de todos os itens do estoque lançados para todos os segmentos de uma escola, incluindo totais e porcentagens para visualização em dashboard.

**URL**: `/estoque/escola/:id_escola/consolidado`

**Método**: `GET`

**Autenticação**: Requerida

#### Parâmetros da URL
- `id_escola`: ID da escola (UUID)

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Consolidado de estoque por segmento obtido com sucesso",
  "dados": {
    "totalGeral": 1200,
    "segmentos": [
      {
        "segmento": "creche",
        "totalSegmento": 400,
        "porcentagemSegmento": 33.3,
        "itens": [
          {
            "nome_item": "ARROZ BRANCO",
            "quantidade": 100,
            "porcentagem": 8.3
          }
          // ...
        ]
      }
      // ...
    ]
  }
}
```

#### Observações
- Se não houver itens lançados, os totais e porcentagens retornam como zero.
- Útil para dashboards e relatórios gerenciais.

#### Códigos de Erro
- `401`: Token inválido ou ausente
- `403`: Usuário sem permissão
- `404`: Escola não encontrada
- `500`: Erro interno do servidor

---

### Consolidado Geral de Estoque por Escola

Retorna o consolidado do total de estoque lançado por todas as escolas, incluindo o total geral e a porcentagem de cada escola em relação ao total.

**URL**: `/estoque/consolidado-geral`

**Método**: `GET`

**Autenticação**: Requerida

#### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Consolidado geral de estoque por escola obtido com sucesso",
  "dados": {
    "totalGeral": 1000,
    "escolas": [
      {
        "id_escola": "uuid-escola-1",
        "nome_escola": "E M CÂNDIDO PORTINARI",
        "total": 400,
        "porcentagem": 40
      },
      {
        "id_escola": "uuid-escola-2",
        "nome_escola": "E M OUTRA ESCOLA",
        "total": 600,
        "porcentagem": 60
      }
    ]
  }
}
```

#### Observações
- O total de cada escola é a soma de todos os itens lançados no estoque.
- A porcentagem indica a participação da escola no total geral.
- Útil para dashboards de acompanhamento macro (ex: visão do nutricionista).

#### Códigos de Erro
- `401`: Token inválido ou ausente
- `403`: Usuário sem permissão
- `500`: Erro interno do servidor

---
